<script setup>
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const name = route.name;

</script>
<template>
    <nav
      class="max-h-[7vh] h-[7vh] backdrop-brightness-125 flex items-center justify-between p-3 shadow-md"
    >
      <div class="flex items-center justify-start h-full">
        <img class="mx-3 rounded-full h-5/6" src="@/assets/logo.png" alt="" />
        <div>
          <div class="text-base font-semibold dark:text-white text-slate-700 uppercase">
            magpie AI
          </div>
        </div>
      </div>
      <div>
        <router-link href="/new-file">
          <button v-if="name == 'file_selection'"  type="button" class="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
            <path d="M3 7H1a1 1 0 0 0-1 1v8a2 2 0 0 0 4 0V8a1 1 0 0 0-1-1Zm12.954 0H12l1.558-4.5a1.778 1.778 0 0 0-3.331-1.06A24.859 24.859 0 0 1 6 6.8v9.586h.114C8.223 16.969 11.015 18 13.6 18c1.4 0 1.592-.526 1.88-1.317l2.354-7A2 2 0 0 0 15.954 7Z"/>
            </svg>
            <span class="sr-only">Add new</span>
          </button>
        </router-link>
      </div>
    </nav>
    <main class="grid mt-2">
      <RouterView class="w-full h-full"></RouterView>
    </main>
</template>