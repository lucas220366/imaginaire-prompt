
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft, Home, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileNav from "@/components/MobileNav";
import Logo from "@/components/Logo";

interface ProfileHeaderProps {
  onSignOut: () => Promise<void>;
}

const ProfileHeader = ({ onSignOut }: ProfileHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Fixed header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Logo />
            
            {/* Mobile navigation */}
            <MobileNav onSignOut={onSignOut} />
            
            {/* Desktop navigation - visible only on md and up */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/generator")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Generator
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/contact")}
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Contact
              </Button>
              <Button
                onClick={onSignOut}
                variant="outline"
                size="sm"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content header - shows on all screens */}
      <div className="bg-white/50 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-gray-100 mb-8 mt-24">
        <h1 className="text-2xl font-semibold text-gray-800">Your Generated Images</h1>
        <p className="text-gray-600 mt-2">
          View and download all your previously generated images
        </p>
      </div>
    </>
  );
};

export default ProfileHeader;
