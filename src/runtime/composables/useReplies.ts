import { computed, ref } from 'vue'
import useNuxstr from './useNuxstr'
import { NDKEvent, type NDKFilter, NDKKind, type NDKSubscription } from '@nostr-dev-kit/ndk'
import type { Comment } from '~/src/runtime/types'

export function useReplies(rootCommentId: string) {
  const { ndk, connect, mapComment, pubkey, fetchProfile } = useNuxstr()
  const repliesData = ref<Comment[]>([])
  const error = ref<string | null>(null)

  const replies = computed(() => {
    return repliesData.value.slice().sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  })

  async function subscribeReplies(): Promise<void> {
    await connect()
    const filter: NDKFilter = { kinds: [NDKKind.GenericReply], limit: 100, ['#e']: [rootCommentId] }
    const sub: NDKSubscription = ndk.subscribe(filter)
    sub.on('event', async (event) => {
      const reply = mapComment(event)
      reply.profile = await fetchProfile(event.pubkey)
      repliesData.value.push(reply)
    })
  }

  async function reply(comment: string): Promise<boolean> {
    const ndkEvent = await createReplyEvent(comment)
    return await ndkEvent.publish().then(() => true).catch((err: unknown) => {
      error.value = (err as Error)?.message || String(err)
      return false
    })
  }

  // Create a comment reply event as defined in NIP 22
  async function createReplyEvent(comment: string): Promise<NDKEvent> {
    const event = new NDKEvent(ndk)
    event.kind = NDKKind.GenericReply
    event.content = comment
    event.tags = [
      ['e', `${rootCommentId}`],
      ['k', `${NDKKind.GenericReply}`], // The parent kind
      ['p', pubkey ?? ''],
    ]
    return event
  }
  const count = computed(async () => {
    await connect()
    const filter: NDKFilter = { kinds: [NDKKind.GenericReply], limit: 100, ['#e']: [rootCommentId] }
    const events = await ndk.fetchEvents(filter)
    return `${Array.from(events).length}`
  })

  return { subscribeReplies, replies: replies, reply, count }
}
