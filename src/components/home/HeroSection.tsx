
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
    <div className="text-center space-y-4 mb-12">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mt-8">
        Transform Your Ideas Into Art
      </h1>
      <p className="text-base text-gray-600 max-w-xl mx-auto">
        Create stunning, unique images in seconds using the power of AI. 
        Perfect for artists, designers, and creative minds.
      </p>
      {authReady && isAuthenticated ? (
        <Button
          onClick={() => navigate("/generator")}
          className="text-base px-4 py-2 h-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          Go to Generator <ArrowRight className="ml-2" />
        </Button>
      ) : authReady && !isAuthenticated ? (
        <Button
          onClick={() => navigate("/auth")}
          className="text-base px-4 py-2 h-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          Get Started, It's Free! <ArrowRight className="ml-2" />
        </Button>
      ) : null}
    </div>
  );
};

export default HeroSection;
