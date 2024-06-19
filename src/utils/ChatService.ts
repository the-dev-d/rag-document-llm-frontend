import { io } from 'socket.io-client'
import { ref } from 'vue'

export const connectionStatus = ref(false)

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

      this.socket.on('connect', () => {
        connectionStatus.value = true;
        console.log("connected")
      })
    
    
      this.socket.on('disconnect', () => {
        connectionStatus.value = false;
      })

      connectionStatus.value = true;
      
    } catch (error) {
      console.error('Error loading config:', error);
    }
  }

  onRecieveReply(callback: CallableFunction) {
    this.socket.on('handle_chat', (data:any) => {
      callback(data)
    });
  }

  sendQuestion(message: string) {
    this.socket.emit('chat_message', {
      message
    });
  }

}

const apiServiceInstance = new ApiService();
export default apiServiceInstance;