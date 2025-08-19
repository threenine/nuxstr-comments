<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: Nuxstr Comments
- Package name: @threenine/nuxstr-comments
- Description: Nuxstr Comments
-->

# Nuxstr Comments

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Nuxstr Comments for doing amazing things.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/@threenine/nuxstr-comments?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

- Nostr-powered comments for Nuxt Content blog posts
- NIP-07 login prompt if user is not authenticated
- Comments are written in Markdown and rendered via @nuxt/content's ContentRendererMarkdown
- Configurable relay list and tagging strategy

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add @threenine/nuxstr-comments
```

That's it! You can now use Nuxstr Comments in your Nuxt app ✨

### Usage

1. Ensure @nuxt/content is enabled and your blog post pages use ContentDoc or render content files.
2. Add the comments component where you want comments to appear (usually below a ContentDoc):

```vue
<template>
  <div>
    <ContentDoc />
    <NuxstrComments />
  </div>
</template>
```

By default, the component tags comments by the current route path (e.g., content:/blog/my-post) and fetches them from configured relays.

3. Configuration (nuxt.config.ts):

```ts
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@threenine/nuxstr-comments',
  ],
  nuxstrComments: {
    relays: ['wss://relay.damus.io', 'wss://relay.nostr.band'],
    tagStrategy: 'path',
    tagPrefix: 'content:',
  },
})
```

When a user attempts to post, they will be prompted to log in with their Nostr browser extension (NIP-07). Comments are published as kind:1 notes tagged with a `t` tag containing the content tag (e.g., `content:/blog/my-post`). Rendering of comment bodies uses @nuxt/content's ContentRendererMarkdown component so users can write markdown.


## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@threenine/nuxstr-comments/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@threenine/nuxstr-comments

[npm-downloads-src]: https://img.shields.io/npm/dm/@threenine/nuxstr-comments.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/@threenine/nuxstr-comments

[license-src]: https://img.shields.io/npm/l/@threenine/nuxstr-comments.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/@threenine/nuxstr-comments

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
