
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { AuthForm } from "@/components/auth/AuthForm";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";

const Auth = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  // Check if we're in a recovery flow by looking at both URL hash and search params
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const searchParams = new URLSearchParams(window.location.search);
  const isRecoveryFlow = hashParams.has('access_token') || 
                        searchParams.has('token') || 
                        hashParams.get('type') === 'recovery' ||
                        searchParams.get('type') === 'recovery';

  useEffect(() => {
    // Log current state for debugging
    console.log("Auth page - Current URL:", window.location.href);
    console.log("Auth page - Hash params:", Object.fromEntries(hashParams));
    console.log("Auth page - Search params:", Object.fromEntries(searchParams));
    console.log("Auth page - isRecoveryFlow:", isRecoveryFlow);
    console.log("Auth page - session:", session);
  }, [isRecoveryFlow, session]);

  // Only redirect if we have a session and we're not in a password reset flow
  useEffect(() => {
    if (session && !isRecoveryFlow) {
      navigate("/generator");
    }
  }, [session, navigate, isRecoveryFlow]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {isRecoveryFlow ? <PasswordResetForm /> : <AuthForm />}
    </div>
  );
};

export default Auth;
