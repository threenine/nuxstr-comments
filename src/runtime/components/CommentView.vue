<script setup lang="ts">
defineProps<{ content: string, id: string }>()
</script>

<template>
  <div class="mt-2 mb-2">
    <UCard
      variant="subtle"
      class="mt-auto"
      :ui="{ header: 'flex items-center gap-1.5 text-dimmed' }"
    >
      <UTextarea
        :model-value="content"
        color="neutral"
        variant="none"
        autoresize
        readonly
        :rows="4"
        class="w-full"
        :ui="{ base: 'p-0 resize-none' }"
      />
    </ucard>
    <ReplyButton :content-id="id" />
  </div>
</template>

<style scoped>

</style>
