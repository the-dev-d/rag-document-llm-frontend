<script setup lang="ts">
  import { RouterView } from 'vue-router';
  import { sidebar } from './utils/GlobalStates'
  import { connectionStatus } from './utils/ChatService';
  import socket from './utils/ChatService';
  import { onMounted } from 'vue';

  const loadConfig = async () => socket.loadConfig();
  onMounted(loadConfig);
</script>

<template>
  <div
    class="grid max-w-[100dvw] max-h-[100dvh] h-[100dvh] grid-rows-[auto_1fr] bg-slate-300/70 dark:bg-dark-primary-darker dark:text-white"
  >
    <RouterView v-if="connectionStatus"></RouterView>
  </div>
</template>
