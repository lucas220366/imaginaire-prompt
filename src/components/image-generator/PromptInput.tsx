
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
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          placeholder="Describe the image you want to generate... (e.g., 'A serene mountain landscape at sunset')"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={onGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="min-w-[120px] bg-green-300 hover:bg-green-400 text-green-800"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        For optimal results try to be specific, include clear details about your subject, style, and your mood!
      </p>
    </div>
  );
};

export default PromptInput;
