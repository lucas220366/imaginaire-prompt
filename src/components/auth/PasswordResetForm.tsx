
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

  // Get the recovery token from the URL when the component mounts
  useEffect(() => {
    const setupRecoverySession = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const recoveryToken = hashParams.get('access_token');

        if (recoveryToken) {
          console.log("Found recovery token, setting up session");
          const { data, error } = await supabase.auth.refreshSession({
            refresh_token: recoveryToken
          });

          if (error) {
            console.error("Error setting up recovery session:", error);
            toast.error("Error setting up recovery session");
          } else if (data?.session) {
            console.log("Recovery session established");
          }
        }
      } catch (error) {
        console.error("Error in recovery setup:", error);
      }
    };

    setupRecoverySession();
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
        navigate("/generator", { replace: true });
      }
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error(error.message || "Failed to update password");
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
