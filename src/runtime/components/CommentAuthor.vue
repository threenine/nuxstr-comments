<script setup lang="ts">
const props = defineProps<{
  profile: Profile,
  createdAt: number
}>()
</script>

<template>
  <div class="flex items-center gap-3">
    <div
      v-if="props.profile.image"
      class="flex-shrink-0"
    >
      <img
        :src="props.profile.image"
        :alt="props.profile.name || props.profile.display_name || 'User avatar'"
        class="w-6 h-6 rounded-full object-cover"
      >
    </div>
    <div class="flex-1 min-w-0 mb-3">
      <div class="truncate">
        {{ props.profile.display_name || props.profile.name || `${props.profile.pubkey.slice(0, 8)}…` }}
        <span class="text-xs">{{ new Date(props.createdAt * 1000).toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
