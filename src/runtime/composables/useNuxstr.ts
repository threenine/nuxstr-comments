import { computed, ref } from 'vue'
import { useRuntimeConfig } from '#imports'
import NDK, { NDKNip07Signer } from '@nostr-dev-kit/ndk'
import { useToast } from '#ui/composables/useToast'

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
    }
  }

  const state = w.__nuxstr as {
    ndk: null | NDK
    signer: null | NDKNip07Signer
    pubkey: ReturnType<typeof ref<string | null>>
    isConnecting: ReturnType<typeof ref<boolean>>
    isConnected: ReturnType<typeof ref<boolean>>
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
    console.log('NDK relays:', ndk.explicitRelayUrls)
    console.log('NDK connected:', state.isConnected.value)
    if (state.isConnected.value) return ndk
    if (state.isConnecting.value) return ndk
    state.isConnecting.value = true
    try {
      await ndk.connect()
      console.log('NDK connected:', state.isConnected.value)
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
      let poo = ndk.getUser({pubkey: user.pubkey})
      console.log(poo)
      await poo.fetchProfile()
      console.log(poo)
      await connect()
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
  }
}
