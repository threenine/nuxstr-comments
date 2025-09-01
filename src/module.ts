import { defineNuxtModule, addPlugin, addComponent, addImports, createResolver } from '@nuxt/kit'
import { defu } from 'defu'

// Module options TypeScript interface definition
export interface ModuleOptions {
  relays?: string[]
  tagStrategy?: 'path' | 'id' | 'custom'
  tagPrefix?: string // e.g., 'comment:' -> results in tag value like 'comment:/blog/my-post'
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@threenine/nuxstr-comments',
    configKey: 'nuxstrComments',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    relays: ['wss://relay.damus.io', 'wss://relay.nostr.band', 'wss://relay.primal.net'],
    tagStrategy: 'path',
    tagPrefix: 'comment:',
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Configure Vite to handle tseep and @nostr-dev-kit/ndk properly
    nuxt.hook('vite:extendConfig', (config) => {
      // Ensure optimizeDeps exist
      config.optimizeDeps = config.optimizeDeps || {}
      config.optimizeDeps.include = config.optimizeDeps.include || []

      // Pre-bundle these packages for better ESM/CJS interop
      config.optimizeDeps.include.push('tseep', '@nostr-dev-kit/ndk', 'nostr-tools', 'defu')

      // For SSR, don't externalize these packages
      config.ssr = config.ssr || {}

      // Handle the noExternal property correctly based on its current type
      const packagesToInclude = ['tseep', '@nostr-dev-kit/ndk', 'nostr-tools', 'defu']

      if (!config.ssr.noExternal) {
        config.ssr.noExternal = packagesToInclude
      }
      else if (Array.isArray(config.ssr.noExternal)) {
        config.ssr.noExternal.push(...packagesToInclude)
      }
      else if (config.ssr.noExternal === true) {
        // If it's true, leave it as is (all packages are not externalized)
        // Don't need to do anything
      }
      else {
        // If it's a single string or RegExp, convert to array and add our packages
        config.ssr.noExternal = [config.ssr.noExternal, ...packagesToInclude]
      }
    })

    // Configure Nitro for server-side bundling
    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.externals = nitroConfig.externals || {}
      nitroConfig.externals.inline = nitroConfig.externals.inline || []
      nitroConfig.externals.inline.push('tseep', '@nostr-dev-kit/ndk', 'nostr-tools', 'defu')
    })

    // Build transpilation (you already had this)
    nuxt.options.build.transpile = nuxt.options.build.transpile || []
    nuxt.options.build.transpile.push('tseep', '@nostr-dev-kit/ndk', 'nostr-tools', 'defu')

    // Expose runtime config to plugin
    nuxt.options.runtimeConfig.public.nuxstrComments = defu(nuxt.options.runtimeConfig.public.nuxstrComments || {}, options)

    // Register plugin
    addPlugin(resolver.resolve('./runtime/plugin'))

    // Register composables
    addImports([
      { name: 'useNuxstr', as: 'useNuxstr', from: resolver.resolve('./runtime/composables/useNuxstr') },
      { name: 'useNuxstrComments', as: 'useNuxstrComments', from: resolver.resolve('./runtime/composables/useNuxstrComments') },
    ])

    // Register component
    addComponent({
      name: 'NuxstrComments',
      filePath: resolver.resolve('./runtime/components/NuxstrComments.vue'),
    })
  },
})
