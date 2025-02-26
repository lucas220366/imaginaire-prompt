
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

  isGenerating = true;
  onStartGenerating();
  
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => {
    abortController.abort();
    toast.error("Image generation timed out. Please try again.");
    onError();
    onFinishGenerating();
    isGenerating = false;
  }, 120000);

  try {
    const dimensions = getImageDimensions(settings.size, settings.aspectRatio);
    const runware = new RunwareService(apiKey);
    
    console.log("Starting image generation with prompt:", prompt);
    console.log("Using dimensions:", dimensions);
    console.log("Current session user ID:", session.user.id);

    const result = await runware.generateImage({ 
      positivePrompt: prompt,
      outputFormat: settings.format || "PNG",
      ...dimensions
    });
    
    clearTimeout(timeoutId);
    
    if (!result?.imageURL) {
      console.error("No image URL in response:", result);
      toast.error("Failed to generate image. Invalid response from API.");
      onError();
      return;
    }

    console.log("Image generation successful:", result);
    
    type GeneratedImageInsert = Database['public']['Tables']['generated_images']['Insert'];
    
    const imageData: GeneratedImageInsert = {
      user_id: session.user.id,
      prompt: prompt,
      image_url: result.imageURL
    };
    
    const { data: savedData, error: saveError } = await supabase
      .from('generated_images')
      .insert(imageData)
      .select()
      .single();
    
    if (saveError) {
      console.error("Failed to save to database:", saveError);
      toast.error(`Failed to save to profile: ${saveError.message}`);
      onError();
      return;
    }

    if (!savedData) {
      console.error("No data returned after save");
      toast.error("Failed to verify image was saved");
      onError();
      return;
    }
    
    console.log("Successfully saved image to database:", savedData);
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
