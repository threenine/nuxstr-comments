import { computed, ref } from 'vue'

import { useToast } from '#ui/composables/useToast'
import type { Profile } from '../types'
import { useNostr } from './useNostr'
import type { Filter } from 'nostr-tools'

function useNuxstr() {
  // Singleton per client
  const DEFAULT_PUBKEY = ''
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = globalThis as any
  if (!w.__nuxstr) {
    w.__nuxstr = {
      pubkey: ref<string>(DEFAULT_PUBKEY),
      isConnecting: ref(false),
      isConnected: ref(false),
      userProfile: ref<Profile | null>(null),
    }
  }

  const state = w.__nuxstr as {
    pubkey: ReturnType<typeof ref<string>>
    isConnecting: ReturnType<typeof ref<boolean>>
    isConnected: ReturnType<typeof ref<boolean>>
    userProfile: ReturnType<typeof ref<Profile | null>>
  }

  const { getEvent } = useNostr()

  const isLoggedIn = computed(() => !!state.pubkey.value)
  const userProfile = computed(() => state.userProfile.value)

  async function checkExtension(): Promise<boolean> {
    if (typeof window !== 'undefined' && 'nostr' in window) return true

    const toast = useToast()
    toast.add({
      title: 'Nostr extension not found',
      description: 'NIP-07 browser extension not found. Install a Nostr extension like nos2x, Alby, or Coracle.',
      icon: 'game-icons:ostrich',
    })
    return false
  }

  async function login(): Promise<void> {
    if (await checkExtension()) {
      try {
        // @ts-expect-error unresolved variable nostr
        const pubkey = await window.nostr.getPublicKey()
        state.pubkey.value = pubkey
        const profile = await fetchProfile(pubkey)
        if (profile) {
          state.userProfile.value = profile
        }
      }
      catch (e) {
        console.error('Failed to login', e)
      }
    }
  }

  async function fetchProfile(pubkey: string): Promise<Profile | undefined> {
    try {
      const filter: Filter = {
        kinds: [0],
        authors: [pubkey],
      }
      const event = await getEvent(filter)
      if (event) {
        const content = JSON.parse(event.content)
        return mapProfile(content, pubkey)
      }
      return undefined
    }
    catch (error) {
      console.error('Failed to fetch profile for', pubkey, error)
      return undefined
    }
  }

  function mapProfile(profile: unknown, pubkey: string): Profile {
    return <Profile>{
      pubkey,
      display_name: profile.display_name || profile.name,
      about: profile.about,
      image: profile.picture,
      nip05: profile.nip05,
      lud06: profile.lud06,
      lud16: profile.lud16,
      website: profile.website,
    }
  }

  function logout(): void {
    state.pubkey.value = DEFAULT_PUBKEY
    state.userProfile.value = null
  }

  return {
    login,
    logout,
    isLoggedIn,
    pubkey: state.pubkey.value,
    userProfile,
    fetchProfile,
  }
}

export default useNuxstr
