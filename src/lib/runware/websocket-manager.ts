
import { WebSocketMessage } from "./types";

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private apiKey: string;
  private endpoint: string;
  private isConnected: boolean = false;
  private messageCallbacks: Map<string, (data: any) => void> = new Map();
  private connectionPromise: Promise<void> | null = null;

  constructor(endpoint: string, apiKey: string) {
    this.endpoint = endpoint;
    this.apiKey = apiKey;
    this.connectionPromise = this.connect();
  }

  private connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.endpoint);
      
      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.isConnected = true;
        this.authenticate().then(resolve).catch(reject);
      };

      this.ws.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);
          
          if (response.error || response.errors) {
            console.error("WebSocket error response:", response);
            const errorMessage = response.errorMessage || response.errors?.[0]?.message || "An error occurred";
            reject(new Error(errorMessage));
            return;
          }

          if (response.data) {
            response.data.forEach((item: any) => {
              const callback = this.messageCallbacks.get(item.taskUUID);
              if (callback) {
                callback(item);
                this.messageCallbacks.delete(item.taskUUID);
              }
            });
          }
        } catch (error) {
          console.error("Error processing WebSocket message:", error);
          reject(error);
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.isConnected = false;
        reject(error);
      };

      this.ws.onclose = () => {
        console.log("WebSocket closed");
        this.isConnected = false;
        this.connectionPromise = null;
      };
    });
  }

  private authenticate(): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return Promise.reject(new Error("WebSocket not ready for authentication"));
    }
    
    const authMessage = [{
      taskType: "authentication",
      apiKey: this.apiKey
    }];
    
    console.log("Sending authentication message");
    this.ws.send(JSON.stringify(authMessage));
    return Promise.resolve();
  }

  // Generate UUID function to replace crypto.randomUUID
  private generateUUID(): string {
    // Use crypto.randomUUID if available (modern browsers)
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    
    // Fallback implementation for environments without crypto.randomUUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async sendMessage<T>(message: WebSocketMessage[]): Promise<T> {
    // Wait for connection before proceeding
    if (!this.isConnected && this.connectionPromise) {
      await this.connectionPromise;
    } else if (!this.isConnected) {
      this.connectionPromise = this.connect();
      await this.connectionPromise;
    }

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket not connected");
    }

    return new Promise((resolve, reject) => {
      // Use the taskUUID from the message, or generate a new one if not provided
      const taskUUID = message[0].taskUUID || this.generateUUID();
      message[0].taskUUID = taskUUID;

      this.messageCallbacks.set(taskUUID, (data) => {
        if (data.error) {
          reject(new Error(data.errorMessage));
        } else {
          resolve(data as T);
        }
      });

      // Set a timeout to prevent hanging promises
      const timeoutId = setTimeout(() => {
        this.messageCallbacks.delete(taskUUID);
        reject(new Error("Request timed out"));
      }, 120000); // 2 minute timeout

      try {
        this.ws.send(JSON.stringify(message));
      } catch (error) {
        clearTimeout(timeoutId);
        this.messageCallbacks.delete(taskUUID);
        reject(error);
      }
    });
  }
}
