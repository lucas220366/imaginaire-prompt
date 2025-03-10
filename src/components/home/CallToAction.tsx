
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
    <div className="text-center mt-12 space-y-6">
      <p className="text-gray-600 mb-4">
        Ready to start creating? Join now and bring your ideas to life!
      </p>
      
      {/* Always show the appropriate button based on authentication status */}
      {isAuthenticated ? (
        <Button
          onClick={() => navigate("/generator")}
          className="text-base px-6 py-3 h-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          Go to Generator <Rocket className="ml-2 h-5 w-5" />
        </Button>
      ) : authReady && (
        <Button
          onClick={() => navigate("/auth")}
          className="text-base px-4 py-2 h-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          Sign Up Now, It's Free! <ArrowRight className="ml-2" />
        </Button>
      )}
      
      {/* Contact button */}
      <div className="mt-4">
        <Button 
          onClick={() => navigate("/contact")} 
          variant="ghost" 
          className="text-sm text-gray-600"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Need help? Contact us
        </Button>
      </div>
    </div>
  );
};

export default CallToAction;
