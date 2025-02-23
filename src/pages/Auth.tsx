
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { AuthForm } from "@/components/auth/AuthForm";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";

const Auth = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (session) {
      navigate("/generator");
    }
  }, [session, navigate]);

  // Handle URL parameters for reset password
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const type = searchParams.get('type');
    const accessToken = searchParams.get('access_token');

    // Also check hash parameters
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hashType = hashParams.get('type');
    const hashAccessToken = hashParams.get('access_token');

    if ((type === 'recovery' && accessToken) || (hashType === 'recovery' && hashAccessToken)) {
      console.log('Recovery flow detected:', { type, hashType, accessToken, hashAccessToken });
    }
  }, []);

  // Check if we're in the password reset flow
  const isPasswordReset = window.location.pathname.includes('reset-password') || 
                         window.location.hash.includes('type=recovery');

  if (isPasswordReset) {
    return <PasswordResetForm />;
  }

  return <AuthForm />;
};

export default Auth;
