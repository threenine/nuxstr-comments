<script setup lang="ts">
import { onMounted } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ content: string, id: string }>()

async function renderMarkdown(md: string): Promise<string> {
  // Marked.parse returns string; keep narrow surface for future changes (e.g., sanitization).
  return marked.parse(md)
}

onMounted(async () => {
  const targetEl = document.getElementById('comment-content')
  if (!targetEl) return
  targetEl.innerHTML = await renderMarkdown(props.content)
})
</script>

<template>
  <div class="mt-2 mb-2">
    <div id="comment-content" />
    <ReplyButton :content-id="props.id" />
  </div>
</template>

<style scoped>

</style>
