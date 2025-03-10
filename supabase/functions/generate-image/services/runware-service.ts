
import { WebSocketManager } from "./websocket-manager.ts";
import { AuthenticationService } from "./authentication-service.ts";
import { ImageService, GenerateImageParams, GeneratedImage } from "./image-service.ts";

export class RunwareService {
  private webSocketManager: WebSocketManager;
  private authService: AuthenticationService;
  private imageService: ImageService;
  private connectionPromise: Promise<void> | null = null;
  private isAuthenticated: boolean = false;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("API key not provided or is empty");
    }
    console.log("Initializing RunwareService with valid API key");
    
    this.webSocketManager = new WebSocketManager({
      endpoint: "wss://ws-api.runware.ai/v1"
    });
    
    this.authService = new AuthenticationService(this.webSocketManager, apiKey);
    this.imageService = new ImageService(this.webSocketManager);
    this.connectionPromise = this.connect();
  }

  private async connect(): Promise<void> {
    try {
      await this.webSocketManager.connect();
      await this.authService.authenticate();
      this.isAuthenticated = true;
    } catch (error) {
      console.error("Connection or authentication failed:", error);
      this.isAuthenticated = false;
      throw error;
    }
  }

  async generateImage(params: GenerateImageParams): Promise<GeneratedImage> {
    console.log("Preparing to generate image with params:", params);
    
    // Wait for connection before proceeding
    if (!this.isAuthenticated && this.connectionPromise) {
      console.log("Waiting for connection and authentication to establish...");
      try {
        await this.connectionPromise;
        console.log("Connection and authentication established successfully");
      } catch (error) {
        console.error("Connection or authentication failed:", error);
        // Try to reconnect
        this.connectionPromise = this.connect();
        try {
          await this.connectionPromise;
          console.log("Reconnection successful");
        } catch (reconnectError) {
          throw new Error(`Failed to establish connection: ${reconnectError.message}`);
        }
      }
    } else if (!this.isAuthenticated) {
      console.log("No active connection, creating new connection...");
      this.connectionPromise = this.connect();
      try {
        await this.connectionPromise;
        console.log("New connection established successfully");
      } catch (error) {
        console.error("Failed to create new connection:", error);
        throw new Error(`Failed to establish connection: ${error.message}`);
      }
    }

    // Now generate the image
    return this.imageService.generateImage(params);
  }
}

// Re-export types from image-service.ts for consumers of this module
export type { GenerateImageParams, GeneratedImage };
