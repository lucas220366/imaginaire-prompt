
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface GeneratedImageProps {
  imageUrl: string;
  prompt: string;
}

const GeneratedImage = ({ imageUrl, prompt }: GeneratedImageProps) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download image. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="bg-white/50 backdrop-blur-lg rounded-lg p-4 shadow-lg border border-gray-100">
        <div className="relative">
          <img
            src={imageUrl}
            alt={prompt}
            className="w-full h-auto rounded-lg shadow-sm"
            loading="lazy"
          />
          <Button
            onClick={handleDownload}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white"
            size="icon"
            variant="outline"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeneratedImage;
