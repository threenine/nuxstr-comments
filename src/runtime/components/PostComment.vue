<script setup lang="ts">
import { useNuxstrComments } from '../composables/useNuxstrComments'

const props = defineProps<{ contentId?: string }>()

const { postComment } = useNuxstrComments(props.contentId)
const comment = ref('')
async function handlePost() {
  if (!comment.value.trim()) return
  const ok = await postComment(comment.value)
  if (ok) comment.value = ''
}
</script>

<template>
  <div class="text-sm text-muted-foreground border border-green mt-16">
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
</template>

<style scoped>

</style>
