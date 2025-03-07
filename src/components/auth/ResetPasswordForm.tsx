
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock } from "lucide-react";

interface ResetPasswordFormProps {
  userEmail: string | null;
}

export const ResetPasswordForm = ({ userEmail }: ResetPasswordFormProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

  return (
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
  );
};
