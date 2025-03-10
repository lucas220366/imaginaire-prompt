
import { WebSocketManager } from "./websocket-manager.ts";

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

export class ImageService {
  private webSocketManager: WebSocketManager;
  
  constructor(webSocketManager: WebSocketManager) {
    this.webSocketManager = webSocketManager;
  }
  
  public generateImage(params: GenerateImageParams): Promise<GeneratedImage> {
    console.log("Preparing to send image generation request with params:", params);
    
    if (!this.webSocketManager.isOpen()) {
      return Promise.reject(new Error("WebSocket not connected"));
    }
    
    return new Promise((resolve, reject) => {
      const taskUUID = crypto.randomUUID();
      
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
      
      // Add a callback for this task
      this.webSocketManager.addMessageCallback(taskUUID, (data) => {
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
        this.webSocketManager.removeMessageCallback(taskUUID);
        reject(new Error("Request timed out"));
      }, 120000); // 2 minute timeout
      
      try {
        console.log(`Sending message for taskUUID: ${taskUUID}`);
        this.webSocketManager.send(message);
      } catch (error) {
        console.error(`Error sending message for taskUUID ${taskUUID}:`, error);
        clearTimeout(timeoutId);
        this.webSocketManager.removeMessageCallback(taskUUID);
        reject(error);
      }
    });
  }
}
