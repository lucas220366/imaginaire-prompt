
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { AuthForm } from "@/components/auth/AuthForm";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";
import { toast } from "sonner";

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

    // Log the recovery flow detection for debugging
    if ((type === 'recovery' && accessToken) || (hashType === 'recovery' && hashAccessToken)) {
      console.log('Recovery flow detected:', { type, hashType, accessToken, hashAccessToken });
      // If we have a recovery token, show the password reset form
      return;
    }

    // Handle potential errors
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    if (error) {
      console.error('Auth error:', error, errorDescription);
      toast.error(errorDescription || 'Authentication error occurred');
    }
  }, []);

  // Check if we're in the password reset flow by checking both URL parameters and hash
  const isPasswordReset = window.location.pathname.includes('reset-password') || 
                         window.location.hash.includes('type=recovery') ||
                         window.location.hash.includes('access_token');

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {isPasswordReset ? <PasswordResetForm /> : <AuthForm />}
    </div>
  );
};

export default Auth;
