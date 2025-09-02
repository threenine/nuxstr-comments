import { computed, ref } from 'vue'
import { useRoute, useRuntimeConfig, useRequestURL } from '#imports'
import { useNuxstr } from './useNuxstr'
import { NDKEvent, type NDKFilter, NDKKind } from '@nostr-dev-kit/ndk'
import type { Comment, Profile } from '~/src/runtime/types'

export function useNuxstrComments(customContentId?: string) {
  const { ndk, connect, isLoggedIn, mapProfile, mapComment } = useNuxstr()
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
    const filter: NDKFilter = { kinds: [NDKKind.GenericReply], ['#t']: [tagValue()], limit: 100, ['#k']: [siteUrl()] }
    const sub = await ndk.subscribe(filter)
    sub.on('event', async (event) => {
      const comment = mapComment(event)

      comment.profile = await fetchProfile(event.pubkey)
      comments.value.push(comment)
    })
  }

  async function postComment(comment: string) {
    await connect()
    const e = new NDKEvent(ndk)
    e.kind = NDKKind.GenericReply
    e.content = comment
    e.tags = [
      ['t', tagValue()],
      ['k', siteUrl()],
    ]
    return await e.publish().then(() => true).catch((err: unknown) => {
      error.value = (err as Error)?.message || String(err)
      return false
    })
  }

  return { loading, error, comments, isLoggedIn, subscribeComments, postComment }
}
