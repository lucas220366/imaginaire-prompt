
import { GenerateImageParams, GeneratedImage, WebSocketMessage } from "./types";
import { WebSocketManager } from "./websocket-manager";

const API_ENDPOINT = "wss://ws-api.runware.ai/v1";

// Helper function to generate a UUID
function generateUUID() {
  // Use crypto.randomUUID if available (modern browsers)
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  
  // Fallback implementation for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export class RunwareService {
  private wsManager: WebSocketManager;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("API key not provided or is empty");
    }
    console.log("Initializing RunwareService with API endpoint:", API_ENDPOINT);
    this.wsManager = new WebSocketManager(API_ENDPOINT, apiKey);
  }

  async generateImage(params: GenerateImageParams): Promise<GeneratedImage> {
    const taskUUID = generateUUID();
    
    const message: WebSocketMessage[] = [{
      taskType: "imageInference",
      taskUUID,
      positivePrompt: params.positivePrompt,
      model: params.model || "runware:100@1",
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

    console.log("Starting image generation with params:", JSON.stringify(params, null, 2));
    console.log("Full message to send:", JSON.stringify(message, null, 2));
    
    try {
      const result = await this.wsManager.sendMessage<GeneratedImage>(message);
      console.log("Image generation successful, received result:", result);
      
      if (!result.imageURL) {
        throw new Error("No image URL returned from API");
      }
      
      return result;
    } catch (error) {
      console.error("Image generation failed:", error);
      throw error;
    }
  }
}
