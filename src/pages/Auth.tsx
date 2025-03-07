
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { AuthForm } from "@/components/auth/AuthForm";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";

const Auth = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [showResetForm, setShowResetForm] = useState(false);

  // Check if we're in a password reset flow
  useEffect(() => {
    // Enhanced detection for various password reset URL formats
    const fragment = new URLSearchParams(window.location.hash.substring(1));
    const query = new URLSearchParams(window.location.search);
    
    // Extract tokens and types from different sources
    const accessToken = fragment.get('access_token');
    const token = fragment.get('token') || query.get('token');
    const type = fragment.get('type') || query.get('type');
    
    // Check for recovery flow
    const isRecovery = (
      (accessToken && type === 'recovery') || 
      (token && type === 'recovery') ||
      window.location.hash.includes('type=recovery') ||
      window.location.search.includes('type=recovery')
    );
    
    if (isRecovery) {
      setShowResetForm(true);
    }
    
    // Log current state for debugging
    console.log("Auth page - Reset password detection:", {
      currentUrl: window.location.href,
      urlHash: window.location.hash,
      urlSearch: window.location.search,
      hasSession: !!session,
      hasAccessToken: !!accessToken,
      hasToken: !!token,
      type: type,
      isRecovery: isRecovery,
      showResetForm: isRecovery
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
      {showResetForm ? (
        <PasswordResetForm />
      ) : (
        <AuthForm onResetPassword={() => setShowResetForm(true)} />
      )}
    </div>
  );
};

export default Auth;
