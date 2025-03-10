
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { LogOut, User, Home, MessageCircle, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { toast } from "sonner";
import Logo from '@/components/Logo';

interface HeaderProps {
  onSignOut: () => Promise<void>;
}

const Header = ({ onSignOut }: HeaderProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleHomeClick = () => {
    console.log("Home button clicked");
    navigate('/');
  };

  const handleSignOut = async () => {
    try {
      console.log("Starting sign out process");
      await signOut();
      console.log("Sign out successful, navigating to auth page");
      toast.success("Signed out successfully");
      // Navigate first, then call the prop function to avoid timing issues
      navigate('/', { replace: true });
      // Call onSignOut as a final cleanup step
      await onSignOut();
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <>
      <Logo />
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
            onClick={handleHomeClick}
            variant="outline"
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button
            onClick={() => navigate("/contact")}
            variant="outline"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Contact
          </Button>
          <Button
            onClick={() => navigate("/profile")}
            variant="outline"
          >
            <User className="mr-2 h-4 w-4" />
            My Images
          </Button>
          <Button
            onClick={handleSignOut}
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
                handleHomeClick();
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
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
