
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut, User, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";

interface HeaderProps {
  onSignOut: () => Promise<void>;
}

const Header = ({ onSignOut }: HeaderProps) => {
  const navigate = useNavigate();
  const { session } = useAuth();

  const handleHomeClick = () => {
    // Only navigate if we have an active session
    if (session) {
      navigate("/generator");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="absolute top-4 right-4 flex gap-2">
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
        onClick={onSignOut}
        variant="outline"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
};

export default Header;
