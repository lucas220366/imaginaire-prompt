
import { toast } from "sonner";
import { WebSocketMessage, WebSocketResponse } from "./types";

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private messageCallbacks: Map<string, (data: any) => void> = new Map();
  private isAuthenticated: boolean = false;
  private connectionSessionUUID: string | null = null;
  private connectionPromise: Promise<void> | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 3;
  private authenticationInProgress: boolean = false;

  constructor(private apiEndpoint: string, private apiKey: string) {
    if (!apiKey) {
      throw new Error("API key is required");
    }
    this.connectionPromise = this.connect();
  }

  private connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this.authenticationInProgress) {
          console.log("Authentication already in progress, waiting...");
          return;
        }

        console.log("Attempting to connect to WebSocket...");
        this.ws = new WebSocket(this.apiEndpoint);
        
        this.ws.onopen = () => {
          console.log("WebSocket connection established, attempting authentication...");
          this.reconnectAttempts = 0;
          this.authenticate().then(resolve).catch(reject);
        };

        this.ws.onmessage = this.handleMessage.bind(this);

        this.ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          toast.error("Connection error occurred. Please try again.");
          this.isAuthenticated = false;
          this.authenticationInProgress = false;
          reject(error);
        };

        this.ws.onclose = () => {
          console.log("WebSocket connection closed");
          this.isAuthenticated = false;
          this.authenticationInProgress = false;
          
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            console.log(`Attempting to reconnect... (Attempt ${this.reconnectAttempts + 1})`);
            this.reconnectAttempts++;
            setTimeout(() => {
              this.connectionPromise = this.connect();
            }, 1000 * this.reconnectAttempts);
          } else {
            console.error("Maximum reconnection attempts reached");
            toast.error("Connection lost. Please refresh the page to try again.");
          }
        };
      } catch (error) {
        console.error("Error establishing connection:", error);
        this.authenticationInProgress = false;
        reject(error);
      }
    });
  }

  private handleMessage(event: MessageEvent): void {
    try {
      console.log("Raw WebSocket message received:", event.data);
      const response: WebSocketResponse = JSON.parse(event.data);
      
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
            this.authenticationInProgress = false;
          } else if (item.taskType === "imageInference") {
            console.log("Image inference response:", item);
            const callback = this.messageCallbacks.get(item.taskUUID);
            if (callback) {
              if (item.imageURL) {
                callback(item);
              } else if (item.error) {
                callback({ error: item.error });
              }
              this.messageCallbacks.delete(item.taskUUID);
            }
          }
        });
      }
    } catch (error) {
      console.error("Error handling WebSocket message:", error);
      toast.error("Error processing server response");
    }
  }

  private authenticate(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error("WebSocket not ready for authentication"));
        return;
      }
      
      this.authenticationInProgress = true;
      
      const authMessage: WebSocketMessage[] = [{
        taskType: "authentication",
        apiKey: this.apiKey,
        ...(this.connectionSessionUUID && { connectionSessionUUID: this.connectionSessionUUID })
      }];
      
      console.log("Sending authentication message");
      
      const timeout = setTimeout(() => {
        this.authenticationInProgress = false;
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

  public async sendMessage<T>(message: WebSocketMessage[]): Promise<T> {
    if (!this.connectionPromise) {
      this.connectionPromise = this.connect();
    }
    await this.connectionPromise;

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.isAuthenticated) {
      console.log("Connection not ready, attempting to reconnect...");
      this.connectionPromise = this.connect();
      await this.connectionPromise;
    }

    return new Promise((resolve, reject) => {
      const taskUUID = message[0].taskUUID;
      if (!taskUUID) {
        return reject(new Error("Task UUID is required"));
      }

      const timeout = setTimeout(() => {
        this.messageCallbacks.delete(taskUUID);
        reject(new Error("Operation timeout"));
        toast.error("Request timed out. Please try again.");
      }, 30000);

      this.messageCallbacks.set(taskUUID, (data) => {
        clearTimeout(timeout);
        if (data.error) {
          reject(new Error(data.error));
        } else {
          resolve(data as T);
        }
      });

      try {
        console.log("Sending message:", JSON.stringify(message, null, 2));
        this.ws.send(JSON.stringify(message));
      } catch (error) {
        clearTimeout(timeout);
        this.messageCallbacks.delete(taskUUID);
        console.error("Failed to send message:", error);
        reject(new Error("Failed to send request"));
      }
    });
  }
}
