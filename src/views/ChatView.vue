<script setup lang="ts">
  import type { Chat } from '@/types/type'
  import { sidebar } from '@/utils/GlobalStates'
  import { nextTick, ref, watch } from 'vue'
  import socket, { dbManager } from '@/utils/ChatService'
  import { escapeParse } from '@/utils/ResponseParser'
  import { useRouter } from 'vue-router'


  const router = useRouter();

  if(dbManager.selected === "") {
    router.replace("/");
  }

  const loading = ref(0);
  const prompt = ref('')
  const chatSection = ref<HTMLElement|null>(null);
  const chats = ref<Chat[]>([{
    role:'bot', 
    message: escapeParse("Hello! Welcome to the world of MagpieAI. I am an expert in document analysis. \n\n Loaded Collection : " + dbManager.selected)
  }])

  socket.onRecieveReply((response: {result: string}) => {
      console.log(response);
      const { result } = response;
      if(!result)
        return;

      const { value } = loading;
      loading.value = Math.max(0, value-1);
      chats.value.push({role: 'bot', message: escapeParse(result)})
    }
  )

  async function sendCurrentPrompt() {

    const { value } = prompt
    if(value == '' || value == null) {
      return;
    }
    prompt.value = ''
    chats.value.push({
      role: 'user',
      message: value
    })
    loading.value++;
    socket.sendQuestion(value); 
    
  }

  watch(chats, async (val) => {
    // console.log(chatSection);
    nextTick(() => {
        if(chatSection.value)
          chatSection.value.scrollTop = chatSection.value.scrollHeight;
      })
  }, {
    deep: true,
  })

  async function handleClicks(e: KeyboardEvent) {
    if (!e.shiftKey && e.code === 'Enter') {
      sendCurrentPrompt()
    }
  }
</script>

<template>
  <div class="grid w-full h-full" :class="{ 'grid-cols-[1fr_1fr]': !sidebar.status.value }">
    <div class="w-full h-full grid grid-rows-[1fr_auto] p-3 gap-2">
      <section ref="chatSection" class="grid content-start max-h-[75svh] gap-5 overflow-y-auto scroll-smooth">
        <div 
        v-for="(chat, index) in chats"
        v-bind:key="index"
        class="flex items-end"
        :class="{'justify-end': chat.role == 'user'}"
        >
        <div v-if="chat.role == 'bot'" class="grid w-10 h-10 text-white rounded-full shadow-sm place-items-center bg-bubble-bot">
          <i class="scale-125 fa-solid fa-feather"></i>
        </div>
          <div
          :class="{
            'bg-bubble-user rounded-md rounded-br-none bubble-right text-white mr-6':
              chat.role == 'user',
            'bg-bubble-bot rounded-md rounded-bl-none bubble-left text-white ml-6':
              chat.role == 'bot'
          }"
          class="relative max-w-[85%] md:max-w-[60%] p-3 rounded-md w-fit"
          v-html="chat.message"
        >
        </div>
        <div v-if="chat.role == 'user'" class="grid w-8 h-8 text-white rounded-full shadow-sm bg-bubble-user place-items-center">
          <i class="fa-solid fa-user"></i>
        </div>
        </div>

        <div v-if="loading != 0" class="flex items-end">
          <div class="grid w-10 h-10 text-white rounded-full shadow-sm place-items-center bg-bubble-bot">
            <i class="scale-125 fa-solid fa-feather"></i>
          </div>

          <div class="bg-bubble-bot rounded-bl-none bubble-left text-white ml-6 relative max-w-[85%] md:max-w-[60%] px-3 py-2 rounded-md w-fit">
            <img class="h-8 saturate-0 brightness-200" src="@/assets/loading.gif" alt="">
          </div>
        </div>
        
      </section>
      <section class="box-border flex items-center justify-center h-20 gap-3">
        <textarea
          v-model="prompt"
          v-on:keyup="handleClicks"
          id="message"
          class="box-border flex-1 p-2 text-sm text-gray-900 bg-transparent border-2 rounded-lg resize-none bg-gray-50 border-slate-400 focus:ring-teal-500 focus:border-blue-500 backdrop-brightness-150 dark:border-teal-600 h-full dark:placeholder-gray-400 dark:text-white focus:outline-none dark:focus:border-teal-400 focus:border-2"
          placeholder="Start typing..."
        ></textarea>
        <button v-on:click="sendCurrentPrompt" type="button" class="grid text-xl font-medium text-center text-dark-primary-darker border border-dark-primary-darker rounded-sm h-fit w-fit p-4 outline-none place-items-center hover:bg-dark-primary-medium hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:text-teal-300 dark:border-teal-500 dark:hover:text-white dark:focus:ring-teal-800 dark:hover:bg-teal-500">
          <i class="fas fa-paper-plane"></i>
        </button>          
      </section>
    </div>
    <div
      v-if="!sidebar.status.value"
      class="grid w-full h-full backdrop-brightness-90 place-items-center"
    >
      <div
        class="w-4/5 h-[82vh] min-w-fit max-h-[82vh] overflow-y-auto grid content-start scroll-smooth"
      >
        <!-- <PDFViewer></PDFViewer> -->
      </div>
    </div>
  </div>
</template>

<style>
.bubble-right::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30px;
  aspect-ratio: 2/1;
  translate: 50% 0px;
  @apply bg-bubble-user;
  clip-path: polygon(0 0, 50% 0, 100% 100%, 0% 100%);
}

.bubble-left::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 30px;
  aspect-ratio: 2/1;
  @apply bg-bubble-bot;
  translate: -50% 0px;
  clip-path: polygon(50% 0, 100% 0, 100% 100%, 0% 100%);
}
</style>
