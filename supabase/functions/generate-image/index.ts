
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { RunwareService } from "./runware-service.ts";

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
      throw new Error("API key not configured on the server");
    }

    console.log("API key found, starting processing");

    // Parse the request body
    const { prompt, settings } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
    
    const result = await runware.generateImage({ 
      positivePrompt: prompt,
      outputFormat: settings.format,
      ...dimensions
    });
    
    if (!result?.imageURL) {
      console.error("No image URL in response:", result);
      throw new Error("No image URL in response from Runware API");
    }

    console.log("Image generation successful, returning URL:", result.imageURL);
    
    return new Response(
      JSON.stringify({ imageURL: result.imageURL }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error generating image:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred generating the image" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
