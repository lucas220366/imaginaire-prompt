
import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="cursor-pointer z-10"
      onClick={() => navigate("/")}
    >
      <span className="text-black text-lg md:text-[22px] font-bold hover:text-gray-800 transition-colors">
        vraho.com
      </span>
    </div>
  );
};

export default Logo;
