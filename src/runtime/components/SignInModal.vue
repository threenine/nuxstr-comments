<script setup lang="ts">
import Extension from './signin/Extension.vue'

const open = defineModel<boolean>('open', { default: false })

function handleSuccess() {
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="Sign in to Comment"
    description="Choose your preferred way to sign in with Nostr."
  >
    <template #body>
      <div class="space-y-6">
        <!-- Nostr Education -->
        <div class="p-4 rounded-lg bg-muted/50">
          <div class="flex items-center gap-2 mb-2 text-sm font-semibold">
            <UIcon
              name="i-lucide-help-circle"
              class="w-4 h-4"
            />
            What is Nostr?
          </div>
          <p class="text-xs leading-relaxed text-muted-foreground">
            Nostr is a decentralized protocol for social media. Instead of a username and password, you use a cryptographic key pair.
            Your "public key" is your identity, and your "private key" is used to sign messages.  <a
              href="https://threenine.blog/posts/what-is-nostr"
              target="_blank"
              class="underline hover:text-primary text-primary"
            >Learn more...</a>
          </p>
        </div>

        <!-- Sign-in Options -->
        <div class="space-y-4">
          <Extension @login-success="handleSuccess" />
        </div>

        <!-- Footer Info -->
        <div class="pt-4 border-t border-border">
          <p class="text-[10px] text-center text-muted-foreground uppercase tracking-wider font-medium">
            Privacy First
          </p>
          <p class="mt-1 text-xs text-center text-muted-foreground">
            We never see your private key. Signing happens directly in your browser or extension.
          </p>
        </div>
      </div>
    </template>
  </UModal>
</template>
