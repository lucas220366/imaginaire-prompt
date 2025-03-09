
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Palette, Wand2, ArrowRight, Rocket, User, LogOut, MessageCircle } from "lucide-react";
import SampleImages from "@/components/image-generator/SampleImages";
import MoreExamples from "@/components/image-generator/MoreExamples";
import { useAuth } from "@/components/AuthProvider";
import { useEffect } from "react";
import { toast } from "sonner";
import Logo from "@/components/Logo";

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
      {/* Logo component */}
      <Logo />

      {/* Header with Profile, Contact and Sign Out links */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          onClick={() => navigate("/contact")}
          variant="outline"
          className="flex items-center gap-2"
          size="sm"
        >
          <MessageCircle className="h-4 w-4" />
          Contact
        </Button>
        
        {session ? (
          <>
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
          </>
        ) : (
          <Button
            onClick={() => navigate("/auth")}
            variant="outline"
            className="flex items-center gap-2"
            size="sm"
          >
            <User className="h-4 w-4" />
            Sign In
          </Button>
        )}
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mt-8">
            Transform Your Ideas Into Art
          </h1>
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

        {/* Additional Examples Section */}
        <MoreExamples />

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white/50 backdrop-blur-lg rounded-lg p-6 text-center shadow-md border border-gray-100">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
            <p className="text-gray-600">
              Simply describe what you want to see, and watch as AI brings your vision to life in seconds.
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur-lg rounded-lg p-6 text-center shadow-md border border-gray-100">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Palette className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Endless Possibilities</h3>
            <p className="text-gray-600">
              Create any style of image you can imagine, from photorealistic scenes to artistic illustrations.
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur-lg rounded-lg p-6 text-center shadow-md border border-gray-100">
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
      </div>
    </div>
  );
};

export default Index;
