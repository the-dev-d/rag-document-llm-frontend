<script setup lang="ts">
  import { usePDF, VuePDF } from '@tato30/vue-pdf'
  import { dbManager } from '@/utils/ChatService'
  import chatService from '@/utils/ChatService'
  import { onMounted, ref } from 'vue';


  
  let fileURL = chatService.backend + "/files/" + dbManager.selected?.file_name.replace(/ /g, "%20").trim();
  if(!fileURL.endsWith(".pdf"))
    fileURL = fileURL + ".pdf"
  
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
  <div class="grid place-items-center">
    <div class="w-fit mb-2" data-page v-for="page in pages" :id="'page-' + page" :key="page">
      <VuePDF
      text-layer
      :height
      :page="page"
      :pdf="pdf">
    </VuePDF>
  </div>
  </div>
</template>

<style>
.textLayer :is(span,br) {
  color: black;
  background-color: white;
}

.highlight {
  background-color: yellow;
  color: black;
}

</style>
