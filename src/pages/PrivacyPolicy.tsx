
import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-16">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-gray max-w-none">
        <p className="mb-4">Last updated: March 1, 2025</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
        <p className="mb-4">
          Welcome to vraho.com. We respect your privacy and are committed to protecting your personal data.
          This privacy policy will inform you about how we look after your personal data when you visit our website
          and tell you about your privacy rights and how the law protects you.Vraho.com website uses adsense advertisements from google and ezoic
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Data We Collect</h2>
        <p className="mb-4">
          We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li className="mb-2">Identity Data includes first name, last name, username or similar identifier.</li>
          <li className="mb-2">Contact Data includes email address and telephone numbers.</li>
          <li className="mb-2">Technical Data includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
          <li className="mb-2">Usage Data includes information about how you use our website, products and services.</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Data</h2>
        <p className="mb-4">
          We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li className="mb-2">Where we need to perform the contract we are about to enter into or have entered into with you.</li>
          <li className="mb-2">Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
          <li className="mb-2">Where we need to comply with a legal obligation.</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this privacy policy or our privacy practices, please contact us at:
          privacy@vraho.com
        </p>
      </div>
      
      <div className="mt-8">
        <Link to="/" className="text-blue-600 hover:text-blue-800">← Back to Home</Link>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
