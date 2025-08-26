<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNuxstr } from '../composables/useNuxstr'
import { useNuxstrComments } from '../composables/useNuxstrComments'

const props = defineProps<{ contentId?: string }>()

const { login, isLoggedIn } = useNuxstr()
const { comments, fetchComments, postComment, loading, error } = useNuxstrComments(props.contentId)

const draft = ref('')

onMounted(() => {
  fetchComments()
})

async function handlePost() {
  if (!isLoggedIn.value) {
    try {
      await login()
    }
    catch (e: unknown) {
      const msg = (e as Error)?.message || 'Login failed'
      alert(msg)
      return
    }
  }
  if (!draft.value.trim()) return
  const ok = await postComment(draft.value)
  if (ok) draft.value = ''
}

export interface ElementNode {
  type: 'element'
  tag: string
  props?: Record<string, unknown>
}

export interface RootNode {
  type: 'root'
  children: ElementNode[]
}

export interface HtmlAst {
  body: RootNode
}

// Renamed from parseContent to buildHtmlAst, removed unnecessary async,
// renamed parameter to 'html' for clarity, and added explicit return type
function parseContent(html: string): HtmlAst {
  return { body: createRoot(html) }
}

// Extracted helper to encapsulate AST node creation
function createRoot(html: string): RootNode {
  return {
    type: 'root',
    children: [
      {
        type: 'element',
        tag: 'div',
        props: { innerHTML: html },
      },
    ],
  }
}
</script>

<template>
  <div class="nuxstr-comments space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">
        Comments
      </h3>
      <UButton
        v-if="!isLoggedIn"
        color="primary"
        variant="solid"
        @click="login"
      >
        Login with Nostr
      </UButton>
    </div>

    <div
      v-if="error"
      class="text-red-600 text-sm"
    >
      {{ error }}
    </div>

    <div
      v-if="loading"
      class="text-sm text-gray-500"
    >
      Loading comments…
    </div>

    <div
      v-else
      class="space-y-6"
    >
      <div
        v-for="c in comments"
        :key="c.id"
        class="rounded border border-gray-200 dark:border-gray-800 p-3"
      >
        <div class="text-xs text-gray-500 mb-2">
          <span class="font-mono">{{ c.pubkey.slice(0, 8) }}…</span>
          <span> • </span>
          <span>{{ new Date(c.created_at * 1000).toLocaleString() }}</span>
        </div>
        <div class="nuxstr-comments">
          <ContentRenderer :value="parseContent(c.content)" />
        </div>
      </div>
    </div>

    <div class="space-y-2">
      <UTextarea
        v-model="draft"
        placeholder="Write a comment in Markdown…"
        :rows="4"
      />
      <div class="flex justify-end">
        <UButton
          color="primary"
          variant="solid"
          :disabled="!draft.trim()"
          @click="handlePost"
        >
          Post Comment
        </UButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nuxstr-comments :deep(pre) {
  white-space: pre-wrap;
}
</style>
