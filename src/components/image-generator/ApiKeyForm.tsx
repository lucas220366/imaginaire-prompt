
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ApiKeyFormProps {
  runwareApiKey: string;
  runwayApiKey: string;
  setRunwareApiKey: (key: string) => void;
  setRunwayApiKey: (key: string) => void;
  isApiKeySet: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

const ApiKeyForm = ({
  runwareApiKey,
  runwayApiKey,
  setRunwareApiKey,
  setRunwayApiKey,
  isApiKeySet,
  onCancel,
}: ApiKeyFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!runwareApiKey.trim()) {
      toast.error("Please enter your Runware API key");
      return;
    }
    localStorage.setItem('runwareApiKey', runwareApiKey);
    localStorage.setItem('runwayApiKey', runwayApiKey);
    toast.success("API keys updated successfully!");
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
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
              <Button type="button" variant="outline" onClick={onCancel}>
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
};

export default ApiKeyForm;
