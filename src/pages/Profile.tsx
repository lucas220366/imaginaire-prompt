
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { Database } from '@/integrations/supabase/types';
import ProfileHeader from "@/components/profile/ProfileHeader";
import ImageGrid from "@/components/profile/ImageGrid";
import ProfilePagination from "@/components/profile/ProfilePagination";

type GeneratedImage = Database['public']['Tables']['generated_images']['Row'];

const IMAGES_PER_PAGE = 30;

const Profile = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      if (!session?.user?.id) return;
      
      try {
        setIsLoading(true);
        console.log("Fetching images for user:", session.user.id);
        
        const { data, error } = await supabase
          .from('generated_images')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching images:', error);
          throw error;
        }
        
        console.log("Fetched images:", data);
        setImages(data || []);
      } catch (error) {
        console.error('Error fetching images:', error);
        toast.error("Failed to load your images");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchImages();
    } else {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleDelete = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('generated_images')
        .delete()
        .match({ id: imageId });

      if (error) throw error;

      setImages(images.filter(image => image.id !== imageId));
      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error("Failed to delete image");
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);
  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
  const endIndex = startIndex + IMAGES_PER_PAGE;
  const currentImages = images.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8faff]">
      <div className="container mx-auto px-4">
        <ProfileHeader onSignOut={handleSignOut} />
        
        <ImageGrid 
          images={currentImages} 
          isLoading={isLoading} 
          onDeleteImage={handleDelete} 
        />

        <ProfilePagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      </div>
    </div>
  );
};

export default Profile;
