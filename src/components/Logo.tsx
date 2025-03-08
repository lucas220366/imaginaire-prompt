
import { useNavigate, useLocation } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Don't show the logo on the home page
  if (location.pathname === '/') {
    return null;
  }
  
  return (
    <div 
      className="absolute top-4 left-24 z-50 cursor-pointer"
      onClick={() => navigate("/")}
    >
      <img 
        src="/lovable-uploads/f464ef73-a167-4019-9205-cfcc1821aa26.png" 
        alt="Rocket Logo" 
        className="h-16 w-16 hover:scale-110 transition-transform duration-200"
      />
    </div>
  );
};

export default Logo;
