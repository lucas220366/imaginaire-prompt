
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import MobileNav from "@/components/MobileNav";

const TermsOfUse = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen">
      {/* Fixed header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Logo />
            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            </div>
            {/* Mobile navigation */}
            <MobileNav />
          </div>
        </div>
      </header>
      
      {/* Main content with padding for fixed header */}
      <main className="container mx-auto px-4 py-8 max-w-4xl pt-24">
        <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="mb-4">Last updated: March 1, 2025</p>
        
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using vraho.com, you accept and agree to be bound by the terms and provision of this agreement.
            In addition, when using this website's particular services, you shall be subject to any posted guidelines or rules
            applicable to such services, which may be posted and modified from time to time.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description of Services</h2>
          <p className="mb-4">
            vraho.com provides users with access to a rich collection of resources, including various communication tools,
            forums, personalized content and branded programming through its network of properties which may be accessed through
            any various medium or device now known or hereafter developed.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Conduct</h2>
          <p className="mb-4">
            You agree to use our services for lawful purposes only and in a way that does not infringe the rights of, 
            restrict or inhibit anyone else's use and enjoyment of the website.
          </p>
          <p className="mb-4">
            Prohibited behavior includes harassing or causing distress or inconvenience to any person, transmitting obscene or offensive content or disrupting the normal flow of dialogue within our services.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Intellectual Property</h2>
          <p className="mb-4">
            The content, organization, graphics, design, compilation, magnetic translation, digital conversion and other matters
            related to the Site are protected under applicable copyrights, trademarks and other proprietary rights.
            The copying, redistribution, use or publication by you of any such matters or any part of the Site is strictly prohibited.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Contact Information</h2>
          <p className="mb-4">
            If you have any questions about these Terms of Use, please contact us at:
            terms@vraho.com
          </p>
        </div>
        
        <div className="mt-8">
          <Link to="/" className="text-blue-600 hover:text-blue-800">← Back to Home</Link>
        </div>
      </main>
    </div>
  );
};

export default TermsOfUse;
