<script setup lang="ts">
const props = defineProps<{ replies: Comment[] }>()
</script>

<template>
  <div class="px-10 py-4">
    <div
      v-for="reply in props.replies"
      :key="reply.id"
      class="rounded-md border p-3 mt-2 mb-2"
    >
      <div>
        <comment-author
          :profile="reply.profile"
          :created-at="reply.created_at"
        />
        <p>{{ reply.content }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
