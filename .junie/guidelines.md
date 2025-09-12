

# Frontend
* Nuxt 4.0
* nuxt/ui
* tailwindcss
* vite
* vueuse

# Backend
* vue
* Typescript
* nostr*tools
* NDK

# Unit Test
* vitest

# package manager
* pnpm 

async function parseCommentContent(content: string) {
try {
const parsed = await parseMarkdown(content)
return parsed
}
catch {
// If parsing fails, return a simple text node structure
return {
type: 'root',
children: [
{
type: 'element',
tag: 'p',
children: [{ type: 'text', value: content }],
},
],
}
}
}
