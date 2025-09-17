<script setup lang="ts">
import { useReplies } from '../composables/useReplies'
import { ref } from 'vue'

const props = defineProps<{ rootId: string }>()
const { reply } = useReplies(props.rootId)
const EMPTY_COMMENT = ''
const content = ref(EMPTY_COMMENT)
function isValidComment(commentText: string): boolean {
  return commentText.trim().length > 0
}
function clearComment(): void {
  content.value = EMPTY_COMMENT
}

async function postReply(comment: string) {
  if (!isValidComment(comment)) return

  const wasPosted = await reply(comment)
  if (wasPosted) {
    clearComment()
  }
}
</script>

<template>
  <div class="text-sm text-muted-foreground  mt-16 p-6">
    <div class="flex gap-2">
      <div class="flex-1">
        <UTextarea
          v-model="content"
          class="w-full mb-4 rounded-xl"
          placeholder="Write a reply to this comment ...."
          :rows="4"
        />
      </div>
      <div class="flex flex-col justify-center items-center p-2">
        <UButton
          icon="mingcute:send-line"
          size="xl"
          color="primary"
          variant="solid"
          class="mb-4 mr-2"
          @click="postReply(content)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
