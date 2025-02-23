
export interface ImageSettings {
  size: "512x512" | "1024x1024" | "1536x1536";
  format: "PNG" | "JPEG";
  aspectRatio: "square" | "portrait" | "landscape";
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}
