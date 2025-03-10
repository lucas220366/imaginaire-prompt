
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { AuthForm } from "@/components/auth/AuthForm";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Home, Menu } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

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
          
          <div className="relative z-10 flex flex-col items-end">
            {/* Mobile Menu Button */}
            <Button
              onClick={toggleMenu}
              variant="outline"
              size="icon"
              className="md:hidden mb-2"
            >
              <Menu className="h-4 w-4" />
            </Button>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            </div>
            
            {/* Mobile Menu */}
            {menuOpen && (
              <div className="md:hidden bg-white shadow-md rounded-md p-2 flex flex-col gap-2 w-36">
                <Button
                  onClick={() => {
                    navigate("/");
                    setMenuOpen(false);
                  }}
                  variant="ghost"
                  className="flex items-center justify-start gap-2 h-8"
                  size="sm"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <AuthForm />
    </div>
  );
};

export default Auth;
