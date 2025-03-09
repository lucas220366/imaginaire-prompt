
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { AuthForm } from "@/components/auth/AuthForm";
import Logo from "@/components/Logo";

const Auth = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  // Redirect if we have a session
  useEffect(() => {
    if (session) {
      navigate("/generator");
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Logo />
      <AuthForm />
    </div>
  );
};

export default Auth;
