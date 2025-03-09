
import React from 'react';
import { ImageSettings } from "@/types/image-generator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface ImageSettingsProps {
  settings: ImageSettings;
  onSettingsChange: (settings: ImageSettings) => void;
}

const ImageSettingsControl = ({ settings, onSettingsChange }: ImageSettingsProps) => {
  const handleCustomDimensionChange = (dimension: "width" | "height", value: string) => {
    const numValue = parseInt(value, 10);
    // Ensure the value is a number, at least 128, and a multiple of 64
    const validValue = !isNaN(numValue) ? Math.max(128, Math.round(numValue / 64) * 64) : 512;
    
    if (dimension === "width") {
      onSettingsChange({ ...settings, customWidth: validValue });
    } else {
      onSettingsChange({ ...settings, customHeight: validValue });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
          Base Size
        </label>
        <Select
          value={settings.size}
          onValueChange={(value: ImageSettings["size"]) => 
            onSettingsChange({ 
              ...settings, 
              size: value,
              // Set default values for custom dimensions when switching to custom
              ...(value === "custom" && { 
                customWidth: settings.customWidth || 512, 
                customHeight: settings.customHeight || 512 
              })
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="512x512">512 x 512</SelectItem>
            <SelectItem value="1024x1024">1024 x 1024</SelectItem>
            <SelectItem value="1536x1536">1536 x 1536</SelectItem>
            <SelectItem value="2048x2048">2048 x 2048</SelectItem>
            <SelectItem value="custom">Custom Size</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {settings.size === "custom" && (
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="customWidth" className="block text-sm font-medium text-gray-700 mb-1">
              Width (px)
            </label>
            <Input
              id="customWidth"
              type="number"
              min="128"
              step="64"
              value={settings.customWidth || 512}
              onChange={(e) => handleCustomDimensionChange("width", e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="customHeight" className="block text-sm font-medium text-gray-700 mb-1">
              Height (px)
            </label>
            <Input
              id="customHeight"
              type="number"
              min="128"
              step="64"
              value={settings.customHeight || 512}
              onChange={(e) => handleCustomDimensionChange("height", e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="aspectRatio" className="block text-sm font-medium text-gray-700 mb-1">
          Aspect Ratio
        </label>
        <Select
          value={settings.aspectRatio}
          onValueChange={(value: ImageSettings["aspectRatio"]) => 
            onSettingsChange({ ...settings, aspectRatio: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select aspect ratio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="square">Square (1:1)</SelectItem>
            <SelectItem value="portrait">Portrait (9:16)</SelectItem>
            <SelectItem value="landscape">Landscape (16:9)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-1">
          Image Format
        </label>
        <Select
          value={settings.format}
          onValueChange={(value: ImageSettings["format"]) => 
            onSettingsChange({ ...settings, format: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PNG">PNG</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ImageSettingsControl;
