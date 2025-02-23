
import React from 'react';
import { ImageSettings } from "@/types/image-generator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ImageSettingsProps {
  settings: ImageSettings;
  onSettingsChange: (settings: ImageSettings) => void;
}

const ImageSettingsControl = ({ settings, onSettingsChange }: ImageSettingsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
          Base Size
        </label>
        <Select
          value={settings.size}
          onValueChange={(value: ImageSettings["size"]) => 
            onSettingsChange({ ...settings, size: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="512x512">512 x 512</SelectItem>
            <SelectItem value="1024x1024">1024 x 1024</SelectItem>
            <SelectItem value="1536x1536">1536 x 1536</SelectItem>
          </SelectContent>
        </Select>
      </div>
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
            <SelectItem value="JPEG">JPEG</SelectItem>
            <SelectItem value="PNG">PNG</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ImageSettingsControl;
