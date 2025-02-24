
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
  if (!prompt.trim()) {
    toast.error("Please enter a prompt");
    return;
  }

  onStartGenerating();
  try {
    const dimensions = getImageDimensions(settings.size, settings.aspectRatio);
    const runware = new RunwareService(apiKey);
    console.log("Starting image generation with prompt:", prompt);
    const result = await runware.generateImage({ 
      positivePrompt: prompt,
      outputFormat: settings.format,
      ...dimensions
    });
    
    console.log("Image generation successful:", result);
    
    // Only try to save to Supabase if we have both a session and a user ID
    if (session?.user?.id) {
      try {
        const { error } = await supabase
          .from('generated_images')
          .insert({
            user_id: session.user.id,
            prompt: prompt,
            image_url: result.imageURL
          });
        
        if (error) {
          console.error("Failed to save to database:", error);
          // Don't throw the error - just log it and continue
        }
      } catch (dbError) {
        console.error("Database operation failed:", dbError);
        // Don't let database errors prevent the image from being shown
      }
    }
    
    onSuccess(result.imageURL);
    toast.success("Image generated successfully!");
  } catch (error) {
    console.error("Image generation failed:", error);
    onError();
    toast.error("Failed to generate image. Please try again.");
  } finally {
    onFinishGenerating();
  }
};

export default ImageGenerationHandler;
