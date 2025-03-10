
import { useNavigate, useLocation } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div 
      className="flex items-center h-16 ml-4 cursor-pointer"
      onClick={() => navigate("/")}
    >
      <span className="text-black text-[22px] font-bold hover:text-gray-800 transition-colors">
        vraho.com
      </span>
    </div>
  );
};

export default Logo;
