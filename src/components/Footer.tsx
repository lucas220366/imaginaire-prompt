
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full px-4 py-6 text-center text-gray-600 text-sm mt-auto">
      {/* Contact link with icon */}
      <div className="mb-4 flex items-center justify-center">
        <Link to="/contact" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          <span>Need help? Contact us</span>
        </Link>
      </div>
      
      {/* Privacy and Terms links */}
      <div className="mb-2 flex items-center justify-center space-x-2">
        <Link to="/privacy-policy" className="text-gray-600 hover:text-gray-900">
          Privacy Policy
        </Link>
        <span className="text-gray-400">|</span>
        <Link to="/terms-of-use" className="text-gray-600 hover:text-gray-900">
          Terms of Use
        </Link>
      </div>
      
      {/* Copyright */}
      <div>
        &copy; 2025 vraho.com All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
