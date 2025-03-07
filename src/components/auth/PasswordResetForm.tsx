
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock, AlertTriangle } from "lucide-react";

interface PasswordResetFormProps {
  resetParams?: Record<string, string | null>;
}

export const PasswordResetForm = ({ resetParams = {} }: PasswordResetFormProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [tokenValidationError, setTokenValidationError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      setIsValidating(true);
      setTokenValidationError(null);
      try {
        // Get parameters from both props, hash and query
        const fragment = new URLSearchParams(window.location.hash.substring(1));
        const query = new URLSearchParams(window.location.search);
        
        // Extract tokens and types from different sources
        const accessToken = resetParams?.accessToken || fragment.get('access_token');
        const token = resetParams?.token || fragment.get('token') || query.get('token');
        const type = resetParams?.type || fragment.get('type') || query.get('type');
        
        // Store token info for debugging
        const info = {
          currentUrl: window.location.href,
          urlHash: window.location.hash,
          urlSearch: window.location.search,
          accessToken: accessToken ? "present" : null,
          token: token ? "present" : null,
          type: type,
          isHashRecovery: window.location.hash.includes('type=recovery'),
          isQueryRecovery: window.location.search.includes('type=recovery'),
          resetParams: resetParams,
          supabaseConfig: {
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        };
        
        setTokenInfo(info);
        console.log("Password reset validation attempt:", info);
        
        // First, check if user is already authenticated
        const { data: { session } } = await supabase.auth.getSession();
        const { data: { user } } = await supabase.auth.getUser();
        
        console.log("Current auth state:", {
          hasSession: !!session,
          hasUser: !!user,
          userEmail: user?.email
        });
        
        if (user && user.email) {
          // User is already authenticated, good to proceed
          setUserEmail(user.email);
          setIsTokenValid(true);
          console.log("User already authenticated:", user.email);
          setIsValidating(false);
          return;
        }
        
        // Try with access token if available
        if (accessToken) {
          try {
            console.log("Trying to get user with access token");
            const { data, error } = await supabase.auth.getUser(accessToken);
            
            if (!error && data && data.user) {
              setUserEmail(data.user.email);
              setIsTokenValid(true);
              console.log("Valid user from access token:", data.user.email);
              setIsValidating(false);
              return;
            } else {
              console.error("Error getting user with access token:", error);
              setTokenValidationError("Access token is invalid or expired");
            }
          } catch (accessError) {
            console.error("Error getting user with access token:", accessError);
            setTokenValidationError("Error processing access token");
          }
        }
        
        // Try with recovery token if available
        if (token && (type === 'recovery' || !type)) {
          try {
            console.log("Attempting to verify recovery token:", token);
            const { data, error } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: 'recovery'
            });
            
            console.log("Token verification result:", { data, error });
            
            if (error) {
              console.error("Token verification failed:", error);
              setTokenValidationError(`Token verification failed: ${error.message}`);
              setIsValidating(false);
              return;
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
          } catch (verifyError: any) {
            console.error("Error during OTP verification:", verifyError);
            setTokenValidationError(`OTP verification error: ${verifyError.message || "Unknown error"}`);
          }
        }
        
        // If we got here, no valid token or session was found
        console.error("No valid token or session found");
        setIsTokenValid(false);
        setIsValidating(false);
        
        // Set appropriate error message if none is set yet
        if (!tokenValidationError) {
          if (!type && !token && !accessToken) {
            setTokenValidationError("Missing password reset parameters");
          } else {
            setTokenValidationError("Invalid or expired reset link");
          }
        }
      } catch (error: any) {
        console.error("Token validation error:", error);
        setIsTokenValid(false);
        setIsValidating(false);
        setTokenValidationError(`Error validating reset link: ${error.message || "Unknown error"}`);
      }
    };

    validateToken();
  }, [resetParams]);

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
      console.log("Attempting to update password");
      const { error, data } = await supabase.auth.updateUser({ 
        password: password
      });

      console.log("Password update result:", { error, data });

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
            <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-2" />
            <h2 className="text-2xl font-bold">Invalid Reset Link</h2>
            <p className="text-gray-600 mt-2">
              {tokenValidationError || "This password reset link is invalid or has expired."}
            </p>
            
            <div className="mt-6 p-4 bg-gray-100 rounded text-left text-sm overflow-auto max-h-60">
              <p className="font-semibold mb-2">Debugging Information:</p>
              <details>
                <summary className="cursor-pointer text-blue-500 hover:text-blue-700">
                  Show Details (Click to expand)
                </summary>
                <pre className="mt-2 text-xs whitespace-pre-wrap break-all">
                  {JSON.stringify(tokenInfo, null, 2)}
                </pre>
              </details>
            </div>
          </div>
          
          <div className="space-y-4 mt-6">
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
