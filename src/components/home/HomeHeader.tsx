
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileNav from "@/components/MobileNav";

interface HomeHeaderProps {
  isAuthenticated: boolean;
  authReady: boolean;
  onSignOut: () => Promise<void>;
}

const HomeHeader = ({ isAuthenticated, authReady, onSignOut }: HomeHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile navigation */}
      <MobileNav onSignOut={onSignOut} />
      
      {/* Desktop navigation */}
      <div className="absolute top-4 right-4 z-10 hidden md:flex gap-2">
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
    </>
  );
};

export default HomeHeader;
