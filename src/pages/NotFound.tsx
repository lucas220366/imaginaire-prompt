
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { isSearchEngine } from "../utils/bot-detection";
import { NotFoundHeader } from "@/components/not-found/NotFoundHeader";
import { NotFoundContent } from "@/components/not-found/NotFoundContent";
import { SEOContentSection } from "@/components/not-found/SEOContentSection";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isBot = isSearchEngine();

  useEffect(() => {
    // Set correct HTTP status code for 404 pages
    const setStatusCode = () => {
      // Create a meta tag that can be read by server-side renderers
      let meta = document.querySelector('meta[name="http-status"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'http-status');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', '404');
      
      // Set title for better search engine recognition
      document.title = "404 Page Not Found - vraho.com";
    };
    
    setStatusCode();
    
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
    
    // For real users, not bots, potentially redirect after delay
    if (!isBot && location.pathname !== "/404") {
      // Wait a moment before redirecting actual users
      const timer = setTimeout(() => {
        navigate("/", { replace: true });
      }, 5000); // 5-second delay to allow for better user experience
      return () => clearTimeout(timer);
    }
  }, [location.pathname, isBot, navigate]);

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>404 Page Not Found - Free AI Image Generator - vraho.com</title>
        <meta name="description" content="Page not found. Visit vraho.com to create stunning AI-generated images for free! Use our AI image generator to turn text into art in seconds." />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href="https://vraho.com/404" />
        <meta name="keywords" content="404, page not found, AI Image Generator, Free AI Art, AI Art Creator" />
        <meta property="og:title" content="404 Page Not Found - Free AI Image Generator" />
        <meta property="og:description" content="Page not found. Create stunning AI images instantly with our free AI art tool. No sign-up required!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vraho.com/404" />
        <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "404 Page Not Found - Free AI Image Generator",
            "description": "Page not found. Create stunning AI-generated images for free using our AI image generator.",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://vraho.com"
              }, {
                "@type": "ListItem",
                "position": 2,
                "name": "404 Not Found",
                "item": "https://vraho.com/404"
              }]
            },
            "mainEntity": {
              "@type": "WebApplication",
              "name": "AI Image Generator",
              "applicationCategory": "Multimedia",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Create AI-generated images from text",
                "Multiple style options",
                "Free to use",
                "No sign-up required"
              ]
            }
          }
        `}
        </script>
      </Helmet>
      
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
