
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if not a search engine and not authenticated
    const isSearchEngine = /Googlebot|bingbot|YandexBot|DuckDuckBot|Baiduspider/i.test(navigator.userAgent);
    
    if (!isLoading && !session && !isSearchEngine) {
      navigate("/auth");
    }
  }, [session, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Show content to search engines even if not authenticated
  const isSearchEngine = /Googlebot|bingbot|YandexBot|DuckDuckBot|Baiduspider/i.test(navigator.userAgent);
  
  return session || isSearchEngine ? <>{children}</> : null;
};
