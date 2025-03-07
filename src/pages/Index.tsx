
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Palette, Wand2, ArrowRight, Rocket, User, LogOut } from "lucide-react";
import SampleImages from "@/components/image-generator/SampleImages";
import { useAuth } from "@/components/AuthProvider";
import { useEffect } from "react";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const { session, isLoading, signOut } = useAuth();

  useEffect(() => {
    console.log("Index page - Auth state:", {
      isLoading,
      isAuthenticated: !!session,
      userId: session?.user?.id
    });
  }, [session, isLoading]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate('/');
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header with Profile and Sign Out links */}
      {session && (
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            onClick={() => navigate("/profile")}
            variant="outline"
            className="flex items-center gap-2"
            size="sm"
          >
            <User className="h-4 w-4" />
            Profile
          </Button>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="flex items-center gap-2"
            size="sm"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      )}

      <div className="container mx-auto p-6">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex flex-col items-center gap-2">
            <Rocket className="w-8 h-8 text-[#0FA0CE] animate-bounce" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
              Transform Your Ideas Into Art
            </h1>
          </div>
          <p className="text-base text-gray-600 max-w-xl mx-auto">
            Create stunning, unique images in seconds using the power of AI. 
            Perfect for artists, designers, and creative minds.
          </p>
          {session ? (
            <Button
              onClick={() => navigate("/generator")}
              className="text-base px-4 py-2 h-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              Go to Generator <ArrowRight className="ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/auth")}
              className="text-base px-4 py-2 h-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              Get Started <ArrowRight className="ml-2" />
            </Button>
          )}
        </div>

        {/* Example Creations Section */}
        <SampleImages />

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
            <p className="text-gray-600">
              Simply describe what you want to see, and watch as AI brings your vision to life in seconds.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Palette className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Endless Possibilities</h3>
            <p className="text-gray-600">
              Create any style of image you can imagine, from photorealistic scenes to artistic illustrations.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Wand2 className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Customizable</h3>
            <p className="text-gray-600">
              Fine-tune your results with adjustable settings for size, style, and other parameters.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Ready to start creating? Join now and bring your ideas to life!
          </p>
          {!session && (
            <Button
              onClick={() => navigate("/auth")}
              variant="outline"
              className="text-sm"
              size="sm"
            >
              Sign Up Now <ArrowRight className="ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
