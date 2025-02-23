
import React, { useState } from 'react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error("Please enter your Runware API key");
      return;
    }

    setIsSubmitting(true);
    try {
      // Test the API key by attempting to establish a WebSocket connection
      const ws = new WebSocket('wss://ws-api.runware.ai/v1');
      
      const connectPromise = new Promise((resolve, reject) => {
        ws.onopen = () => {
          ws.send(JSON.stringify([{
            taskType: "authentication",
            apiKey: apiKey
          }]));
        };

        ws.onmessage = (event) => {
          const response = JSON.parse(event.data);
          if (response.error || response.errors) {
            reject(new Error(response.errorMessage || response.errors?.[0]?.message || "Invalid API key"));
          } else if (response.data?.[0]?.taskType === "authentication") {
            resolve(true);
          }
        };

        ws.onerror = () => {
          reject(new Error("Failed to connect to Runware"));
        };

        // Timeout after 5 seconds
        setTimeout(() => reject(new Error("Connection timeout")), 5000);
      });

      await connectPromise;
      onApiKeySubmit();
      toast.success("API key verified successfully!");
    } catch (error) {
      console.error("API key verification failed:", error);
      toast.error(error instanceof Error ? error.message : "Failed to verify API key");
    } finally {
      setIsSubmitting(false);
    }
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
              disabled={isSubmitting}
            />
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Start Generating Images"}
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
