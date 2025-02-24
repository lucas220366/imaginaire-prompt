
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
  const navigate = useNavigate();

  // Get the recovery token from the URL when the component mounts
  useEffect(() => {
    const validateToken = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const recoveryToken = hashParams.get('access_token');

        if (!recoveryToken) {
          console.log("No recovery token found");
          setIsTokenValid(false);
          return;
        }

        console.log("Found recovery token, validating session");
        const { data, error } = await supabase.auth.refreshSession({
          refresh_token: recoveryToken
        });

        if (error) {
          console.error("Error validating recovery token:", error);
          setIsTokenValid(false);
          if (error.message.includes("expired")) {
            toast.error("Password reset link has expired. Please request a new one.");
          } else {
            toast.error("Invalid password reset link");
          }
        } else if (data?.session) {
          console.log("Recovery token is valid");
          setIsTokenValid(true);
        }
      } catch (error) {
        console.error("Error in recovery validation:", error);
        setIsTokenValid(false);
      }
    };

    validateToken();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Starting password update...");
      
      const { data, error } = await supabase.auth.updateUser({ 
        password: password 
      });

      if (error) {
        console.error("Password update error:", error);
        throw error;
      }

      if (data.user) {
        console.log("Password updated successfully for user:", data.user.id);
        toast.success("Password updated successfully!");
        
        // Clear the hash and navigate
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
      const { data: session } = await supabase.auth.getSession();
      if (session?.user?.email) {
        const { error } = await supabase.auth.resetPasswordForEmail(session.user.email, {
          redirectTo: `${window.location.origin}/auth/reset-password`
        });
        if (error) throw error;
        toast.success("New password reset link sent to your email!");
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
