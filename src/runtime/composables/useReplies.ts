import { computed, ref } from 'vue'
import useNuxstr from './useNuxstr'
import { useNostr } from './useNostr'
import type { Event, Filter } from 'nostr-tools'
import type { Comment } from '../types'

function useReplies(rootCommentId: string) {
  const { pubkey, fetchProfile } = useNuxstr()
  const { subscribe } = useNostr()
  const repliesData = ref<Comment[]>([])
  const error = ref<string | null>(null)

  const replies = computed(() => {
    return repliesData.value.slice().sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  })

  async function subscribeReplies(): Promise<void> {
    const filter: Filter = { kinds: [1111], limit: 100, ['#e']: [rootCommentId] }
    subscribe(filter, async (event: Event) => {
      if (repliesData.value.some(r => r.id === event.id)) return
      const reply: Comment = {
        id: event.id,
        pubkey: event.pubkey,
        created_at: event.created_at,
        content: event.content,
        profile: undefined,
      }
      reply.profile = await fetchProfile(event.pubkey)
      repliesData.value.push(reply)
    })
  }

  async function reply(comment: string): Promise<boolean> {
    const { publish } = useNostr()
    try {
      const event = await createReplyEvent(comment)
      const signedEvent = await window.nostr.signEvent(event)
      await publish(signedEvent)
      return true
    }
    catch (err: unknown) {
      error.value = (err as Error)?.message || String(err)
      return false
    }
  }

  // Create a comment reply event as defined in NIP 22
  async function createReplyEvent(comment: string) {
    return {
      kind: 1111, // GenericReply
      created_at: Math.floor(Date.now() / 1000),
      content: comment,
      tags: [
        ['e', rootCommentId],
        ['k', '1111'], // The parent kind
        ['p', pubkey ?? ''],
      ],
    }
  }
  return { subscribeReplies, replies: replies, reply }
}

export default useReplies
