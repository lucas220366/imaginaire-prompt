
import { Link } from "react-router-dom";
import NotFoundIllustration from "./NotFoundIllustration";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export const NotFoundContent = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
        404 - Page Not Found
      </h1>
      
      <NotFoundIllustration />
      
      <div className="max-w-md mx-auto">
        <p className="text-xl text-gray-600 mb-6 animate-fade-up">
          Oops! The AI couldn't generate this page. It seems to be missing from our canvas.
        </p>
        
        <div className="flex justify-center">
          <Button 
            asChild 
            size="lg" 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Link to="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Return to Canvas
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
