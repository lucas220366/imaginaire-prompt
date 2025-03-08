
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ImageCard from "./ImageCard";
import type { Database } from '@/integrations/supabase/types';

type GeneratedImage = Database['public']['Tables']['generated_images']['Row'];

interface ImageGridProps {
  images: GeneratedImage[];
  isLoading: boolean;
  onDeleteImage: (imageId: string) => Promise<void>;
}

const ImageGrid = ({ images, isLoading, onDeleteImage }: ImageGridProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="text-center py-8">Loading your images...</div>;
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">You haven't generated any images yet.</p>
        <Button
          onClick={() => navigate("/generator")}
          className="mt-4"
        >
          Generate Your First Image
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image) => (
        <ImageCard 
          key={image.id} 
          image={image} 
          onDelete={onDeleteImage} 
        />
      ))}
    </div>
  );
};

export default ImageGrid;
