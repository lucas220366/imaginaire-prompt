
import { Button } from "@/components/ui/button";
import { User, LogOut, MessageCircle, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface HomeHeaderProps {
  isAuthenticated: boolean;
  authReady: boolean;
  onSignOut: () => Promise<void>;
}

const HomeHeader = ({ isAuthenticated, authReady, onSignOut }: HomeHeaderProps) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col items-end">
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
          onClick={() => navigate("/contact")}
          variant="outline"
          className="flex items-center gap-2"
          size="sm"
        >
          <MessageCircle className="h-4 w-4" />
          Contact
        </Button>
        
        {/* Always show one of the buttons regardless of authReady state */}
        {isAuthenticated ? (
          <>
            <Button
              onClick={() => navigate("/profile")}
              variant="outline"
              className="flex items-center gap-2"
              size="sm"
            >
              <User className="h-4 w-4" />
              My Images
            </Button>
            <Button
              onClick={onSignOut}
              variant="outline"
              className="flex items-center gap-2"
              size="sm"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </>
        ) : (
          <Button
            onClick={() => navigate("/auth")}
            variant="outline"
            className="flex items-center gap-2"
            size="sm"
          >
            <User className="h-4 w-4" />
            Sign In
          </Button>
        )}
      </div>
      
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md rounded-md p-2 flex flex-col gap-2 w-36">
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
              <Button
                onClick={() => {
                  onSignOut();
                  setMenuOpen(false);
                }}
                variant="ghost"
                className="flex items-center justify-start gap-2 h-8"
                size="sm"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
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

export default HomeHeader;
