
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
    console.log("Edge function called, method:", req.method);
    console.log("Headers:", JSON.stringify(Object.fromEntries([...req.headers])));
    
    // Get the Runware API key from environment variables
    const apiKey = Deno.env.get('RUNWARE_API_KEY');
    if (!apiKey) {
      console.error("RUNWARE_API_KEY not found in environment variables");
      return new Response(
        JSON.stringify({ 
          error: "API key not configured on the server. Please set the RUNWARE_API_KEY in Supabase secrets.",
          success: false 
        }),
        { 
          status: 200, // Return 200 even for errors to avoid non-2xx status
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`API key found in environment variables, length: ${apiKey.length}`);

    // Parse the request body
    let requestBody;
    try {
      requestBody = await req.json();
      console.log("Parsed request body successfully:", JSON.stringify(requestBody));
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return new Response(
        JSON.stringify({ 
          error: "Invalid request body: " + parseError.message,
          success: false 
        }),
        { 
          status: 200, // Return 200 even for errors
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const prompt = requestBody?.prompt;
    const settings = requestBody?.settings;
    
    if (!prompt) {
      console.error("Missing prompt in request");
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
    let runware;
    try {
      runware = new RunwareService(apiKey);
      console.log("RunwareService initialized successfully");
    } catch (serviceError) {
      console.error("Error creating Runware service:", serviceError);
      return new Response(
        JSON.stringify({ 
          error: serviceError.message || "Failed to initialize Runware service",
          success: false 
        }),
        { 
          status: 200, // Return 200 even for errors
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Get dimensions based on settings
    const dimensions = {
      width: settings?.width || parseInt(settings?.size?.split('x')[0]) || 1024,
      height: settings?.height || parseInt(settings?.size?.split('x')[1]) || 1024,
    };
    
    // Generate the image
    console.log("Calling generateImage with params:", { 
      positivePrompt: prompt,
      outputFormat: settings?.format || "PNG",
      ...dimensions
    });
    
    try {
      const result = await runware.generateImage({ 
        positivePrompt: prompt,
        outputFormat: settings?.format || "PNG",
        ...dimensions
      });
      
      console.log("Generation result:", JSON.stringify(result));
      
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
    console.error("Unhandled error processing request:", error);
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
