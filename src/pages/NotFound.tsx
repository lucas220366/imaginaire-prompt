
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Logo from '@/components/Logo';
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import MobileNav from "@/components/MobileNav";
import { isSearchEngine } from "../utils/bot-detection";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isBot = isSearchEngine();

  useEffect(() => {
    // Enhanced structured logging for search engines
    console.log("NotFound - Detailed Access Information:", {
      path: location.pathname,
      userAgent: navigator.userAgent,
      isBot: isBot,
      timestamp: new Date().toISOString(),
      referrer: document.referrer || "none",
      language: navigator.language,
      platform: navigator.platform || "unknown",
      screenDimensions: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      devicePixelRatio: window.devicePixelRatio,
      cookiesEnabled: navigator.cookieEnabled,
      statusCode: 404
    });
    
    // Make sure bots know this is a 404 page
    if (isBot) {
      // Set title for better search engine recognition
      document.title = "404 Page Not Found - vraho.com";
      
      // For crawlers, log as info rather than error
      console.log("Search engine accessed 404 route:", location.pathname);
    } else {
      // For real users, log as error
      console.error(
        "404 Error: User attempted to access non-existent route:",
        location.pathname
      );
      
      // Don't auto-redirect human users who land on 404 page directly
      if (location.pathname !== "/404") {
        // Wait a moment before redirecting actual users
        const timer = setTimeout(() => {
          // Only redirect non-crawler users
          if (!isBot) {
            navigate("/", { replace: true });
          }
        }, 5000); // 5-second delay to allow for better user experience
        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname, isBot, navigate]);

  return (
    <div className="min-h-screen">
      {/* Fixed header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Logo />
            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            </div>
            {/* Mobile navigation */}
            <MobileNav />
          </div>
        </div>
      </header>
      
      {/* Main content with proper 404 semantics */}
      <div className="flex items-center justify-center min-h-screen pt-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-4">The page you're looking for doesn't exist or has been moved.</p>
          <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
            Return to Home
          </Link>
          
          {/* Enhanced SEO content for 404 page */}
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
        </div>
      </div>
    </div>
  );
};

export default NotFound;
