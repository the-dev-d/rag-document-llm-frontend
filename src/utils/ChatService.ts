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
  private SUGGESTIONS = ref([]);
  private socket:any;
  
  constructor() {
    this.BACKEND_URL = '';
  }

  get baseURL() {
    return this.BACKEND_URL;
  }

  get SUGGESTED_PROMPTS() {
        return this.SUGGESTIONS;
  }

  async loadConfig() {
    if (this.BACKEND_URL) return; // Prevent re-fetching if already loaded
    try {
      const response = await fetch(`config.json`);
      const config = await response.json();
      this.BACKEND_URL = config.BACKEND_URL;
      this.SUGGESTIONS.value = config.SUGGESTED_PROMPTS;

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

  async onRecieveReply(callback: (...args: any[]) => void) {
    if(!this.BACKEND_URL)
      await this.loadConfig();

    this.socket.on('handle_chat', callback);
  }
  
  async removeHandleChatListener(callback: (...args: any[]) => void) {
    if(!this.BACKEND_URL)
      await this.loadConfig();

    this.socket.off('handle_chat', callback);
  }
  
  async sendQuestion(message: string) {
    if(!this.BACKEND_URL)
      await this.loadConfig();

    this.socket.emit('chat_message', {
      message
    });
  }
  
  async uploadFile(data: any) {
    if(!this.BACKEND_URL)
      await this.loadConfig();

    this.socket.emit('chat_message', data);
  }
  
  async disconnect() {
    this.socket.disconnect();
  }
}

const apiServiceInstance = new ApiService();
export default apiServiceInstance;

export const dbManager = new DBManager();