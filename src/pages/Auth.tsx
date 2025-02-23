
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { AuthForm } from "@/components/auth/AuthForm";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  // Check if we're in a recovery flow by looking at URL hash
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const isRecoveryFlow = hashParams.has('access_token') || hashParams.get('type') === 'recovery';

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
