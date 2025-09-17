<script setup lang="ts">
</script>

<template>
  <nuxt-layout name="default-layout">
    <UContainer>
    <h1>Playground</h1>
    <p>Index Page</p> <nuxt-link
      to="another-page"
      class="text-primary"
    > Another Page</nuxt-link>
    <NuxstrComments />
    </UContainer>
  </nuxt-layout>
</template>

<style scoped></style>
