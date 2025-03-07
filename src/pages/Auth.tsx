
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
    // Look for password reset token in URL
    const fragment = new URLSearchParams(window.location.hash.substring(1));
    const query = new URLSearchParams(window.location.search);
    const accessToken = fragment.get('access_token');
    const type = fragment.get('type') || query.get('type');
    
    if ((accessToken && type === 'recovery') || 
        (query.get('token') && type === 'recovery')) {
      setShowResetForm(true);
    }
    
    // Log current state for debugging
    console.log("Auth page - Current URL:", window.location.href);
    console.log("Auth page - session:", session);
    console.log("Auth page - URL params:", {
      hasToken: !!query.get('token') || !!fragment.get('token'),
      type,
      hasAccessToken: !!accessToken
    });
  }, []);

  // Redirect if we have a session
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
