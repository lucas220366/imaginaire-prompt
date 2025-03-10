
import { Button } from "@/components/ui/button";
import { User, LogOut, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HomeHeaderProps {
  isAuthenticated: boolean;
  authReady: boolean;
  onSignOut: () => Promise<void>;
}

const HomeHeader = ({ isAuthenticated, authReady, onSignOut }: HomeHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="absolute top-4 right-4 z-10 flex gap-2">
      <Button
        onClick={() => navigate("/contact")}
        variant="outline"
        className="flex items-center gap-2"
        size="sm"
      >
        <MessageCircle className="h-4 w-4" />
        Contact
      </Button>
      
      {authReady && isAuthenticated ? (
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
      ) : authReady && !isAuthenticated ? (
        <Button
          onClick={() => navigate("/auth")}
          variant="outline"
          className="flex items-center gap-2"
          size="sm"
        >
          <User className="h-4 w-4" />
          Sign In
        </Button>
      ) : null}
    </div>
  );
};

export default HomeHeader;
