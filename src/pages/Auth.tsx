
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { AuthForm } from "@/components/auth/AuthForm";
import Logo from "@/components/Logo";
import NavigationMenu from "@/components/layout/NavigationMenu";

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
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Logo />
          <NavigationMenu isAuthenticated={false} />
        </div>
      </div>
      <AuthForm />
    </div>
  );
};

export default Auth;
