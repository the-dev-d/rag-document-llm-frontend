<script setup lang="ts">
  import { useRouter } from 'vue-router';

    const router = useRouter();

    function handleGoClick() {
        
        console.log("Clicked");
        router.push("/chat");
    }
</script>
<template>
    <div class="w-full h-full grid place-items-center">
        <div class="bg-white p-10 w-11/12 md:w-1/3 aspect-[2/1] shadow-md rounded-md grid place-items-center content-center gap-6">
            <div class="gap-6 w-full">
                <label for="countries" class="block text-nowrap mb-2 text-sm font-medium text-gray-900 dark:text-white">Select</label>
                <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="pdf1">PDF 1</option>
                    <option value="pdf2">PDF 2</option>
                    <option value="pdf3">PDF 3</option>
                    <option value="pdf4">PDF 4</option>
                </select>
            </div>
            <button v-on:click="handleGoClick()" type="button" class="text-white w-1/3 bg-dark-primary-medium hover:bg-dark-primary-darker focus:ring-0 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none ">Go</button>
        </div>
    </div>
</template>