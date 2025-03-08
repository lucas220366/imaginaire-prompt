
import React from 'react';
import { Rocket } from "lucide-react";

const Title = () => {
  return (
    <div className="relative">
      {/* Rocket positioned at top left, adjusted for mobile */}
      <div className="absolute top-0 left-0 -translate-y-16 md:-translate-y-16 translate-y-1">
        <Rocket className="w-16 h-16 text-[#0FA0CE] animate-bounce" />
      </div>
      
      <div className="text-center space-y-4 mt-4">
        <h1 className="text-3xl font-bold text-gray-800">AI Image Generator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Transform your ideas into stunning images using AI. Just describe what you want to see, and watch the magic happen!
        </p>
      </div>
    </div>
  );
};

export default Title;
