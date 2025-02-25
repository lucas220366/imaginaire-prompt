
import { WebSocketResponse } from "../types";
import { toast } from "sonner";

export class MessageHandler {
  constructor(
    private messageCallbacks: Map<string, (data: any) => void>,
    private onAuthenticationSuccess: (sessionUUID: string) => void
  ) {}

  handleMessage(event: MessageEvent): void {
    try {
      console.log("Raw WebSocket message received:", event.data);
      const response: WebSocketResponse = JSON.parse(event.data);
      
      if (response.error || response.errors) {
        this.handleError(response);
        return;
      }

      if (response.data) {
        this.handleData(response.data);
      }
    } catch (error) {
      console.error("Error handling WebSocket message:", error);
      toast.error("Error processing server response");
    }
  }

  private handleError(response: WebSocketResponse): void {
    console.error("WebSocket error response:", response);
    const errorMessage = response.errorMessage || response.errors?.[0]?.message || "An error occurred";
    toast.error(errorMessage);
    this.messageCallbacks.forEach((callback) => callback({ error: errorMessage }));
    this.messageCallbacks.clear();
  }

  private handleData(data: any[]): void {
    data.forEach((item: any) => {
      if (item.taskType === "authentication") {
        console.log("Authentication successful, session UUID:", item.connectionSessionUUID);
        this.onAuthenticationSuccess(item.connectionSessionUUID);
      } else if (item.taskType === "imageInference") {
        this.handleImageInference(item);
      }
    });
  }

  private handleImageInference(item: any): void {
    console.log("Image inference response:", item);
    const callback = this.messageCallbacks.get(item.taskUUID);
    if (callback) {
      if (item.imageURL) {
        callback(item);
      } else if (item.error) {
        callback({ error: item.error });
      }
      this.messageCallbacks.delete(item.taskUUID);
    }
  }
}
