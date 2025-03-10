
import React from 'react';
import { ImageSettings } from "@/types/image-generator";
import { RunwareService } from '@/lib/runware';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getImageDimensions } from "@/utils/image-utils";
import { Session } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

interface ImageGenerationHandlerProps {
  apiKey: string;
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
  apiKey,
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
    
    // Initialize Runware service
    let runware: RunwareService;
    try {
      console.log("Initializing RunwareService with API key length:", apiKey?.length || 0);
      runware = new RunwareService(apiKey);
    } catch (err: any) {
      console.error("API service initialization error:", err);
      toast.error(`Could not initialize the image generation service: ${err.message}`);
      onError();
      clearTimeout(timeoutId);
      onFinishGenerating();
      isGenerating = false;
      return;
    }
    
    // Generate the image
    console.log("Calling generateImage method with params:", { 
      positivePrompt: prompt,
      outputFormat: settings.format,
      ...dimensions
    });
    
    const result = await runware.generateImage({ 
      positivePrompt: prompt,
      outputFormat: settings.format,
      ...dimensions
    });
    
    clearTimeout(timeoutId);
    
    // Validate response
    if (!result?.imageURL) {
      console.error("No image URL in response:", result);
      toast.error("Failed to generate image. Invalid response from API.");
      onError();
      onFinishGenerating();
      isGenerating = false;
      return;
    }

    console.log("Image generation successful:", result);

    // Save to database
    type GeneratedImageInsert = Database['public']['Tables']['generated_images']['Insert'];
    
    console.log("Saving image to database for user:", session.user.id);
    const { data: savedImage, error: saveError } = await supabase
      .from('generated_images')
      .insert([{
        user_id: session.user.id,
        prompt: prompt,
        image_url: result.imageURL
      } satisfies GeneratedImageInsert])
      .select()
      .single();
    
    if (saveError) {
      console.error("Failed to save to database:", saveError);
      toast.error(`Failed to save to profile: ${saveError.message}`);
      onError();
      onFinishGenerating();
      isGenerating = false;
      return;
    }

    if (!savedImage) {
      console.error("No data returned after save");
      toast.error("Failed to verify image was saved");
      onError();
      onFinishGenerating();
      isGenerating = false;
      return;
    }
    
    console.log("Successfully saved image to database:", savedImage);
    onSuccess(result.imageURL);
    toast.success("Image generated and saved successfully!");
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error("Image generation or save failed:", error);
    toast.error(error?.message || "Failed to generate image. Please try again.");
    onError();
  } finally {
    onFinishGenerating();
    isGenerating = false;
  }
};

export default ImageGenerationHandler;
