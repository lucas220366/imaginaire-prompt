
import React from 'react';
import { Helmet } from 'react-helmet';
import ContactForm from '@/components/contact/ContactForm';
import Logo from '@/components/Logo';
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileNav from "@/components/MobileNav";

const Contact = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Contact Us | AI Image Generator</title>
      </Helmet>
      
      {/* Fixed header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm shadow-sm">
        <div className="flex justify-between items-center h-16">
          <Logo />
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-2 mr-4">
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
      </header>
      
      {/* Main content with padding for fixed header */}
      <main className="container mx-auto px-4 py-8 max-w-4xl pt-24">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-gray-600">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>
        <ContactForm />
      </main>
    </div>
  );
};

export default Contact;
