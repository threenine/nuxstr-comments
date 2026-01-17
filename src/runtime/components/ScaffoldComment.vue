<script setup lang="ts">

</script>

<template>
  <div>
    <p class="text-xs">
      No comments available
    </p>
    <UCard
      variant="subtle"
      class="mt-auto"
      :ui="{ header: 'flex items-center gap-1.5 text-dimmed' }"
    >
      <span><USkeleton class="h-4 w-5 rounded-full" /></span><USkeleton class="h-4" />
      <div class="mt-3">
        <USkeleton class="h-4" />
      </div>
    </UCard>
  </div>
</template>

<style scoped>

</style>
