<script setup lang="ts">
    import { AppBarProgress } from '@/utils/LoaderService';
    import { computed, reactive, ref } from 'vue';
    import {useRouter} from 'vue-router';
    import socket from '@/utils/ChatService';
import ChatService from '@/utils/ChatService';
    const router = useRouter();

    const name = ref('')
    const fileUploadElement = ref(null);
    const fileUpload = ref<FileList|null>(null);
    const tags = ref('');

    const disabled = computed(() => name.value == '' || fileUpload.value == null || fileUpload.value.length == 0);

    function handleUpload() {

        if(disabled.value) return

        const files = fileUpload.value!;
        const fileNames:string[] = [];

        if (files.length > 0 && name.value) {
            for (const file of files) {
                fileNames.push(file.name.trim());
                const reader = new FileReader();
                reader.onload = function(event) {

                    if(!event.target || !event.target.result) return;
                    const arrayBuffer = event.target.result;
                    const fileData = new Uint8Array(arrayBuffer as ArrayBuffer);

                    const data = {
                        files:fileNames,
                        filename: file.name.trim(),
                        filedata: fileData,
                        db_name: name.value.trim(),
                        tags: tags.value.trim(),
                    }        
                    AppBarProgress.startLoading();
                    socket.uploadFile(data)
                    AppBarProgress.progress = 50;
                    
                };
                const handler = (data: any) => {
                    if (data === "Created DB successfully") {
                        AppBarProgress.progress = 100;
                    }
                    ChatService.removeHandleChatListener(handler);
                    router.replace("/")
                }
                ChatService.onRecieveReply(handler)
                reader.readAsArrayBuffer(file);
            }
        }
    }
</script>

<template>
    <div class="w-full h-full grid place-items-center">
        <form class="bg-white shadow-md rounded-md p-6 box-border mx-3 w-11/12 md:w-3/5 lg:w-2/5 grid gap-6" @submit.prevent="handleUpload">
            <h4 class="text-2xl font-semibold">Upload Document</h4>
            <div>
                <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                <input v-model="name" type="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-dark-primary-medium dark:text-white"  required />
            </div>
            <div>
                <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" ref="fileUploadElement" @change="(e) => { fileUpload = (e.target as HTMLInputElement).files }" aria-describedby="upload_help" id="upload" multiple type="file" accept=".txt, .docx, .pdf">
                <div class="mt-1 ml-1 text-xs md:text-sm text-gray-500 dark:text-gray-300" id="upload_help">Upload your .txt, docx or pdf file here.</div>
            </div>
            <div>
                <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tags</label>
                <input v-model="tags" type="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-dark-primary-medium dark:text-white"  required />
            </div>
            <button :disabled="disabled"   class="text-white w-full bg-dark-primary-medium hover:bg-dark-primary-darker font-medium rounded-lg text-sm px-5 py-2.5 disabled:bg-gray-400 me-2 mb-2 focus:outline-none">Upload</button>
        </form>
    </div>
</template>