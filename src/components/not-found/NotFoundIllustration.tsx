
import React from 'react';
import { Sparkles, Bot, Image, FileX } from 'lucide-react';

const NotFoundIllustration = () => {
  return (
    <div className="w-full max-w-md mx-auto my-8 relative">
      {/* Main container with animation */}
      <div className="relative p-6 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 border border-blue-100 shadow-lg animate-fade-in">
        {/* Decorative sparkles */}
        <Sparkles 
          className="absolute -top-4 -right-4 text-purple-400 animate-pulse w-8 h-8" 
        />
        <Sparkles 
          className="absolute -bottom-3 -left-3 text-blue-400 animate-pulse w-6 h-6" 
        />
        
        {/* Main illustration components */}
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <Image className="w-24 h-24 text-gray-300" strokeWidth={1.5} />
            <FileX className="absolute w-16 h-16 text-blue-600 top-4 left-4" strokeWidth={1.5} />
          </div>
          
          <div className="relative my-4 animate-bounce duration-slow">
            <Bot className="w-16 h-16 text-purple-500" strokeWidth={1.5} />
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
              ?
            </span>
          </div>
        </div>
        
        {/* Animated dots for loading effect */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <div 
              key={i} 
              className="w-3 h-3 rounded-full bg-purple-400"
              style={{ 
                animation: `pulse 1.5s infinite ${i * 0.2}s`,
                opacity: 0.7
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Add keyframes for the pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default NotFoundIllustration;
