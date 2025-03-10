
import { useNavigate } from "react-router-dom";
import NavigationMenu from "@/components/layout/NavigationMenu";

interface HomeHeaderProps {
  isAuthenticated: boolean;
  authReady: boolean;
  onSignOut: () => Promise<void>;
}

const HomeHeader = ({ isAuthenticated, authReady, onSignOut }: HomeHeaderProps) => {
  return (
    <NavigationMenu 
      isAuthenticated={isAuthenticated} 
      onSignOut={onSignOut} 
    />
  );
};

export default HomeHeader;
