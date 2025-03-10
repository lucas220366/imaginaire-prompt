
import React from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { toast } from "sonner";
import Logo from '@/components/Logo';
import NavigationMenu from '@/components/layout/NavigationMenu';

interface HeaderProps {
  onSignOut: () => Promise<void>;
}

const Header = ({ onSignOut }: HeaderProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

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
    <div className="flex justify-between items-center">
      <Logo />
      <NavigationMenu 
        isAuthenticated={true} 
        onSignOut={handleSignOut} 
      />
    </div>
  );
};

export default Header;
