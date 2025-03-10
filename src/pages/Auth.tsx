
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { AuthForm } from "@/components/auth/AuthForm";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import MobileNav from "@/components/MobileNav";

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
      {/* Fixed header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm shadow-sm">
        <div className="flex justify-between items-center h-16">
          <Logo />
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-2 mr-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          </div>
          {/* Mobile navigation */}
          <MobileNav />
        </div>
      </header>
      
      {/* Main content with padding for fixed header */}
      <main className="pt-20">
        <AuthForm />
      </main>
    </div>
  );
};

export default Auth;
