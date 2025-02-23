
import React, { useState } from 'react';
import { toast } from "sonner";
import { RunwareService } from '@/lib/runware';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { ImageSettings } from "@/types/image-generator";
import { getImageDimensions } from "@/utils/image-utils";
import ApiKeySetup from "./image-generator/ApiKeySetup";
import ImageSettingsControl from "./image-generator/ImageSettings";
import GeneratedImage from "./image-generator/GeneratedImage";
import Header from "./image-generator/Header";
import Title from "./image-generator/Title";
import PromptInput from "./image-generator/PromptInput";
import SampleImages from "./image-generator/SampleImages";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('runwareApiKey') || "");
  const [isApiKeySet, setIsApiKeySet] = useState(() => Boolean(localStorage.getItem('runwareApiKey')));
  const navigate = useNavigate();
  const { session } = useAuth();
  const [settings, setSettings] = useState<ImageSettings>({
    size: "1024x1024",
    format: "PNG",
    aspectRatio: "square"
  });

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
      const dimensions = getImageDimensions(settings.size, settings.aspectRatio);
      const runware = new RunwareService(apiKey);
      const result = await runware.generateImage({ 
        positivePrompt: prompt,
        outputFormat: settings.format,
        ...dimensions
      });
      console.log('Generation result:', result);
      setImage(result.imageURL);
      
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

  const handleApiKeySubmit = () => {
    localStorage.setItem('runwareApiKey', apiKey);
    setIsApiKeySet(true);
    toast.success("API key set successfully!");
  };

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      <Header onSignOut={handleSignOut} />

      {!isApiKeySet ? (
        <ApiKeySetup
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
          onApiKeySubmit={handleApiKeySubmit}
        />
      ) : (
        <div className="max-w-6xl mx-auto space-y-8 pt-16">
          <Title />

          <div className="bg-white/50 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-gray-100">
            <ImageSettingsControl
              settings={settings}
              onSettingsChange={setSettings}
            />
            <PromptInput
              prompt={prompt}
              isGenerating={isGenerating}
              onPromptChange={setPrompt}
              onGenerate={handleGenerate}
            />
          </div>

          {image && (
            <GeneratedImage
              imageUrl={image}
              prompt={prompt}
            />
          )}

          <SampleImages />
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
