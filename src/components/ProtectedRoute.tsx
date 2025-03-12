
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();

  // Simplified bot detection focused on major search engines
  const isSearchEngine = /bot|googlebot|crawler|spider|robot|crawling/i.test(
    navigator.userAgent
  );

  useEffect(() => {
    // Enhanced logging for debugging
    console.log({
      userAgent: navigator.userAgent,
      isBot: isSearchEngine,
      path: window.location.pathname,
      isLoading,
      hasSession: !!session
    });

    // Only redirect human users
    if (!isLoading && !session && !isSearchEngine) {
      navigate("/auth");
    }
  }, [session, isLoading, navigate, isSearchEngine]);

  // Allow immediate access for search engines
  if (isSearchEngine) {
    console.log("Search engine detected - allowing access");
    return <>{children}</>;
  }

  // Show loading state for human users
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Show content for authenticated users
  return session ? <>{children}</> : null;
};
