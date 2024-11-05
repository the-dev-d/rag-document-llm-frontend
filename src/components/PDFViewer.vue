<script setup lang="ts">
  import { usePDF, VuePDF } from '@tato30/vue-pdf'
  import { dbManager } from '@/utils/ChatService'
  import chatService from '@/utils/ChatService'
  import { onMounted, ref } from 'vue';

  let fileURL = chatService.backend + "/files/" + dbManager.selected?.file_name.replace(/ /g, "%20").trim();
  if(!fileURL.endsWith(".pdf"))
    fileURL = fileURL + ".pdf"
  
  const { pdf, pages } = usePDF(fileURL)
  const parent = ref<HTMLElement|null>(null);
  let height = 0;
  let width = 0;
  onMounted(() => {
    width = (parent.value as HTMLElement).offsetWidth;
  })

</script>

<template>
  <div ref="parent" class="grid place-items-center">
    <div class="w-full mb-2" data-page v-for="page in pages" :id="'page-' + page" :key="page">
      <VuePDF
      text-layer
      :width
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
