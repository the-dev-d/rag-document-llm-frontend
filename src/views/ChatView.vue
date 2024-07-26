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

  const loading = ref(1);
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

  function makeDownload(content: string) {

    const popup = window.open('', 'print', 'height=1080,width=1920');

    if(!popup)
      return;

    var style = popup.document.createElement('style');
    style.type = 'text/css';
    style.textContent = 'td, th {border: 1px solid black; padding: 0.5rem; @apply text-sm;}'; 
    popup.document.head.appendChild(style);
    popup.document.body.innerHTML = content;

    popup.print();

    popup.onafterprint = () => {
      popup.close();
    }
  }



  watch(chats, async (val) => {
    nextTick(() => {
        if(chatSection.value)
          chatSection.value.scrollTop = chatSection.value.scrollHeight;
      })
  }, {
    deep: true,
  })

</script>

<template>
  <div class="grid relative w-full h-full items-center" :class="{ 'grid-cols-[1fr_auto]': !sidebar.status.value }">
    <div class="w-full h-full grid grid-rows-[1fr_auto] p-3 gap-2">
      <section ref="chatSection" class="grid content-start max-h-[88svh] gap-5 overflow-y-auto scroll-smooth px-2">
        <div
        v-for="(chat, index) in chats"
        v-bind:key="index"
        class="flex items-end"
        :class="{'justify-end': chat.role == 'user'}"
        >
        <div v-if="chat.role == 'bot'" class="grid w-5 h-5 md:w-10 md:h-10 text-white rounded-full shadow-sm place-items-center bg-bubble-bot">
          <i class="scale-75 fa-solid fa-feather"></i>
        </div>
          <div class="relative bg-bubble-bot rounded-bl-none bubble-left text-white ml-6 p-3 rounded-md w-fit">
            <div v-html="chat.message">

            </div>
            <button @click="() => makeDownload(chat.message)" v-if="chats.length-1 == index" class="absolute px-5 hover:brightness-200 bottom-0 right-0 translate-y-[110%] p-1 rounded-lg bg-dark-primary-darker">
              <i class="fa-solid fa-download"></i>
            </button>
          </div>
        </div>

        <div v-if="loading != 0" class="flex items-end">
          <div class="grid w-5 h-5 text-white rounded-full shadow-sm place-items-center bg-bubble-bot">
            <i class="scale-75 fa-solid fa-feather"></i>
          </div>

          <div class="bg-bubble-bot rounded-bl-none bubble-left text-white ml-6 relative max-w-[85%] md:max-w-[60%] px-3 py-2 rounded-md w-fit">
            <img class="h-8 saturate-0 brightness-200" src="@/assets/loading.gif" alt="">
          </div>
        </div>
      </section>
    </div>
    <div
    :class="{'hidden': sidebar.status.value, 'grid': !sidebar.status.value}"
      class="w-full grid-rows-[auto_1fr] h-full max-h-[88svh]  max-w-[100svw]  absolute lg:relative bg-slate-200"
    >
      <div class="h-full mx-2">
        <button @click="() => sidebar.status.value = true" type="button" class="m-3 text-white bg-dark-primary-medium hover:bg-dark-primary-darker focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Collapse <i class="fa-solid fa-arrow-right"></i> </button>
      </div>      
      <div
        class="w-full max-w-full h-full  overflow-y-auto content-start scroll-smooth gap-1 grid justify-center bg-slate-200 py-3"
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
