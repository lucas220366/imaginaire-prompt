
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
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      setIsValidating(true);
      try {
        // Get current URL parameters from hash and search
        const fragment = new URLSearchParams(window.location.hash.substring(1));
        const query = new URLSearchParams(window.location.search);
        
        // Extract access token, token, and type from URL
        const accessToken = fragment.get('access_token');
        const token = fragment.get('token') || query.get('token');
        const type = fragment.get('type') || query.get('type');
        
        // Store token info for debugging
        const info = {
          currentUrl: window.location.href,
          urlHash: window.location.hash,
          urlSearch: window.location.search,
          hasAccessToken: !!accessToken,
          hasToken: !!token,
          type: type,
          isHashRecovery: window.location.hash.includes('type=recovery'),
          isQueryRecovery: window.location.search.includes('type=recovery')
        };
        
        setTokenInfo(info);
        console.log("Password reset validation attempt:", info);
        
        // First, try to get the current user from the session
        const { data: { session } } = await supabase.auth.getSession();
        const { data: { user } } = await supabase.auth.getUser();
        
        console.log("Current auth state:", {
          hasSession: !!session,
          hasUser: !!user,
          email: user?.email
        });
        
        if (user && user.email) {
          // User is already authenticated, good to proceed
          setUserEmail(user.email);
          setIsTokenValid(true);
          console.log("User already authenticated:", user.email);
          setIsValidating(false);
          return;
        }
        
        // If we have access token in the URL but no user yet, try to use it
        if (accessToken && type === 'recovery') {
          try {
            // This might be a direct auth link with an access token
            const { data, error } = await supabase.auth.getUser(accessToken);
            
            if (!error && data && data.user) {
              setUserEmail(data.user.email);
              setIsTokenValid(true);
              console.log("Valid user from access token:", data.user.email);
              setIsValidating(false);
              return;
            }
          } catch (accessError) {
            console.error("Error getting user with access token:", accessError);
          }
        }
        
        // Try to verify the token if we have one
        if (token && type === 'recovery') {
          try {
            console.log("Attempting to verify recovery token...");
            const { data, error } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: 'recovery'
            });
            
            console.log("Token verification result:", { data, error });
            
            if (error) {
              console.error("Token verification failed:", error);
              setIsValidating(false);
              throw error;
            }
            
            // Get user after verification
            const { data: userData } = await supabase.auth.getUser();
            if (userData.user?.email) {
              setUserEmail(userData.user.email);
              setIsTokenValid(true);
              console.log("Valid user from token verification:", userData.user.email);
              setIsValidating(false);
              return;
            }
          } catch (verifyError) {
            console.error("Error during OTP verification:", verifyError);
          }
        }
        
        // If we got here, no valid token or session was found
        console.error("No valid token or session found");
        setIsTokenValid(false);
        setIsValidating(false);
        
        // Show appropriate error message
        if (!type && !token && !accessToken) {
          toast.error("Missing password reset parameters", {
            description: "The password reset link is incomplete"
          });
        } else {
          toast.error("Invalid or expired reset link", {
            description: "Please request a new password reset email"
          });
        }
      } catch (error) {
        console.error("Token validation error:", error);
        setIsTokenValid(false);
        setIsValidating(false);
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

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <h2 className="text-2xl font-bold">Validating Reset Link</h2>
          <p className="text-gray-600">Please wait while we validate your password reset link...</p>
          <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Invalid Reset Link</h2>
            <p className="text-gray-600 mt-2">This password reset link is invalid or has expired.</p>
            
            {tokenInfo && (
              <div className="mt-4 p-4 bg-gray-100 rounded text-left text-xs overflow-auto max-h-44">
                <p className="font-semibold mb-2">Debug Information:</p>
                <pre>{JSON.stringify(tokenInfo, null, 2)}</pre>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <Button
              onClick={() => navigate("/auth")}
              className="w-full"
            >
              Back to Sign In
            </Button>
            
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                If you need to reset your password, please request a new reset link from the sign in page.
              </p>
            </div>
          </div>
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
