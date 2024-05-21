import { createRouter, createWebHistory } from 'vue-router'
import ChatView from '../views/ChatView.vue'
//import HomeView from '../views/HomeView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/chat',
      name: 'chat',
      component: ChatView
    },
    {
      path: '/',
      name: 'home',
      component: ChatView
    }
  ]
})

export default router
