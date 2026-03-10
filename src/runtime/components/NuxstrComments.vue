<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import useNuxstr from '../composables/useNuxstr'
import useComments from '../composables/useComments'
import SignInModal from './SignInModal.vue'

const props = defineProps<{ contentId?: string }>()
const emit = defineEmits(['querying', 'completed', 'no-comments'])

const { isLoggedIn } = useNuxstr()
const { comments, subscribeComments, loading } = useComments(props.contentId)

const isSignInModalOpen = ref(false)

watch(loading, (isLoading) => {
  if (isLoading) {
    emit('querying')
  }
  else {
    emit('completed')
    if (comments.value.length === 0) {
      emit('no-comments')
    }
  }
})

onMounted(() => {
  subscribeComments()
})
</script>

<template>
  <div class="nuxstr-comments space-y-4">
    <div class="flex items-center justify-between">
      <span class="text-lg font-semibold text-primary">
        Comments
      </span>

      <div
        v-if="!isLoggedIn"
        class="text-sm text-muted-foreground"
      >
        <UButton
          color="primary"
          variant="solid"
          leading-icon="game-icons:ostrich"
          @click="isSignInModalOpen = true"
        >
          Sign in
        </UButton>

        <SignInModal v-model:open="isSignInModalOpen" />
      </div>
    </div>

    <div
      v-if="isLoggedIn"
      class="text-sm text-muted-foreground"
    >
      <PostComment :content-id="contentId" />
    </div>

    <div class="space-y-4">
      <div
        v-if="loading"
        class="space-y-4"
      >
        <scaffold-comment
          v-for="n in 3"
          :key="n"
        />
      </div>

      <div
        v-else
        class="space-y-6"
      >
        <div v-if="comments.length === 0">
          <p class="text-xs">
            No comments available
          </p>
        </div>
        <UCard
          v-for="c in comments"
          v-else
          :key="c.id"
          variant="subtle"
          class="mt-auto"
          :ui="{ header: 'flex items-center gap-1.5 text-dimmed' }"
        >
          <comment-author
            :profile="c.profile"
            :created-at="c.created_at"
          />
          <comment-view
            :id="c.id"
            :content="c.content"
          />
        </UCard>

        <div
          v-if="isLoggedIn"
          class=" mt-5"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
