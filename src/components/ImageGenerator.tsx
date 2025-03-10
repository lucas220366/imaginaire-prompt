import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { ImageSettings } from "@/types/image-generator";
import Header from "./image-generator/Header";
import ImageGeneratorContent from "./image-generator/ImageGeneratorContent";
import ImageGenerationHandler from "./image-generator/ImageGenerationHandler";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

// Default API key - will be replaced by user input
const DEFAULT_API_KEY = process.env.RUNWARE_API_KEY || "";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState(DEFAULT_API_KEY);
  const [apiKeyEntered, setApiKeyEntered] = useState(!!DEFAULT_API_KEY);
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const [settings, setSettings] = useState<ImageSettings>({
    size: "1024x1024",
    format: "PNG",
    aspectRatio: "square"
  });

  const handleSignOut = async () => {
    try {
      console.log("Starting sign out process");
      await signOut();
      console.log("Sign out successful");
      toast.success("Signed out successfully");
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error("Please enter your Runware API key");
      return;
    }
    
    console.log("API key entered, length:", apiKey.length);
    setApiKeyEntered(true);
    localStorage.setItem("runware_api_key", apiKey);
    toast.success("API key saved");
  };

  const handleGenerate = async () => {
    console.log("Generate button clicked");
    
    if (isGenerating) {
      console.log("Already generating an image, ignoring request");
      toast.info("Already generating an image. Please wait.");
      return;
    }
    
    if (!prompt.trim()) {
      console.log("Empty prompt, showing error");
      toast.error("Please enter a prompt");
      return;
    }
    
    if (!session?.user?.id) {
      console.log("User not logged in, showing error");
      toast.error("Please log in to generate images");
      return;
    }

    if (!apiKey) {
      console.log("No API key, showing error");
      toast.error("Please enter your Runware API key");
      setApiKeyEntered(false);
      return;
    }
    
    console.log("Starting image generation process");
    await ImageGenerationHandler({
      apiKey,
      prompt,
      settings,
      session,
      onSuccess: (imageUrl) => {
        console.log("Image generation successful, setting image URL:", imageUrl);
        setImage(imageUrl);
      },
      onError: () => {
        console.log("Image generation failed");
      },
      onStartGenerating: () => {
        console.log("Setting generating state to true");
        setIsGenerating(true);
      },
      onFinishGenerating: () => {
        console.log("Setting generating state to false");
        setIsGenerating(false);
      }
    });
  };

  // Check if there's a saved API key in localStorage
  React.useEffect(() => {
    const savedApiKey = localStorage.getItem("runware_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setApiKeyEntered(true);
    }
  }, []);

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      <Header onSignOut={handleSignOut} />
      
      {!apiKeyEntered ? (
        <div className="max-w-lg mx-auto mt-20 bg-white/50 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Enter Runware API Key</h2>
          <p className="text-sm text-gray-600 mb-4">
            To generate images, you need to provide your Runware API key.
            Get your API key at{" "}
            <a 
              href="https://runware.ai/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              runware.ai
            </a>
          </p>
          <form onSubmit={handleApiKeySubmit} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Runware API key"
                className="flex-1"
              />
              <Button type="submit" className="bg-green-300 hover:bg-green-400 text-green-800">
                <Lock className="mr-2 h-4 w-4" />
                Save Key
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Your API key will be stored only in your browser's local storage and is never sent to our servers.
            </p>
          </form>
        </div>
      ) : (
        <ImageGeneratorContent
          settings={settings}
          onSettingsChange={setSettings}
          prompt={prompt}
          isGenerating={isGenerating}
          onPromptChange={setPrompt}
          onGenerate={handleGenerate}
          generatedImage={image}
        />
      )}
    </div>
  );
};

export default ImageGenerator;
