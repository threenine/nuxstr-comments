<script setup lang="ts">
import { marked } from 'marked'

const props = defineProps<{ content: string, id?: string }>()
</script>

<template>
  <div class="mt-2 mb-2">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div
      class="mb-1"
      v-html="marked.parse(props.content)"
    />
    <!-- eslint-disable-next-line vue/no-v-html -->
    <ReplyButton :content-id="props.id" />
  </div>
</template>

<style scoped>

</style>
