
import { RunwareService } from '@/lib/runware';
import { toast } from "sonner";

interface RunwayVideoResponse {
  videoUrl: string;
}

const generateVideoWithRunway = async (prompt: string, apiKey: string): Promise<RunwayVideoResponse> => {
  const response = await fetch('https://api.runwayml.com/v1/inference', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      prompt,
      model: 'gen2-videoGen',
      parameters: {
        duration_in_frames: 30,
        frame_rate: 12,
        guidance_scale: 17.5,
        height: 576,
        width: 1024,
        negative_prompt: ''
      },
    }),
  });

  const result = await response.json();
  console.log('RunwayML API Response:', result); // Debug log

  if (!response.ok) {
    throw new Error(result.error || 'Failed to generate video');
  }

  if (!result.output?.video) {
    throw new Error('No video URL in response');
  }

  return { videoUrl: result.output.video };
};

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

    try {
      const result = await generateVideoWithRunway(prompt, runwayApiKey);
      if (!result.videoUrl) {
        throw new Error('Invalid video URL received from RunwayML');
      }
      return { imageURL: null, videoURL: result.videoUrl };
    } catch (error) {
      console.error('RunwayML error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate video');
      return null;
    }
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
