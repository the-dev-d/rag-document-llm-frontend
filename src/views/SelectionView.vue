<script setup lang="ts">
    import { dbManager } from '@/utils/ChatService';
    import chatService from '@/utils/ChatService';
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    const router = useRouter();
    const selection = ref(dbManager.selected || null);
    const prompt = ref(null);

    function handleGoClick() {
        
        if(!selection.value || !prompt.value)
            return;
        
        dbManager.setSelected(selection.value);
        router.push("/chat");
        chatService.sendQuestion(prompt.value)
    }
</script>
<template>
    <div class="w-full h-full grid place-items-center">
        <div class="bg-white p-10 w-11/12 md:w-1/3 aspect-[2/1] shadow-md rounded-md grid place-items-center content-center gap-6">
            <div class="gap-6 w-full">
                <label for="countries" class="block text-nowrap mb-2 text-sm font-medium text-gray-900 dark:text-white">Select File</label>
                <select v-model="selection"  id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option :value="null">__</option>
                    <option :key="file" v-for="file in dbManager.options.value" :value="file">{{ file }}</option>
                </select>
            </div>
            <div class="gap-6 w-full">
                <label for="countries" class="block text-nowrap mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Prompt</label>
                <select v-model="prompt"  id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option :value="null">__</option>
                    <option value="Vendor Policy"> Vendor Policy </option>
                    <option value="Vendor Contract"> Vendor Contract </option>
                </select>
            </div>
            <button :disabled="selection === null" v-on:click="handleGoClick()" type="button" class="text-white w-1/3 bg-dark-primary-medium hover:bg-dark-primary-darker focus:ring-0 font-medium disabled:bg-slate-400 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none ">Go</button>
        </div>
    </div>
</template>