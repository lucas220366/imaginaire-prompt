
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const PasswordResetForm = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      try {
        // First check if we have an access_token in the hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        if (hashParams.has('access_token')) {
          // If we have an access_token, we can try to get the session directly
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.email) {
            console.log("User authenticated with access token:", user.email);
            setUserEmail(user.email);
            setIsTokenValid(true);
            return;
          }
        }

        // If no access_token, look for recovery token
        const token = hashParams.get('token') || new URLSearchParams(window.location.search).get('token');
        
        console.log("Recovery flow params:", {
          hasToken: !!token,
          hasAccessToken: hashParams.has('access_token'),
          currentUrl: window.location.href,
          redirectUrl: 'https://yqbepcvnnnujsgvqmvno.lovable.ai/auth',
          token: token
        });

        if (!token && !hashParams.has('access_token')) {
          console.log("No recovery token found");
          setIsTokenValid(false);
          toast.error("Invalid password reset link");
          return;
        }

        if (token) {
          // Verify the recovery token
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'recovery'
          });

          if (error) {
            console.error("Recovery verification error:", error);
            setIsTokenValid(false);
            toast.error("Password reset link has expired. Please request a new one.");
            return;
          }
        }

        // Get user after verification
        const { data: { user: verifiedUser } } = await supabase.auth.getUser();
        
        if (verifiedUser?.email) {
          console.log("Recovery successful for:", verifiedUser.email);
          setUserEmail(verifiedUser.email);
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
          toast.error("Unable to verify reset link");
        }
      } catch (error) {
        console.error("Token validation error:", error);
        setIsTokenValid(false);
        toast.error("An error occurred while validating your reset link");
      }
    };

    validateToken();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ 
        password: password
      });

      if (error) {
        throw error;
      }

      console.log("Password update successful");
      toast.success("Password updated successfully!");
      
      // Clear URL parameters
      window.history.replaceState({}, '', '/auth');
      
      // Sign out after password update
      await supabase.auth.signOut();
      
      // Redirect to login
      navigate("/auth", { replace: true });
    } catch (error: any) {
      console.error("Password update failed:", error);
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestNewLink = async () => {
    try {
      setIsLoading(true);
      if (userEmail) {
        console.log("Requesting new reset link for:", userEmail);
        const redirectUrl = 'https://yqbepcvnnnujsgvqmvno.lovable.ai/auth';
        console.log("Using redirect URL:", redirectUrl);
        
        const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
          redirectTo: redirectUrl
        });
        if (error) throw error;
        toast.success("New password reset link sent to your email!");
      } else {
        toast.error("No email found. Please try resetting your password from the login page.");
      }
    } catch (error: any) {
      console.error("New link request failed:", error);
      toast.error("Failed to send new reset link");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Reset Link Expired</h2>
            <p className="text-gray-600 mt-2">Your password reset link has expired or is invalid.</p>
          </div>
          <Button 
            onClick={handleRequestNewLink} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Request New Reset Link"}
          </Button>
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => navigate("/auth")}
              className="text-blue-500 hover:text-blue-600"
            >
              Back to Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Reset Password</h2>
          <p className="text-gray-600 mt-2">Enter your new password</p>
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};
