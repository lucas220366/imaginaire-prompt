
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
      isBot: isCrawler,
      hasSession: !!session,
      isLoading,
      timestamp: new Date().toISOString()
    });

    // Only redirect human users
    if (!isLoading && !session && !isCrawler) {
      navigate("/auth");
    }
  }, [session, isLoading, navigate, isCrawler]);

  // Always show content to search engines
  if (isCrawler) {
    return <>{children}</>;
  }

  // Standard flow for human users
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return session ? <>{children}</> : null;
};

