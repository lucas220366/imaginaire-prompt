
import { Quote } from "lucide-react";

interface TestimonialProps {
  text: string;
  author: string;
  role: string;
}

const Testimonial = ({ text, author, role }: TestimonialProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 flex flex-col h-full">
      <div className="mb-4">
        <Quote className="h-6 w-6 text-blue-500" />
      </div>
      <p className="text-gray-700 italic mb-4 flex-grow text-sm md:text-base">{text}</p>
      <div>
        <p className="font-semibold text-gray-800 text-sm md:text-base">{author}</p>
        <p className="text-gray-500 text-xs md:text-sm">{role}</p>
      </div>
    </div>
  );
};

const TestimonialSection = () => {
  const testimonials = [
    {
      text: "This AI image generator exceeded my expectations. The quality of the images is outstanding, and it's so easy to use!",
      author: "Sarah Johnson",
      role: "Graphic Designer"
    },
    {
      text: "I've tried several AI image tools, but this one stands out for its speed and creativity. It's become an essential part of my workflow.",
      author: "Michael Chen",
      role: "Content Creator"
    },
    {
      text: "As someone with no artistic skills, this tool has been a game-changer for my small business. Now I can create professional visuals in minutes!",
      author: "Emma Rodriguez",
      role: "Small Business Owner"
    }
  ];

  return (
    <div className="mt-12 md:mt-16 mb-12 md:mb-16 px-4 md:px-0">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">What Our Users Say</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Testimonial
            key={index}
            text={testimonial.text}
            author={testimonial.author}
            role={testimonial.role}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSection;
