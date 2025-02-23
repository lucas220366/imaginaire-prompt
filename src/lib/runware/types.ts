
export interface GenerateImageParams {
  positivePrompt: string;
  model?: string;
  numberResults?: number;
  outputFormat?: string;
  CFGScale?: number;
  scheduler?: string;
  strength?: number;
  promptWeighting?: "compel" | "sdEmbeds";
  seed?: number | null;
  lora?: string[];
  width?: number;
  height?: number;
}

export interface GeneratedImage {
  imageURL: string;
  positivePrompt: string;
  seed: number;
  NSFWContent: boolean;
}

export interface WebSocketMessage {
  taskType: string;
  taskUUID?: string;
  apiKey?: string;
  connectionSessionUUID?: string;
  [key: string]: any;
}

export interface WebSocketResponse {
  data?: any[];
  error?: string;
  errors?: { message: string }[];
  errorMessage?: string;
}
