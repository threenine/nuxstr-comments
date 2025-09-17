<script setup lang="ts">
import { useReplies } from '../composables/useReplies'
import { onMounted } from 'vue'

const props = defineProps<{ rootId: string }>()
const { replies, subscribeReplies } = useReplies(props.rootId)

onMounted(() => {
  subscribeReplies()
})
</script>

<template>
  <div class="px-10 py-4">
    <div
      v-for="reply in replies"
      :key="reply.id"
      class="rounded border border-gray-900 p-3 mt-2 mb-2"
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
