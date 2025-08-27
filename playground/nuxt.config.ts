export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxt/ui', '../src/module'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  content: {
    experimental: { nativeSqlite: true },
  },
  compatibilityDate: '2025-08-19',
  nuxstrComments: {
    relays: ['wss://relay.damus.io', 'wss://relay.nostr.band', 'wss://relay.primal.net'],
  },
})
