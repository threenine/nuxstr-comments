// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
  ],
  content: {
    experimental: { nativeSqlite: true },
  },
  experimental: { nativeSqlite: true },
  compatibilityDate: '2025-08-19',
})
