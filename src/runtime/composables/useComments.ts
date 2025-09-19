import { computed, type Ref, ref, type UnwrapRef } from 'vue'
import { useRequestURL, useRoute, useRuntimeConfig } from '#imports'
import useNuxstr from './useNuxstr'
import { NDKEvent, type NDKFilter, NDKKind, type NDKSignedEvent, type NDKSubscription } from '@nostr-dev-kit/ndk'
import type { Comment } from '~/src/runtime/types'

function useComments(customContentId?: string) {
  const { ndk, connect, isLoggedIn, mapComment, pubkey, fetchProfile } = useNuxstr()
  const route = useRoute()

  const config = useRuntimeConfig()
  const opts = (config.public?.nuxstrComments || {}) as {
    tagStrategy?: 'path' | 'id' | 'custom'
    tagPrefix?: string
  }

  const loading: Ref<boolean, boolean> = ref(false)
  const error: Ref<UnwrapRef<string | null>, UnwrapRef<string | null> | string | null> = ref<string | null>(null)

  const commentsData = ref<Comment[]>([])
  const comments = computed(() => {
    return commentsData.value.slice().sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  })

  const contentId = computed(() => {
    if (customContentId) return customContentId
    // default to route.path when using tagStrategy 'path'
    return route.path
  })

  function tagValue() {
    const prefix: string = opts.tagPrefix || 'comment:'
    return `${prefix}${contentId.value}`
  }

  function siteUrl(): string {
    const url: URL = useRequestURL()
    return `${url.protocol}//${url.host}`
  }

  function fullUrl(path: string): string {
    return `${siteUrl()}${path}`
  }

  async function subscribeComments() {
    await connect()
    const filter: NDKFilter = {
      kinds: [NDKKind.GenericReply],
      ['#t']: [tagValue()],
      limit: 100,
      ['#k']: ['web'],
      ['#A']: [fullUrl(contentId.value)],
    }
    const sub: NDKSubscription = ndk.subscribe(filter)
    sub.on('event', async (event: NDKSignedEvent) => {
      const comment: Comment = mapComment(event)
      comment.profile = await fetchProfile(event.pubkey)
      commentsData.value.push(comment)
    })
  }

  async function postComment(comment: string) {
    await connect()
    const ndkEvent: NDKEvent = await createCommentEvent(comment)
    return await ndkEvent.publish().then(() => true).catch((err: unknown) => {
      error.value = (err as Error)?.message || String(err)
      return false
    })
  }

  /// Create a new comment event as defined in NIP 22
  async function createCommentEvent(comment: string): Promise<NDKEvent> {
    const event: NDKEvent = new NDKEvent(ndk)
    event.kind = NDKKind.GenericReply
    event.content = comment
    event.tags = [
      ['A', fullUrl(contentId.value)],
      ['a', fullUrl(contentId.value)],
      ['I', fullUrl(contentId.value)], //
      ['i', fullUrl(contentId.value)],
      ['t', tagValue()],
      ['k', 'web'], // Defined NIP 73
      ['K', 'web'], // Defined NIP 73,
      ['p', pubkey ?? ''],
    ]
    return event
  }

  return { loading, error, comments, isLoggedIn, subscribeComments, postComment }
}

export default useComments
