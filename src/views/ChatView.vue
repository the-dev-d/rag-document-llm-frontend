<script setup lang="ts">
  import type { Chat } from '@/types/type'
  import { sidebar } from '@/utils/GlobalStates'
  import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
  import socket, { dbManager } from '@/utils/ChatService'
  import { escapeParse, parseJSONToTable } from '@/utils/ResponseParser'
  import { useRouter } from 'vue-router'
  import PDFViewer from '@/components/PDFViewer.vue'
  import { Dropdown, initFlowbite } from 'flowbite'

  const router = useRouter();

  onMounted(() => {
    initFlowbite();    
  })
  onUnmounted(() => {
    sidebar.status.value = true;
  })

  if(dbManager.selected === "") {
    router.replace("/");
  }

  const loading = ref(0);
  const chatSection = ref<HTMLElement|null>(null);
  const chats = ref<Chat[]>([{
    role:'bot',
    message: escapeParse("Hello! Welcome to the world of MagpieAI. I am an expert in document analysis. \n\n Loaded Collection : " + dbManager.selected)
  }])

  const riskList = ['All Risks', 'Internal Fraud', 'External Fraud', 'Employment Practices and Workplace Safety', 'Clients, Products, and Business Practice', 'Damage to Physical Assets', 'Business Disruption and Systems Failures', 'Execution, Delivery, and Process Management']

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
      if(response === "Loading.." || response === "Loading...")
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
        // console.log(e);
      }
    }
  )

  async function sendCurrentPrompt(value:string) {

    if(value == '' || value == null) {
      return;
    }

    const target = document.getElementById('dropdown');
    const trigger = document.getElementById('dropdownDefaultButton');

    const dropdown = new Dropdown(target, trigger);
    dropdown.hide();

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
        initFlowbite();
      })
  }, {
    deep: true,
  })

</script>

<template>
  <div class="grid w-full h-full relative place-items-center" :class="{ 'grid-cols-[1fr_auto]': !sidebar.status.value }">
    <div class="w-full h-full grid p-1 md:p-3 gap-2">
      <section ref="chatSection" class="grid content-start max-h-[88vh] h-full gap-5 overflow-y-auto scroll-smooth px-2">
        <div
        v-for="(chat, index) in chats"
        v-bind:key="index"
        >
        <div
        class="grid content-end items-end grid-rows-[auto_auto]"
        :class="{'grid-cols-[1fr_auto] justify-items-end': chat.role == 'user', 'grid-cols-[auto_1fr]': chat.role == 'bot'}"
        >
        <div v-if="chat.role == 'bot'" class="grid md:w-10 md:h-10 w-7 h-7 text-white rounded-full shadow-sm place-items-center bg-bubble-bot">
          <i class="scale-125 fa-solid fa-feather"></i>
        </div>
          <div
          :class="{
            'bg-bubble-user rounded-md rounded-br-none bubble-right text-white mr-6':
              chat.role == 'user',
            'bg-bubble-bot rounded-md rounded-bl-none bubble-left text-white ml-6':
              chat.role == 'bot'
          }"
          class="relative  p-3 rounded-md w-fit"
          v-html="chat.message"
        >
        </div>
        <div v-if="chat.role == 'user'" class="grid md:w-10 md:h-10 w-7 h-7 text-white rounded-full shadow-sm bg-bubble-user place-items-center">
          <i class="fa-solid fa-user"></i>
        </div>
        <div class="col-start-2 p-3">
          
        <div v-if="chat.role == 'bot' && (index === chats.length-1 || index === chats.length-2)" class="w-full gap-3 grid md:flex items-center justify-start">
          <div id="dropdown-wrappper">
            <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" class="text-white bg-bubble-bot/70 hover:bg-bubble-bot/80  focus:outline-none font-medium rounded-lg text-xs md:text-sm px-5 py-2.5 text-center inline-flex items-center" type="button"> Basel II Categories of Operational Risks <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
            </svg>
            </button>

            <div id="dropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700">
                <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                  <li class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" v-for="(risk, key) in riskList" :key @click="() => sendCurrentPrompt(risk)">
                    {{ risk }}
                  </li>
                </ul>
            </div>
          </div>
        </div>
      </div>
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
    </div>
    <div
    :class="{'hidden': sidebar.status.value, 'grid': !sidebar.status.value}"
      class="w-full grid-rows-[auto_1fr] h-full max-w-[100svw] bg-slate-50 absolute xl:relative max-h-[88svh]"
    >
      <div class="h-full mx-2">
        <button @click="() => sidebar.status.value = true" type="button" class="m-3 text-white bg-dark-primary-medium hover:bg-dark-primary-darker focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Collapse </button>
      </div>      
      <div
        class="w-full max-w-full h-full overflow-y-auto grid content-start scroll-smooth gap-1 bg-slate-100 justify-center"
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
