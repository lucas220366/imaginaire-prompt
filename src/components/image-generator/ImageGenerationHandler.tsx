
import React from 'react';
import { ImageSettings } from "@/types/image-generator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getImageDimensions } from "@/utils/image-utils";
import { Session } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

interface ImageGenerationHandlerProps {
  prompt: string;
  settings: ImageSettings;
  session: Session | null;
  onSuccess: (imageUrl: string) => void;
  onError: () => void;
  onStartGenerating: () => void;
  onFinishGenerating: () => void;
}

let isGenerating = false;

const ImageGenerationHandler = async ({
  prompt,
  settings,
  session,
  onSuccess,
  onError,
  onStartGenerating,
  onFinishGenerating
}: ImageGenerationHandlerProps) => {
  if (isGenerating) {
    toast.error("Please wait for the current generation to complete");
    return;
  }

  if (!prompt.trim()) {
    toast.error("Please enter a prompt");
    return;
  }

  if (!session?.user?.id) {
    toast.error("Please log in to generate and save images");
    onError();
    return;
  }

  // Set generating flags and notify UI
  isGenerating = true;
  onStartGenerating();
  
  let timeoutId: NodeJS.Timeout | undefined;
  
  try {
    // Clear any previous timeouts first
    if (timeoutId) clearTimeout(timeoutId);
    
    // Setup a new timeout
    timeoutId = setTimeout(() => {
      console.log("Image generation timed out after 2 minutes");
      isGenerating = false;
      onFinishGenerating();
      onError();
      toast.error("Image generation timed out. Please try again.");
    }, 120000); // 2 minute timeout

    // Get dimensions based on settings
    const dimensions = getImageDimensions(settings.size, settings.aspectRatio);
    
    console.log("Starting image generation with prompt:", prompt);
    console.log("Using dimensions:", dimensions);
    console.log("Using settings:", settings);
    
    // Call the edge function with detailed error handling
    console.log("Invoking generate-image edge function");
    
    const { data, error } = await supabase.functions.invoke<{ imageURL: string; success: boolean; error?: string }>('generate-image', {
      body: {
        prompt,
        settings: {
          ...settings,
          ...dimensions
        }
      }
    });

    console.log("Edge function response:", { data, error });
    
    if (error) {
      console.error("Edge function error:", error);
      throw new Error(error.message || "Error calling the edge function");
    }
    
    if (!data || !data.success) {
      console.error("Invalid response from edge function:", data);
      throw new Error(data?.error || "Invalid response from edge function");
    }
    
    if (!data.imageURL) {
      console.error("No image URL in response:", data);
      throw new Error("No image URL returned from edge function");
    }

    // Save to database
    type GeneratedImageInsert = Database['public']['Tables']['generated_images']['Insert'];
    
    console.log("Saving image to database for user:", session.user.id);
    const { data: savedImage, error: saveError } = await supabase
      .from('generated_images')
      .insert([{
        user_id: session.user.id,
        prompt: prompt,
        image_url: data.imageURL
      } satisfies GeneratedImageInsert])
      .select()
      .single();
    
    if (saveError) {
      console.error("Failed to save to database:", saveError);
      toast.error(`Failed to save to profile: ${saveError.message}`);
      // Still consider the generation successful even if saving failed
      onSuccess(data.imageURL);
    } else if (!savedImage) {
      console.error("No data returned after save");
      toast.warning("Image generated successfully but may not have been saved to your profile");
      onSuccess(data.imageURL);
    } else {
      console.log("Successfully saved image to database:", savedImage);
      onSuccess(data.imageURL);
      toast.success("Image generated and saved successfully!");
    }

    // Clear the timeout on success
    if (timeoutId) clearTimeout(timeoutId);
    
  } catch (error: any) {
    console.error("Image generation or save failed:", error);
    const errorMessage = error?.message || "Failed to generate image. Please try again.";
    toast.error(errorMessage);
    onError();
  } finally {
    // Clear any remaining timeout
    if (timeoutId) clearTimeout(timeoutId);
    onFinishGenerating();
    isGenerating = false;
  }
};

export default ImageGenerationHandler;
