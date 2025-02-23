
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onSignOut: () => Promise<void>;
}

const Header = ({ onSignOut }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="absolute top-4 right-4 flex gap-2">
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
