
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from '@/integrations/supabase/types';

type GeneratedImage = Database['public']['Tables']['generated_images']['Row'];

interface ImageCardProps {
  image: GeneratedImage;
  onDelete: (imageId: string) => Promise<void>;
}

const ImageCard = ({ image, onDelete }: ImageCardProps) => {
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
    <div className="bg-white/50 backdrop-blur-lg rounded-lg overflow-hidden shadow-lg border border-gray-100">
      <div className="relative aspect-square">
        <img
          src={image.image_url}
          alt={image.prompt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            onClick={() => handleDownload(image.image_url)}
            className="bg-white/80 hover:bg-white"
            size="icon"
            variant="outline"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onDelete(image.id)}
            className="bg-white/80 hover:bg-white hover:text-red-600"
            size="icon"
            variant="outline"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 line-clamp-2">{image.prompt}</p>
        <p className="text-xs text-gray-500 mt-2">
          {new Date(image.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default ImageCard;
