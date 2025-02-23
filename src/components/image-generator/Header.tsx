
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut, User, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { toast } from "sonner";

interface HeaderProps {
  onSignOut: () => Promise<void>;
}

const Header = ({ onSignOut }: HeaderProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleHomeClick = () => {
    console.log("Home button clicked");
    window.location.href = '/';
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      await onSignOut();
      toast.success("Signed out successfully");
      navigate('/auth');
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="absolute top-4 left-0 right-0 flex justify-center md:justify-end md:right-4 px-4">
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
          Profile
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
  );
};

export default Header;
