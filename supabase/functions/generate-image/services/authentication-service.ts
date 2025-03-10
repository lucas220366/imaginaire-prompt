
import { WebSocketManager } from "./websocket-manager.ts";

export class AuthenticationService {
  private webSocketManager: WebSocketManager;
  private apiKey: string;
  
  constructor(webSocketManager: WebSocketManager, apiKey: string) {
    if (!apiKey) {
      throw new Error("API key not provided or is empty");
    }
    
    this.webSocketManager = webSocketManager;
    this.apiKey = apiKey;
  }
  
  public authenticate(): Promise<void> {
    if (!this.webSocketManager.isOpen()) {
      return Promise.reject(new Error("WebSocket not ready for authentication"));
    }
    
    const authMessage = [{
      taskType: "authentication",
      apiKey: this.apiKey
    }];
    
    console.log("Sending authentication message");
    
    return new Promise((resolve, reject) => {
      // Set up a one-time listener for the authentication response
      const handleAuthResponse = (event: MessageEvent) => {
        try {
          const response = JSON.parse(event.data);
          console.log("Authentication response received:", response.data?.[0]?.taskType);
          
          if (response.data?.[0]?.taskType === "authentication") {
            console.log("Authentication successful");
            resolve();
          } else if (response.error || response.errors) {
            const error = response.errorMessage || response.errors?.[0]?.message || "Authentication failed";
            console.error("Authentication error:", error);
            reject(new Error(error));
          }
        } catch (error) {
          console.error("Error parsing authentication response:", error);
          reject(error);
        }
      };
      
      // Try to send the authentication message
      try {
        this.webSocketManager.send(authMessage);
        
        // Temporarily add an event listener for authentication response
        this.webSocketManager.addWebSocketEventListener("message", handleAuthResponse);
        
        // Set a timeout for authentication
        setTimeout(() => {
          this.webSocketManager.removeWebSocketEventListener("message", handleAuthResponse);
          reject(new Error("Authentication timed out"));
        }, 10000);
      } catch (error) {
        reject(error);
      }
    });
  }
}
