<script setup lang="ts">
import { ref } from 'vue'
import { connectionStatus } from './utils/ChatService'
import { sidebar } from './utils/GlobalStates'
</script>

<template>
  <div
    class="grid max-w-[100dvw] max-h-[100dvh] bg-slate-300/70 dark:bg-dark-primary-darker dark:text-white"
  >
    <!-- <nav
      class="max-h-[7vh] h-[7vh] backdrop-brightness-125 flex items-center justify-between p-3 shadow-md"
    >
      <div class="h-full flex items-center justify-start">
        <img class="h-3/4 aspect-square rounded-full mx-3" src="@/assets/robot.jpg" alt="" />
        <div>
          <div class="font-semibold text-sm text-red-400" v-if="!connectionStatus">
            Disconnected
          </div>
          <div class="text-sm font-semibold text-green-400" v-else>Connected</div>
        </div>
      </div>
      <div @click="sidebar.status.value = !sidebar.status.value">
        <span class="material-symbols-outlined"> right_panel_close </span>
      </div>
    </nav> -->
    <main class="grid h-[100dvh]">
      <RouterView class="w-full h-full"></RouterView>
    </main>
  </div>
</template>
