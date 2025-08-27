<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNuxstr } from '../composables/useNuxstr'
import { useNuxstrComments } from '../composables/useNuxstrComments'
import type { HtmlAst, RootNode } from '~/src/runtime/types'

const props = defineProps<{ contentId?: string }>()

const { login, isLoggedIn } = useNuxstr()
const { comments, fetchComments, postComment, loading, error } = useNuxstrComments(props.contentId)

const comment = ref('')
onMounted(() => {
  fetchComments()
})

async function handlePost() {
  if (!comment.value.trim()) return
  const ok = await postComment(comment.value)
  if (ok) comment.value = ''
}

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
        leading-icon="game-icons:ostrich"
        @click="login"
      >
        Login
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
        class="rounded border border-gray-200 dark:border-gray-800 p-3 mt-2"
      >
        <div class="flex items-center gap-3 mb-3 mt-2">
          <div
            v-if="c.profile?.picture"
            class="flex-shrink-0"
          >
            <UAvatar
              :src="c.profile.picture"
              :alt="c.profile.name || c.profile.display_name || 'User avatar'"
              class="w-8 h-8 rounded-full object-cover"
            />
          </div>
          <div class="flex-1 min-w-0">
            <div class="truncate">
              {{ c.profile?.display_name || c.profile?.name || `${c.pubkey.slice(0, 8)}…` }}
              <span class="text-xs">{{ new Date(c.created_at * 1000).toLocaleString() }}</span>
            </div>
          </div>
        </div>
        <div class="prose prose-sm prose-invert mt-2">
          <ContentRenderer :value="parseContent(c.content)" />
        </div>
      </div>
    </div>

    <div
      v-if="isLoggedIn"
      class="space-y-2"
    >
      <UTextarea
        v-model="comment"
        class="w-full"
        placeholder="Write a comment ...."
        :rows="4"
      />
      <div class="flex justify-end">
        <UButton
          color="primary"
          variant="solid"
          :disabled="!comment.trim()"
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
