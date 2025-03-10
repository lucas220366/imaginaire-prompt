
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
    
    // Only set authReady to true once we're sure about the auth state
    if (!isLoading) {
      setAuthReady(true);
      setIsAuthenticated(!!session);
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
    <div className="min-h-screen">
      {/* Logo component */}
      <Logo />

      {/* Header with Profile, Contact and Sign Out links */}
      <HomeHeader 
        isAuthenticated={isAuthenticated} 
        authReady={authReady} 
        onSignOut={handleSignOut} 
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
      </div>
    </div>
  );
};

export default Index;
