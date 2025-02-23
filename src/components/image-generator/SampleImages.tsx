
import React from 'react';
import { Sparkles } from "lucide-react";

const sampleImages = [
  {
    url: "https://images.unsplash.com/photo-1534705867302-2a41394d2a3b",
    style: "Realistic Style"
  },
  {
    url: "https://images.unsplash.com/photo-1495853500318-2be4a7964488",
    style: "Cartoon Style"
  },
  {
    url: "https://images.unsplash.com/photo-1518562180175-34a163b1a9a6",
    style: "Pixar Style"
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
