<script setup lang="ts">
import type { Comment } from '../types'

const props = defineProps<{ replies: Comment[] }>()
</script>

<template>
  <div class="px-10 py-4">
    <UCard
      v-for="reply in props.replies"
      :key="reply.id"
      variant="subtle"
      class="mt-auto mb-3"
      :ui="{ header: 'flex items-center gap-1.5 text-dimmed' }"
    >
      <div>
        <comment-author
          :profile="reply.profile"
          :created-at="reply.created_at"
        />
        <p class="p-2 text-base">
          {{ reply.content }}
        </p>
      </div>
    </UCard>
  </div>
</template>

<style scoped>

</style>
