
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  isAuthenticated: boolean;
  authReady: boolean;
}

const HeroSection = ({ isAuthenticated, authReady }: HeroSectionProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center space-y-6 mb-8 md:mb-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-6 md:mt-8">
        Transform Your Ideas Into Art
      </h1>
      <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto">
        Create stunning, unique images in seconds using the power of AI. 
        Perfect for artists, designers, and creative minds.
      </p>
      
      {/* Always show one of the buttons regardless of authReady state */}
      {isAuthenticated ? (
        <Button
          onClick={() => navigate("/generator")}
          className="text-sm md:text-base px-4 py-2 h-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 w-full sm:w-auto"
        >
          Go to Generator <ArrowRight className="ml-2" />
        </Button>
      ) : (
        <Button
          onClick={() => navigate("/auth")}
          className="text-sm md:text-base px-4 py-2 h-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 w-full sm:w-auto"
        >
          Get Started, It's Free! <ArrowRight className="ml-2" />
        </Button>
      )}
    </div>
  );
};

export default HeroSection;
