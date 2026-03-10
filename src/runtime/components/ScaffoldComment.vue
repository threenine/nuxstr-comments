<script setup lang="ts">

</script>

<template>
  <UCard
    variant="subtle"
    class="mt-auto"
    :ui="{ header: 'flex items-center gap-1.5 text-dimmed' }"
  >
    <div class="flex items-center gap-1.5">
      <USkeleton class="h-4 w-5 rounded-full" /><USkeleton class="h-4" /></div>

    <div class="mt-3 space-y-2">
      <USkeleton class="h-4" />
    </div>
  </UCard>
</template>

<style scoped>

</style>
