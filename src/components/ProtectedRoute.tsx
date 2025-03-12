
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();

  // Super permissive bot detection - include all possible variations and partial matches
  const userAgent = navigator.userAgent.toLowerCase();
  const botKeywords = [
    'bot', 'crawler', 'spider', 'search', 'index', 'scrape', 'google', 'baidu', 
    'bing', 'yahoo', 'yandex', 'duckduck', 'facebook', 'twitter', 'linkedin',
    'pinterest', 'archive', 'semrush', 'ahrefs', 'moz', 'majestic', 'alexa'
  ];
  
  const isSearchEngine = botKeywords.some(keyword => userAgent.includes(keyword));

  useEffect(() => {
    // Comprehensive debug logging
    console.log("Protected Route Access:", {
      path: window.location.pathname,
      fullUserAgent: navigator.userAgent,
      lowerUserAgent: userAgent,
      isSearchEngine: isSearchEngine,
      botDetectionKeywords: botKeywords,
      matchedKeywords: botKeywords.filter(keyword => userAgent.includes(keyword)),
      hasSession: !!session,
      isLoading,
      timestamp: new Date().toISOString()
    });

    // Only handle navigation for human users
    if (!isLoading && !session && !isSearchEngine) {
      console.log("Redirecting non-bot user to auth page");
      navigate("/auth");
    }
  }, [session, isLoading, navigate, isSearchEngine, userAgent]);

  // Search engines always see the content without any delay or conditions
  if (isSearchEngine) {
    console.log("Search engine detected - providing immediate full access to content");
    return <>{children}</>;
  }

  // Human user flow
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return session ? <>{children}</> : null;
};
