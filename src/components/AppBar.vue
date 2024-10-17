<template>
    <nav class="grid shadow-md pt-[0.2rem] bg-white">
        <section
        class="max-h-[8vh] h-[8vh] backdrop-brightness-125 flex items-center justify-between p-2.5"
        >
        <div class="flex items-center justify-start h-full">
            <img class="mx-3 rounded-full h-full" src="@/assets/logo.png" alt="" />
        </div>
        <div class="flex items-center justify-end gap-3 font-semibold text-xs md:text-base">
            <span class="border p-2 m-2 rounded-md">Incident Management</span>
            <!-- <RouterLink v-if="route.name == 'file_selection'" to="/new-file">
            <button  type="button" class="text-dark-primary-medium/70 border hover:bg-dark-primary-medium/90 hover:text-white focus:ring-4 focus:outline-none focus:ring-dark-primary-darker font-medium rounded-full text-sm p-0.5 md:p-1.5 text-center inline-flex items-center dark:border-dark-primary-medium/90 border-dark-primary-medium/90 dark:hover:text-white dark:hover:bg-dark-primary-darker">
                <span class="material-symbols-outlined">add</span>
                <span class="sr-only">Add new</span>
            </button>
            </RouterLink> -->
            <!-- <RouterLink v-else-if="route.name == 'chat'" to="/">
                <button title="Back to homepage" class="grid text-xl font-medium text-center text-dark-primary-medium  rounded-full min-w-10 aspect-square outline-none w-full h-full place-items-center hover:bg-black/10 focus:ring-4 focus:outline-none dark:text-teal-300 dark:border-teal-500  dark:focus:ring-teal-800 dark:hover:bg-teal-500">
                    <i class="fa-solid fa-house"></i>
                </button>
          </RouterLink> -->
        </div>
        </section>
        <div class="w-full bg-gradient-to-r from-dark-primary-medium to-emerald-300 flex items-center justify-end">
            <div :style=" 'width:' + (AppBarProgress.isLoading() ? 100 - AppBarProgress.progress : 100)  + '%;' " class="progress transition-all p-[0.15rem]" :class="{ 'bg-slate-200': AppBarProgress.isLoading(), 'bg-white': !AppBarProgress.isLoading() }"></div>
        </div>
    </nav>
</template>

<script setup lang="ts">
    import { AppBarProgress } from '@/utils/LoaderService';
    import { RouterLink, useRoute } from 'vue-router';
    const route = useRoute();
</script>