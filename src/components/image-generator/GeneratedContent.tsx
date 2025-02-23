
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface GeneratedContentProps {
  image: string | null;
  video: string | null;
  prompt: string;
  onDownload: () => void;
}

const GeneratedContent = ({ image, video, prompt, onDownload }: GeneratedContentProps) => {
  if (!image && !video) return null;

  return (
    <div className="w-full max-w-3xl animate-fade-up">
      <div className="bg-white/50 backdrop-blur-lg rounded-lg p-4 shadow-lg border border-gray-100">
        <div className="relative">
          {image && (
            <img
              src={image}
              alt={prompt}
              className="w-full h-auto rounded-lg shadow-sm"
              loading="lazy"
            />
          )}
          {video && (
            <video
              src={video}
              controls
              autoPlay
              playsInline
              loop
              className="w-full h-auto rounded-lg shadow-sm"
            >
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          <Button
            onClick={onDownload}
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

export default GeneratedContent;
