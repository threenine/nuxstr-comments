<script setup lang="ts">
import { onMounted } from 'vue'
import { useNuxstr } from '../composables/useNuxstr'
import { useNuxstrComments } from '../composables/useNuxstrComments'
import { marked } from 'marked'

const props = defineProps<{ contentId?: string }>()

const { login, isLoggedIn } = useNuxstr()
const { comments, subscribeComments, loading } = useNuxstrComments(props.contentId)

onMounted(() => {
  subscribeComments()
})
</script>

<template>
  <div class="nuxstr-comments space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">
        Comments
      </h3>

      <div
        v-if="!isLoggedIn"
        class="text-sm text-muted-foreground"
      >
        <UButton
          color="primary"
          variant="solid"
          leading-icon="game-icons:ostrich"
          @click="login"
        >
          Login
        </UButton>
      </div>
    </div>
    <ClientOnly>
    <div
      v-if="isLoggedIn"
      class="text-sm text-muted-foreground"
    >
      <PostComment :content-id="contentId" />
    </div>
    </ClientOnly>
    <ClientOnly>
    <div class="space-y-4">
      <div
        v-if="loading"
      >
        <ScaffoldComment />
      </div>

      <div
        v-else
        class="space-y-6"
      >
        <div
          v-for="c in comments"
          :key="c.id"
          class="rounded border p-3 mt-2 mb-2"
        >
          <div class="flex items-center gap-3 mb-3 mt-2">
            <div
              v-if="c.profile?.image"
              class="flex-shrink-0"
            >
              <UAvatar
                :src="c.profile.image"
                :alt="c.profile.name || c.profile.display_name || 'User avatar'"
                class="w-8 h-8 rounded-full object-cover"
              />
            </div>
            <div class="flex-1 min-w-0">
              <div class="truncate">
                {{ c.profile?.display_name || c.profile?.name || `${c.pubkey.slice(0, 8)}…` }}
                <span class="text-xs">{{ new Date(c.created_at * 1000).toLocaleString() }}</span>
              </div>
            </div>
          </div>
          <div class="prose prose-sm prose-invert mt-2 mb-2">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-html="marked.parse(c.content)" />
            <!-- eslint-disable-next-line vue/no-v-html -->
          </div>
        </div>

        <div
          v-if="isLoggedIn"
          class=" mt-5"
        />
      </div>

    </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
.nuxstr-comments :deep(pre) {
  white-space: pre-wrap;
}
</style>
