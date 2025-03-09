
export interface ImageSettings {
  size: "512x512" | "1024x1024" | "1536x1536" | "2048x2048" | "custom";
  format: "PNG";
  aspectRatio: "square" | "portrait" | "landscape";
  customWidth?: number;
  customHeight?: number;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}
