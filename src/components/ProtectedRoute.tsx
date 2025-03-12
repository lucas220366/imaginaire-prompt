
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();

  // Improved and more comprehensive search engine detection
  const isSearchEngine = /Googlebot|googlebot|bingbot|YandexBot|DuckDuckBot|Baiduspider|AdsBot-Google|Mediapartners-Google|Googlebot-Mobile|Googlebot-Image|APIs-Google|AdsBot-Google-Mobile|Twitterbot|facebookexternalhit|ia_archiver|semrushbot|AhrefsBot|SeznamBot|YisouSpider|BLEXBot|MJ12bot|PetalBot/i.test(navigator.userAgent);
  
  // Log for debugging
  useEffect(() => {
    console.log("ProtectedRoute - User Agent:", navigator.userAgent);
    console.log("ProtectedRoute - Is Search Engine:", isSearchEngine);
    console.log("ProtectedRoute - Auth State:", { isLoading, isAuthenticated: !!session });
  }, [isSearchEngine, session, isLoading]);

  useEffect(() => {
    // Only redirect if not loading, not authenticated and not a search engine
    if (!isLoading && !session && !isSearchEngine) {
      navigate("/auth");
    }
  }, [session, isLoading, navigate, isSearchEngine]);

  // Always render content for search engines regardless of authentication
  if (isSearchEngine) {
    console.log("ProtectedRoute - Rendering content for search engine");
    return <>{children}</>;
  }

  // Show loading indicator for real users
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // For regular users, only show if authenticated
  return session ? <>{children}</> : null;
};
