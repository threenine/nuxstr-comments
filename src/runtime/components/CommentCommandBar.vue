<script setup lang="ts">
import { useNuxstr } from '../composables/useNuxstr'


const props = defineProps<{ contentId: string }>()
const { isLoggedIn } = useNuxstr()
const open = ref(false)

function toggleReply() {
  open.value = !open.value
}

</script>

<template>
  <div >

    <div class="flex items-center gap-4 mx-auto mt-4 mb-4">
      <u-button
        variant="ghost"
        icon="mdi:message-reply-text-outline"
        title="Reply"
        square
        @click="toggleReply"
      />
      <!--      <u-button
        variant="ghost"
        icon="mynaui:zap"
        @click="poo('zap')"
      />
      <u-button
        variant="ghost"
        icon="ic:sharp-favorite-border"
        @click="poo('love')"
      />
      <u-button
        variant="ghost"
        icon="ion:heart-dislike-outline"
        @click="poo('hate')"
      /> -->
    </div>
    <UCollapsible
      class="flex flex-col gap-2 w-48 p-16"
      :open
    >
      <template #content>
        <div >
          <reply-view :root-id="props.contentId" />
        </div>

        <div v-if="isLoggedIn" class="mt-4">
          <post-reply :root-id="props.contentId" />
        </div>

      </template>
    </UCollapsible>
  </div>
</template>

<style scoped>

</style>
