
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();

  // Simplified bot detection focused on major search engines
  const userAgent = navigator.userAgent.toLowerCase();
  const isSearchEngine = (
    userAgent.includes('googlebot') ||
    userAgent.includes('bingbot') ||
    userAgent.includes('yandexbot') ||
    userAgent.includes('baiduspider') ||
    userAgent.includes('duckduckbot') ||
    // Broader fallbacks for other potential crawlers
    userAgent.includes('bot') ||
    userAgent.includes('spider') ||
    userAgent.includes('crawler')
  );

  useEffect(() => {
    // Essential debug logging
    console.log("Protected Route:", {
      isBot: isSearchEngine,
      userAgent: navigator.userAgent,
      path: window.location.pathname,
      timestamp: new Date().toISOString()
    });

    // Only redirect human users
    if (!isLoading && !session && !isSearchEngine) {
      navigate("/auth");
    }
  }, [session, isLoading, navigate, isSearchEngine]);

  // Immediate access for search engines
  if (isSearchEngine) {
    console.log("Search engine access granted");
    return <>{children}</>;
  }

  // Standard flow for human users
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return session ? <>{children}</> : null;
};
