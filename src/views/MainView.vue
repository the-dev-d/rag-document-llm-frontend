<script setup lang="ts">
import AppBar from '@/components/AppBar.vue';


</script>
<template>
    <div class="grid grid-rows-[auto_1fr] max-h-[100dvh]">
      <AppBar/>
      <main class="grid mt-2 overflow-y-auto max-h-full">
        <RouterView class="w-full h-full"></RouterView>
      </main>
    </div>
</template>