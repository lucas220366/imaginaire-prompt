
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, Home, MessageCircle, User, LogOut, ArrowLeft } from "lucide-react";

interface NavigationMenuProps {
  showBackToGenerator?: boolean;
  onSignOut?: () => Promise<void>;
  isAuthenticated?: boolean;
}

const NavigationMenu = ({ 
  showBackToGenerator = false, 
  onSignOut, 
  isAuthenticated 
}: NavigationMenuProps) => {
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
        {showBackToGenerator && (
          <Button
            variant="outline"
            onClick={() => navigate("/generator")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Generator
          </Button>
        )}
        
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Home
        </Button>
        
        <Button
          variant="outline"
          onClick={() => navigate("/contact")}
          className="flex items-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          Contact
        </Button>
        
        {isAuthenticated ? (
          <>
            <Button
              variant="outline"
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              My Images
            </Button>
            
            {onSignOut && (
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            )}
          </>
        ) : (
          <Button
            variant="outline"
            onClick={() => navigate("/auth")}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Sign In
          </Button>
        )}
      </div>
      
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md rounded-md p-2 flex flex-col gap-2 w-36">
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
                  onClick={() => {
                    handleSignOut();
                    setMenuOpen(false);
                  }}
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

export default NavigationMenu;
