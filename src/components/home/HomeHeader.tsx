
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
    <div className="flex justify-end items-center h-16">
      {/* Mobile navigation */}
      <MobileNav onSignOut={onSignOut} />
      
      {/* Desktop navigation */}
      <div className="hidden md:flex items-center gap-2 mr-4">
        {/* Always show one of the buttons regardless of authReady state */}
        {isAuthenticated ? (
          <>
            <Button
              onClick={() => navigate("/profile")}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              My Images
            </Button>
            <Button
              onClick={onSignOut}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </>
        ) : (
          <Button
            onClick={() => navigate("/auth")}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
};

export default HomeHeader;
