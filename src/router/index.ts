import { createRouter, createWebHistory } from 'vue-router'
import ChatView from '../views/ChatView.vue'
import LoginView from '../views/LoginView.vue'
import SelectionView from '../views/SelectionView.vue'
import MainView from '../views/MainView.vue'
import NewFileView from '@/views/NewFileView.vue'


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
        path: '/chat',
        name: 'chat',
        component: ChatView
      },
      {
        path: '',
        name: 'file_selection',
        component: SelectionView
      },
      {
        path: '/new-file',
        name: 'new_file',
        component: NewFileView
      }
    ]
    },
    
  ]
})

export default router
