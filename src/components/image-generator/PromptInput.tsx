
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PromptInputProps {
  prompt: string;
  isGenerating: boolean;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
}

const PromptInput = ({ prompt, isGenerating, onPromptChange, onGenerate }: PromptInputProps) => {
  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Describe the image you want to generate... (e.g., 'A serene mountain landscape at sunset')"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="flex-1"
          disabled={isGenerating}
        />
        <Button 
          onClick={onGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="min-w-[120px] bg-green-300 hover:bg-green-400 text-green-800"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>
      <p className="text-sm text-gray-600 mt-1">
        {isGenerating 
          ? "Please wait while your image is being generated. This may take up to 30 seconds..." 
          : "For optimal results try to be specific, include clear details about your subject, style, and your mood!"}
      </p>
    </div>
  );
};

export default PromptInput;
