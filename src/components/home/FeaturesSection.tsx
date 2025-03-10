
import { Sparkles, Palette, Wand2 } from "lucide-react";

const FeaturesSection = () => {
  return (
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
  );
};

export default FeaturesSection;
