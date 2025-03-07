
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RequestPasswordResetProps {
  onBackToSignIn: () => void;
}

export const RequestPasswordReset = ({ onBackToSignIn }: RequestPasswordResetProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Ensure we have the correct reset URL with the origin
      const currentOrigin = window.location.origin;
      
      // Use the exact same structure as the current URL to ensure consistent behavior
      const resetUrl = `${currentOrigin}/auth`;
      
      console.log("Password reset request:", {
        email: email,
        redirectUrl: resetUrl,
        currentOrigin: currentOrigin,
        currentUrl: window.location.href,
        supabaseConfig: {
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
      
      const { error, data } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetUrl,
      });
      
      console.log("Password reset response:", { error, data });
      
      if (error) throw error;
      
      toast.success("Password reset email sent! Check your inbox and spam folder.");
      onBackToSignIn();
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Reset Your Password</h2>
        <p className="text-gray-600 mt-2">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={onBackToSignIn}
          className="text-blue-500 hover:text-blue-600"
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
};
