
import React from 'react';
import { Helmet } from 'react-helmet';
import ContactForm from '@/components/contact/ContactForm';
import Logo from '@/components/Logo';

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Helmet>
        <title>Contact Us | AI Image Generator</title>
      </Helmet>
      <Logo />
      {/* Added pt-12 md:pt-8 for more top padding on mobile */}
      <div className="text-center mb-8 pt-12 md:pt-8">
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-gray-600">
          Have a question or feedback? We'd love to hear from you.
        </p>
      </div>
      <ContactForm />
    </div>
  );
};

export default Contact;
