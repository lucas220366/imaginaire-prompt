
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft, Home, MessageCircle, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileHeaderProps {
  onSignOut: () => Promise<void>;
}

const ProfileHeader = ({ onSignOut }: ProfileHeaderProps) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div className="flex-grow">
          {/* Title section remains visible on all screen sizes */}
          <div className="bg-white/50 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-gray-100">
            <h1 className="text-2xl font-semibold text-gray-800">Your Generated Images</h1>
            <p className="text-gray-600 mt-2">
              View and download all your previously generated images
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-end ml-4">
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
          
          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden bg-white shadow-md rounded-md p-2 flex flex-col gap-2 w-36">
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
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
