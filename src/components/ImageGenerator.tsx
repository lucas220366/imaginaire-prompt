import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Settings } from "lucide-react";
import { toast } from "sonner";
import { RunwareService } from '@/lib/runware';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!runwareApiKey.trim()) {
      toast.error("Please enter your Runware API key");
      return;
    }
    localStorage.setItem('runwareApiKey', runwareApiKey);
    localStorage.setItem('runwayApiKey', runwayApiKey);
    setIsApiKeySet(true);
    setShowSettings(false);
    toast.success("API keys updated successfully!");
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    try {
      if (activeTab === "image") {
        const runware = new RunwareService(runwareApiKey);
        const result = await runware.generateImage({ positivePrompt: prompt });
        setImage(result.imageURL);
        setVideo(null);
      } else {
        if (!runwayApiKey) {
          toast.error("Please set your RunwayML API key first");
          return;
        }
        // Video generation will be implemented here
        toast.info("Video generation with RunwayML coming soon!");
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

  const ApiKeyForm = () => (
    <form onSubmit={handleApiKeySubmit} className="w-full max-w-md space-y-4">
      <div className="bg-white/50 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {isApiKeySet ? "Update API Keys" : "Enter your API keys"}
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="runwareKey" className="block text-sm font-medium text-gray-700 mb-1">
              Runware API Key (for images)
            </label>
            <Input
              id="runwareKey"
              type="password"
              placeholder="Runware API Key"
              value={runwareApiKey}
              onChange={(e) => setRunwareApiKey(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="runwayKey" className="block text-sm font-medium text-gray-700 mb-1">
              RunwayML API Key (for videos)
            </label>
            <Input
              id="runwayKey"
              type="password"
              placeholder="RunwayML API Key (optional)"
              value={runwayApiKey}
              onChange={(e) => setRunwayApiKey(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {isApiKeySet ? "Update Keys" : "Set Keys"}
            </Button>
            {isApiKeySet && (
              <Button type="button" variant="outline" onClick={() => setShowSettings(false)}>
                Cancel
              </Button>
            )}
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-600">
            Get your Runware API key from{" "}
            <a
              href="https://runware.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Runware.ai
            </a>
          </p>
          <p className="text-sm text-gray-600">
            Get your RunwayML API key from{" "}
            <a
              href="https://runway.ml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Runway.ml
            </a>
          </p>
        </div>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center gap-8 animate-fade-in">
      {!isApiKeySet || showSettings ? (
        <ApiKeyForm />
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
                  <TabsTrigger value="video">Video (Coming Soon)</TabsTrigger>
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
                  disabled={isGenerating || !prompt.trim() || activeTab === "video"}
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
