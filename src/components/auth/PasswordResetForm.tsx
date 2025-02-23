
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const PasswordResetForm = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Set the access token from the URL hash if present
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    
    if (accessToken && refreshToken) {
      console.log("Setting session from recovery token");
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      }).then(({ error }) => {
        if (error) {
          console.error("Error setting session:", error);
          toast.error("Error setting up password reset. Please try again.");
        }
      });
    } else {
      console.error("Missing tokens in URL");
      toast.error("Invalid password reset link. Please request a new one.");
    }
  }, []);

  const handleUpdatePassword = async (newPassword: string) => {
    try {
      setIsLoading(true);
      
      // First verify we have an active session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No active session. Please request a new password reset link.");
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      
      toast.success("Password updated successfully!");
      navigate("/generator");
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Reset Password</h2>
          <p className="text-gray-600 mt-2">Enter your new password</p>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          handleUpdatePassword(password);
        }} className="space-y-4">
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
