<script setup lang="ts">
// @ts-nocheck
import { reactive, ref } from "vue";
import { ToastService } from "../utils/ToastService";
import { ToastMessage } from "../utils/ToastService";

const toasts = ref<ToastMessage[]>([]);

ToastService.subscribe({
  next: (value) => {
    toasts.value = value;
  },
});
</script>

<template>
  <div class="">
    <TransitionGroup name="list">
      <div
        :class="{
          'border-dark-primary-medium': toast.type == 'success',
          'border-red-400': toast.type == 'error',
        }"
        v-for="toast in toasts"
        :key="toast"
        class="p-2 border bg-white m-2 border-l-4 shadow-md text-sm"
      >
        {{ toast.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
