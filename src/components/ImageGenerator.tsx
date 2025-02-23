
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Download, LogOut, User, Camera, Rocket } from "lucide-react";
import { toast } from "sonner";
import { RunwareService } from '@/lib/runware';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('runwareApiKey') || "");
  const [isApiKeySet, setIsApiKeySet] = useState(() => Boolean(localStorage.getItem('runwareApiKey')));
  const navigate = useNavigate();
  const { session } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

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
      
      // Save the generated image to the user's account
      if (session?.user) {
        const { error } = await supabase
          .from('generated_images')
          .insert({
            user_id: session.user.id,
            prompt: prompt,
            image_url: result.imageURL
          });
        
        if (error) throw error;
      }
      
      toast.success("Image generated successfully!");
    } catch (error) {
      toast.error("Failed to generate image. Please try again.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!image) return;
    
    try {
      const response = await fetch(image);
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
    <div className="min-h-screen p-6 animate-fade-in">
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          onClick={() => navigate("/profile")}
          variant="outline"
        >
          <User className="mr-2 h-4 w-4" />
          Profile
        </Button>
        <Button
          onClick={handleSignOut}
          variant="outline"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>

      {!isApiKeySet ? (
        <div className="flex items-center justify-center min-h-screen">
          <form onSubmit={handleApiKeySubmit} className="w-full max-w-md space-y-6">
            <div className="bg-white/50 backdrop-blur-lg rounded-lg p-8 shadow-lg border border-gray-100">
              <div className="flex justify-center mb-6">
                <Camera className="h-12 w-12 text-blue-500" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-center text-gray-800">Welcome to AI Image Generator</h2>
              <p className="text-gray-600 mb-6 text-center">Let's get you set up with your Runware API key</p>
              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="Enter your Runware API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full"
                />
                <Button type="submit" className="w-full">
                  Start Generating Images
                </Button>
              </div>
              <p className="mt-4 text-sm text-gray-600 text-center">
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
        </div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-8 pt-16">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Rocket className="h-12 w-12 text-blue-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">AI Image Generator</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Transform your ideas into stunning images using AI. Just describe what you want to see, and watch the magic happen!
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-gray-100">
            <div className="flex gap-2">
              <Input
                placeholder="Describe the image you want to generate... (e.g., 'A serene mountain landscape at sunset')"
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

          {image && (
            <div className="animate-fade-up">
              <div className="bg-white/50 backdrop-blur-lg rounded-lg p-4 shadow-lg border border-gray-100">
                <div className="relative">
                  <img
                    src={image}
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
          )}
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
