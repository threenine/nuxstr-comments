<script setup lang="ts">
import { useNuxstr } from '../composables/useNuxstr'
import { useReplies } from '../composables/useReplies'
import { computed, onMounted, ref } from 'vue'

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

const showChip = computed(() => replies.value.length > 0)
</script>

<template>
  <div>
    <div class="flex items-center gap-4 mx-auto mt-4 mb-4">
      <u-chip
        :show="showChip"
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
    <u-collapsible
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
    </u-collapsible>
  </div>
</template>

<style scoped>

</style>
