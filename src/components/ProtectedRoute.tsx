
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { isSearchEngine } from "../utils/bot-detection";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();
  const isCrawler = isSearchEngine();

  useEffect(() => {
    // Super detailed logging for debugging
    console.log("Protected Route Access:", {
      path: window.location.pathname,
      userAgent: navigator.userAgent,
      isBot: isCrawler,
      hasSession: !!session,
      isLoading,
      timestamp: new Date().toISOString(),
      language: navigator.language,
      platform: navigator.platform,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight
    });

    // Only redirect human users when absolutely certain
    if (!isLoading && !session && !isCrawler) {
      console.log("Redirecting human user to auth page");
      navigate("/auth");
    } else if (!isLoading && !session && isCrawler) {
      console.log("Allowing crawler access without session");
    }
  }, [session, isLoading, navigate, isCrawler]);

  // Always show content to anything remotely resembling a search engine
  if (isCrawler) {
    console.log("Crawler access granted to:", window.location.pathname);
    return <>{children}</>;
  }

  // Standard flow for human users
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return session ? <>{children}</> : null;
};
