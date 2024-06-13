import { io } from 'socket.io-client'
import { onMounted, ref } from 'vue'

export const connectionStatus = ref(false)


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

class ApiService {

  private BACKEND_URL: string = "";
  private socket:any;
  
  constructor() {
    this.BACKEND_URL = '';
  }

  async loadConfig() {
    if (this.BACKEND_URL) return; // Prevent re-fetching if already loaded
    try {
      const response = await fetch(`config.json`);
      const config = await response.json();
      this.BACKEND_URL = config.BACKEND_URL;

      this.socket = io(this.BACKEND_URL, {
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
        //transports: ['websocket'],
        secure: true
      });

      this.socket.on('fetch_dropdown', (data:any) => {
        dbManager.options.value = data;
      })
    
      this.socket.on('connect', () => {
        connectionStatus.value = true;
        console.log("connected")
      })
    
      this.socket.on('disconnect', () => {
        connectionStatus.value = false;
      })

    } catch (error) {
      console.error('Error loading config:', error);
    }
  }

  onRecieveReply(callback: (...args: any[]) => void) {
    this.socket.on('handle_chat', callback);
  }
  
  removeHandleChatListener(callback: (...args: any[]) => void) {
    this.socket.off('handle_chat', callback);
  }
  
  sendQuestion(message: string) {
    this.socket.emit('chat_message', {
      message,
      db_name: dbManager.selected
    });
  }
  
  uploadFile(data: any) {
    this.socket.emit('chat_message', data);
  }
  
  disconnect() {
    this.socket.disconnect();
  }
}

const apiServiceInstance = new ApiService();
export default apiServiceInstance;

// const socket = io(SOCKET_URL, {
//   reconnection: true,
//   reconnectionAttempts: 3,
//   reconnectionDelay: 1000,
//   //transports: ['websocket'],
//   secure: true
// })

// function initializeSocket() {

//   socket.on('fetch_dropdown', (data) => {
//     dbManager.options.value = data;
//   })

//   socket.on('connect', () => {
//     connectionStatus.value = true;
//     console.log("connected")
//   })


//   socket.on('disconnect', () => {
//     connectionStatus.value = false;
//   })

//   return {
//     onRecieveReply,
//     sendQuestion,
//     uploadFile, 
//     disconnect,
//     removeHandleChatListener
//   }
// }

// function onRecieveReply(callback: (...args: any[]) => void) {
//   socket.on('handle_chat', callback);
// }

// function removeHandleChatListener(callback: (...args: any[]) => void) {
//   socket.off('handle_chat', callback);
// }

// function sendQuestion(message: string) {
//   socket.emit('chat_message', {
//     message,
//     db_name: dbManager.selected
//   });
// }

// function uploadFile(data: any) {
//   socket.emit('chat_message', data);
// }

// function disconnect() {
//   socket.disconnect();
// }

//export default initializeSocket();
export const dbManager = new DBManager();