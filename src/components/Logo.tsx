
import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="absolute top-4 left-4 z-50 cursor-pointer"
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
