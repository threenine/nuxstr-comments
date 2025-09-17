<script setup lang="ts">
import { ref } from 'vue'

import { useComments } from '../composables/useComments'

const props = defineProps<{ contentId?: string }>()

const EMPTY_COMMENT = ''

const { postComment } = useComments(props.contentId)
const comment = ref(EMPTY_COMMENT)

function isValidComment(commentText: string): boolean {
  return commentText.trim().length > 0
}

function clearComment(): void {
  comment.value = EMPTY_COMMENT
}

async function handlePost() {
  if (!isValidComment(comment.value)) return

  const wasPosted = await postComment(comment.value)
  if (wasPosted) {
    clearComment()
  }
}
</script>

<template>
  <div class="text-sm text-muted-foreground border border-green mt-4 p-6">
    <div class="flex gap-2">
      <div class="flex-1">

      <UTextarea
      v-model="comment"
      class="w-full mb-4"
      placeholder="Write a comment ...."
      :rows="4"
    />
      </div>
    <div class="flex flex-col justify-center items-center p-2">
      <UButton
        icon="mingcute:send-line"
        color="primary"
        variant="solid"
        :disabled="!comment.trim()"
        class=""
        @click="handlePost"
        size="xl"
      />
    </div>
    </div>
  </div>
</template>

<style scoped>

</style>
