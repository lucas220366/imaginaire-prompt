
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logo = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="absolute top-4 left-4 cursor-pointer z-10"
      onClick={() => navigate('/')}
    >
      <div className="flex items-center">
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          <span className="text-3xl">V</span>raho
        </span>
        <span className="text-gray-500 text-sm ml-0.5">.com</span>
      </div>
    </div>
  );
};

export default Logo;
