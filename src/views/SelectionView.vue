<script setup lang="ts">
    import socket, { dbManager } from '@/utils/ChatService';
    import { ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import logo from '@/assets/logo.png'
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
        handleGoClick();
    }

    handleChange()
</script>
<template>
    <div class="w-full h-full grid place-items-center">
       <div class="bg-white p-10 w-11/12 md:w-1/2 aspect-[2/1] md:grid-cols-2 shadow-md rounded-md grid place-items-center content-center gap-6">
            <div class="md:border-r h-full grid place-items-center">
                <img class="w-1/2 mx-auto" src="@/assets/image.png" alt="">
            </div>
            <div class="grid place-items-center text-xs md:text-base">
                    <div v-if="!name">
                    Please use 'name' query parameter to specify document
                </div>
                <div v-if="loading" class="grid relative place-items-center gap-4 ">
                    <div>{{ name }}</div>
                    <div class="grid relative place-items-center gap-6 z-10">
                        <span class="loader"></span>
                    </div>
                    <p class="text-center">Please wait till we build your custom magpie mini bot</p>

                </div>
            </div>
        </div> 
    </div>
</template>

<style scoped>
.loader {
  width: 50px;
  height: 50px;
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
  width: 35pxc;
  height: 35pxc;
  border-radius: 50%;
  box-sizing: border-box;
  animation: rotationBack 0.5s linear infinite;
  transform-origin: center center;
}
.loader::before {
  width: 25px;
  height: 25px;
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