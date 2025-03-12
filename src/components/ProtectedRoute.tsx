
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();

  // Improved search engine detection with additional bot patterns
  const isSearchEngine = /Googlebot|bingbot|YandexBot|DuckDuckBot|Baiduspider|AdsBot-Google|Mediapartners-Google|Googlebot-Mobile|Googlebot-Image|APIs-Google|AdsBot-Google-Mobile|Twitterbot|facebookexternalhit/i.test(navigator.userAgent);
  
  useEffect(() => {
    // Only redirect if not loading, not authenticated and not a search engine
    if (!isLoading && !session && !isSearchEngine) {
      navigate("/auth");
    }
  }, [session, isLoading, navigate, isSearchEngine]);

  // Show loading indicator only for real users, not for search engines
  if (isLoading && !isSearchEngine) {
    return <div>Loading...</div>;
  }

  // Always render content for search engines regardless of authentication
  // For regular users, only show if authenticated
  return (session || isSearchEngine) ? <>{children}</> : null;
};
