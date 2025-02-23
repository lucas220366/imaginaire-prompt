
import React from 'react';
import { Sparkles } from "lucide-react";

const sampleImages = [
  {
    url: "/lovable-uploads/c908fd05-9132-4aa6-b910-993b419b1469.png",
    style: "Realistic Style"
  },
  {
    url: "/lovable-uploads/32df9e19-3599-41ff-ae29-71f8e3b0cc45.png",
    style: "Cartoon Style"
  },
  {
    url: "/lovable-uploads/d795f3ed-1ece-45dc-a78f-b9f46602157f.png",
    style: "Digital Art Style"
  }
];

const SampleImages = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-blue-500" />
        <h2 className="text-xl font-semibold text-gray-800">Example Creations</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleImages.map((sample, index) => (
          <div 
            key={index}
            className="bg-white/50 backdrop-blur-lg rounded-lg overflow-hidden shadow-lg border border-gray-100"
          >
            <div className="aspect-square relative">
              <img
                src={sample.url}
                alt={sample.style}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {sample.style}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SampleImages;
