
import { useNavigate, useLocation } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div 
      className="absolute top-2 left-4 z-50 cursor-pointer"
      onClick={() => navigate("/")}
    >
      <span className="text-black text-[22px] font-bold hover:text-gray-800 transition-colors">
        vraho.com
      </span>
    </div>
  );
};

export default Logo;
