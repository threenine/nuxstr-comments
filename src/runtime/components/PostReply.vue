<script setup lang="ts">
import { useNuxstrComments } from '../composables/useNuxstrComments'

const props = defineProps<{ contentId: string }>()



const EMPTY_COMMENT = ''
const { replyComment } = useNuxstrComments(props.contentId)
console.log(props.contentId)
const reply = ref(EMPTY_COMMENT)
function isValidComment(commentText: string): boolean {
  return commentText.trim().length > 0
}
function clearComment(): void {
  reply.value = EMPTY_COMMENT
}

async function postReply(comment: string) {
  if (!isValidComment(reply.value)) return

  const wasPosted = await replyComment(reply.value, props.contentId)
  if (wasPosted) {
    clearComment()
  }
}
</script>

<template>
  <div class="text-sm text-muted-foreground border border-neutral mt-16 p-6">
    <UTextarea
      v-model="reply"
      class="w-full mb-4"
      placeholder="Write a reply to this comment ...."
      :rows="4"
    />
    <div class="flex justify-end">
      <UButton
        color="primary"
        variant="solid"
        class="mb-4 mr-2"
        @click="postReply(repy)"
      >
        Reply
      </UButton>
    </div>
  </div>
</template>

<style scoped>

</style>
