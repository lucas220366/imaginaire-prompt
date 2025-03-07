
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full p-4 text-center text-gray-600 text-sm mt-auto">
      <div className="mb-2">
        <Link to="/privacy-policy" className="text-gray-600 hover:text-gray-900 mx-2">Privacy Policy</Link>
        <span className="mx-1">|</span>
        <Link to="/terms-of-use" className="text-gray-600 hover:text-gray-900 mx-2">Terms of Use</Link>
      </div>
      <div>
        &copy; 2025 vraho.com All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
