
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PasswordResetFormProps {
  onCancel?: () => void;
}

export const PasswordResetForm = ({ onCancel }: PasswordResetFormProps) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
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

        console.log("Recovery flow params:", {
          hasAccessToken: !!accessToken,
          hasToken: !!token,
          type: type,
          currentUrl: window.location.href
        });

        if (accessToken) {
          // Handle direct access token case
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.email) {
            setUserEmail(user.email);
            setIsTokenValid(true);
            return;
          }
        }

        if (token && type === 'recovery') {
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
          }
        } else {
          setIsTokenValid(false);
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
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ 
        password: password
      });

      if (error) throw error;

      toast.success("Password updated successfully!");
      
      // Clear URL parameters
      window.history.replaceState({}, '', '/auth');
      
      // Sign out user
      await supabase.auth.signOut();
      
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
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Invalid Reset Link</h2>
          <p className="text-gray-600 mt-2">This password reset link is invalid or has expired.</p>
        </div>
        <Button
          onClick={() => navigate("/auth")}
          className="w-full"
        >
          Back to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      {onCancel && (
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="text-blue-500 hover:text-blue-600 text-sm"
          >
            Back to login
          </button>
        </div>
      )}
    </div>
  );
};
