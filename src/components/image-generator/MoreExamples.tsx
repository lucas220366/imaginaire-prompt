
import React from 'react';
import { GalleryHorizontal } from "lucide-react";

const moreExamples = [
  {
    url: "/lovable-uploads/6f5819e1-0091-438c-9641-c99629c7fb29.png",
    style: "Anime Style"
  },
  {
    url: "/lovable-uploads/77125e86-7cfa-4ce5-95c4-c241ff3c0868.png",
    style: "Pixar Style"
  },
  {
    url: "/lovable-uploads/2d733314-16fe-421d-b7be-ff1c54bf4d37.png",
    style: "Gothic Style"
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
