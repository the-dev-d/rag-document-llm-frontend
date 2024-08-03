<script setup lang="ts">
  import { usePDF, VuePDF } from '@tato30/vue-pdf'
  import { dbManager } from '@/utils/ChatService'
  import chatService from '@/utils/ChatService'
  import { onMounted } from 'vue';


  const fileURL = chatService.backend + "/uploads/" + dbManager.selected?.file_name.replace(/ /g, "%20").trim();
  const { pdf, pages } = usePDF(fileURL)

  let height = 0;

  onMounted(() => {
    const {innerHeight, innerWidth} = window;
    if(innerWidth > innerHeight) {
      height = innerHeight;
    }else {
      height = innerHeight / 1.7;
    }
  })

</script>

<template>
  <div class="max-w-[90svw]" data-page v-for="page in pages" :id="'page-' + page" :key="page">
    <VuePDF
      text-layer
      :height
      annotation-layer
      :highlight-options="{
        completeWords: false
      }"
      :page="page"
      :pdf="pdf"
    ></VuePDF>
  </div>
</template>
