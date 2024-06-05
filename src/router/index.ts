import { createRouter, createWebHistory } from 'vue-router'
import ChatView from '../views/ChatView.vue'
import LoginView from '../views/LoginView.vue'
import SelectionView from '../views/SelectionView.vue'
import MainView from '../views/MainView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      name: 'home',
      component: MainView,
      children: [
        {
        path: '',
        name: 'chat',
        component: ChatView
      },
      {
        path: '/select',
        name: 'file_selection',
        component: SelectionView
      }
    ]
    },
    
  ]
})

export default router
