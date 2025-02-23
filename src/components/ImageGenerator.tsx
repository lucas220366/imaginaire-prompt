
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";
import { toast } from "sonner";
import { RunwareService } from '@/lib/runware';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('runwareApiKey') || "");
  const [isApiKeySet, setIsApiKeySet] = useState(() => Boolean(localStorage.getItem('runwareApiKey')));
  const [activeTab, setActiveTab] = useState<"image" | "video">("image");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    try {
      const runware = new RunwareService(apiKey);
      if (activeTab === "image") {
        const result = await runware.generateImage({ positivePrompt: prompt });
        setImage(result.imageURL);
        setVideo(null);
      } else {
        // Video generation would go here - requires video generation API implementation
        toast.info("Video generation is coming soon!");
        setVideo(null);
        setImage(null);
      }
      toast.success(`${activeTab === "image" ? "Image" : "Video"} generated successfully!`);
    } catch (error) {
      toast.error(`Failed to generate ${activeTab}. Please try again.`);
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!image && !video) return;
    
    try {
      const url = image || video;
      if (!url) return;
      
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `generated-${activeTab}-${Date.now()}.${activeTab === "image" ? "png" : "mp4"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      toast.success(`${activeTab === "image" ? "Image" : "Video"} downloaded successfully!`);
    } catch (error) {
      toast.error("Failed to download. Please try again.");
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
    <div className="min-h-screen p-6 flex flex-col items-center justify-center gap-8 animate-fade-in">
      {!isApiKeySet ? (
        <form onSubmit={handleApiKeySubmit} className="w-full max-w-md space-y-4">
          <div className="bg-white/50 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Enter your Runware API key</h2>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full"
              />
              <Button type="submit" className="w-full">
                Set API Key
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-600">
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
      ) : (
        <>
          <div className="w-full max-w-3xl space-y-4">
            <div className="bg-white/50 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-gray-100">
              <h1 className="text-2xl font-semibold mb-6 text-gray-800">Generate Content</h1>
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
          </div>

          {(image || video) && (
            <div className="w-full max-w-3xl animate-fade-up">
              <div className="bg-white/50 backdrop-blur-lg rounded-lg p-4 shadow-lg border border-gray-100">
                <div className="relative">
                  {image && (
                    <img
                      src={image}
                      alt={prompt}
                      className="w-full h-auto rounded-lg shadow-sm"
                      loading="lazy"
                    />
                  )}
                  {video && (
                    <video
                      src={video}
                      controls
                      className="w-full h-auto rounded-lg shadow-sm"
                    />
                  )}
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
        </>
      )}
    </div>
  );
};

export default ImageGenerator;
