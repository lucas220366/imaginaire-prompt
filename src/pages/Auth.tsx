
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
    const checkForRecoveryFlow = () => {
      // Get all URL parts
      const hash = window.location.hash;
      const search = window.location.search;
      const fullUrl = window.location.href;
      
      // Parse parameters from hash
      const hashParams = new URLSearchParams(hash.substring(1));
      const type = hashParams.get('type');
      const accessToken = hashParams.get('access_token');
      
      // Determine if this is a recovery flow
      const isRecovery = 
        (type === 'recovery') || 
        hash.includes('type=recovery') || 
        search.includes('type=recovery') ||
        fullUrl.includes('type=recovery');
      
      console.log("Auth page - Reset password detection:", {
        currentUrl: fullUrl,
        urlHash: hash,
        type,
        isRecovery,
        hashParams: Object.fromEntries(hashParams)
      });
      
      if (isRecovery) {
        setShowResetForm(true);
        setResetParams({
          accessToken,
          type,
          hash,
          search,
          fullUrl
        });
      }
    };
    
    checkForRecoveryFlow();
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
        <PasswordResetForm resetParams={resetParams} />
      ) : (
        <AuthForm onResetPassword={() => setShowResetForm(true)} />
      )}
    </div>
  );
};

export default Auth;
