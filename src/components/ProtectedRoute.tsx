
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();

  // Most permissive bot detection
  const isSearchEngine = /bot|crawler|spider|google|baidu|bing|yahoo|yandex|duckduck/i.test(
    navigator.userAgent
  );

  useEffect(() => {
    // Debug logging
    console.log("Route access:", {
      path: window.location.pathname,
      userAgent: navigator.userAgent,
      isBot: isSearchEngine,
      hasSession: !!session,
      isLoading
    });

    // Only handle navigation for human users
    if (!isLoading && !session && !isSearchEngine) {
      navigate("/auth");
    }
  }, [session, isLoading, navigate, isSearchEngine]);

  // Search engines always see the content
  if (isSearchEngine) {
    return <>{children}</>;
  }

  // Regular user flow
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return session ? <>{children}</> : null;
};
