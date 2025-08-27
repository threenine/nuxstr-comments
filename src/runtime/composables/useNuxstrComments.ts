import { computed, ref } from 'vue'
import { useRoute, useRuntimeConfig } from '#imports'
import { useNuxstr } from './useNuxstr'
import { NDKEvent, type NDKFilter, NDKKind } from '@nostr-dev-kit/ndk'
import type { NuxstrComment, NuxstrProfile } from '~/src/runtime/types'
import { marked } from 'marked'

export function useNuxstrComments(customContentId?: string) {
  const { ndk, connect, isLoggedIn } = useNuxstr()
  const route = useRoute()
  const config = useRuntimeConfig()
  const opts = (config.public?.nuxstrComments || {}) as {
    tagStrategy?: 'path' | 'id' | 'custom'
    tagPrefix?: string
  }

  const loading = ref(false)
  const error = ref<string | null>(null)
  const comments = ref<NuxstrComment[]>([])

  const contentId = computed(() => {
    if (customContentId) return customContentId
    // default to route.path when using tagStrategy 'path'
    return route.path
  })

  function tagValue() {
    const prefix = opts.tagPrefix || 'comment:'
    return `${prefix}${contentId.value}`
  }

  async function fetchProfile(pubkey: string): Promise<NuxstrProfile | undefined> {
    try {
      const filter: NDKFilter = { kinds: [0], authors: [pubkey] }
      const events = await ndk.fetchEvents(filter)
      const latestEvent = Array.from(events)
        .sort((a, b) => (b.created_at || 0) - (a.created_at || 0))[0]

      if (!latestEvent?.content) return undefined

      const profileData = JSON.parse(latestEvent.content)
      return {
        name: profileData.name,
        display_name: profileData.display_name,
        about: profileData.about,
        picture: profileData.picture,
        nip05: profileData.nip05,
      }
    }
    catch (error) {
      console.warn('Failed to fetch profile for', pubkey, error)
      return undefined
    }
  }

  async function fetchComments() {
    loading.value = true
    error.value = null
    try {
      await connect()
      const filter: NDKFilter<NDKKind> = { kinds: [NDKKind.GenericReply], ['#t']: [tagValue()] }
      const events = await ndk.fetchEvents(filter)
      const list = Array.from(events).sort((a, b) => (a.created_at || 0) - (b.created_at || 0))

      // Fetch profiles for all unique pubkeys
      const pubkeys = [...new Set(list.map(e => e.pubkey))]
      const profilePromises = pubkeys.map(async (pubkey) => {
        const profile = await fetchProfile(pubkey)
        return { pubkey, profile }
      })
      const profileResults = await Promise.all(profilePromises)
      const profileMap = new Map(profileResults.map(r => [r.pubkey, r.profile]))

      comments.value = list.map(e => ({
        id: e.id,
        pubkey: e.pubkey,
        created_at: e.created_at || 0,
        content: e.content,
        profile: profileMap.get(e.pubkey),
      }))
    }
    catch (e: unknown) {
      error.value = (e as Error)?.message || String(e)
    }
    finally {
      loading.value = false
    }
  }

  async function postComment(comment: string) {
    await connect()
    const e = new NDKEvent(ndk)
    e.kind = NDKKind.GenericReply
    e.content = comment
    e.tags = [
      ['t', tagValue()],
    ]
    const ok = await e.publish().then(() => true).catch((err: unknown) => {
      error.value = (err as Error)?.message || String(err)
      return false
    })
    if (ok) {
      await fetchComments()
    }
    return ok
  }

  return { loading, error, comments, isLoggedIn, fetchComments, postComment }
}
