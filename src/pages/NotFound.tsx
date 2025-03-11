
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Logo from '@/components/Logo';
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import MobileNav from "@/components/MobileNav";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      {/* Fixed header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Logo />
            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-2">
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
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex items-center justify-center min-h-screen pt-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
          <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
