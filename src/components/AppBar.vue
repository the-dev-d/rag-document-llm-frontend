<template>
    <nav class="grid shadow-md pt-[0.2rem] bg-white">
        <section
        class="max-h-[7vh] h-[7vh] backdrop-brightness-125 flex items-center justify-between p-3"
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
            <router-link to="/new-file">
            <button v-if="route.name == 'file_selection'"  type="button" class="text-dark-primary-medium/70 border hover:bg-dark-primary-medium/90 hover:text-white focus:ring-4 focus:outline-none focus:ring-dark-primary-darker font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-dark-primary-medium/90 border-dark-primary-medium/90 dark:hover:text-white dark:hover:bg-dark-primary-darker">
                <span class="material-symbols-outlined">add</span>
                <span class="sr-only">Add new</span>
            </button>
            </router-link>
        </div>
        </section>
        <div class="w-full bg-gradient-to-r from-dark-primary-medium to-emerald-300 flex items-center justify-end">
            <div :style=" 'width:' + (AppBarProgress.isLoading() ? 100 - AppBarProgress.progress : 100)  + '%;' " class="progress transition-all p-[0.15rem]" :class="{ 'bg-slate-200': AppBarProgress.isLoading(), 'bg-white': !AppBarProgress.isLoading() }"></div>
        </div>
    </nav>
</template>

<script setup>
    import { AppBarProgress } from '@/utils/LoaderService';
import { useRoute } from 'vue-router';
    const route = useRoute();
</script>