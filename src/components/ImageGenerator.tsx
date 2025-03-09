
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { ImageSettings } from "@/types/image-generator";
import Header from "./image-generator/Header";
import ImageGeneratorContent from "./image-generator/ImageGeneratorContent";
import ImageGenerationHandler from "./image-generator/ImageGenerationHandler";
import { toast } from "sonner";
import { RunwareService } from '@/lib/runware';

// Default API key for development/testing environments
const DEFAULT_API_KEY = process.env.RUNWARE_API_KEY || "runware_demo_key";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
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

  const handleGenerate = async () => {
    await ImageGenerationHandler({
      apiKey: DEFAULT_API_KEY,
      prompt,
      settings,
      session,
      onSuccess: setImage,
      onError: () => {},
      onStartGenerating: () => setIsGenerating(true),
      onFinishGenerating: () => setIsGenerating(false)
    });
  };

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      <Header onSignOut={handleSignOut} />
      
      <ImageGeneratorContent
        settings={settings}
        onSettingsChange={setSettings}
        prompt={prompt}
        isGenerating={isGenerating}
        onPromptChange={setPrompt}
        onGenerate={handleGenerate}
        generatedImage={image}
      />
    </div>
  );
};

export default ImageGenerator;
