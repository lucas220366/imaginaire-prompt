
import { toast } from "sonner";

export abstract class BaseWebSocketService {
  protected ws: WebSocket | null = null;
  protected connectionPromise: Promise<void> | null = null;
  protected isAuthenticated: boolean = false;
  protected connectionSessionUUID: string | null = null;
  protected reconnectAttempts: number = 0;
  protected readonly maxReconnectAttempts: number = 3;
  protected readonly connectionTimeout: number = 30000;

  constructor(
    protected readonly apiEndpoint: string,
    protected readonly apiKey: string
  ) {
    if (!apiKey) {
      throw new Error("API key is required");
    }
  }

  protected handleConnectionError(error: any): void {
    console.error("WebSocket error:", error);
    toast.error("Connection error occurred. Please try again.");
    this.isAuthenticated = false;
  }

  protected handleConnectionClose(): void {
    console.log("WebSocket connection closed");
    this.isAuthenticated = false;
    
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
  }

  protected abstract connect(): Promise<void>;
  protected abstract authenticate(): Promise<void>;
}
