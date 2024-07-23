<script setup lang="ts">
  import { usePDF, VuePDF } from '@tato30/vue-pdf'
  import chatService, { dbManager } from '@/utils/ChatService'
import { onMounted, ref } from 'vue';

  const fileURL = chatService.baseURL + "/uploads/" + dbManager.selected.replace(/ /g, "%20").trim();
  console.log(fileURL);
  const { pdf, pages } = usePDF(fileURL)

  let height = ref(0);

  function calculatePDFRender() {
    const {innerWidth, innerHeight} = window;
    if(innerWidth > innerHeight)
      height.value = innerHeight;
    else
      height.value = innerHeight/1.5;
    console.log(height.value);
    
  }

  onMounted(() => {
    
    calculatePDFRender();

  })

</script>

<template>
  <div :data-render="height" data-page v-for="page in pages" :id="'page-' + page" :key="page">
    <VuePDF
      text-layer
      :height="height"
      annotation-layer
      :highlight-options="{
        completeWords: false
      }"
      :page="page"
      :pdf="pdf"
    ></VuePDF>
  </div>
</template>
