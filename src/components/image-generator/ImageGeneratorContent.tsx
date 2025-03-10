
import React from 'react';
import { ImageSettings } from "@/types/image-generator";
import ImageSettingsControl from "./ImageSettings";
import Title from "./Title";
import PromptInput from "./PromptInput";
import GeneratedImage from "./GeneratedImage";

interface ImageGeneratorContentProps {
  settings: ImageSettings;
  onSettingsChange: (settings: ImageSettings) => void;
  prompt: string;
  isGenerating: boolean;
  onPromptChange: (prompt: string) => void;
  onGenerate: () => void;
  generatedImage: string | null;
}

const ImageGeneratorContent = ({
  settings,
  onSettingsChange,
  prompt,
  isGenerating,
  onPromptChange,
  onGenerate,
  generatedImage
}: ImageGeneratorContentProps) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Title />

      <div className="bg-white/50 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-gray-100">
        <ImageSettingsControl
          settings={settings}
          onSettingsChange={onSettingsChange}
        />
        <PromptInput
          prompt={prompt}
          isGenerating={isGenerating}
          onPromptChange={onPromptChange}
          onGenerate={onGenerate}
        />
      </div>

      {generatedImage && (
        <div className="mt-8">
          <GeneratedImage
            imageUrl={generatedImage}
            prompt={prompt}
          />
        </div>
      )}
    </div>
  );
};

export default ImageGeneratorContent;
