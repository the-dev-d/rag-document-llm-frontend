import { io } from 'socket.io-client'
import { onMounted, ref } from 'vue'
import { ToastService } from './ToastService';

export const connectionStatus = ref(false)


export const db = ref([]);


class DBManager {

  private _selected: {file_name:string} | null = null;

  setSelected(db: {file_name: string}) {
    this._selected = db;  
  }

  get selected() {
    return this._selected;
  }

}

class ApiService {

  private BACKEND_URL: string = "";
  private _socket:any;
  
  constructor() {
    this.BACKEND_URL = '';
  }

  get backend() {
    return this.BACKEND_URL;
  }

  get socket():any {
    return this.socket
  }

  async loadConfig() {
    if (this.BACKEND_URL) return; // Prevent re-fetching if already loaded
    try {
      const response = await fetch(`config.json`);
      const config = await response.json();
      this.BACKEND_URL = config.BACKEND_URL;

      this._socket = io(this.BACKEND_URL, {
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
        //transports: ['websocket'],
        secure: true
      });
    
      this._socket.on('connect', () => {
        connectionStatus.value = true;
        console.log("connected")
      })
    
      this._socket.on('disconnect', () => {
        connectionStatus.value = false;
      })

    } catch (error) {
      console.error('Error loading config:', error);
    }
  }

  async onRecieveReply(callback: (...args: any[]) => void) {
    if(!this.BACKEND_URL)
      await this.loadConfig();

    this._socket.on('handle_chat', callback);
  }

  async offRecieveReply(callback: (...args: any[]) => void) {
    if(!this.BACKEND_URL)
      await this.loadConfig();

    this._socket.off('handle_chat', callback);
  }
  
  async removeHandleChatListener(callback: (...args: any[]) => void) {
    if(!this.BACKEND_URL)
      await this.loadConfig();

    this._socket.off('handle_chat', callback);
  }
  
  async sendQuestion(message: string) {
    if(!this.BACKEND_URL)
      await this.loadConfig();

    this._socket.emit('chat_message', {
      message,
      db_name: dbManager.selected?.file_name
    });
  }

  async create_db(file_name: string) {
    if(!this.BACKEND_URL)
      await this.loadConfig();

    const p = new Promise((resolve, reject) => {
      
      const dbCreationHandler = (data:string|any) => {
        if(data === `4 Database for ${file_name} created successfully.`) {
          resolve(data);
          this._socket.off("handle_chat", dbCreationHandler);
          console.log("Database created successfully");
        }else if(typeof(data) === "object" && data.status === "error") {
          ToastService.add({message:data.errormessage, type: "error"})
          reject(data);
        }
      }
      this._socket.on("handle_chat", dbCreationHandler);
      this._socket.emit('chat_message', {
        file_name
      });
    })
    const data = await p;
    return data;
  }
  
  async uploadFile(data: any) {
    if(!this.BACKEND_URL)
      await this.loadConfig();

    this._socket.emit('chat_message', data);
  }
  
  async disconnect() {
    this._socket.disconnect();
  }
}

export function createRegexPatternForLetters(input: string): string {
  const escapedInput = input.replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  const letters = escapedInput.match(/\\?.|./g) || [];
  console.log(letters)
  const regexPattern = letters.join('(?:<[^>]+>|(?: ))*');
  return `(?:<[^\/>]+>|(?: ))${regexPattern}(?:</[^    const selection = ref<number|null>(null);
>]+>|(?: ))*`;
}


const apiServiceInstance = new ApiService();
export default apiServiceInstance;

export const dbManager = new DBManager();