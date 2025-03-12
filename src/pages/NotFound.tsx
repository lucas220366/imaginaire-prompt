import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isSearchEngine } from "../utils/bot-detection";
import { NotFoundHeader } from "@/components/not-found/NotFoundHeader";
import { NotFoundContent } from "@/components/not-found/NotFoundContent";
import { SEOContentSection } from "@/components/not-found/SEOContentSection";

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
      <NotFoundHeader />
      
      {/* Main content with proper 404 semantics */}
      <div className="flex items-center justify-center min-h-screen pt-16">
        <div>
          <NotFoundContent />
          <SEOContentSection />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
