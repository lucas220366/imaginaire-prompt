
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
      screenHeight: window.innerHeight,
      referrer: document.referrer,
      hour: new Date().getHours(),
      dayOfWeek: new Date().getDay()
    });

    // NEVER redirect anything that could possibly be a crawler
    if (isCrawler || isLoading) {
      console.log("Crawler or loading state - no redirection");
      return;
    }

    // ALWAYS serve content initially, then consider redirecting
    // This slight delay helps with indexing even for non-crawler requests
    const timer = setTimeout(() => {
      if (!session) {
        console.log("Delayed redirect for human user to auth page");
        navigate("/auth");
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [session, isLoading, navigate, isCrawler]);

  // Special debugging helper visible only in development
  if (process.env.NODE_ENV === 'development' && isCrawler) {
    console.log("🤖 CRAWLER ACCESS GRANTED:", {
      path: window.location.pathname,
      agent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
  }

  // Always render content for potential crawlers
  if (isCrawler || isLoading) {
    return <>{children}</>;
  }

  // Only block content for definitively authenticated human users with no session
  return session || isCrawler ? <>{children}</> : null;
};
