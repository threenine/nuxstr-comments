export default defineNuxtConfig({
  modules: ['@nuxt/ui', '../src/module'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-08-19',
  nuxstrComments: {
    relays: ['wss://relay.damus.io', 'wss://relay.nostr.band', 'wss://relay.primal.net'],
  },
})
