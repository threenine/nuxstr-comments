<script setup lang="ts">
import useNuxstr from '../../composables/useNuxstr'

const { login } = useNuxstr()

const emit = defineEmits(['login-success'])

async function handleLogin() {
  await login()
  emit('login-success')
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-start gap-3 p-4 border rounded-lg border-primary/20 bg-primary/5">
      <UIcon
        name="i-lucide-info"
        class="w-5 h-5 mt-0.5 text-primary"
      />
      <div class="text-sm">
        <p class="font-medium text-primary">
          Browser Extension (NIP-07)
        </p>
        <p class="mt-1 text-muted-foreground">
          Use a browser extension like Diogel, Alby or nos2x. This is the most secure way to sign in without sharing your private key.
        </p>
      </div>
    </div>

    <UButton
      block
      color="primary"
      size="lg"
      icon="game-icons:ostrich"
      label="Sign in with Extension"
      @click="handleLogin"
    />

    <p class="text-xs text-center text-muted-foreground">
      Don't have an extension?
      <a
        href="https://threenine.io/products/diogel"
        target="_blank"
        class="underline hover:text-primary"
      >Diogel</a> or
      <a
        href="https://getalby.com/"
        target="_blank"
        class="underline hover:text-primary"
      >Get Alby</a> or
      <a
        href="https://github.com/fiatjaf/nos2x"
        target="_blank"
        class="underline hover:text-primary"
      >nos2x</a>
    </p>
  </div>
</template>
