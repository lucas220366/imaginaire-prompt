
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";

interface NavigationMenuProps {
  showBackToGenerator?: boolean;
  onSignOut?: () => Promise<void>;
  isAuthenticated?: boolean;
}

const NavigationMenu = ({ 
  showBackToGenerator = false, 
  onSignOut, 
  isAuthenticated 
}: NavigationMenuProps) => {
  return (
    <div className="relative z-10">
      {/* Mobile Menu */}
      <MobileMenu 
        showBackToGenerator={showBackToGenerator} 
        onSignOut={onSignOut} 
        isAuthenticated={isAuthenticated} 
      />
      
      {/* Desktop Menu */}
      <DesktopMenu 
        showBackToGenerator={showBackToGenerator} 
        onSignOut={onSignOut} 
        isAuthenticated={isAuthenticated} 
      />
    </div>
  );
};

export default NavigationMenu;
