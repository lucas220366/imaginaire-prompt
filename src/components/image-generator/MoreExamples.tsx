
import React from 'react';
import { GalleryHorizontal } from "lucide-react";

const moreExamples = [
  {
    url: "/lovable-uploads/6f5819e1-0091-438c-9641-c99629c7fb29.png",
    style: "Anime Style"
  },
  {
    url: "/lovable-uploads/5ad55131-4ba5-477c-8599-87bb47c60725.png",
    style: "Watercolor Style"
  },
  {
    url: "/lovable-uploads/61e17058-8f03-496d-ad0d-24fc8a03b176.png",
    style: "Futuristic Style"
  }
];

const MoreExamples = () => {
  return (
    <div className="space-y-4 mt-12">
      <div className="flex items-center gap-2">
        <GalleryHorizontal className="h-4 w-4 text-purple-500" />
        <h2 className="text-lg font-semibold text-gray-800">More Inspiration</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {moreExamples.map((example, index) => (
          <div 
            key={index}
            className="bg-white/50 backdrop-blur-lg rounded-lg overflow-hidden shadow-md border border-gray-100"
          >
            <div className="aspect-square relative">
              <img
                src={example.url}
                alt={example.style}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-3">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                {example.style}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoreExamples;
