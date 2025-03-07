
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface InvalidResetTokenProps {
  errorMessage: string | null;
  tokenInfo: any;
}

export const InvalidResetToken = ({ errorMessage, tokenInfo }: InvalidResetTokenProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-2" />
        <h2 className="text-2xl font-bold">Invalid Reset Link</h2>
        <p className="text-gray-600 mt-2">
          {errorMessage || "This password reset link is invalid or has expired."}
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
  );
};
