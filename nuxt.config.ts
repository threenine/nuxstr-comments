// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-08-19',
  experimental: {nativeSqlite: true},
  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxt/ui"
  ]
})
