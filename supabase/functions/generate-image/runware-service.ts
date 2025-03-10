
// Simplified version of the RunwareService for edge function use
export interface GenerateImageParams {
  positivePrompt: string;
  outputFormat?: string;
  width?: number;
  height?: number;
  numberResults?: number;
  steps?: number;
  CFGScale?: number;
  scheduler?: string;
  strength?: number;
  lora?: string[];
}

export interface GeneratedImage {
  imageURL: string;
  positivePrompt?: string;
  seed?: number;
  NSFWContent?: boolean;
}

export class RunwareService {
  private ws: WebSocket | null = null;
  private apiKey: string;
  private endpoint: string = "wss://ws-api.runware.ai/v1";
  private isConnected: boolean = false;
  private messageCallbacks: Map<string, (data: any) => void> = new Map();
  private connectionPromise: Promise<void> | null = null;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("API key not provided or is empty");
    }
    console.log("Initializing RunwareService with valid API key");
    this.apiKey = apiKey;
    this.connectionPromise = this.connect();
  }

  private connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log("Attempting WebSocket connection to:", this.endpoint);
        this.ws = new WebSocket(this.endpoint);
        
        this.ws.onopen = () => {
          console.log("WebSocket connection established");
          this.isConnected = true;
          this.authenticate().then(resolve).catch(reject);
        };

        this.ws.onmessage = (event) => {
          try {
            const response = JSON.parse(event.data);
            console.log("WebSocket received message type:", response.data?.[0]?.taskType);
            
            if (response.error || response.errors) {
              console.error("WebSocket error response:", response);
              const errorMessage = response.errorMessage || response.errors?.[0]?.message || "An error occurred";
              // Don't reject here, just log the error and let the callback handle it
              console.error("WebSocket error:", errorMessage);
              return;
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
            // Don't reject here, just log the error
          }
        };

        this.ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          this.isConnected = false;
          reject(new Error("WebSocket connection error"));
        };

        this.ws.onclose = (event) => {
          console.log(`WebSocket closed with code ${event.code} and reason: ${event.reason}`);
          this.isConnected = false;
          this.connectionPromise = null;
        };
      } catch (error) {
        console.error("Error setting up WebSocket:", error);
        reject(error);
      }
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
    
    return new Promise((resolve, reject) => {
      // Set up a one-time listener for the authentication response
      const onMessage = (event: MessageEvent) => {
        try {
          const response = JSON.parse(event.data);
          console.log("Authentication response received:", response.data?.[0]?.taskType);
          
          if (response.data?.[0]?.taskType === "authentication") {
            this.ws?.removeEventListener("message", onMessage);
            console.log("Authentication successful");
            resolve();
          } else if (response.error || response.errors) {
            this.ws?.removeEventListener("message", onMessage);
            const error = response.errorMessage || response.errors?.[0]?.message || "Authentication failed";
            console.error("Authentication error:", error);
            reject(new Error(error));
          }
        } catch (error) {
          this.ws?.removeEventListener("message", onMessage);
          console.error("Error parsing authentication response:", error);
          reject(error);
        }
      };
      
      this.ws.addEventListener("message", onMessage);
      
      // Set a timeout for authentication
      setTimeout(() => {
        this.ws?.removeEventListener("message", onMessage);
        reject(new Error("Authentication timed out"));
      }, 10000);
    });
  }

  // Generate UUID function 
  private generateUUID(): string {
    return crypto.randomUUID();
  }

  async generateImage(params: GenerateImageParams): Promise<GeneratedImage> {
    console.log("Preparing to send message with params:", params);
    
    // Wait for connection before proceeding
    if (!this.isConnected && this.connectionPromise) {
      console.log("Waiting for connection to establish...");
      try {
        await this.connectionPromise;
        console.log("Connection established successfully");
      } catch (error) {
        console.error("Connection failed:", error);
        throw new Error(`Failed to establish WebSocket connection: ${error.message}`);
      }
    } else if (!this.isConnected) {
      console.log("No active connection, creating new connection...");
      this.connectionPromise = this.connect();
      try {
        await this.connectionPromise;
        console.log("New connection established successfully");
      } catch (error) {
        console.error("Failed to create new connection:", error);
        throw new Error(`Failed to establish WebSocket connection: ${error.message}`);
      }
    }

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket not connected");
    }

    return new Promise((resolve, reject) => {
      const taskUUID = this.generateUUID();
      
      const message = [{
        taskType: "imageInference",
        taskUUID,
        positivePrompt: params.positivePrompt,
        model: "runware:100@1",
        width: params.width || 1024,
        height: params.height || 1024,
        numberResults: params.numberResults || 1,
        steps: params.steps || 20,
        CFGScale: params.CFGScale || 7,
        scheduler: params.scheduler || "DPMSolverMultistepScheduler",
        strength: params.strength || 1.0,
        lora: params.lora || [],
        outputFormat: params.outputFormat || "WEBP"
      }];
      
      console.log(`Setting up callback for taskUUID: ${taskUUID}`);
      this.messageCallbacks.set(taskUUID, (data) => {
        console.log(`Received callback data for taskUUID ${taskUUID}:`, data);
        if (data.error) {
          reject(new Error(data.errorMessage || "Error generating image"));
        } else if (!data.imageURL) {
          reject(new Error("No image URL in response"));
        } else {
          resolve(data as GeneratedImage);
        }
      });

      // Set a timeout to prevent hanging promises
      const timeoutId = setTimeout(() => {
        console.log(`Request timed out for taskUUID: ${taskUUID}`);
        this.messageCallbacks.delete(taskUUID);
        reject(new Error("Request timed out"));
      }, 120000); // 2 minute timeout

      try {
        console.log(`Sending message for taskUUID: ${taskUUID}`);
        this.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error(`Error sending message for taskUUID ${taskUUID}:`, error);
        clearTimeout(timeoutId);
        this.messageCallbacks.delete(taskUUID);
        reject(error);
      }
    });
  }
}
