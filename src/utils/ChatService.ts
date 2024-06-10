import { io } from 'socket.io-client'
import { onMounted, ref } from 'vue'

export const connectionStatus = ref(false)

const SOCKET_URL = import.meta.env.VITE_SOCKET_HOST

export const db = ref([]);


class DBManager {

  private _selected: string = "";
  public options = ref([]);

  setSelected(db: string) {
    this._selected = db;  
  }

  get selected() {

    return this._selected;
  }

}

const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
  //transports: ['websocket'],
  secure: true
})

function initializeSocket() {

  socket.on('fetch_dropdown', (data) => {
    dbManager.options.value = data;
  })

  socket.on('connect', () => {
    connectionStatus.value = true;
    console.log("connected")
  })


  socket.on('disconnect', () => {
    connectionStatus.value = false;
  })

  return {
    onRecieveReply,
    sendQuestion,
    uploadFile, 
    disconnect,
    removeHandleChatListener
  }
}

function onRecieveReply(callback: (...args: any[]) => void) {
  socket.on('handle_chat', callback);
}

function removeHandleChatListener(callback: (...args: any[]) => void) {
  socket.off('handle_chat', callback);
}

function sendQuestion(message: string) {
  socket.emit('chat_message', {
    message,
    db_name: dbManager.selected
  });
}

function uploadFile(data: any) {
  socket.emit('chat_message', data);
}

function disconnect() {
  socket.disconnect();
}

export default initializeSocket();
export const dbManager = new DBManager();