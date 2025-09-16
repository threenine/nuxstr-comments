import { computed, ref } from 'vue'
import { useRoute, useRuntimeConfig, useRequestURL } from '#imports'
import { useNuxstr } from './useNuxstr'
import { NDKEvent, type NDKFilter, NDKKind } from '@nostr-dev-kit/ndk'
import type { Comment, Profile } from '~/src/runtime/types'

export function useNuxstrComments(customContentId?: string) {
  const { ndk, connect, isLoggedIn, mapProfile, mapComment, pubkey } = useNuxstr()
  const route = useRoute()
  const config = useRuntimeConfig()
  const opts = (config.public?.nuxstrComments || {}) as {
    tagStrategy?: 'path' | 'id' | 'custom'
    tagPrefix?: string
  }

  const loading = ref(false)
  const error = ref<string | null>(null)
  const comments = ref<Comment[]>([])

  const contentId = computed(() => {
    if (customContentId) return customContentId
    // default to route.path when using tagStrategy 'path'
    return route.path
  })

  function tagValue() {
    const prefix = opts.tagPrefix || 'comment:'
    return `${prefix}${contentId.value}`
  }
  function siteUrl(): string {
    const url = useRequestURL()
    return `${url.protocol}//${url.host}`
  }

  function fullUrl(path: string): string {
    return `${siteUrl()}${path}`
  }
  async function fetchProfile(pubkey: string): Promise<Profile | undefined> {
    try {
      const user = ndk.getUser({ pubkey: pubkey })
      const profile = await user.fetchProfile()
      return mapProfile(profile)
    }
    catch (error) {
      console.error('Failed to fetch profile for', pubkey, error)
      return undefined
    }
  }

  async function subscribeComments() {
    await connect()
    const filter: NDKFilter = { kinds: [NDKKind.GenericReply], ['#t']: [tagValue()], limit: 100, ['#k']: ['web'], ['#A']: [fullUrl(contentId.value)] }
    const sub = await ndk.subscribe(filter)
    sub.on('event', async (event) => {
      const comment = mapComment(event)
      comment.profile = await fetchProfile(event.pubkey)
      comments.value.push(comment)
    })
  }

  async function postComment(comment: string) {
    await connect()
    const ndkEvent = await createCommentEvent(comment)
    return await ndkEvent.publish().then(() => true).catch((err: unknown) => {
      error.value = (err as Error)?.message || String(err)
      return false
    })
  }

  async function replyComment(comment: string, rootId: string) {
   console.log('replyComment', comment, rootId)
    await connect()
    const ndkEvent = await createReplyEvent(comment, rootId)
    return await ndkEvent.publish().then(() => true).catch((err: unknown) => {
      error.value = (err as Error)?.message || String(err)
    })
  }

  // Create a comment reply event as defined in NIP 22
  async function createReplyEvent(comment: string, rootId: string): Promise<NDKEvent> {
    const event = new NDKEvent(ndk)
    event.kind = NDKKind.GenericReply
    event.content = comment
    event.tags = [
      ['e', rootId],
      ['a', fullUrl(contentId.value)],
      ['I', fullUrl(contentId.value)], //
      ['i', fullUrl(contentId.value)],
      ['t', tagValue()],
      ['k', 'web'], // Defined NIP 73
      ['K', 'web'], // Defined NIP 73,
      ['p', pubkey.value],
    ]
    return event
  }

  /// Create a new comment event as defined in NIP 22
  async function createCommentEvent(comment: string): Promise<NDKEvent> {
    const event = new NDKEvent(ndk)
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
      ['p', pubkey.value],
    ]
    return event
  }

  return { loading, error, comments, isLoggedIn, subscribeComments, postComment, replyComment }
}
