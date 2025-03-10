
import { useNavigate, useLocation } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div 
      className="fixed top-4 left-4 z-50 cursor-pointer bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm"
      onClick={() => navigate("/")}
    >
      <span className="text-black text-[22px] font-bold hover:text-gray-800 transition-colors">
        vraho.com
      </span>
    </div>
  );
};

export default Logo;
