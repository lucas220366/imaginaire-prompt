
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { isSearchEngine } from "../utils/bot-detection";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();
  const isCrawler = isSearchEngine();

  useEffect(() => {
    // Detailed logging for debugging
    console.log("Protected Route Access:", {
      path: window.location.pathname,
      userAgent: navigator.userAgent,
      isBot: isCrawler,
      hasSession: !!session,
      isLoading,
      timestamp: new Date().toISOString()
    });

    // ALWAYS allow crawlers to see content
    if (isCrawler) {
      console.log("Search engine detected - allowing access");
      return;
    }

    // For real users, check auth after a small delay
    // This helps with initial page load and indexing
    const timer = setTimeout(() => {
      if (!isLoading && !session) {
        navigate("/auth");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [session, isLoading, navigate, isCrawler]);

  // Search engines ALWAYS see content
  if (isCrawler) {
    return <>{children}</>;
  }

  // Show loading state or content based on auth
  return isLoading ? null : session ? <>{children}</> : null;
};

