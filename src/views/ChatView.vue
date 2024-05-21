<script setup lang="ts">
  import type { Chat } from '@/types/type'
  import { sidebar } from '@/utils/GlobalStates'
  import PDFViewer from '@/components/PDFViewer.vue'
  import { nextTick, ref, watch } from 'vue'
  import { initializeSocket } from '@/utils/ChatService'
  import { escapeParse } from '@/utils/ResponseParser'


  const loading = ref(0);
  const prompt = ref('')
  const chatSection = ref<HTMLElement|null>(null);
  const chats = ref<Chat[]>([{role:'bot', message: "Hello! Welcome to the world of MagpieAI. I'm an expert trained on the DORA regulation. Feel free to ask me anything!"}])
  const socket = initializeSocket();


  socket.onRecieveReply((response: {data: string}) => {
      const {data} = response;
      loading.value--;
      chats.value.push({role: 'bot', message: escapeParse(data)})
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
  <div class="w-full h-full grid" :class="{ 'grid-cols-[1fr_1fr]': !sidebar.status.value }">
    <div class="w-full h-full grid grid-rows-[auto_1fr] p-3 gap-2">
      <section ref="chatSection" class="overflow-y-auto scroll-smooth gap-5 grid content-start h-[80vh] md:h-[85dvh]">
        <div 
        v-for="(chat, index) in chats"
        v-bind:key="index"
        class="flex items-end"
        :class="{'justify-end': chat.role == 'user'}"
        >
        <div v-if="chat.role == 'bot'" class="w-10 h-10 shadow-sm grid text-white place-items-center rounded-full bg-bubble-bot">
          <i class="fa-solid fa-feather scale-125"></i>
        </div>
          <div
          :class="{
            'bg-bubble-user rounded-md rounded-br-none bubble-right text-black mr-6':
              chat.role == 'user',
            'bg-bubble-bot rounded-md rounded-bl-none bubble-left text-white ml-6':
              chat.role == 'bot'
          }"
          class="relative max-w-[85%] md:max-w-[60%] p-3 rounded-md w-fit"
          v-html="chat.message"
        >
        </div>
        <div v-if="chat.role == 'user'" class="w-8 shadow-sm h-8 rounded-full bg-bubble-user grid place-items-center text-black">
          <i class="fa-solid fa-user"></i>
        </div>
        </div>

        <div v-if="loading != 0" class="flex items-end">
          <div class="w-10 h-10 shadow-sm grid text-white place-items-center rounded-full bg-bubble-bot">
            <i class="fa-solid fa-feather scale-125"></i>
          </div>

          <div class="bg-bubble-bot rounded-bl-none bubble-left text-white ml-6 relative max-w-[85%] md:max-w-[60%] px-3 py-2 rounded-md w-fit">
            <img class="h-8 saturate-0 brightness-200" src="@/assets/loading.gif" alt="">
          </div>
        </div>
        
      </section>
      <section class="flex gap-3 h-full box-border">
        <textarea
          v-model="prompt"
          v-on:keyup="handleClicks"
          id="message"
          rows="4"
          class="resize-none flex-1 box-border p-2 rounded-lg text-sm text-gray-900 bg-gray-50 border-slate-400 focus:ring-teal-500 focus:border-blue-500 bg-transparent backdrop-brightness-150 dark:border-teal-600 dark:placeholder-gray-400 border-2 dark:text-white focus:outline-none dark:focus:border-teal-400 focus:border-2"
          placeholder="Ask your questions..."
        ></textarea>
        <button v-on:click="sendCurrentPrompt" type="button" class="text-blue-700 outline-none border h-1/2 aspect-square grid place-items-center border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl text-center dark:text-teal-300 dark:border-teal-500 dark:hover:text-white dark:focus:ring-teal-800 dark:hover:bg-teal-500">
          <i class="fas fa-paper-plane"></i>
        </button>
      </section>
    </div>
    <div
      v-if="!sidebar.status.value"
      class="w-full h-full backdrop-brightness-90 grid place-items-center"
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
