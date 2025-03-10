
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { RunwareService } from "./services/runware-service.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the Runware API key from environment variables
    const apiKey = Deno.env.get('RUNWARE_API_KEY');
    if (!apiKey) {
      console.error("RUNWARE_API_KEY not found in environment variables");
      return new Response(
        JSON.stringify({ 
          error: "API key not configured on the server",
          success: false 
        }),
        { 
          status: 200, // Return 200 even for errors to avoid non-2xx status
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log("API key found, starting processing");

    // Parse the request body
    const { prompt, settings } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ 
          error: "Prompt is required",
          success: false 
        }),
        { 
          status: 200, // Return 200 even for errors
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log("Starting image generation with prompt:", prompt);
    console.log("Settings:", JSON.stringify(settings));
    
    // Initialize Runware service
    const runware = new RunwareService(apiKey);
    
    // Get dimensions based on settings
    const dimensions = {
      width: parseInt(settings.size.split('x')[0]),
      height: parseInt(settings.size.split('x')[1]),
    };
    
    // Generate the image
    console.log("Calling generateImage with params:", { 
      positivePrompt: prompt,
      outputFormat: settings.format,
      ...dimensions
    });
    
    try {
      const result = await runware.generateImage({ 
        positivePrompt: prompt,
        outputFormat: settings.format,
        ...dimensions
      });
      
      if (!result?.imageURL) {
        console.error("No image URL in response:", result);
        return new Response(
          JSON.stringify({ 
            error: "No image URL in response from Runware API",
            success: false 
          }),
          { 
            status: 200, // Return 200 even for errors
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log("Image generation successful, returning URL:", result.imageURL);
      
      return new Response(
        JSON.stringify({ 
          imageURL: result.imageURL,
          success: true 
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } catch (generationError) {
      console.error("Error in image generation:", generationError);
      return new Response(
        JSON.stringify({ 
          error: generationError.message || "Failed to generate image",
          success: false 
        }),
        { 
          status: 200, // Return 200 even for errors
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred processing the request",
        success: false 
      }),
      { 
        status: 200, // Return 200 even for errors
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
