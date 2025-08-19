// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  experimental: {nativeSqlite: true},
  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxt/ui"
  ]
})
