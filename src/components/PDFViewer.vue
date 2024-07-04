<script setup lang="ts">
  import { usePDF, VuePDF } from '@tato30/vue-pdf'
  import { dbManager } from '@/utils/ChatService'

  const fileURL = import.meta.env.VITE_FILE_BASE + dbManager.selected.replace(/ /g, "%20").trim();
  const { pdf, pages } = usePDF(fileURL)

</script>

<template>
  <div data-page v-for="page in pages" :id="'page-' + page" :key="page">
    <VuePDF
      text-layer
      annotation-layer
      :highlight-options="{
        completeWords: false
      }"
      :page="page"
      :pdf="pdf"
    ></VuePDF>
  </div>
</template>
