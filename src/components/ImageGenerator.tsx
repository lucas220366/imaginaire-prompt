
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, User, Rocket, Sparkles } from "lucide-react";
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
        <ApiKeySetup
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
          onApiKeySubmit={handleApiKeySubmit}
        />
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
            <ImageSettingsControl
              settings={settings}
              onSettingsChange={setSettings}
            />
            <div className="flex flex-col gap-2">
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
              <p className="text-sm text-gray-600 mt-2 font-bold">
                For optimal results try to be specific, include clear details about your subject, style, and mood
              </p>
            </div>
          </div>

          {image && (
            <GeneratedImage
              imageUrl={image}
              prompt={prompt}
            />
          )}

          {/* Sample Images Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">Example Creations</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  url: "https://images.unsplash.com/photo-1534705867302-2a41394d2a3b",
                  prompt: "A mystical ice castle in the Northern Lights, with crystalline spires and shimmering aurora reflections casting rainbow shadows",
                  style: "Realistic Style"
                },
                {
                  url: "https://images.unsplash.com/photo-1558470598-a5dda9640f68",
                  prompt: "A whimsical candy kingdom with lollipop trees, chocolate rivers, and flying cupcakes spreading sprinkles of joy across a cotton candy sky",
                  style: "Animated Style"
                },
                {
                  url: "https://images.unsplash.com/photo-1518562180175-34a163b1a9a6",
                  prompt: "A fantastical treehouse city at sunset with spiral staircases wrapped in glowing vines, floating lanterns, and tiny dragons playing hide and seek",
                  style: "Pixar Style"
                }
              ].map((sample, index) => (
                <div 
                  key={index}
                  className="bg-white/50 backdrop-blur-lg rounded-lg overflow-hidden shadow-lg border border-gray-100"
                >
                  <div className="aspect-square relative">
                    <img
                      src={sample.url}
                      alt={sample.prompt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {sample.style}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{sample.prompt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
