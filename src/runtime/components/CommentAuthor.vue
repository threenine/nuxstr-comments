<script setup lang="ts">
import type { Profile } from '../types'

const props = defineProps<{
  profile?: Profile
  createdAt: number
}>()
</script>

<template>
  <div
    v-if="props.profile"
    class="flex items-center gap-3"
  >
    <div
      v-if="props.profile.image"
      class="flex-shrink-0"
    >
      <img
        :src="props.profile.image"
        :alt="props.profile.display_name || 'User avatar'"
        class="w-6 h-6 rounded-full object-cover"
      >
    </div>
    <div class="flex-1 min-w-0 mb-3 ">
      <div class="flex gap-6 items-center">
        <span class="text-sm mr-6">{{ props.profile.display_name || `${props.profile.pubkey.slice(0, 8)}…` }}</span>
        <span class="text-xs text-muted-foreground ml-3">&nbsp;&nbsp;</span>
        <span class="text-xs text-primary ml-3">{{ new Date(props.createdAt * 1000).toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
