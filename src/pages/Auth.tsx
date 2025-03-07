
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { AuthForm } from "@/components/auth/AuthForm";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";
import Logo from "@/components/Logo";

const Auth = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetParams, setResetParams] = useState<Record<string, string | null>>({});

  // Check if we're in a password reset flow
  useEffect(() => {
    // Get all URL parts - including fragment, search, and complete URL
    const fragment = window.location.hash;
    const search = window.location.search;
    const fullUrl = window.location.href;
    const pathname = window.location.pathname;
    
    // Parse parameters from both hash and query
    const fragmentParams = new URLSearchParams(fragment.substring(1));
    const queryParams = new URLSearchParams(search);
    
    // Extract tokens and types from different sources
    const accessToken = fragmentParams.get('access_token');
    const token = fragmentParams.get('token') || queryParams.get('token');
    const type = fragmentParams.get('type') || queryParams.get('type');
    
    // Check for recovery flow - using multiple detection methods
    const isRecovery = (
      (accessToken && type === 'recovery') || 
      (token && type === 'recovery') ||
      fragment.includes('type=recovery') ||
      search.includes('type=recovery') ||
      fullUrl.includes('type=recovery') ||
      pathname.includes('/reset-password') ||
      // Check if URL is a Supabase auth callback URL
      fullUrl.includes('/supabase/auth/callback') ||
      // Look for "reset_password" or "recovery" in query parameters
      search.includes('reset_password') ||
      search.includes('recovery')
    );
    
    if (isRecovery) {
      setShowResetForm(true);
      
      // Store all parameters for debugging
      const params: Record<string, string | null> = {
        accessToken,
        token,
        type,
        hash: fragment,
        search,
        fullUrl,
        pathname
      };
      setResetParams(params);
    }
    
    // Enhanced logging for debugging
    console.log("Auth page - Reset password detection:", {
      currentUrl: fullUrl,
      urlHash: fragment,
      urlSearch: search,
      pathname: pathname,
      hasSession: !!session,
      hasAccessToken: !!accessToken,
      hasToken: !!token,
      type: type,
      isRecovery: isRecovery,
      showResetForm: isRecovery,
      allParams: Object.fromEntries(queryParams),
      allHashParams: Object.fromEntries(fragmentParams)
    });
  }, []);

  // Redirect if we have a session and not in password reset mode
  useEffect(() => {
    if (session && !showResetForm) {
      navigate("/generator");
    }
  }, [session, navigate, showResetForm]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Add Logo */}
      <Logo />
      
      {showResetForm ? (
        <PasswordResetForm resetParams={resetParams} />
      ) : (
        <AuthForm onResetPassword={() => setShowResetForm(true)} />
      )}
    </div>
  );
};

export default Auth;
