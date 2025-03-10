
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { ImageSettings } from "@/types/image-generator";
import Header from "./image-generator/Header";
import ImageGeneratorContent from "./image-generator/ImageGeneratorContent";
import ImageGenerationHandler from "./image-generator/ImageGenerationHandler";
import { toast } from "sonner";

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
    
    console.log("Starting image generation process");
    await ImageGenerationHandler({
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

  return (
    <div className="min-h-screen flex flex-col bg-background animate-fade-in">
      <Header onSignOut={handleSignOut} />
      
      <main className="flex-grow p-6">
        <ImageGeneratorContent
          settings={settings}
          onSettingsChange={setSettings}
          prompt={prompt}
          isGenerating={isGenerating}
          onPromptChange={setPrompt}
          onGenerate={handleGenerate}
          generatedImage={image}
        />
      </main>
    </div>
  );
};

export default ImageGenerator;
