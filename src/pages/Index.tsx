
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";

const Index = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-8 p-4">
        <h1 className="text-4xl font-bold">Welcome to Image Generator</h1>
        <p className="text-xl text-gray-600">Create amazing images with AI</p>
        
        <div className="space-y-4">
          {session ? (
            <Button 
              onClick={() => navigate("/generator")} 
              className="px-8 py-2"
            >
              Go to Generator
            </Button>
          ) : (
            <div className="space-y-4">
              <Button 
                onClick={() => navigate("/auth")} 
                className="px-8 py-2"
              >
                Sign In
              </Button>
              <p className="text-sm text-gray-500">
                New here? You can create an account when signing in.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
