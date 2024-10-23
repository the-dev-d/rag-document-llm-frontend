<script setup lang="ts">
    import {renderAsync} from 'docx-preview';
    import { onMounted, ref } from 'vue';
    import chatService, { dbManager } from '@/utils/ChatService'

    const props = defineProps({
        highlight: String
    });
    
    let blob = ref<Blob|null>(null);
    
    async function makeFileBlob() {
        const res = await fetch(chatService.backend + "/uploads/" + dbManager.selected?.file_name);
        blob.value = await res.blob();
    }

    onMounted(async () => {
        await makeFileBlob();
        console.log(blob.value);
        let container = document.getElementById('container');
        
        if(!container) {
            console.error("Container not found")
            return;
        }
        await renderAsync(blob.value, container);
        
    })
</script>

<template>
    <div id="container">
        
    </div>
</template>

<style>
    .highlight {
        background-color: yellow;
        color: black;
    }
</style>