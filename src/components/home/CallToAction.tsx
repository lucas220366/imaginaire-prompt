
import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CallToActionProps {
  isAuthenticated: boolean;
  authReady: boolean;
}

const CallToAction = ({ isAuthenticated, authReady }: CallToActionProps) => {
  const navigate = useNavigate();

  return (
    <div className="text-center mt-8 md:mt-12 space-y-4 md:space-y-6 px-4">
      <p className="text-sm md:text-base text-gray-600 mb-4">
        Ready to start creating? Join now and bring your ideas to life!
      </p>
      
      {/* Always show one of the buttons regardless of authReady state */}
      {isAuthenticated ? (
        <Button
          onClick={() => navigate("/generator")}
          className="text-sm md:text-base px-4 md:px-6 py-2 md:py-3 h-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 w-full sm:w-auto"
        >
          Go to Generator <Rocket className="ml-2 h-4 md:h-5 w-4 md:w-5" />
        </Button>
      ) : (
        <Button
          onClick={() => navigate("/auth")}
          className="text-sm md:text-base px-4 py-2 h-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 w-full sm:w-auto"
        >
          Sign Up Now, It's Free! <ArrowRight className="ml-2" />
        </Button>
      )}
      
      {/* Contact button */}
      <div className="mt-4">
        <Button 
          onClick={() => navigate("/contact")} 
          variant="ghost" 
          className="text-xs md:text-sm text-gray-600"
        >
          <MessageCircle className="mr-2 h-3 md:h-4 w-3 md:w-4" />
          Need help? Contact us
        </Button>
      </div>
    </div>
  );
};

export default CallToAction;
