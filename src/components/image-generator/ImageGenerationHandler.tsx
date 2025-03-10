
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

// Use a module-level variable instead of a function-level one to avoid race conditions
// when the function is called multiple times
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
  // Early validation checks
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
  
  // Create an abort controller for timeout handling
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => {
    abortController.abort();
    toast.error("Image generation timed out. Please try again.");
    onError();
    onFinishGenerating();
    isGenerating = false;
  }, 120000); // 2 minute timeout

  try {
    // Get dimensions based on settings
    const dimensions = getImageDimensions(settings.size, settings.aspectRatio);
    
    console.log("Starting image generation with prompt:", prompt);
    console.log("Using dimensions:", dimensions);
    console.log("Using settings:", settings);
    
    // Call the edge function with detailed error handling
    console.log("Invoking generate-image edge function");
    try {
      const response = await supabase.functions.invoke('generate-image', {
        body: {
          prompt,
          settings: {
            ...settings,
            ...dimensions
          }
        },
        signal: abortController.signal
      });
      
      clearTimeout(timeoutId);
      
      // Log the full response for debugging
      console.log("Edge function response:", response);
      
      const { data, error } = response;
      
      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || "Failed to send a request to the Edge Function");
      }
      
      // Check if the response indicates an error
      if (data?.error || !data?.success) {
        console.error("Error from edge function:", data?.error);
        throw new Error(data?.error || "Failed to generate image. Invalid response from API.");
      }
      
      // Validate response
      if (!data?.imageURL) {
        console.error("No image URL in response:", data);
        throw new Error("Failed to generate image. No image URL returned.");
      }

      console.log("Image generation successful:", data);

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
    } catch (invokeError: any) {
      console.error("Error invoking edge function:", invokeError);
      throw new Error(`Failed to call Edge Function: ${invokeError.message}`);
    }
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error("Image generation or save failed:", error);
    const errorMessage = error?.message || "Failed to generate image. Please try again.";
    toast.error(errorMessage);
    onError();
  } finally {
    onFinishGenerating();
    isGenerating = false;
  }
};

export default ImageGenerationHandler;
