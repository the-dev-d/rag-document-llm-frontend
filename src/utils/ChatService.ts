import { io } from 'socket.io-client'
import { ref } from 'vue'

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
    sendQuestion
  }
}

function onRecieveReply(callback: CallableFunction) {
  socket.on('handle_chat', (data) => {
    callback(data)
  });
}

function sendQuestion(message: string) {
  socket.emit('chat_message', {
    message,
    db_name: dbManager.selected
  });
}

export default initializeSocket();
export const dbManager = new DBManager();