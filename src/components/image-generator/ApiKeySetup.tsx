
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { toast } from "sonner";

interface ApiKeySetupProps {
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  onApiKeySubmit: () => void;
}

const ApiKeySetup = ({ apiKey, onApiKeyChange, onApiKeySubmit }: ApiKeySetupProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error("Please enter your Runware API key");
      return;
    }
    onApiKeySubmit();
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <div className="bg-white/50 backdrop-blur-lg rounded-lg p-8 shadow-lg border border-gray-100">
          <div className="flex justify-center mb-6">
            <Camera className="h-12 w-12 text-blue-500" />
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-center text-gray-800">Welcome to AI Image Generator</h2>
          <p className="text-gray-600 mb-6 text-center">Let's get you set up with your Runware API key</p>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter your Runware API key"
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              className="w-full"
            />
            <Button type="submit" className="w-full">
              Start Generating Images
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-600 text-center">
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
    </div>
  );
};

export default ApiKeySetup;
