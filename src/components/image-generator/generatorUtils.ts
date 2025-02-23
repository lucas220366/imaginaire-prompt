
import { RunwareService } from '@/lib/runware';
import { toast } from "sonner";

export const generateContent = async (
  prompt: string,
  activeTab: "image" | "video",
  runwareApiKey: string,
  runwayApiKey: string
) => {
  if (!prompt.trim()) {
    toast.error("Please enter a prompt");
    return null;
  }

  if (activeTab === "image") {
    const runware = new RunwareService(runwareApiKey);
    const result = await runware.generateImage({ positivePrompt: prompt });
    return { imageURL: result.imageURL, videoURL: null };
  } else {
    if (!runwayApiKey) {
      toast.error("Please set your RunwayML API key first");
      return null;
    }
    // Video generation will be implemented here
    toast.info("Video generation with RunwayML coming soon!");
    return null;
  }
};

export const downloadContent = async (
  url: string | null,
  type: "image" | "video"
) => {
  if (!url) return;
  
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `generated-${type}-${Date.now()}.${type === "image" ? "png" : "mp4"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
    toast.success(`${type === "image" ? "Image" : "Video"} downloaded successfully!`);
  } catch (error) {
    toast.error("Failed to download. Please try again.");
    console.error(error);
  }
};
