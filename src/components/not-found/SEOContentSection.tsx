
import { Link } from "react-router-dom";

export const SEOContentSection = () => {
  return (
    <div className="mt-8 max-w-2xl mx-auto text-left">
      <h2 className="text-2xl font-semibold mb-4">Looking for AI Image Generation?</h2>
      <p className="mb-4">Our AI Image Generator lets you create stunning AI art from text descriptions. Free to use, no sign-up required.</p>
      <p className="mb-4">Vrano.com offers the best free text-to-image AI tools, allowing anyone to create beautiful artwork, designs, and visual content in seconds.</p>
      
      <h3 className="text-xl font-semibold mt-6 mb-2">Key Features</h3>
      <ul className="list-disc pl-5 mb-4">
        <li>Create high-quality AI images from text prompts</li>
        <li>Multiple size options and aspect ratios</li>
        <li>Download your images in various formats</li>
        <li>Completely free to use</li>
        <li>No watermarks on generated images</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mb-4">Popular pages on vraho.com:</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li><Link to="/" className="text-blue-500 hover:text-blue-700">Home</Link> - Our main page</li>
        <li><Link to="/generator" className="text-blue-500 hover:text-blue-700">AI Image Generator</Link> - Create AI art</li>
        <li><Link to="/contact" className="text-blue-500 hover:text-blue-700">Contact Us</Link> - Get in touch</li>
        <li><Link to="/privacy-policy" className="text-blue-500 hover:text-blue-700">Privacy Policy</Link></li>
        <li><Link to="/terms-of-use" className="text-blue-500 hover:text-blue-700">Terms of Use</Link></li>
      </ul>
    </div>
  );
};
