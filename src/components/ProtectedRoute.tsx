
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { isSearchEngine } from "../utils/bot-detection";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();
  const isCrawler = isSearchEngine();

  useEffect(() => {
    // Enhanced logging for debugging
    console.log("Protected Route Access:", {
      path: window.location.pathname,
      userAgent: navigator.userAgent,
      isBot: isCrawler,
      hasSession: !!session,
      isLoading,
      timestamp: new Date().toISOString(),
      referrer: document.referrer || "none"
    });

    // ALWAYS allow crawlers to see content without ANY restrictions
    if (isCrawler) {
      console.log("Search engine detected - allowing unrestricted access");
      return;
    }

    // For human users, check auth after a longer delay
    // This prevents race conditions and helps with indexing
    const timer = setTimeout(() => {
      if (!isLoading && !session) {
        console.log("No session found after delay, redirecting to auth");
        navigate("/auth");
      }
    }, 500); // Increased delay for better indexing support

    return () => clearTimeout(timer);
  }, [session, isLoading, navigate, isCrawler]);

  // Search engines ALWAYS see the full page content immediately
  if (isCrawler) {
    return <>{children}</>;
  }

  // For users: show full content if authenticated or still loading
  return isLoading || session ? <>{children}</> : null;
};
