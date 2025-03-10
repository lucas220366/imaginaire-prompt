
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import Logo from "@/components/Logo";
import SampleImages from "@/components/image-generator/SampleImages";
import MoreExamples from "@/components/image-generator/MoreExamples";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CallToAction from "@/components/home/CallToAction";
import HomeHeader from "@/components/home/HomeHeader";

const Index = () => {
  const navigate = useNavigate();
  const { session, isLoading, signOut } = useAuth();
  const [authReady, setAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log("Index page - Auth state:", {
      isLoading,
      isAuthenticated: !!session,
      userId: session?.user?.id
    });
    
    // Update authentication state regardless of loading state
    setIsAuthenticated(!!session);
    
    // Only set authReady to true once we're sure about the auth state
    if (!isLoading) {
      setAuthReady(true);
    }
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
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Fixed header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <HomeHeader 
              isAuthenticated={isAuthenticated} 
              authReady={authReady} 
              onSignOut={handleSignOut} 
            />
          </div>
        </div>
      </header>

      {/* Main content with padding for fixed header */}
      <main className="pt-24 pb-8 px-4 container mx-auto max-w-4xl">
        {/* Hero Section */}
        <HeroSection isAuthenticated={isAuthenticated} authReady={authReady} />

        {/* Example Creations Section */}
        <SampleImages />

        {/* Additional Examples Section */}
        <MoreExamples />

        {/* Features Section */}
        <FeaturesSection />

        {/* Call to Action */}
        <CallToAction isAuthenticated={isAuthenticated} authReady={authReady} />
      </main>
    </div>
  );
};

export default Index;
