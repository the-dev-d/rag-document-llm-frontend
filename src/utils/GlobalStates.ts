import { ref } from 'vue'

const sideBarCollapsed = ref(false)

export const sidebar = {
  status: sideBarCollapsed,
}

export const captchaVerified = false;