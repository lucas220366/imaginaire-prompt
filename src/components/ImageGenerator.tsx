
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

  // Check if it's a search engine
  const isSearchEngine = /Googlebot|bingbot|YandexBot|DuckDuckBot|Baiduspider/i.test(navigator.userAgent);

  const handleSignOut = async () => {
    try {
      console.log("Starting sign out process");
      await signOut();
      console.log("Sign out successful");
      toast.success("Signed out successfully");
      // Redirect to home page after sign out
      navigate("/");
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
    <div className="min-h-screen flex flex-col bg-[#f8faff] animate-fade-in w-full overflow-x-hidden">
      {/* Fixed header with updated styling to match other pages */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Header onSignOut={handleSignOut} />
          </div>
        </div>
      </header>
      
      {/* Main content with padding for fixed header */}
      <main className="flex-grow p-4 sm:p-6 w-full mt-20">
        <ImageGeneratorContent
          settings={settings}
          onSettingsChange={setSettings}
          prompt={prompt}
          isGenerating={isGenerating}
          onPromptChange={setPrompt}
          onGenerate={handleGenerate}
          generatedImage={image}
        />
        
        {/* Additional SEO content for search engines */}
        {isSearchEngine && !session && (
          <div className="mt-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">AI Image Generator</h2>
            <p className="mb-4">Create stunning AI-generated images from text descriptions with our free online tool.</p>
            <p className="mb-4">Our AI Image Generator allows you to:</p>
            <ul className="list-disc pl-5 mb-4">
              <li>Generate high-quality AI art from text prompts</li>
              <li>Customize image size and aspect ratio</li>
              <li>Download your creations in various formats</li>
              <li>Save your generated images to your profile</li>
            </ul>
            <p className="mb-4">Sign up or log in to start creating amazing AI art!</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">How to use our AI Image Generator:</h3>
            <ol className="list-decimal pl-5 mb-4">
              <li>Sign up for a free account</li>
              <li>Enter a detailed text description of what you want to create</li>
              <li>Click "Generate" to create your AI image</li>
              <li>Download your image or save it to your profile</li>
            </ol>
          </div>
        )}
      </main>
    </div>
  );
};

export default ImageGenerator;
