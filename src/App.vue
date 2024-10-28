<script setup lang="ts">
  import { onMounted } from 'vue';
  import { RouterView } from 'vue-router';
  import socket from '@/utils/ChatService'
  import ToastViewer from "./components/ToastViewer.vue";


  const loadConfig = async () => {
    await socket.loadConfig();
  }
  onMounted(loadConfig);
  
  onMounted(() => {
    window.onbeforeunload = function() {
      socket.disconnect();
    };
  })
</script>

<template>
  <div
    class="grid max-w-[100dvw] max-h-[100dvh] h-[100dvh] bg-slate-300/70 dark:bg-dark-primary-darker dark:text-white relative">
    <div class="absolute bottom-0  md:left-1/2 w-full md:-translate-x-1/2 md:w-1/3 h-fit overflow-hidden">
      <ToastViewer></ToastViewer>
    </div>
    <RouterView></RouterView>
  </div>
</template>
