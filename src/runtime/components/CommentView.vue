<script setup lang="ts">
import {marked} from "marked";

const props = defineProps<{ content: string }>()
</script>

<template>
  <div class="prose prose-sm prose-invert mt-2 mb-2">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="marked.parse(props.content)" class="mb-4" />
    <!-- eslint-disable-next-line vue/no-v-html -->
    <u-separator />
    <comment-command-bar />
  </div>

</template>

<style scoped>

</style>
