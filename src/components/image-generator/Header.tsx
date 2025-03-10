
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut, User, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { toast } from "sonner";
import Logo from '@/components/Logo';
import MobileNav from '@/components/MobileNav';

interface HeaderProps {
  onSignOut: () => Promise<void>;
}

const Header = ({ onSignOut }: HeaderProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

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
      {/* Mobile menu */}
      <MobileNav onSignOut={onSignOut} />
      
      {/* Desktop menu */}
      <div className="fixed top-4 right-4 z-50 hidden md:flex gap-2 bg-background/80 backdrop-blur-sm py-1 px-2 rounded-md shadow-sm">
        <div className="flex gap-2">
          <Button
            onClick={handleHomeClick}
            variant="outline"
          >
            <Home className="mr-2 h-4 w-4" />
            Home
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
      </div>
    </>
  );
};

export default Header;
