
import { useNavigate, useLocation } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div 
      className="absolute top-4 left-4 z-50 flex items-center gap-2 cursor-pointer"
      onClick={() => navigate("/")}
    >
      <img 
        src="/lovable-uploads/f464ef73-a167-4019-9205-cfcc1821aa26.png" 
        alt="Rocket Logo" 
        className="h-16 w-16 hover:scale-110 transition-transform duration-200"
      />
      <span className="text-[#33C3F0] text-[14px] font-medium hover:text-[#1EAEDB] transition-colors">
        vraho.com
      </span>
    </div>
  );
};

export default Logo;
