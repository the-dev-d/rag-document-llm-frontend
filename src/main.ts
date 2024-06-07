import './index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
//import { VueReCaptcha } from 'vue-recaptcha-v3'

const app = createApp(App)

app.use(router)
//app.use(VueReCaptcha, {siteKey: "6LfzHL8pAAAAAMPIDRVeLjVYWnf98RuRggDVN8--"})
app.mount('#app')
