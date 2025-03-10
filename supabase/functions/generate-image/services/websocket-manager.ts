
export interface WebSocketManagerOptions {
  endpoint: string;
  onMessage?: (data: any) => void;
  onError?: (error: any) => void;
  onClose?: (event: CloseEvent) => void;
}

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private endpoint: string;
  private isConnected: boolean = false;
  private messageCallbacks: Map<string, (data: any) => void> = new Map();
  private connectionPromise: Promise<void> | null = null;
  private onMessageCallback?: (data: any) => void;
  private onErrorCallback?: (error: any) => void;
  private onCloseCallback?: (event: CloseEvent) => void;

  constructor(options: WebSocketManagerOptions) {
    this.endpoint = options.endpoint;
    this.onMessageCallback = options.onMessage;
    this.onErrorCallback = options.onError;
    this.onCloseCallback = options.onClose;
  }

  public connect(): Promise<void> {
    if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        console.log("Attempting WebSocket connection to:", this.endpoint);
        this.ws = new WebSocket(this.endpoint);
        
        this.ws.onopen = () => {
          console.log("WebSocket connection established");
          this.isConnected = true;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const response = JSON.parse(event.data);
            console.log("WebSocket received message type:", response.data?.[0]?.taskType);
            
            if (response.error || response.errors) {
              console.error("WebSocket error response:", response);
              const errorMessage = response.errorMessage || response.errors?.[0]?.message || "An error occurred";
              console.error("WebSocket error:", errorMessage);
              return;
            }

            if (this.onMessageCallback) {
              this.onMessageCallback(response);
            }

            if (response.data) {
              response.data.forEach((item: any) => {
                const callback = this.messageCallbacks.get(item.taskUUID);
                if (callback) {
                  console.log(`Executing callback for taskUUID: ${item.taskUUID}`);
                  callback(item);
                  this.messageCallbacks.delete(item.taskUUID);
                } else {
                  console.log(`No callback found for taskUUID: ${item.taskUUID}`);
                }
              });
            }
          } catch (error) {
            console.error("Error processing WebSocket message:", error);
          }
        };

        this.ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          this.isConnected = false;
          if (this.onErrorCallback) {
            this.onErrorCallback(error);
          }
          reject(new Error("WebSocket connection error"));
        };

        this.ws.onclose = (event) => {
          console.log(`WebSocket closed with code ${event.code} and reason: ${event.reason}`);
          this.isConnected = false;
          this.connectionPromise = null;
          if (this.onCloseCallback) {
            this.onCloseCallback(event);
          }
        };
      } catch (error) {
        console.error("Error setting up WebSocket:", error);
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  public addMessageCallback(taskUUID: string, callback: (data: any) => void): void {
    this.messageCallbacks.set(taskUUID, callback);
  }

  public removeMessageCallback(taskUUID: string): void {
    this.messageCallbacks.delete(taskUUID);
  }

  public send(message: any): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket not connected");
    }
    
    this.ws.send(JSON.stringify(message));
  }

  public isOpen(): boolean {
    return this.isConnected && this.ws?.readyState === WebSocket.OPEN;
  }
}
