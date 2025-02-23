
import { toast } from "sonner";

const API_ENDPOINT = "wss://ws-api.runware.ai/v1";

export interface GenerateImageParams {
  positivePrompt: string;
  model?: string;
  numberResults?: number;
  outputFormat?: string;
  CFGScale?: number;
  scheduler?: string;
  strength?: number;
  promptWeighting?: "compel" | "sdEmbeds";
  seed?: number | null;
  lora?: string[];
  width?: number;
  height?: number;
}

export interface GeneratedImage {
  imageURL: string;
  positivePrompt: string;
  seed: number;
  NSFWContent: boolean;
}

export class RunwareService {
  private ws: WebSocket | null = null;
  private apiKey: string | null = null;
  private connectionSessionUUID: string | null = null;
  private messageCallbacks: Map<string, (data: any) => void> = new Map();
  private isAuthenticated: boolean = false;
  private connectionPromise: Promise<void> | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 3;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.connectionPromise = this.connect();
  }

  private connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(API_ENDPOINT);
        
        this.ws.onopen = () => {
          console.log("WebSocket connected");
          this.reconnectAttempts = 0;
          this.authenticate().then(resolve).catch(reject);
        };

        this.ws.onmessage = (event) => {
          console.log("WebSocket message received:", event.data);
          const response = JSON.parse(event.data);
          
          if (response.error || response.errors) {
            console.error("WebSocket error response:", response);
            const errorMessage = response.errorMessage || response.errors?.[0]?.message || "An error occurred";
            toast.error(errorMessage);
            this.messageCallbacks.forEach((callback) => callback({ error: errorMessage }));
            this.messageCallbacks.clear();
            return;
          }

          if (response.data) {
            response.data.forEach((item: any) => {
              if (item.taskType === "authentication") {
                console.log("Authentication successful, session UUID:", item.connectionSessionUUID);
                this.connectionSessionUUID = item.connectionSessionUUID;
                this.isAuthenticated = true;
              } else if (item.taskType === "imageInference" && item.imageURL) {
                const callback = this.messageCallbacks.get(item.taskUUID);
                if (callback) {
                  callback(item);
                  this.messageCallbacks.delete(item.taskUUID);
                }
              }
            });
          }
        };

        this.ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          toast.error("Connection error. Please try again.");
          reject(error);
        };

        this.ws.onclose = () => {
          console.log("WebSocket closed");
          this.isAuthenticated = false;
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            console.log(`Attempting to reconnect... (Attempt ${this.reconnectAttempts + 1})`);
            this.reconnectAttempts++;
            setTimeout(() => {
              this.connectionPromise = this.connect();
            }, 1000 * this.reconnectAttempts);
          } else {
            console.error("Max reconnection attempts reached");
            toast.error("Connection lost. Please refresh the page.");
          }
        };
      } catch (error) {
        console.error("Error in connect:", error);
        reject(error);
      }
    });
  }

  private authenticate(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error("WebSocket not ready for authentication"));
        return;
      }
      
      const authMessage = [{
        taskType: "authentication",
        apiKey: this.apiKey,
        ...(this.connectionSessionUUID && { connectionSessionUUID: this.connectionSessionUUID }),
      }];
      
      console.log("Sending authentication message");
      
      const timeout = setTimeout(() => {
        reject(new Error("Authentication timeout"));
      }, 10000);

      const authCallback = (event: MessageEvent) => {
        const response = JSON.parse(event.data);
        if (response.data?.[0]?.taskType === "authentication") {
          clearTimeout(timeout);
          this.ws?.removeEventListener("message", authCallback);
          resolve();
        }
      };
      
      this.ws.addEventListener("message", authCallback);
      this.ws.send(JSON.stringify(authMessage));
    });
  }

  async generateImage(params: GenerateImageParams): Promise<GeneratedImage> {
    if (!this.apiKey) {
      throw new Error("API key not set");
    }

    await this.connectionPromise;

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.isAuthenticated) {
      console.log("Connection not ready, attempting to reconnect...");
      this.connectionPromise = this.connect();
      await this.connectionPromise;
    }

    const taskUUID = crypto.randomUUID();
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.messageCallbacks.delete(taskUUID);
        reject(new Error("Image generation timeout"));
      }, 30000);

      const requestMessage = {
        taskType: "imageInference",
        taskUUID,
        positivePrompt: params.positivePrompt,
        model: "runware:100@1",
        width: params.width || 1024,
        height: params.height || 1024,
        numberResults: 1,
        steps: 4,
        CFGScale: 1,
        scheduler: "FlowMatchEulerDiscreteScheduler",
        strength: 0.8,
        lora: [],
        outputFormat: params.outputFormat
      };

      const message = [requestMessage];

      console.log("Sending image generation message:", JSON.stringify(message, null, 2));

      this.messageCallbacks.set(taskUUID, (data) => {
        clearTimeout(timeout);
        if (data.error) {
          reject(new Error(data.error));
        } else {
          resolve(data);
        }
      });

      try {
        this.ws.send(JSON.stringify(message));
      } catch (error) {
        clearTimeout(timeout);
        this.messageCallbacks.delete(taskUUID);
        reject(new Error("Failed to send generation request"));
      }
    });
  }
}
