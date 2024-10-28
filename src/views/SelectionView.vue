<script setup lang="ts">
    import socket, { dbManager } from '@/utils/ChatService';
    import { ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    const router = useRouter();
    const route = useRoute();

    const {name} = route.query;
    const loading = ref(false);

    function handleGoClick() {
        if(!name || typeof(name)!=="string") {
            return;
        }
        dbManager.setSelected({file_name:name});
        router.push("/chat");
    }

    async function handleChange() {
        if(!name || typeof(name)!=="string") {
            return;
        }
        loading.value = true;

        dbManager.setSelected({
            file_name: name
        });
        try {
            const res = await socket.create_db(name);
        } catch (error) {
            loading.value = false;
            return;
        }
        const handleRouteChange = (res:any) => {
            if(res.includes("Loading"))
                return;

            socket.offRecieveReply(handleRouteChange)
            loading.value = false;
            handleGoClick();
            
        }
        socket.onRecieveReply(handleRouteChange);
        socket.sendQuestion("All Risks");
    }

    handleChange()

</script>
<template>
    <div class="w-full h-full grid place-items-center">
        <div class="bg-white p-10 w-11/12 md:w-1/2 aspect-[2/1] shadow-md rounded-md grid place-items-center content-center gap-6">
            <div v-if="!name">
                Please use 'name' query parameter to specify document
            </div>
            <div>
                <div>{{ name }}</div>
            </div>
            <div v-if="loading" class="grid place-items-center gap-2">
                <div class="grid place-items-center gap-6">
                    <span class="loader"></span>
                    <p>Please wait while we create your database.</p>
                </div>
            </div>
            <!-- <div class="gap-6 w-full">
                <label for="countries" class="block text-nowrap mb-2 text-sm font-medium text-gray-900 dark:text-white">Select</label>
                <select @change="handleChange" v-model="selection"  id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option :value="null">Select DB</option>
                    <option :key="index" v-for="(file, index) in dbManager.options.value" :value="index">{{ file.database_name }}</option>
                </select>
            </div>
            <button :disabled="selection === null || disabled" v-on:click="handleGoClick()" type="button" class="text-white w-1/3 bg-dark-primary-medium hover:bg-dark-primary-darker focus:ring-0 font-medium disabled:bg-slate-400 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none ">
                <div class="flex items-center justify-center" role="status" v-if="disabled">
                    <svg aria-hidden="true" class="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-dark-primary-darker" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span class="sr-only">Loading...</span>
                </div>
                <span v-else>
                    Go
                </span>
            </button> -->
        </div>
    </div>
</template>

<style scoped>
.loader {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  border: 3px solid;
  border-color: #086375 #086375 transparent transparent;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
.loader::after,
.loader::before {
  content: '';  
  box-sizing: border-box;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  border: 3px solid;
  border-color: transparent transparent #2a9c97 #28918b;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-sizing: border-box;
  animation: rotationBack 0.5s linear infinite;
  transform-origin: center center;
}
.loader::before {
  width: 32px;
  height: 32px;
  border-color: #FFF #FFF transparent transparent;
  animation: rotation 1.5s linear infinite;
}
    
@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
} 
@keyframes rotationBack {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
</style>