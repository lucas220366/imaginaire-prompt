
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

interface GeneratedImage {
  id: string;
  created_at: string;
  prompt: string;
  image_url: string;
  user_id: string;
}

interface GeneratedImageProps {
  imageUrl: string;
  prompt: string;
}

const GeneratedImage = ({ imageUrl, prompt }: GeneratedImageProps) => {
  const { session } = useAuth();

  const handleDownload = async () => {
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
      toast.error("Failed to download image. Please try again.");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase
        .from('generated_images')
        .delete()
        .match({ image_url: imageUrl, user_id: session.user.id });

      if (error) throw error;
      
      toast.success("Image deleted successfully!");
      // Refresh the page to update the image list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="bg-white/50 backdrop-blur-lg rounded-lg p-4 shadow-lg border border-gray-100">
        <div className="relative">
          <img
            src={imageUrl}
            alt={prompt}
            className="w-full h-auto rounded-lg shadow-sm"
            loading="lazy"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              onClick={handleDownload}
              className="bg-white/80 hover:bg-white"
              size="icon"
              variant="outline"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-white/80 hover:bg-white hover:text-red-600"
              size="icon"
              variant="outline"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedImage;
