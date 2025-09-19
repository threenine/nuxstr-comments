import { computed, ref } from 'vue'
import { useRuntimeConfig } from '#imports'
import NDK, { type NDKEvent, NDKNip07Signer, type NDKUserProfile } from '@nostr-dev-kit/ndk'
import { useToast } from '#ui/composables/useToast'
import type { Comment, Profile } from '../types'

function useNuxstr() {
  // Singleton per client
  // We attach NDK instance to a module-level variable
  // to avoid multiple connections in HMR/dev.
  const DEFAULT_PUBKEY = ''
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = globalThis as any
  if (!w.__nuxstr) {
    w.__nuxstr = {
      ndk: null as null | NDK,
      signer: null as null | NDKNip07Signer,
      pubkey: ref<string>(DEFAULT_PUBKEY),
      isConnecting: ref(false),
      isConnected: ref(false),
      userProfile: ref<Profile>(undefined as unknown as Profile),
    }
  }

  const state = w.__nuxstr as {
    ndk: null | NDK
    signer: null | NDKNip07Signer
    pubkey: ReturnType<typeof ref<string>>
    isConnecting: ReturnType<typeof ref<boolean>>
    isConnected: ReturnType<typeof ref<boolean>>
    userProfile: ReturnType<typeof ref<Profile | null>>
  }
  const DEFAULT_TIMESTAMP = 0
  const config = useRuntimeConfig()
  const opts = (config.public?.nuxstrComments || {}) as {
    relays?: string[]
  }

  function initializeNDK() {
    if (!state.ndk) {
      state.ndk = new NDK({
        explicitRelayUrls: opts.relays || [],

      })
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
      await connect()
      const signer = new NDKNip07Signer()
      ndk.signer = signer
      const account = await signer.user()
      state.signer = signer
      state.pubkey.value = account.pubkey
      const user = ndk.getUser({ pubkey: account.pubkey })
      const profile = await user.fetchProfile()
      state.userProfile.value = mapProfile(profile)
    }
  }

  function mapComment(event: NDKEvent): Comment {
    return <Comment> {
      id: event.id,
      pubkey: event.pubkey,
      created_at: event.created_at || DEFAULT_TIMESTAMP,
      content: event.content,
      profile: undefined,
    }
  }
  async function fetchProfile(pubkey: string): Promise<Profile | undefined> {
    try {
      const ndk = initializeNDK()
      const user = ndk.getUser({ pubkey: pubkey })
      const profile = await user.fetchProfile()
      return mapProfile(profile)
    }
    catch (error) {
      console.error('Failed to fetch profile for', pubkey, error)
      return undefined
    }
  }
  function mapProfile(profile: NDKUserProfile | null): Profile {
    if (profile === null) return <Profile>{}

    return <Profile>{
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
    state.pubkey.value = DEFAULT_PUBKEY
  }

  return {
    get ndk() {
      return initializeNDK()
    },
    connect,
    login,
    logout,
    isLoggedIn,
    pubkey: state.pubkey.value,
    mapProfile,
    mapComment,
    fetchProfile,
  }
}

export default useNuxstr
