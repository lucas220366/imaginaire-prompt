
import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    // Validate stored API key on mount
    const validateStoredApiKey = async () => {
      const storedApiKey = localStorage.getItem('runwareApiKey');
      if (storedApiKey) {
        try {
          const ws = new WebSocket('wss://ws-api.runware.ai/v1');
          
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              ws.close();
              reject(new Error('Connection timeout'));
            }, 5000);

            ws.onopen = () => {
              ws.send(JSON.stringify([{
                taskType: "authentication",
                apiKey: storedApiKey
              }]));
            };

            ws.onmessage = (event) => {
              const response = JSON.parse(event.data);
              if (response.error || response.errors) {
                reject(new Error('Invalid API key'));
              } else if (response.data?.[0]?.taskType === "authentication") {
                clearTimeout(timeout);
                resolve(true);
              }
            };

            ws.onerror = () => {
              clearTimeout(timeout);
              reject(new Error('Connection failed'));
            };
          });
        } catch (error) {
          console.error('API key validation error:', error);
          localStorage.removeItem('runwareApiKey');
          setApiKey("");
          setIsApiKeySet(false);
          toast.error("Invalid API key. Please enter a valid key.");
        }
      }
    };

    validateStoredApiKey();
  }, []);

  const handleSignOut = async () => {
    try {
      console.log("Starting sign out process");
      await supabase.auth.signOut();
      console.log("Sign out successful, navigating to auth page");
      toast.success("Signed out successfully");
      // Force page reload to clear any cached states
      window.location.href = '/auth';
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
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

  const handleApiKeySubmit = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter your Runware API key");
      return;
    }

    try {
      const ws = new WebSocket('wss://ws-api.runware.ai/v1');
      
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          ws.close();
          reject(new Error('Connection timeout'));
        }, 5000);

        ws.onopen = () => {
          ws.send(JSON.stringify([{
            taskType: "authentication",
            apiKey: apiKey
          }]));
        };

        ws.onmessage = (event) => {
          const response = JSON.parse(event.data);
          if (response.error || response.errors) {
            reject(new Error('Invalid API key'));
          } else if (response.data?.[0]?.taskType === "authentication") {
            clearTimeout(timeout);
            resolve(true);
          }
        };

        ws.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Connection failed'));
        };
      });

      localStorage.setItem('runwareApiKey', apiKey);
      setIsApiKeySet(true);
      toast.success("API key verified and saved successfully!");
    } catch (error) {
      console.error('API key validation error:', error);
      toast.error("Invalid API key. Please check and try again.");
    }
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
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
