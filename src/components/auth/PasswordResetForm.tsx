
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export const PasswordResetForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      try {
        // Get the recovery token from the URL
        const fragment = new URLSearchParams(window.location.hash.substring(1));
        const query = new URLSearchParams(window.location.search);
        const accessToken = fragment.get('access_token');
        const token = fragment.get('token') || query.get('token');
        const type = fragment.get('type') || query.get('type');

        // Store token info for debugging
        setTokenInfo({
          hasAccessToken: !!accessToken,
          hasToken: !!token,
          type: type,
          currentUrl: window.location.href,
          hash: window.location.hash,
          search: window.location.search
        });
        
        console.log("Recovery flow params:", {
          hasAccessToken: !!accessToken,
          hasToken: !!token,
          type: type,
          currentUrl: window.location.href,
          hash: window.location.hash,
          search: window.location.search
        });

        if (accessToken) {
          // Handle direct access token case
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) {
              setUserEmail(user.email);
              setIsTokenValid(true);
              return;
            }
          } catch (error) {
            console.error("Error getting user with access token:", error);
          }
        }

        // First try to use the token via a recovery flow
        if (token && type === 'recovery') {
          try {
            const { error } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: 'recovery'
            });

            if (error) {
              console.error("Token verification failed:", error);
              setIsTokenValid(false);
              toast.error("Invalid or expired reset link");
              return;
            }

            // Get user after verification
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) {
              setUserEmail(user.email);
              setIsTokenValid(true);
              return;
            }
          } catch (verifyError) {
            console.error("Error during OTP verification:", verifyError);
          }
        }
        
        // As a fallback, try to check the current session
        try {
          const { data: { session } } = await supabase.auth.getSession();
          const { data: { user } } = await supabase.auth.getUser();
          
          console.log("Current session:", {
            hasSession: !!session,
            hasUser: !!user,
            email: user?.email
          });
          
          if (user && user.email) {
            setUserEmail(user.email);
            setIsTokenValid(true);
            return;
          }
        } catch (sessionError) {
          console.error("Error getting session:", sessionError);
        }

        // If we got here, no valid token or session was found
        setIsTokenValid(false);
        if (!type || !token) {
          toast.error("Missing reset parameters");
        } else {
          toast.error("Invalid reset link");
        }
      } catch (error) {
        console.error("Token validation error:", error);
        setIsTokenValid(false);
        toast.error("Error validating reset link");
      }
    };

    validateToken();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ 
        password: password
      });

      if (error) throw error;

      toast.success("Password updated successfully!");
      
      // Clear URL parameters
      window.history.replaceState({}, '', '/auth');
      
      // Redirect to login
      navigate("/auth");
    } catch (error: any) {
      console.error("Password update failed:", error);
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Invalid Reset Link</h2>
            <p className="text-gray-600 mt-2">This password reset link is invalid or has expired.</p>
            {tokenInfo && (
              <div className="mt-4 p-4 bg-gray-100 rounded text-left text-xs overflow-auto max-h-32">
                <pre>{JSON.stringify(tokenInfo, null, 2)}</pre>
              </div>
            )}
          </div>
          <Button
            onClick={() => navigate("/auth")}
            className="w-full"
          >
            Back to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Lock className="h-8 w-8 mx-auto text-blue-500 mb-2" />
          <h2 className="text-2xl font-bold">Reset Password</h2>
          <p className="text-gray-600 mt-2">
            {userEmail ? `For ${userEmail}` : 'Enter your new password'}
          </p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};
