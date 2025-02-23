
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { ImageSettings } from "@/types/image-generator";
import ApiKeySetup from "./image-generator/ApiKeySetup";
import Header from "./image-generator/Header";
import ImageGeneratorContent from "./image-generator/ImageGeneratorContent";
import APIKeyValidator from "./image-generator/APIKeyValidator";
import ImageGenerationHandler from "./image-generator/ImageGenerationHandler";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
    try {
      console.log("Starting sign out process");
      await supabase.auth.signOut();
      console.log("Sign out successful, navigating to auth page");
      toast.success("Signed out successfully");
      window.location.href = '/auth';
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  const handleGenerate = async () => {
    await ImageGenerationHandler({
      apiKey,
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
      <APIKeyValidator 
        apiKey={apiKey}
        onInvalidKey={() => {
          setApiKey("");
          setIsApiKeySet(false);
        }}
      />

      {!isApiKeySet ? (
        <ApiKeySetup
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
          onApiKeySubmit={async () => {
            localStorage.setItem('runwareApiKey', apiKey);
            setIsApiKeySet(true);
          }}
        />
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
