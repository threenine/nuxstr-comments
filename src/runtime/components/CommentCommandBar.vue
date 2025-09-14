<script setup lang="ts">

function poo(text: string) {
  console.log(text)
   alert(text)
}
</script>

<template>
  <div >
     <div class="flex items-center gap-4 mx-auto mt-4" >
      <u-button variant="ghost" icon="mdi:message-reply-text-outline"  @click="poo('reply')" />
       <u-button variant="ghost" icon="mynaui:zap"  @click="poo('zap')" />
      <u-button variant="ghost" icon="ic:sharp-favorite-border"  @click="poo('love')" />
      <u-button variant="ghost" icon="ion:heart-dislike-outline"  @click="poo('hate')" />

    </div>
  </div>

</template>

<style scoped>

</style>
