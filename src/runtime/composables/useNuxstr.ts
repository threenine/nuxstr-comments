import { computed, ref } from 'vue'
import { useRuntimeConfig } from '#imports'
import NDK, { type NDKEvent, NDKNip07Signer } from '@nostr-dev-kit/ndk'
import { useToast } from '#ui/composables/useToast'
import type { Profile, Comment } from '../types'

export function useNuxstr() {
  // Singleton per client
  // We attach NDK instance to a module-level variable
  // to avoid multiple connections in HMR/dev.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = globalThis as any
  if (!w.__nuxstr) {
    w.__nuxstr = {
      ndk: null as null | NDK,
      signer: null as null | NDKNip07Signer,
      pubkey: ref<string | null>(null),
      isConnecting: ref(false),
      isConnected: ref(false),
      userProfile: ref<Profile>(null),
    }
  }

  const state = w.__nuxstr as {
    ndk: null | NDK
    signer: null | NDKNip07Signer
    pubkey: ReturnType<typeof ref<string | null>>
    isConnecting: ReturnType<typeof ref<boolean>>
    isConnected: ReturnType<typeof ref<boolean>>
    userProfile: ReturnType<typeof ref<Profile | null>>
  }

  const config = useRuntimeConfig()
  const opts = (config.public?.nuxstrComments || {}) as {
    relays?: string[]
  }

  function initializeNDK() {
    if (!state.ndk) {
      state.ndk = new NDK({ explicitRelayUrls: opts.relays || [] })
    }
    return state.ndk
  }

  const isLoggedIn = computed(() => !!state.pubkey.value)

  async function connect() {
    const ndk = initializeNDK()
    if (state.isConnected.value) return ndk
    if (state.isConnecting.value) return ndk
    state.isConnecting.value = true
    try {
      await ndk.connect()
      state.isConnected.value = true
      return ndk
    }
    finally {
      state.isConnecting.value = false
    }
  }
  async function checkExtension(): Promise<boolean> {
    if ('nostr' in window) return true

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
      const ndk = initializeNDK()
      const signer = new NDKNip07Signer()
      ndk.signer = signer
      const user = await signer.user()
      state.signer = signer
      state.pubkey.value = user.pubkey
      await connect()
      const profile = await ndk.getUser({ pubkey: user.pubkey })

      state.userProfile.value = mapProfile(profile)
    }
  }

  function mapComment(event: NDKEvent): Comment {
    return <Comment> {
      id: event.id,
      pubkey: event.pubkey,
      created_at: event.created_at || 0,
      content: event.content,
      profile: null,
    }
  }
  function mapProfile(profile: NDKUserProfile): Profile {
    console.log('profile', profile)
    return <Profile> {
      display_name: profile.displayName,
      about: profile.about,
      image: profile.picture,
      nip05: profile.nip05,
      lud06: profile.lud06,
      lud16: profile.lud16,
      website: profile.website,
    }
  }
  function logout(): void {
    state.signer = null
    state.pubkey.value = null
  }

  return {
    get ndk() { return initializeNDK() },
    connect,
    login,
    logout,
    isLoggedIn,
    pubkey: state.pubkey,
    mapProfile,
    mapComment,
  }
}
