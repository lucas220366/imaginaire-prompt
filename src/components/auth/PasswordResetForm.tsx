
import { useState, useEffect } from "react";
import { ValidationLoading } from "./ValidationLoading";
import { InvalidResetToken } from "./InvalidResetToken";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { validateResetToken, type TokenValidationResult } from "@/utils/auth/token-validation";

interface PasswordResetFormProps {
  resetParams?: Record<string, string | null>;
}

export const PasswordResetForm = ({ resetParams = {} }: PasswordResetFormProps) => {
  const [validationResult, setValidationResult] = useState<TokenValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const runValidation = async () => {
      setIsValidating(true);
      const result = await validateResetToken(resetParams);
      setValidationResult(result);
      setIsValidating(false);
    };

    runValidation();
  }, [resetParams]);

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ValidationLoading />
      </div>
    );
  }

  if (!validationResult?.isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <InvalidResetToken 
          errorMessage={validationResult?.error} 
          tokenInfo={validationResult?.tokenInfo} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ResetPasswordForm userEmail={validationResult.userEmail} />
    </div>
  );
};
