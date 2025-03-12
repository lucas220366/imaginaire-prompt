
import { useNavigate } from "react-router-dom";
import Logo from '@/components/Logo';
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import MobileNav from "@/components/MobileNav";

export const NotFoundHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Logo />
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          </div>
          {/* Mobile navigation */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
};
