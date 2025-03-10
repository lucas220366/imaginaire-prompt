
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Home, User, LogOut, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

type MobileNavProps = {
  onSignOut?: () => Promise<void>;
};

const MobileNav = ({ onSignOut }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { session, signOut } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate('/', { replace: true });
      if (onSignOut) {
        await onSignOut();
      }
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger button */}
      <Button
        variant="outline"
        size="icon"
        className="md:hidden"
        onClick={toggleMenu}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile menu - moved to fixed position with higher z-index */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white/95 md:hidden pt-24">
          <div className="flex flex-col items-center gap-4 p-4">
            <Button
              onClick={() => { 
                navigate("/");
                setIsOpen(false);
              }}
              variant="ghost"
              className="w-full justify-start"
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>

            <Button
              onClick={() => { 
                navigate("/contact");
                setIsOpen(false);
              }}
              variant="ghost"
              className="w-full justify-start"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Contact
            </Button>

            {session ? (
              <>
                <Button
                  onClick={() => { 
                    navigate("/profile");
                    setIsOpen(false);
                  }}
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <User className="mr-2 h-4 w-4" />
                  My Images
                </Button>
                
                {session && (
                  <Button
                    onClick={() => { 
                      navigate("/generator");
                      setIsOpen(false);
                    }}
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Generator
                  </Button>
                )}
                
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                onClick={() => { 
                  navigate("/auth");
                  setIsOpen(false);
                }}
                variant="ghost"
                className="w-full justify-start"
              >
                <User className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
