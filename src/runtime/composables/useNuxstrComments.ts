import { ref, computed } from 'vue'
import { useRoute, useRuntimeConfig } from '#imports'
import { useNuxstr } from './useNuxstr'
import { NDKEvent, type NDKFilter, NDKKind } from '@nostr-dev-kit/ndk'

export type NuxstrComment = {
  id: string
  pubkey: string
  created_at: number
  content: string
}

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
    const prefix = opts.tagPrefix || 'content:'
    return `${prefix}${contentId.value}`
  }

  async function fetchComments() {
    loading.value = true
    error.value = null
    try {
      await connect()
      const filter: NDKFilter<NDKKind> = { kinds: [NDKKind.Text], ['#t']: [tagValue()] }
      const events = await ndk.fetchEvents(filter)
      const list = Array.from(events).sort((a, b) => (a.created_at || 0) - (b.created_at || 0))
      comments.value = list.map(e => ({
        id: e.id,
        pubkey: e.pubkey,
        created_at: e.created_at || 0,
        content: e.content,

      }))
    }
    catch (e: unknown) {
      error.value = (e as Error)?.message || String(e)
    }
    finally {
      loading.value = false
    }
  }

  async function postComment(markdown: string) {
    await connect()
    const e = new NDKEvent(ndk)
    e.kind = 1
    e.content = markdown
    e.tags = [
      ['t', tagValue()],
    ]
    const ok = await e.publish().then(() => true).catch((err: unknown) => {
      error.value = (err as Error)?.message || String(err)
      return false
    })
    if (ok) {
      comments.value.push({ id: e.id!, pubkey: e.pubkey!, created_at: e.created_at || Math.floor(Date.now() / 1000), content: e.content })
    }
    return ok
  }

  return { loading, error, comments, isLoggedIn, fetchComments, postComment }
}
