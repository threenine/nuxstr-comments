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
    relays: ['wss://relay.damus.io', 'wss://relay.nostr.band', 'wss://nos.lol'],
    tagStrategy: 'path',
    tagPrefix: 'comment:',
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

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
