import { io } from 'socket.io-client'
import { ref } from 'vue'

export const connectionStatus = ref(false)

const API_URL = import.meta.env.VITE_HTTP_HOST
const SOCKET_URL = import.meta.env.VITE_SOCKET_HOST

export async function sendPrompt(prompt: string) {
  const response = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({
      prompt
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const status = response.ok
  const data = await response.json()

  return {
    status,
    ...data
  }
}

const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
  //transports: ['websocket'],
  secure: true
})

export function initializeSocket() {

  socket.on('connect', () => {
    connectionStatus.value = true;
    console.log("connected")
  })


  socket.on('disconnect', () => {
    connectionStatus.value = false;
  })

  return {
    onRecieveReply,
    sendQuestion
  }
}

function onRecieveReply(callback: CallableFunction) {
  socket.on('final_result', (data) => {
    callback(data)
  })
}

function sendQuestion(question: string) {
  socket.emit('start_chat_session', {
    question
  })
}