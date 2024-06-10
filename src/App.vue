<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue';
  import { RouterView } from 'vue-router';
  import socket from '@/utils/ChatService'
  
  onMounted(() => {
    window.onbeforeunload = function() {
      socket.disconnect();
    };
  })
</script>

<template>
  <div
    class="grid max-w-[100dvw] max-h-[100dvh] h-[100dvh] grid-rows-[auto_1fr] bg-slate-300/70 dark:bg-dark-primary-darker dark:text-white"
  >
    <RouterView></RouterView>
  </div>
</template>
