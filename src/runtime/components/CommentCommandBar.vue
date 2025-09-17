<script setup lang="ts">
import { useNuxstr } from '../composables/useNuxstr'
import { useReplies } from '../composables/useReplies'
import { onMounted } from 'vue'

const props = defineProps<{ contentId: string }>()
const { replies, subscribeReplies } = useReplies(props.contentId)
const { isLoggedIn } = useNuxstr()

const open = ref(false)

function toggleReply() {
  open.value = !open.value
}

onMounted(() => {
  subscribeReplies()
})
</script>

<template>
  <div>
    <div class="flex items-center gap-4 mx-auto mt-4 mb-4">
      <u-chip
        :text="replies.length"
        size="3xl"
        inset
      >
        <u-button
          variant="ghost"
          icon="mdi:message-reply-text-outline"
          title="Reply"
          square
          class="rounded-full hover:bg-gray-900"
          @click="toggleReply"
        />
      </u-chip>
    </div>
    <UCollapsible
      class="flex flex-col gap-2 w-48 p-16"
      :open
    >
      <template #content>
        <div>
          <reply-view :replies="replies" />
        </div>

        <div
          v-if="isLoggedIn"
          class="mt-4"
        >
          <post-reply :root-id="props.contentId" />
        </div>
      </template>
    </UCollapsible>
  </div>
</template>

<style scoped>

</style>
