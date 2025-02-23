
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Settings } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApiKeyForm from './image-generator/ApiKeyForm';
import GeneratedContent from './image-generator/GeneratedContent';
import { generateContent, downloadContent } from './image-generator/generatorUtils';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [runwareApiKey, setRunwareApiKey] = useState(() => localStorage.getItem('runwareApiKey') || "");
  const [runwayApiKey, setRunwayApiKey] = useState(() => localStorage.getItem('runwayApiKey') || "");
  const [isApiKeySet, setIsApiKeySet] = useState(() => Boolean(localStorage.getItem('runwareApiKey')));
  const [activeTab, setActiveTab] = useState<"image" | "video">("image");
  const [showSettings, setShowSettings] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateContent(prompt, activeTab, runwareApiKey, runwayApiKey);
      if (result) {
        setImage(result.imageURL);
        setVideo(result.videoURL);
      }
      toast.success(`${activeTab === "image" ? "Image" : "Video"} generated successfully!`);
    } catch (error) {
      toast.error(`Failed to generate ${activeTab}. Please try again.`);
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const contentUrl = image || video;
    if (contentUrl) {
      downloadContent(contentUrl, activeTab);
    }
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center gap-8 animate-fade-in">
      {!isApiKeySet || showSettings ? (
        <ApiKeyForm
          runwareApiKey={runwareApiKey}
          runwayApiKey={runwayApiKey}
          setRunwareApiKey={setRunwareApiKey}
          setRunwayApiKey={setRunwayApiKey}
          isApiKeySet={isApiKeySet}
          onSubmit={() => setIsApiKeySet(true)}
          onCancel={() => setShowSettings(false)}
        />
      ) : (
        <>
          <div className="w-full max-w-3xl space-y-4">
            <div className="bg-white/50 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Generate Content</h1>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowSettings(true)}
                  className="hover:bg-gray-100"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              <Tabs
                defaultValue="image"
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as "image" | "video")}
                className="mb-6"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="image">Image</TabsTrigger>
                  <TabsTrigger value="video">Video</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex gap-2">
                <Input
                  placeholder={`Describe the ${activeTab} you want to generate...`}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim() || (activeTab === "video" && !runwayApiKey)}
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

          <GeneratedContent
            image={image}
            video={video}
            prompt={prompt}
            onDownload={handleDownload}
          />
        </>
      )}
    </div>
  );
};

export default ImageGenerator;
