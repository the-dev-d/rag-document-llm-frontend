import { createRouter, createWebHistory } from 'vue-router'
import ChatView from '../views/ChatView.vue'
import SelectionView from '../views/SelectionView.vue'
import MainView from '../views/MainView.vue'
import LoginView from '../views/LoginView.vue'
import NewFileView from '../views/NewFileView.vue'




const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainView,
      children: [
        {
        path: '/chat',
        name: 'chat',
        component: ChatView
      },
    ]
    },
  ]
})

export default router
