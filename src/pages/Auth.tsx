
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { AuthForm } from "@/components/auth/AuthForm";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

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
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        </div>
      </div>
      <AuthForm />
    </div>
  );
};

export default Auth;
