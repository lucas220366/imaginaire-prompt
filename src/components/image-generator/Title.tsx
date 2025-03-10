
import React from 'react';
import { Rocket } from "lucide-react";
import { useLocation } from "react-router-dom";

const Title = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <div className="relative mt-12 md:mt-4">
      {/* Rocket only shown on homepage with smaller size */}
      {isHomePage && (
        <div className="absolute top-0 left-0 -translate-y-16 md:-translate-y-16 -translate-y-8">
          <Rocket className="w-10 h-10 text-[#0FA0CE] animate-bounce" />
        </div>
      )}
      
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
