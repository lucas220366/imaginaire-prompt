
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface GeneratedImage {
  id: string;
  created_at: string;
  prompt: string;
  image_url: string;
}

const Profile = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase
          .from('generated_images')
          .select('*')
          .eq('user_id', session?.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setImages(data);
      } catch (error) {
        console.error('Error fetching images:', error);
        toast.error("Failed to load your images");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user.id) {
      fetchImages();
    }
  }, [session?.user.id]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/generator")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Generator
          </Button>
          <Button
            onClick={handleSignOut}
            variant="outline"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="bg-white/50 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-gray-100 mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Your Generated Images</h1>
          <p className="text-gray-600 mt-2">
            View and download all your previously generated images
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading your images...</div>
        ) : images.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">You haven't generated any images yet.</p>
            <Button
              onClick={() => navigate("/generator")}
              className="mt-4"
            >
              Generate Your First Image
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="bg-white/50 backdrop-blur-lg rounded-lg overflow-hidden shadow-lg border border-gray-100"
              >
                <div className="relative aspect-square">
                  <img
                    src={image.image_url}
                    alt={image.prompt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <Button
                    onClick={() => handleDownload(image.image_url)}
                    className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                    size="icon"
                    variant="outline"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{image.prompt}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(image.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
