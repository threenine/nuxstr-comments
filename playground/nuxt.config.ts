export default defineNuxtConfig({
  modules: ['@nuxt/ui', '../src/module'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-08-19',
  nuxstrComments: {
    relays: ['wss://relay.threenine.services']
  },
})
