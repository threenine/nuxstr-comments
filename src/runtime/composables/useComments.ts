import { computed, type Ref, ref, type UnwrapRef } from 'vue'
import { useRequestURL, useRoute, useRuntimeConfig } from '#imports'
import useNuxstr from './useNuxstr'
import { useNostr } from './useNostr'
import type { Event, Filter } from 'nostr-tools'

import type { Comment } from '~/src/runtime/types'

function useComments(customContentId?: string) {
  const { isLoggedIn, pubkey, fetchProfile } = useNuxstr()
  const { subscribe } = useNostr()
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
    if (import.meta.server) {
      const url: URL = useRequestURL()
      return `${url.protocol}//${url.host}`
    }
    return window.location.origin
  }

  function fullUrl(path: string): string {
    return `${siteUrl()}${path}`
  }

  async function subscribeComments() {
    const filter: Filter = {
      kinds: [1111], // NDKKind.GenericReply is 22
      ['#t']: [tagValue()],
      limit: 100,
    }

    subscribe(filter, async (event: Event) => {
      if (commentsData.value.some(c => c.id === event.id)) return
      const comment: Comment = {
        id: event.id,
        pubkey: event.pubkey,
        created_at: event.created_at,
        content: event.content,
        profile: undefined,
      }
      comment.profile = await fetchProfile(event.pubkey)
      commentsData.value.push(comment)
    })
  }

  async function postComment(comment: string) {
    const { publish } = useNostr()
    try {
      const event = await createCommentEvent(comment)
      console.log('event', event)
      // @ts-expect-error unresolved variable nostr
      const signedEvent = await window.nostr.signEvent(event)
      console.log('signedEvent', signedEvent)
      await publish(signedEvent)
      return true
    }
    catch (err: unknown) {
      error.value = (err as Error)?.message || String(err)
      return false
    }
  }

  /// Create a new comment event as defined in NIP 22
  async function createCommentEvent(comment: string) {
    return {
      kind: 1111, // GenericReply
      created_at: Math.floor(Date.now() / 1000),
      content: comment,
      tags: [
        ['A', fullUrl(contentId.value)],
        ['t', tagValue()],
        ['k', 'web'],
        ['p', pubkey ?? ''],
      ],
    }
  }

  return { loading, error, comments, isLoggedIn, subscribeComments, postComment }
}

export default useComments
