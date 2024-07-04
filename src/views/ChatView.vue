<script setup lang="ts">
  import type { Chat } from '@/types/type'
  import { sidebar } from '@/utils/GlobalStates'
  import { nextTick, onUnmounted, ref, watch } from 'vue'
  import socket, { dbManager } from '@/utils/ChatService'
  import { escapeParse, parseJSONToTable } from '@/utils/ResponseParser'
  import { useRouter } from 'vue-router'
  import PDFViewer from '@/components/PDFViewer.vue'

  const router = useRouter();

  onUnmounted(() => {
    sidebar.status.value = true;
  })

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

  function createSourceClickListeners() {
    const elements = document.querySelectorAll('[data-source="true"]');
    elements.forEach(el => {
      el.addEventListener('click', (e) => {
        handleSourceClick(e.target);
      })
    })
  }

  function handleSourceClick(source: EventTarget|null) {
    if(!source) return;

    const key: string = (source as HTMLElement).innerText.replace(/[\n\s]/g, "") as string;

    const pageProcessing = () => {
      const pages = document.querySelectorAll('[data-page]');
      for(const page of pages) {
        const innerText: string = JSON.stringify((page as HTMLElement).innerText.replace(/[\n\s]+/g, "")) as string;
        console.log(innerText);
        if(innerText.match(key)) {
          page.scrollIntoView();
        }
      }
    }

    if(sidebar.status.value) {
      sidebar.status.value = false;
      nextTick(() => {
        setTimeout(pageProcessing, 1000)
      })
      return;
    }
    pageProcessing();
  }

  socket.onRecieveReply((response: string) => {
      if(response === "Loading..")
        return;
    
      try {

        const parsed = JSON.parse(response);
        let final: string|null = null;

        const {type, data} = parsed[0];
        console.log(data);
        if(type == "table")
          final = parseJSONToTable(data);
        else
          final = data
        
        if(final)
          chats.value.push({
            role: 'bot',
            message: final
          })
        loading.value--;
        nextTick(createSourceClickListeners)
      }catch(e) {
        console.log(e);
      }
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
    socket.sendQuestion(value.trim());

  }

  watch(chats, async (val) => {
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
  <div class="grid w-full h-full" :class="{ 'grid-cols-[1fr_auto]': !sidebar.status.value }">
    <div class="w-full h-full grid grid-rows-[1fr_auto] p-3 gap-2">
      <section ref="chatSection" class="grid content-start max-h-[75svh] gap-5 overflow-y-auto scroll-smooth px-2">
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
          class="relative max-w-[80%] p-3 rounded-md w-fit"
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
    :class="{'hidden': sidebar.status.value, 'grid': !sidebar.status.value}"
      class="w-full h-full place-items-center px-6"
    >
      <div
        class="w-fit h-[83vh] min-w-fit max-h-[83vh] overflow-y-auto grid content-start scroll-smooth gap-1"
      >
        <PDFViewer></PDFViewer>
      </div>
    </div>
  </div>
</template>

<style>
td, th {
  border: 1px solid white;
  padding: 0.5rem;
  @apply text-sm;
}
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
