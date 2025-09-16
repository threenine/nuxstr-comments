<script setup lang="ts">
import { useNuxstr } from '../composables/useNuxstr'

const props = defineProps<{ contentId: string }>()
const { isLoggedIn } = useNuxstr()
const open = ref(false)
const reply = ''

console.log(props.contentId)
function openReply() {

  open.value = !open.value
}
function postReply(comment: string){
  console.log(props.contentId)
  alert(comment)
}
function poo(message : string) {
  alert(message)
}
</script>

<template>
  <div v-if="isLoggedIn" >
    <USeparator />
    <div class="flex items-center gap-4 mx-auto mt-4 mb-4">
      <u-button
        variant="ghost"
        icon="mdi:message-reply-text-outline"
        @click="openReply"
      />
      <u-button
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
      />
    </div>
    <UCollapsible class="flex flex-col gap-2 w-48 p-16" v-bind:open>
      <template #content>
        <div class="text-sm text-muted-foreground border border-neutral mt-16 p-6">
          <UTextarea v-model="reply"
                     class="w-full mb-4"
                     placeholder="Write a reply to this comment ...."
                     :rows="4"/>
          <div class="flex justify-end">
            <UButton
              color="primary"
              variant="solid"
              class="mb-4 mr-2"
              @click="postReply(reply)"
            >
              Reply
            </UButton>
          </div>
        </div>
      </template>
    </UCollapsible>
  </div>
</template>

<style scoped>

</style>
