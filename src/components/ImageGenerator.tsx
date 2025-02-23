
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { RunwareService } from '@/lib/runware';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('runwareApiKey') || "");
  const [isApiKeySet, setIsApiKeySet] = useState(() => Boolean(localStorage.getItem('runwareApiKey')));

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    try {
      const runware = new RunwareService(apiKey);
      const result = await runware.generateImage({ positivePrompt: prompt });
      setImage(result.imageURL);
      toast.success("Image generated successfully!");
    } catch (error) {
      toast.error("Failed to generate image. Please try again.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error("Please enter your Runware API key");
      return;
    }
    localStorage.setItem('runwareApiKey', apiKey);
    setIsApiKeySet(true);
    toast.success("API key set successfully!");
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center gap-8 animate-fade-in">
      {!isApiKeySet ? (
        <form onSubmit={handleApiKeySubmit} className="w-full max-w-md space-y-4">
          <div className="bg-white/50 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Enter your Runware API key</h2>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full"
              />
              <Button type="submit" className="w-full">
                Set API Key
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Get your API key from{" "}
              <a
                href="https://runware.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 underline"
              >
                Runware.ai
              </a>
            </p>
          </div>
        </form>
      ) : (
        <>
          <div className="w-full max-w-3xl space-y-4">
            <div className="bg-white/50 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-gray-100">
              <h1 className="text-2xl font-semibold mb-6 text-gray-800">Generate Images</h1>
              <div className="flex gap-2">
                <Input
                  placeholder="Describe the image you want to generate..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="min-w-[120px]"
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
            </div>
          </div>

          {image && (
            <div className="w-full max-w-3xl animate-fade-up">
              <div className="bg-white/50 backdrop-blur-lg rounded-lg p-4 shadow-lg border border-gray-100">
                <img
                  src={image}
                  alt={prompt}
                  className="w-full h-auto rounded-lg shadow-sm"
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImageGenerator;
