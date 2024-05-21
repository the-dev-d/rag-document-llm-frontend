import { ref, watch } from 'vue'

const sideBarCollapsed = ref(true)

const watchControl = watch(sideBarCollapsed, (v) => {
  localStorage.setItem('sideBarCollapse', v ? 'true' : 'false')
})

export const sidebar = {
  status: sideBarCollapsed,
  watchControl
}

export const captchaVerified = false;