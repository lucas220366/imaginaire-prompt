
import { GenerateImageParams, GeneratedImage, WebSocketMessage } from "./types";
import { WebSocketManager } from "./websocket-manager";

const API_ENDPOINT = "wss://ws-api.runware.ai/v1";

export class RunwareService {
  private wsManager: WebSocketManager;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("API key not set");
    }
    this.wsManager = new WebSocketManager(API_ENDPOINT, apiKey);
  }

  async generateImage(params: GenerateImageParams): Promise<GeneratedImage> {
    const taskUUID = crypto.randomUUID();
    
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
    
    try {
      const result = await this.wsManager.sendMessage<GeneratedImage>(message);
      if (!result) {
        throw new Error("No result received from WebSocket");
      }
      return result;
    } catch (error) {
      console.error("Error in generateImage:", error);
      throw error;
    }
  }
}
