
import { toast } from "sonner";
import { WebSocketMessage } from "./types";
import { BaseWebSocketService } from "./websocket/base-service";
import { MessageHandler } from "./websocket/message-handler";
import { TimeoutManager } from "./websocket/timeout-manager";

export class WebSocketManager extends BaseWebSocketService {
  private messageCallbacks: Map<string, (data: any) => void> = new Map();
  private messageHandler: MessageHandler;
  private timeoutManager: TimeoutManager;
  private authenticationInProgress: boolean = false;
  private readonly operationTimeout: number = 60000;

  constructor(apiEndpoint: string, apiKey: string) {
    super(apiEndpoint, apiKey);
    this.messageHandler = new MessageHandler(
      this.messageCallbacks,
      (sessionUUID) => {
        this.connectionSessionUUID = sessionUUID;
        this.isAuthenticated = true;
        this.authenticationInProgress = false;
      }
    );
    this.timeoutManager = new TimeoutManager();
    this.connectionPromise = this.connect();
  }

  protected connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this.authenticationInProgress) {
          console.log("Authentication already in progress, waiting...");
          return;
        }

        console.log("Attempting to connect to WebSocket...");
        this.ws = new WebSocket(this.apiEndpoint);
        
        const connectionTimeout = setTimeout(() => {
          console.error("Connection timeout");
          this.ws?.close();
          reject(new Error("Connection timeout"));
        }, this.connectionTimeout);
        
        this.ws.onopen = () => {
          clearTimeout(connectionTimeout);
          console.log("WebSocket connection established, attempting authentication...");
          this.reconnectAttempts = 0;
          this.authenticate().then(resolve).catch(reject);
        };

        this.ws.onmessage = this.messageHandler.handleMessage.bind(this.messageHandler);
        this.ws.onerror = (error) => {
          clearTimeout(connectionTimeout);
          this.handleConnectionError(error);
          reject(error);
        };
        this.ws.onclose = () => {
          clearTimeout(connectionTimeout);
          this.handleConnectionClose();
        };
      } catch (error) {
        console.error("Error establishing connection:", error);
        this.authenticationInProgress = false;
        reject(error);
      }
    });
  }

  protected authenticate(): Promise<void> {
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

      this.timeoutManager.setOperationTimeout(taskUUID, () => {
        this.messageCallbacks.delete(taskUUID);
        reject(new Error("Operation timeout"));
        toast.error("Request timed out. Please try again.");
      }, this.operationTimeout);

      this.messageCallbacks.set(taskUUID, (data) => {
        this.timeoutManager.clearTimeout(taskUUID);
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
        this.timeoutManager.clearTimeout(taskUUID);
        this.messageCallbacks.delete(taskUUID);
        console.error("Failed to send message:", error);
        reject(new Error("Failed to send request"));
      }
    });
  }
}
