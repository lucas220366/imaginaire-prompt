
import React from 'react';
import { Sparkles } from "lucide-react";

const sampleImages = [
  {
    url: "/lovable-uploads/45fdc716-4fed-4baf-b60c-dfa562bfefa2.png",
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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-800">Example Creations</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sampleImages.map((sample, index) => (
          <div 
            key={index}
            className="bg-white/50 backdrop-blur-lg rounded-lg overflow-hidden shadow-md border border-gray-100"
          >
            <div className="aspect-square relative">
              <img
                src={sample.url}
                alt={sample.style}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-3">
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
