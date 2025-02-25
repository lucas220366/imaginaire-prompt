
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center text-center">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/50"
          style={{
            backgroundImage: 'url("/placeholder.svg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlend: 'overlay'
          }}
        />
        <div className="relative z-10 space-y-6 px-4 animate-fade-up">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Serious Connections
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Your journey to a meaningful relationship starts here.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-destructive hover:bg-destructive/90 text-xl py-6"
          >
            <Link to="/auth">Join Now</Link>
          </Button>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
            Why Choose Serious Connections?
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Find someone who shares your values and life goals. We connect you with like-minded singles ready for a committed relationship.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
            About Us
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Serious Connections is designed for singles who are done with games and looking for meaningful relationships. Our advanced matching algorithm ensures you meet someone special.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-white" id="signup">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
            Ready to Find Your Match?
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Sign up today and start your journey towards a meaningful relationship.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-destructive hover:bg-destructive/90 text-xl py-6"
          >
            <Link to="/auth">Sign Up Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 bg-gray-900 text-white/80 text-center">
        <p>&copy; 2025 Serious Connections. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
