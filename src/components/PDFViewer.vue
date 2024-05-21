<script setup lang="ts">
  import { usePDF, VuePDF } from '@tato30/vue-pdf'
  import { computed, onMounted } from 'vue'

  const { pdf, pages } = usePDF('http://64.227.169.214/syllabus.pdf')

  onMounted(() => {
    setTimeout(() => document.getElementById('page-11')?.scrollIntoView(), 2000)
  })
</script>

<template>
  <div v-for="page in pages" :id="'page-' + page" :key="page">
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
