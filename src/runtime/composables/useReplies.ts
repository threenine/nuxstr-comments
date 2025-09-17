import { computed, ref } from 'vue'
import { useNuxstr } from './useNuxstr'
import { NDKEvent, type NDKFilter, NDKKind } from '@nostr-dev-kit/ndk'
import type { Comment } from '~/src/runtime/types'

export function useReplies(rootCommentId?: string) {
  const { ndk, connect, mapComment, pubkey, fetchProfile } = useNuxstr()
  const repliesData = ref<Comment[]>([])
  const error = ref<string | null>(null)
  const replies = computed(() => {
    return repliesData.value.slice().sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  })

  async function subscribeReplies() {
    await connect()
    const filter: NDKFilter = { kinds: [NDKKind.GenericReply], limit: 100, ['#e']: [rootCommentId] }
    const sub = await ndk.subscribe(filter)
    sub.on('event', async (event) => {
      const reply = mapComment(event)
      reply.profile = await fetchProfile(event.pubkey)
      repliesData.value.push(reply)
    })
  }

  async function reply(comment: string) {
    const ndkEvent = await createReplyEvent(comment)
    return await ndkEvent.publish().then(() => true).catch((err: unknown) => {
      console.log('reply error', err)
      error.value = (err as Error)?.message || String(err)
      return false
    })
  }

  // Create a comment reply event as defined in NIP 22
  async function createReplyEvent(comment: string): Promise<NDKEvent> {
    console.log('createReplyEvent', comment, rootCommentId)
    const event = new NDKEvent(ndk)
    event.kind = NDKKind.GenericReply
    event.content = comment
    event.tags = [
      ['e', `${rootCommentId}`],
      ['k', `${NDKKind.GenericReply}`], // The parent kind
      ['p', pubkey.value],
    ]
    console.log('createReplyEvent', event)
    return event
  }

  return { subscribeReplies, replies: replies, reply }
}
