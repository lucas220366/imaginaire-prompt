
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, MessageCircle, User, LogOut, ArrowLeft } from "lucide-react";

interface DesktopMenuProps {
  showBackToGenerator?: boolean;
  onSignOut?: () => Promise<void>;
  isAuthenticated?: boolean;
}

const DesktopMenu = ({ 
  showBackToGenerator = false, 
  onSignOut, 
  isAuthenticated 
}: DesktopMenuProps) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    if (onSignOut) {
      await onSignOut();
    }
  };

  return (
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
  );
};

export default DesktopMenu;
