<script setup lang="ts">
  import type { Chat } from '@/types/type'
  import { sidebar } from '@/utils/GlobalStates'
  import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
  import socket from '@/utils/ChatService'
  import { makeInputBoxes, parseMarkDown } from '@/utils/ResponseParser'
  import { initFlowbite, initTooltips } from 'flowbite'

  onUnmounted(() => {
    sidebar.status.value = true;
  })

  onMounted(() => {
    initFlowbite()
  })

  const loading = ref(0);
  const prompt = ref('');
  const chatSection = ref<HTMLElement|null>(null);
  const chats = ref<Chat[]>([]);
  const copyTooltip = ref("Copy");
  const  suggested_prompt = socket.SUGGESTED_PROMPTS;
  //   {
  //   role:'bot',
  //   message: escapeParse("Hello! Welcome to the world of MagpieAI. I am an expert in document analysis. \n\n Loaded Collection : " + dbManager.selected)
  // }

  function createFlattenedContent() {
    const dynamicBoxes = document.querySelectorAll("input[data-dynamic-box]");
    const values: string[] = [];
    dynamicBoxes.forEach(box => {
      const value = box.getAttribute("data-value") || "";
      values.push(value);
    })

    let oldMessage = chats.value[1].message;
    let newMessage = chats.value[1].message;
    do {
      oldMessage = newMessage;
      newMessage = oldMessage.replace("<input type='text' data-dynamic-box data-value='' />", values.splice(0,1)[0])
    }
    while (oldMessage != newMessage);
    return newMessage;
  }

  async function handleDownload() {

    const newMessage = createFlattenedContent();

    const container = document.createElement('div');
    container.innerHTML = newMessage;

    const popup = window.open('', "c", "'height=1920,width=1080'");
    if(!popup)
      return;
    popup.document.body.innerHTML = newMessage;
    popup.print();
    popup.onafterprint = () => popup.close()
    
  }

  function getSelectableContent(el: HTMLDivElement) {
  const walker = document.createTreeWalker(
    el,
    NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          if (node.parentNode!.nodeName === "SCRIPT" || 
            node.parentNode!.nodeName === "STYLE" || 
            getComputedStyle(node.parentNode as Element).visibility === "hidden" || 
            getComputedStyle(node.parentNode as Element).display === "none") {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    let content = '';
    while (walker.nextNode()) {
      content += walker.currentNode.nodeValue;
    }

    return content;
  }

  async function handleCopy() {
    const newMessage = createFlattenedContent();
    const div = document.createElement('div');
    div.innerHTML = newMessage;

    const content = getSelectableContent(div);
    console.log(content);
    navigator.clipboard.writeText(content);
    if(copyTooltip.value === "Copy") {
      copyTooltip.value = "Copied ✔️";
      setTimeout(() => {copyTooltip.value = "Copy"}, 2000)
    }
  }

  async function sendCurrentPrompt() {

    if(prompt.value.trim() == "") {
      return;
    }

    const { value } = prompt
    prompt.value = ''
    chats.value = [];
    chats.value.push({
      role: 'user',
      message: value
    })
    loading.value++;
    socket.sendQuestion(value); 
  }

  async function handleClicks(e: KeyboardEvent) {
    if (!e.shiftKey && e.code === 'Enter') {
      sendCurrentPrompt()
    }
  }


  socket.onRecieveReply((response: any) => {
      if(response === "Loading")
        return;
    
      try {

        if(response.result)
          chats.value.push({
            role: 'bot',
            message: makeInputBoxes(parseMarkDown(response.result))
          })
        loading.value--;
      }catch(e) {
        console.log(e);
      }
    }
  )

  watch(chats, async (val) => {
    nextTick(() => {
        initTooltips();
        setDynamicEvents();
        if(chatSection.value)
          chatSection.value.scrollTop = chatSection.value.scrollHeight;
      })
  }, {
    deep: true,
  })

  function setDynamicEvents() {

    const dynamicInputs = document.querySelectorAll('input[data-dynamic-box]');
    dynamicInputs.forEach(input => {
      input.addEventListener('keyup', () => {
        input.setAttribute('data-value', (input as HTMLInputElement).value);
      })
    })
  }

</script>

<template>
  <!-- :class="{ 'grid-cols-[1fr_auto]': !sidebar.status.value }" -->
  <div class="grid relative w-full h-full items-center grid-rows-[auto_1fr] max-h-full overflow-hidden">
    <div class="p-3">
      <div class="mx-auto flex gap-3 items-center">
        <textarea :disabled="!!chats.length" v-model="prompt" v-on:keyup="handleClicks" id="message" rows="4" class="block p-2.5 flex-1 border-2 text-sm text-gray-900 bg-gray-50 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 resize-none dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Incident Information"></textarea>
        <div class="grid gap-2">
          <button data-tooltip-target="tooltip-send" :disabled="!!chats.length || prompt.trim() == ''" v-on:click="sendCurrentPrompt" type="button" class="text-white bg-dark-primary-medium hover:bg-dark-primary-darker focus:ring-4 h-fit focus:outline-none disabled:bg-gray-600 focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 ">
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
            <span class="sr-only">Send Message</span>
          </button>
          <div id="tooltip-send" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
            Send
            <div class="tooltip-arrow" data-popper-arrow></div>
          </div>
          <button @click="() => (chats = [])" data-tooltip-target="tooltip-reset" :disabled="(chats.length%2)!==0" type="button" class="text-white bg-dark-primary-medium hover:bg-dark-primary-darker focus:ring-4 h-fit focus:outline-none disabled:bg-gray-600 focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 ">
            <span class="material-symbols-outlined">
              restart_alt
            </span>
            <span class="sr-only">Send Message</span>
          </button>
          <div id="tooltip-reset" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
            Reset
            <div class="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>
      </div>
      <div class="flex gap-1 md:gap-3 py-2 md:flex-row flex-col">
        <button :disabled="!!chats.length" v-for="(p, index) in suggested_prompt" v-bind:key="index" @click="()=> {prompt = p; sendCurrentPrompt()}"  class="flex-1 disabled:bg-gray-500 text-sm xl:text-base border rounded-md p-2 bg-dark-primary-medium text-white hover:bg-dark-primary-darker border-dark-primary-darker">
          {{ p }}
        </button>
      </div>
      <div class="grid grid-cols-3">

      </div>
    </div>
    <div class="w-full h-full max-h-full overflow-auto grid grid-rows-[1fr_auto] md:p-3 p-1 gap-2 @container">
      <section ref="chatSection" class="grid content-start max-h-[88svh] gap-5 scroll-smooth px-2">
        <div
        v-for="(chat, index) in chats"
        v-bind:key="index"
        class="flex items-end"
        :class="{'justify-end': chat.role == 'user'}"
        >
          <div v-if="chat.role == 'bot'" class="grid text-white rounded-full shadow-sm place-items-center bg-bubble-bot w-8 h-8 mb-10">
            <i class="fa-solid fa-feather"></i>
          </div>
          <div class="w-fit h-fit grid">
            <div
            :class="{
              'bg-bubble-user rounded-md rounded-br-none bubble-right text-white mr-6 md:ml-12':
                chat.role == 'user',
              'bg-bubble-bot rounded-md rounded-bl-none bubble-left text-white ml-6 md:mr-12 max-h-[40dvh] @md:max-h-[43dvh] @3xl:max-h-[50dvh] @5xl:max-h-[52dvh] overflow-auto':
                chat.role == 'bot'
            }"
            class="relative p-3 rounded-md w-fit chat"
            v-html="chat.role == 'bot' ? parseMarkDown(chat.message) : chat.message">
            </div>
            <div class="ml-5 mt-3 flex gap-2 relative" v-if="chat.role == 'bot'">
              <button data-tooltip-target="tooltip-download" @click="handleDownload" class="w-fit px-4 py-1 rounded-md bg-dark-primary-medium text-white hover:bg-dark-primary-darker">
                <i class="fa-solid fa-download"></i>
              </button>
              <div id="tooltip-download" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                Download
                <div class="tooltip-arrow" data-popper-arrow></div>
              </div>
              <button data-tooltip-target="tooltip-copy" @click="handleCopy" class="w-fit px-4 py-1 rounded-md bg-dark-primary-medium text-white hover:bg-dark-primary-darker">
                <i class="fa-solid fa-clipboard"></i>
              </button>
              <div id="tooltip-copy" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                {{copyTooltip}}
                <div class="tooltip-arrow" data-popper-arrow></div>
              </div>
            </div>
          </div>
          <div v-if="chat.role == 'user'" class="grid w-8 h-8 text-white rounded-full shadow-sm bg-bubble-user place-items-center">
            <i class="fa-solid fa-user"></i>
          </div>
        </div>

        <div v-if="loading != 0" class="flex items-end">
          <div class="grid w-8 h-8 text-white rounded-full shadow-sm place-items-center bg-bubble-bot">
            <i class="fa-solid fa-feather"></i>
          </div>

          <div class="bg-bubble-bot rounded-bl-none bubble-left text-white ml-6 relative max-w-[85%] md:max-w-[60%] px-3 py-2 rounded-md w-fit">
            <img class="h-8 saturate-0 brightness-200" src="@/assets/loading.gif" alt="">
          </div>
        </div>
      </section>
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
.chat > * {
  margin: 0.5rem 0rem;
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
input {
  padding: 0 !important;
  color:black !important;
  font-size: small !important;
  border-radius: 5px !important;
}
</style>
