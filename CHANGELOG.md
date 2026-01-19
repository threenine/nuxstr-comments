# Changelog


## v1.6.0

[compare changes](https://github.com/threenine/nuxstr-comments/compare/v1.5.4...v1.6.0)

### 🚀 Enhancements

- Add initial NostrManager class with basic imports from `nostr-tools` ([f83f57e](https://github.com/threenine/nuxstr-comments/commit/f83f57e))
- Integrate `useNostr` composable, replace `@nostr-dev-kit/ndk` with `nostr-tools`, and refactor comment/reply subscription logic ([5a5fc6e](https://github.com/threenine/nuxstr-comments/commit/5a5fc6e))

### 💅 Refactors

- Clean up type imports, extend global window typings, and remove unnecessary comments ([6bb8c23](https://github.com/threenine/nuxstr-comments/commit/6bb8c23))

### 🏡 Chore

- Replace `@nostr-dev-kit/ndk` with `nostr-tools` and update profile fetch logic in `useNuxstr` for improved null handling ([3c48c68](https://github.com/threenine/nuxstr-comments/commit/3c48c68))

### ❤️ Contributors

- Gary Woodfine <lnb0l9dc@duck.com>

## v1.5.4

[compare changes](https://github.com/threenine/nuxstr-comments/compare/v1.5.3...v1.5.4)

### 🏡 Chore

- **dependencies:** Update `@nuxt/ui` to `^4.3.0` ([ee14f9c](https://github.com/threenine/nuxstr-comments/commit/ee14f9c))

### ❤️ Contributors

- Gary Woodfine <lnb0l9dc@duck.com>

## v1.5.3

[compare changes](https://github.com/threenine/nuxstr-comments/compare/v1.5.2...v1.5.3)

### 🏡 Chore

- **runtime & dependencies:** Fix padding typo, enhance UI, and update dependencies ([2098aca](https://github.com/threenine/nuxstr-comments/commit/2098aca))
- **dependencies:** Update `@nuxt/ui` to `^4.2.1` ([4b90159](https://github.com/threenine/nuxstr-comments/commit/4b90159))

### ❤️ Contributors

- Gary Woodfine <lnb0l9dc@duck.com>

## v1.5.2

[compare changes](https://github.com/threenine/nuxstr-comments/compare/v1.5.1...v1.5.2)

### 📖 Documentation

- **README:** Replace npm commands with pnpm equivalents ([60f1f9b](https://github.com/threenine/nuxstr-comments/commit/60f1f9b))
- **README:** Reorder usage instructions and fix formatting in example code ([282b0c1](https://github.com/threenine/nuxstr-comments/commit/282b0c1))

### 🏡 Chore

- **dependencies:** Update Nuxt dependencies and fix typos in README ([6d81cf8](https://github.com/threenine/nuxstr-comments/commit/6d81cf8))
- **runtime:** Enhance markdown rendering and style updates in components ([cbd48dc](https://github.com/threenine/nuxstr-comments/commit/cbd48dc))
- **changelog:** Cleanup historical logs and reformat for initial release ([5f86a6c](https://github.com/threenine/nuxstr-comments/commit/5f86a6c))
- **dependencies:** Remove `@nuxt/content` and update `nuxt.config.ts` plugins list ([cd420ca](https://github.com/threenine/nuxstr-comments/commit/cd420ca))

### ❤️ Contributors

- Gary Woodfine <lnb0l9dc@duck.com>

## v1.5.1

[compare changes](https://github.com/threenine/nuxstr-comments/compare/v1.5.0...v1.5.1)

### 🩹 Fixes

- **ReplyButton:** Remove extra spaces in imports and computed property ([8bd2dfe](https://github.com/threenine/nuxstr-comments/commit/8bd2dfe))

### 💅 Refactors

- **components:** Rename `CommentCommandBar` to `ReplyButton` and improve reply UI ([1f89445](https://github.com/threenine/nuxstr-comments/commit/1f89445))
- **components:** Standardize casing in `ReplyButton` template elements ([8726305](https://github.com/threenine/nuxstr-comments/commit/8726305))
- **components:** Update spacing and styles in reply-related components ([b780258](https://github.com/threenine/nuxstr-comments/commit/b780258))
- **runtime:** Update imports and typings for improved consistency ([6933618](https://github.com/threenine/nuxstr-comments/commit/6933618))
- **runtime:** Standardize `useReplies` import and improve type annotations ([68fd2e2](https://github.com/threenine/nuxstr-comments/commit/68fd2e2))

### 📖 Documentation

- **README:** Update comment configuration and tagging details ([73ad389](https://github.com/threenine/nuxstr-comments/commit/73ad389))

### ❤️ Contributors

- Gary Woodfine <lnb0l9dc@duck.com>

## v1.5.0

[compare changes](https://github.com/threenine/nuxstr-comments/compare/v1.4.0...v1.5.0)

### 🚀 Enhancements

- **playground:** Add new pages with nested routes and update navigation links ([6976528](https://github.com/threenine/nuxstr-comments/commit/6976528))

### 🩹 Fixes

- **PostReply:** Remove redundant space in `ref` import ([ea69320](https://github.com/threenine/nuxstr-comments/commit/ea69320))

### ❤️ Contributors

- Gary Woodfine <lnb0l9dc@duck.com>

## v1.4.0

[compare changes](https://github.com/threenine/nuxstr-comments/compare/v1.3.0...v1.4.0)

### 🚀 Enhancements

- **playground:** Enhance `index.vue` with `UContainer` layout ([2ae64ae](https://github.com/threenine/nuxstr-comments/commit/2ae64ae))

### ❤️ Contributors

- Gary Woodfine <lnb0l9dc@duck.com>

## v1.3.0

[compare changes](https://github.com/threenine/nuxstr-comments/compare/v1.2.3...v1.3.0)

### 🚀 Enhancements

- **components:** Add `CommentCommandBar` and update `NuxstrComments` ([602e7dd](https://github.com/threenine/nuxstr-comments/commit/602e7dd))
- **components:** Add `CommentAuthor` and `CommentView` components, refactor `NuxstrComments` ([68b3132](https://github.com/threenine/nuxstr-comments/commit/68b3132))
- **comments:** Add reply functionality, enhance command bar, and improve component integration ([163fd55](https://github.com/threenine/nuxstr-comments/commit/163fd55))
- **comments:** Enhance reply functionality and refactor components ([8edd011](https://github.com/threenine/nuxstr-comments/commit/8edd011))
- **comments:** Refactor comments and replies handling, introduce new components ([07cba76](https://github.com/threenine/nuxstr-comments/commit/07cba76))
- **comments:** Refactor comments and replies handling, introduce new components ([6ee7039](https://github.com/threenine/nuxstr-comments/commit/6ee7039))
- **comments:** Integrate reply counting and enhance UI for `CommentCommandBar` ([7a32527](https://github.com/threenine/nuxstr-comments/commit/7a32527))

### 💅 Refactors

- **components:** Update `NuxstrComments` styles and text for improved consistency ([65409af](https://github.com/threenine/nuxstr-comments/commit/65409af))
- **app:** Restructure playground with dedicated pages and layout ([f956d2c](https://github.com/threenine/nuxstr-comments/commit/f956d2c))

### 📖 Documentation

- **README:** Add support section with donation links ([e11bcfb](https://github.com/threenine/nuxstr-comments/commit/e11bcfb))
- **README:** Update support section and add FUNDING.yml ([f7ebb1a](https://github.com/threenine/nuxstr-comments/commit/f7ebb1a))
- **README:** Update description for Nostr support ([a7fb8e3](https://github.com/threenine/nuxstr-comments/commit/a7fb8e3))

### ❤️ Contributors

- Gary Woodfine <lnb0l9dc@duck.com>

## v1.2.3

[compare changes](https://github.com/threenine/nuxstr-comments/compare/v1.2.2...v1.2.3)

### 💅 Refactors

- **components:** Replace `UAvatar` with `img` for profile avatars in `NuxstrComments.vue` ([21f199c](https://github.com/threenine/nuxstr-comments/commit/21f199c))

### ❤️ Contributors

- Gary Woodfine <lnb0l9dc@duck.com>

## v1.2.2

[compare changes](https://github.com/threenine/nuxstr-comments/compare/v1.2.1...v1.2.2)

### 💅 Refactors

- **components:** Wrap comment sections in `ClientOnly` for improved SSR compatibility ([d6bd62d](https://github.com/threenine/nuxstr-comments/commit/d6bd62d))
- **components:** Wrap comment sections in `ClientOnly` for improved SSR compatibility ([0cfa4c6](https://github.com/threenine/nuxstr-comments/commit/0cfa4c6))

### ❤️ Contributors

- Gary Woodfine <lnb0l9dc@duck.com>

## v1.2.1

[compare changes](https://github.com/threenine/nuxstr-comments/compare/v1.2.0...v1.2.1)

### 💅 Refactors

- **components:** Improve comment handling logic and validation ([b00c1e3](https://github.com/threenine/nuxstr-comments/commit/b00c1e3))

### 🏡 Chore

- **components:** Remove redundant empty lines in `NuxstrComments.vue` and `PostComment.vue` ([1686736](https://github.com/threenine/nuxstr-comments/commit/1686736))

### ❤️ Contributors

- Gary Woodfine <lnb0l9dc@duck.com>

## v1.2.0

[compare changes](https://github.com/threenine/nuxstr-comments/compare/v1.1.1...v1.2.0)

### 🚀 Enhancements

- **components:** Introduce `Scaffold` component for skeleton loading ([b15a5d7](https://github.com/threenine/nuxstr-comments/commit/b15a5d7))

### 💅 Refactors

- **components, composables:** Modularize comment posting and enhance profile handling ([e5fbf0e](https://github.com/threenine/nuxstr-comments/commit/e5fbf0e))
- **composables, components:** Replace `fetchComments` with `subscribeComments` ([5c248b7](https://github.com/threenine/nuxstr-comments/commit/5c248b7))
- **components, composables:** Rename `Scaffold` to `ScaffoldComment` and improve formatting ([0c68218](https://github.com/threenine/nuxstr-comments/commit/0c68218))

### ❤️ Contributors

- Gary Woodfine <lnb0l9dc@duck.com>

## v1.1.1

[compare changes](https://github.com/threenine/nuxstr-comments/compare/v1.1.0...v1.1.1)

### 🏡 Chore

- **config:** Update default and playground `relays` lists for improved connectivity ([8fd1b09](https://github.com/threenine/nuxstr-comments/commit/8fd1b09))
- **config:** Update default and playground `relays` lists for improved connectivity ([a78b04c](https://github.com/threenine/nuxstr-comments/commit/a78b04c))

### ❤️ Contributors

- Gary Woodfine <lnb0l9dc@duck.com>

## v1.1.0

[compare changes](https://github.com/threenine/nuxstr-comments/compare/v1.0.15...v1.1.0)

### 🚀 Initial Release

- **composables:** Add `useRequestURL` import to `useComments` ([3c6468a](https://github.com/threenine/nuxstr-comments/commit/3c6468a))

### ❤️ Contributors

- Gary Woodfine <lnb0l9dc@duck.com>
