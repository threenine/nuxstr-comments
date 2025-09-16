<script setup lang="ts">
import { ref } from 'vue'

import { useNuxstrComments } from '../composables/useNuxstrComments'

const props = defineProps<{ contentId?: string }>()

const EMPTY_COMMENT = ''

const { postComment } = useNuxstrComments(props.contentId)
const comment = ref(EMPTY_COMMENT)

function isValidComment(commentText: string): boolean {
  return commentText.trim().length > 0
}

function clearComment(): void {
  comment.value = EMPTY_COMMENT
}

async function handlePost() {

}
</script>

<template>
  <div class="text-sm text-muted-foreground border border-green mt-16">
    <UTextarea
      v-model="comment"
      class="w-full mb-4"
      placeholder="Write a comment ...."
      :rows="4"
    />
    <div class="flex justify-end">
      <UButton
        color="primary"
        variant="solid"
        :disabled="!comment.trim()"
        class="mb-4"
        @click="handlePost"
      >
        Post Comment
      </UButton>
    </div>
  </div>
</template>

<style scoped>

</style>
