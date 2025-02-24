
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
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const type = hashParams.get('type');
        const accessToken = hashParams.get('access_token');

        console.log("Recovery flow type:", type);
        console.log("Access token present:", !!accessToken);

        if (!accessToken) {
          console.log("No access token found");
          setIsTokenValid(false);
          toast.error("Invalid password reset link");
          return;
        }

        // First verify the token
        const { data, error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: accessToken,
          type: 'recovery'
        });

        if (verifyError) {
          console.error("Token verification error:", verifyError);
          setIsTokenValid(false);
          toast.error("Password reset link has expired. Please request a new one.");
          return;
        }

        if (data.user?.email) {
          console.log("Token verified for email:", data.user.email);
          setUserEmail(data.user.email);
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
          toast.error("Unable to verify reset link");
        }
      } catch (error) {
        console.error("Error in token validation:", error);
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
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const { data, error } = await supabase.auth.updateUser({ 
        password: password
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        console.log("Password updated successfully");
        toast.success("Password updated successfully!");
        window.location.hash = '';
        navigate("/auth", { replace: true });
      }
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestNewLink = async () => {
    try {
      setIsLoading(true);
      if (userEmail) {
        const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
          redirectTo: `${window.location.origin}/auth/reset-password`
        });
        if (error) throw error;
        toast.success("New password reset link sent to your email!");
      } else {
        toast.error("No email found. Please try resetting your password from the login page.");
      }
    } catch (error: any) {
      console.error("Error requesting new link:", error);
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
