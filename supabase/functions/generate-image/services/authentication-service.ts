
import { WebSocketManager } from "./websocket-manager.ts";

export class AuthenticationService {
  private webSocketManager: WebSocketManager;
  private apiKey: string;
  private isAuthenticating: boolean = false;
  private authPromise: Promise<void> | null = null;
  
  constructor(webSocketManager: WebSocketManager, apiKey: string) {
    if (!apiKey) {
      throw new Error("API key not provided or is empty");
    }
    
    console.log(`API key received: ${apiKey.slice(0, 3)}...${apiKey.slice(-3)} (length: ${apiKey.length})`);
    
    this.webSocketManager = webSocketManager;
    this.apiKey = apiKey;
  }
  
  public authenticate(): Promise<void> {
    // If we're already in the process of authenticating, return the existing promise
    if (this.isAuthenticating && this.authPromise) {
      console.log("Authentication already in progress, reusing existing promise");
      return this.authPromise;
    }
    
    if (!this.webSocketManager.isOpen()) {
      return Promise.reject(new Error("WebSocket not ready for authentication"));
    }
    
    const authMessage = [{
      taskType: "authentication",
      apiKey: this.apiKey
    }];
    
    console.log("Sending authentication message with API key");
    
    this.isAuthenticating = true;
    
    this.authPromise = new Promise((resolve, reject) => {
      // Set up a one-time listener for the authentication response
      const handleAuthResponse = (event: MessageEvent) => {
        try {
          const response = JSON.parse(event.data);
          console.log("Authentication response received:", response);
          
          if (response.data?.[0]?.taskType === "authentication") {
            console.log("Authentication successful");
            this.webSocketManager.removeWebSocketEventListener("message", handleAuthResponse);
            this.isAuthenticating = false;
            resolve();
          } else if (response.error || response.errors) {
            const errorDetails = response.errors?.[0] || {};
            const errorMessage = errorDetails.message || response.errorMessage || "Authentication failed";
            console.error("Authentication error details:", errorDetails);
            console.error("Authentication error message:", errorMessage);
            console.error("API key validation failed. Please verify your Runware API key is correct.");
            
            if (errorDetails.connectionDetails) {
              console.log("Connection details:", JSON.stringify(errorDetails.connectionDetails));
            }
            
            this.webSocketManager.removeWebSocketEventListener("message", handleAuthResponse);
            this.isAuthenticating = false;
            
            // Create a more descriptive error message for API key issues
            if (errorDetails.code === "invalidApiKey") {
              reject(new Error("Invalid Runware API key. Please check your RUNWARE_API_KEY in Supabase secrets."));
            } else {
              reject(new Error(errorMessage));
            }
          }
        } catch (error) {
          console.error("Error parsing authentication response:", error);
          this.webSocketManager.removeWebSocketEventListener("message", handleAuthResponse);
          this.isAuthenticating = false;
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
          if (this.isAuthenticating) {
            this.webSocketManager.removeWebSocketEventListener("message", handleAuthResponse);
            this.isAuthenticating = false;
            reject(new Error("Authentication timed out"));
          }
        }, 10000);
      } catch (error) {
        this.isAuthenticating = false;
        reject(error);
      }
    });
    
    return this.authPromise;
  }
}
