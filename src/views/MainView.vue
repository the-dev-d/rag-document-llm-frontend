<script setup lang="ts">
  import AppBar from '@/components/AppBar.vue';
</script>
<template>
    <AppBar/>
    <main class="grid mt-2">
      <RouterView class="w-full h-full"></RouterView>
    </main>
</template>