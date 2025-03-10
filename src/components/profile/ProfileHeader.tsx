
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft, Home, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileNav from "@/components/MobileNav";

interface ProfileHeaderProps {
  onSignOut: () => Promise<void>;
}

const ProfileHeader = ({ onSignOut }: ProfileHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile navigation */}
      <MobileNav onSignOut={onSignOut} />
      
      {/* Desktop navigation - visible only on md and up */}
      <div className="fixed top-4 right-4 z-50 hidden md:flex gap-2 bg-background/80 backdrop-blur-sm py-1 px-2 rounded-md shadow-sm">
        <Button
          variant="outline"
          onClick={() => navigate("/generator")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Generator
        </Button>
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
        <Button
          onClick={onSignOut}
          variant="outline"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>

      {/* Content header - shows on all screens */}
      <div className="bg-white/50 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-gray-100 mb-8 mt-20 md:mt-20">
        <h1 className="text-2xl font-semibold text-gray-800">Your Generated Images</h1>
        <p className="text-gray-600 mt-2">
          View and download all your previously generated images
        </p>
      </div>
    </>
  );
};

export default ProfileHeader;
