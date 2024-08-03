<!-- <script setup>
    import { onMounted } from 'vue';
    import { useReCaptcha } from 'vue-recaptcha-v3';

    const sitekey = import.meta.env.VITE_RECAPTCHA_PUBLIC_KEY;
    const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();


    const recaptcha = async () => {
        await recaptchaLoaded();
        const token = await executeRecaptcha('login')
        console.log(token);
    }
</script>
<template>
    <div class="w-[100dvw] h-[100dvh] grid place-items-center">
        <div class="w-1/3 p-6 backdrop-brightness-150 grid gap-4">
            <h3 class="text-3xl font-semibold">Let's chat</h3>
            <p>Chat with an expert system trained to assist you today with any questions or inquiries you may have related to DORA (Digital Operational Resilience Act) compliance or regulations</p>
            <button @click="recaptcha" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Continue</button>
        </div>
    </div>
</template> -->