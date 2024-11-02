<script setup lang="ts">
  import type { Chat } from '@/types/type'
  import { sidebar } from '@/utils/GlobalStates'
  import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
  import socket, { createRegexPatternForLetters, dbManager } from '@/utils/ChatService'
  import { escapeParse, parseJSONToTable } from '@/utils/ResponseParser'
  import { useRouter } from 'vue-router'
  import PDFViewer from '@/components/PDFViewer.vue'
  import DocxViewer from '@/components/DocxViewer.vue';
  import { Dropdown, initFlowbite } from 'flowbite'
  import ExcelJS from 'exceljs'
  import { saveAs } from 'file-saver'
import { match } from 'assert'

  const router = useRouter();
  const prompt = ref('')


  onMounted(() => {
    initFlowbite();    
  })

  if(dbManager.selected === null) {
    router.replace("/");
  }

  const loading = ref(0);
  const chatSection = ref<HTMLElement|null>(null);
  const chats = ref<Chat[]>([{
    role:'bot',
    message: escapeParse("Hello! Welcome to the world of MagpieAI. I am an expert in document analysis. \n\n Loaded Collection : " + dbManager.selected?.file_name)
  }])

  // const riskList = ['All Risks', 'Internal Fraud', 'External Fraud', 'Employment Practices and Workplace Safety', 'Clients, Products, and Business Practice', 'Damage to Physical Assets', 'Business Disruption and Systems Failures', 'Execution, Delivery, and Process Management']

  function createSourceClickListeners() {
    const elements = document.querySelectorAll('[data-source="true"]');
    elements.forEach(el => {
      console.log(el)
      el.addEventListener('click', (e) => {
        handleSourceClick(e.target);
      })
    })
  }

  async function handleClicks(e: KeyboardEvent) {
    if (!e.shiftKey && e.code === 'Enter') {
      sendCurrentPrompt(prompt.value)
      prompt.value = ''
    }
  }

  function handleSourceClick(source: EventTarget|null) {
    if(!source) return;

    let key: string = "" 
    if(dbManager.selected?.file_name.endsWith(".pdf"))
      key = (source as HTMLElement).innerText.replace(/[\n\s]/g, "") as string;
    else 
      key = (source as HTMLElement).innerText as string;

    key = key.replace("(", "\\(")
    key = key.replace(")", "\\)")

    let highlight = (source as HTMLElement).innerText as string;
    let indexOfHyphen = highlight.indexOf('-');
    highlight = (indexOfHyphen !== -1) ? highlight.substring(indexOfHyphen + 1).trim() : highlight;
    
    const pageProcessing = () => {
      let pages;
      if(dbManager.selected?.file_name.endsWith(".pdf"))
        pages = document.querySelectorAll('[data-page]')
      else
        pages = document.getElementsByClassName('docx-wrapper')[0].childNodes;

      for(let page of pages as NodeListOf<HTMLElement>) {
        
        page = page as HTMLElement;
        let innerText: string = "";

        // if(dbManager.selected?.file_name.endsWith(".pdf")) {

          const canvas = page.getElementsByTagName('canvas')[0];
          page.innerHTML = page.innerHTML.replace(/background-color: yellow;/g, "")
          const newCanvas = page.getElementsByTagName('canvas')[0];
          const context = newCanvas.getContext("2d");
          context?.drawImage(canvas, 0, 0);

          innerText = page.innerText.replace(/\s+/g, "");
          if(innerText.match(key)) {
            
            page.scrollIntoView()
            const pattern = createRegexPatternForLetters(highlight);

            const canvas = page.getElementsByTagName('canvas')[0];
            const matchExp = page.innerHTML.match(pattern);

            if(!matchExp)
              return;

            const selected = page.innerHTML.match(pattern);
            if(!selected)
              return;

            const highlighed = selected[0].replace(/(<span\b[^>]*style=\"[^\"]*?)([^\"]*?)\"/g,'$1$2 background-color: yellow;\"');
            if(matchExp.index)
              page.innerHTML = page.innerHTML.slice(0, matchExp.index) + highlighed + page.innerHTML.slice(matchExp.index + matchExp[0].length);

            const newCanvas = page.getElementsByTagName('canvas')[0];
            const context = newCanvas.getContext("2d");

            context?.drawImage(canvas, 0, 0);
          }
        // }
        // else {
        //   page.innerHTML = page.innerHTML.replace(/<span class=['"]highlight['"]>(.*?)<\/span>/g, '$1')
        //   page.innerHTML = page.innerHTML.replace(highlight, "<span class='highlight'>" + highlight + "</span>")
        
        //   const highlightSpan = document.getElementsByClassName('highlight')[0];
        //   if(highlightSpan) {
        //     highlightSpan.scrollIntoView();
        //   }
        // }
      }
    }

    if(!sidebar.status.value) {
      sidebar.status.value = true;
      nextTick(() => {
        setTimeout(pageProcessing, 1000)
      })
      return;
    }
    pageProcessing();
  }

  socket.onRecieveReply((response) => {
      if(response === "Loading" || response === "Loading...")
        return;
    
      try {        
        // const parsed = JSON.parse(response);
        
        const {result} = response as {result:string};
        const match = result.match(/\*?\*?Answer:\*?\*?\s(.*)[.\n]*\*?\*?Source:\*?\*?(.*)/)
        let final = response.result;

        console.log(result,match)
        if(match) {
          const answer = match[1];
          const source = match[2];
          const sourceParsed = `<br><br> Source: <span data-source="true"> ${source} </span>`;
          const response = answer + sourceParsed;
          final = response;
        }

        console.log(final)
        // final = parseJSONToTable(parsed);
        chats.value.push({
          role: 'bot',
          message: final
        })
        loading.value--;
        console.log(loading.value)
        // nextTick(createSourceClickListeners)
      }catch(e) {
        console.log(e);
      }
    }
  )

  async function sendCurrentPrompt(value:string) {

    if(value == '' || value == null) {
      return;
    }

    chats.value.push({
      role: 'user',
      message: value
    })
    loading.value++;
    socket.sendQuestion(value.trim());

  }

  // function makeDownload(content: string) {
  //   const div = document.createElement("div");
  //   div.innerHTML = content;

  //   const workbook = new ExcelJS.Workbook();
  //   const sheet = workbook.addWorksheet('My Sheet');

  //   const tableBody = div.childNodes[0].childNodes[0];
  //   for(const tableRow of tableBody.childNodes) {
  //     const rowEl = [];
  //     for(const tableCell of tableRow.childNodes)  {
  //       rowEl.push(tableCell.textContent);
  //     }
  //     sheet.addRow(rowEl);
  //   }

  //   workbook.xlsx.writeBuffer()
  //     .then((buffer) => {
  //       saveAs(new Blob([buffer], {type: 'application/octet-stream'}),'download.xlsx')
  //     })
  // }


  watch(chats, async (val) => {
    nextTick(() => {
        if(chatSection.value)
          chatSection.value.scrollTop = chatSection.value.scrollHeight;
        initFlowbite();
        createSourceClickListeners();
      })
  }, {
    deep: true,
  })
</script>

<template>
  <div class="grid w-full h-full relative place-items-center" :class="{ 'grid-cols-[1fr_auto]': sidebar.status.value }">
    <div class="w-full h-full grid p-1 md:p-3 gap-2 grid-rows-[1fr_auto]">
      <section ref="chatSection" class="grid content-start max-h-[96vh] h-full gap-5 overflow-y-auto scroll-smooth px-2">
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
        <!-- <div v-if="chat.role == 'bot' && (index === chats.length-1 || index === chats.length-2)" class="w-full gap-3 flex md:flex items-center justify-start">
          <div id="dropdown-wrappper">
            <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" class="text-white bg-bubble-bot/70 hover:bg-bubble-bot/80  focus:outline-none font-medium rounded-lg text-xs md:text-sm px-5 py-2.5 text-center inline-flex items-center" type="button"> Categories of Operational Risks <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
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
            <div>
          </div>
          </div>
          <div v-if="index !== 0">
            <button @click="() => makeDownload(chat.message)" v-if="chats.length-1 == index" class=" px-5 hover:brightness-200 p-1 rounded-lg bg-dark-primary-darker text-white">
              <i class="fa-solid fa-download"></i>
            </button>
          </div>
        </div> -->
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
      <div>
        <section class="box-border flex items-center justify-center h-20 gap-3">
        <textarea
          v-model="prompt"
          v-on:keyup="handleClicks"
          id="message"
          class="box-border flex-1 p-2 text-sm text-gray-900 bg-transparent border-2 rounded-lg resize-none bg-gray-50 border-slate-400 focus:ring-teal-500 focus:border-blue-500 backdrop-brightness-150 dark:border-teal-600 h-full dark:placeholder-gray-400 dark:text-white focus:outline-none dark:focus:border-teal-400 focus:border-2"
          placeholder="Start typing..."
        ></textarea>
        <button v-on:click="() => {sendCurrentPrompt(prompt); prompt = ''}" type="button" class="grid text-xl font-medium text-center text-dark-primary-darker border border-dark-primary-darker rounded-sm h-fit w-fit p-4 outline-none place-items-center hover:bg-dark-primary-medium hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:text-teal-300 dark:border-teal-500 dark:hover:text-white dark:focus:ring-teal-800 dark:hover:bg-teal-500">
          <i class="fas fa-paper-plane"></i>
        </button>          
      </section>
      </div>
    </div>  
    <div
    :class="{'hidden': !sidebar.status.value, 'grid': sidebar.status.value}"
      class="w-full grid-rows-[auto_1fr] h-full max-h-[95svh]  max-w-[100svw] bg-slate-200 p-2 absolute xl:relative"
    >
      <div class="h-full px-2  bg-white border-b-2">
        <button @click="() => sidebar.status.value = false" type="button" class="m-3 text-white bg-dark-primary-medium hover:bg-dark-primary-darker focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Collapse </button>
      </div>      
      <div
        class="w-full max-w-full h-full overflow-y-auto grid content-start scroll-smooth gap-1justify-center mt-1">
        <PDFViewer></PDFViewer>
        <!-- <DocxViewer v-if="dbManager.selected?.file_name.endsWith('.docx')"></DocxViewer> -->
      </div> 
    </div>
  </div>
</template>

<style>
span[data-source] {
  text-decoration: underline;
  cursor: pointer;
}
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
