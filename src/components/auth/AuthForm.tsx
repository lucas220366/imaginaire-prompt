
import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";
import { RequestPasswordReset } from "./RequestPasswordReset";

interface AuthFormProps {
  onResetPassword?: () => void;
}

export const AuthForm = ({ onResetPassword }: AuthFormProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);

  if (isResetMode) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <RequestPasswordReset onBackToSignIn={() => setIsResetMode(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {isSignUp ? (
        <SignUpForm onSwitchToSignIn={() => setIsSignUp(false)} />
      ) : (
        <LoginForm 
          onSwitchToSignUp={() => setIsSignUp(true)} 
          onResetPassword={() => {
            if (onResetPassword) {
              onResetPassword();
            }
            setIsResetMode(true);
          }} 
        />
      )}
    </div>
  );
};
