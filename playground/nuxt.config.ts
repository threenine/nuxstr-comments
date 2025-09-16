export default defineNuxtConfig({
  modules: ['@nuxt/ui', '../src/module'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-08-19',
  nuxstrComments: {
    relays: ['wss://frens.nostr1.com', 'wss://purplerelay.com', 'wss://a.nos.lol', 'wss://freelay.sovbit.host', 'wss://nos.lol'],
  },
})
