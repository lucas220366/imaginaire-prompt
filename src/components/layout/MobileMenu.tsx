
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, Home, MessageCircle, User, LogOut, ArrowLeft } from "lucide-react";

interface MobileMenuProps {
  showBackToGenerator?: boolean;
  onSignOut?: () => Promise<void>;
  isAuthenticated?: boolean;
}

const MobileMenu = ({ 
  showBackToGenerator = false, 
  onSignOut, 
  isAuthenticated 
}: MobileMenuProps) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleSignOut = async () => {
    if (onSignOut) {
      await onSignOut();
    }
    setMenuOpen(false);
  };

  return (
    <div className="md:hidden relative">
      {/* Mobile Menu Button */}
      <Button
        onClick={toggleMenu}
        variant="outline"
        size="icon"
        className="ml-auto"
      >
        <Menu className="h-4 w-4" />
      </Button>
      
      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="absolute right-0 top-10 bg-white shadow-md rounded-md p-2 flex flex-col gap-2 w-36 z-50">
          {showBackToGenerator && (
            <Button
              onClick={() => {
                navigate("/generator");
                setMenuOpen(false);
              }}
              variant="ghost"
              className="flex items-center justify-start gap-2 h-8"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Generator
            </Button>
          )}
          
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
          
          <Button
            onClick={() => {
              navigate("/contact");
              setMenuOpen(false);
            }}
            variant="ghost"
            className="flex items-center justify-start gap-2 h-8"
            size="sm"
          >
            <MessageCircle className="h-4 w-4" />
            Contact
          </Button>
          
          {isAuthenticated ? (
            <>
              <Button
                onClick={() => {
                  navigate("/profile");
                  setMenuOpen(false);
                }}
                variant="ghost"
                className="flex items-center justify-start gap-2 h-8"
                size="sm"
              >
                <User className="h-4 w-4" />
                My Images
              </Button>
              
              {onSignOut && (
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  className="flex items-center justify-start gap-2 h-8"
                  size="sm"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              )}
            </>
          ) : (
            <Button
              onClick={() => {
                navigate("/auth");
                setMenuOpen(false);
              }}
              variant="ghost"
              className="flex items-center justify-start gap-2 h-8"
              size="sm"
            >
              <User className="h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
