
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
    <div className="min-h-screen p-6 animate-fade-in" style={{
      backgroundImage: "radial-gradient(circle at center, rgba(255, 255, 255, 0.8) 0%, rgba(240, 240, 240, 0.6) 100%)"
    }}>
      {/* Header with Profile and Sign Out links */}
      {session && (
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            onClick={() => navigate("/profile")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Profile
          </Button>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      )}

      <div className="max-w-6xl mx-auto pt-16 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="flex flex-col items-center gap-2">
            <Rocket className="w-12 h-12 text-[#0FA0CE] animate-bounce" />
            <h1 className="text-5xl font-bold text-gray-800 animate-fade-up">
              Transform Your Ideas Into Art
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-up">
            Create stunning, unique images in seconds using the power of AI. 
            Perfect for artists, designers, and creative minds.
          </p>
          {session ? (
            <Button
              onClick={() => navigate("/generator")}
              className="text-lg px-8 py-6 h-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 animate-fade-up"
            >
              Go to Generator <ArrowRight className="ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6 h-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 animate-fade-up"
            >
              Get Started <ArrowRight className="ml-2" />
            </Button>
          )}
          
          {/* Example Creations Section */}
          <SampleImages />
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 pt-8">
          <div className="bg-white/60 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-100 animate-fade-up">
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
            <p className="text-gray-600">
              Simply describe what you want to see, and watch as AI brings your vision to life in seconds.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-100 animate-fade-up">
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
              <Palette className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Endless Possibilities</h3>
            <p className="text-gray-600">
              Create any style of image you can imagine, from photorealistic scenes to artistic illustrations.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-100 animate-fade-up">
            <div className="h-12 w-12 rounded-lg bg-pink-100 flex items-center justify-center mb-4">
              <Wand2 className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Customizable</h3>
            <p className="text-gray-600">
              Fine-tune your results with adjustable settings for size, style, and other parameters.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center pt-8">
          <p className="text-gray-600 mb-6">
            Ready to start creating? Join now and bring your ideas to life!
          </p>
          {!session && (
            <Button
              onClick={() => navigate("/auth")}
              variant="outline"
              className="text-lg animate-fade-up"
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
