
import { useNavigate, useLocation } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div 
      className="absolute top-4 left-4 z-50 cursor-pointer"
      onClick={() => navigate("/")}
    >
      <span className="text-[#33C3F0] text-[14px] font-medium hover:text-[#1EAEDB] transition-colors">
        vraho.com
      </span>
    </div>
  );
};

export default Logo;
