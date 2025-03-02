
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
      throw new Error("API key not set");
    }
    this.wsManager = new WebSocketManager(API_ENDPOINT, apiKey);
  }

  async generateImage(params: GenerateImageParams): Promise<GeneratedImage> {
    const taskUUID = generateUUID();
    
    const message: WebSocketMessage[] = [{
      taskType: "imageInference",
      taskUUID,
      positivePrompt: params.positivePrompt,
      model: "runware:100@1",
      width: params.width || 1024,
      height: params.height || 1024,
      numberResults: 1,
      steps: 20,
      CFGScale: 7,
      scheduler: "DPMSolverMultistepScheduler",
      strength: 1.0,
      lora: [],
      outputFormat: params.outputFormat || "WEBP"
    }];

    console.log("Starting image generation with params:", JSON.stringify(params, null, 2));
    return this.wsManager.sendMessage<GeneratedImage>(message);
  }
}
