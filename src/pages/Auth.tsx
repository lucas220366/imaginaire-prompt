
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { AuthForm } from "@/components/auth/AuthForm";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";

const Auth = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  // Check if we're in a recovery flow by looking at URL hash
  const accessToken = new URLSearchParams(window.location.hash.substring(1)).get('access_token');
  const isRecoveryFlow = Boolean(accessToken);

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
