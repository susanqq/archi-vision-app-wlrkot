
// supabase/functions/generate-interior-design/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleGenAI } from "npm:@google/genai";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!;
const BUCKET = "generated-designs";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, { 
  auth: { persistSession: false } 
});

function uint8ToBase64(u8: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < u8.length; i++) {
    bin += String.fromCharCode(u8[i]);
  }
  return btoa(bin);
}

function base64ToUint8(b64: string): Uint8Array {
  const bin = atob(b64);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    u8[i] = bin.charCodeAt(i);
  }
  return u8;
}

// Design tool prompts for different interior design options
const DESIGN_PROMPTS: Record<string, string> = {
  "wall-color": "Transform this interior space by changing the wall colors to modern, elegant tones. Keep the furniture and layout the same, but reimagine the walls with sophisticated paint colors and textures that enhance the room's ambiance.",
  "furniture": "Redesign this interior space with modern, stylish furniture arrangements. Replace or rearrange the furniture to create a more functional and aesthetically pleasing layout while maintaining the room's structure.",
  "lighting": "Enhance this interior space with improved lighting design. Add modern light fixtures, adjust natural lighting, and create a warm, inviting atmosphere through strategic lighting placement.",
  "flooring": "Transform this interior space by changing the flooring material. Replace the current floor with modern materials like hardwood, tile, or luxury vinyl that complement the room's style.",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { 
        status: 405, 
        headers: { "content-type": "application/json", ...CORS_HEADERS } 
      }
    );
  }

  try {
    // Authenticate user
    const auth = req.headers.get("Authorization") || "";
    const { data: user } = await supabase.auth.getUser(auth.replace("Bearer ", ""));
    
    if (!user?.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { 
          status: 401, 
          headers: { "content-type": "application/json", ...CORS_HEADERS } 
        }
      );
    }

    // Parse multipart form data
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("multipart/form-data")) {
      return new Response(
        JSON.stringify({ error: "Expected multipart/form-data" }),
        { 
          status: 400, 
          headers: { "content-type": "application/json", ...CORS_HEADERS } 
        }
      );
    }

    const form = await req.formData();
    const imageFile = form.get("image") as File | null;
    const designTool = String(form.get("designTool") ?? "");
    const customPrompt = String(form.get("customPrompt") ?? "");

    if (!imageFile) {
      return new Response(
        JSON.stringify({ error: "Image file is required" }),
        { 
          status: 400, 
          headers: { "content-type": "application/json", ...CORS_HEADERS } 
        }
      );
    }

    if (!designTool) {
      return new Response(
        JSON.stringify({ error: "Design tool selection is required" }),
        { 
          status: 400, 
          headers: { "content-type": "application/json", ...CORS_HEADERS } 
        }
      );
    }

    const started = performance.now();

    // Convert image to base64
    const imageBuffer = new Uint8Array(await imageFile.arrayBuffer());
    const imageBase64 = uint8ToBase64(imageBuffer);
    const imageMimeType = imageFile.type || "image/jpeg";

    // Build prompt based on design tool
    const basePrompt = DESIGN_PROMPTS[designTool] || DESIGN_PROMPTS["wall-color"];
    const finalPrompt = customPrompt || basePrompt;

    console.log("Processing interior design with tool:", designTool);
    console.log("Using prompt:", finalPrompt);

    // Prepare parts for Gemini API
    const parts = [
      { text: finalPrompt },
      {
        inlineData: {
          data: imageBase64,
          mimeType: imageMimeType,
        },
      },
    ];

    // Initialize Gemini AI
    const ai = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
    });

    const model = "gemini-2.0-flash-exp";
    const config = {
      responseModalities: ["IMAGE", "TEXT"],
    };

    // Call Gemini API
    const response = await ai.models.generateContent({
      model,
      config,
      contents: [
        {
          role: "user",
          parts,
        },
      ],
    });

    const candidate = response.candidates?.[0];
    const respParts = candidate?.content?.parts ?? [];

    // Look for generated image in response
    let generatedImageData: Uint8Array | null = null;
    let generatedMimeType = "image/png";

    for (const p of respParts) {
      if (p?.inlineData?.data) {
        generatedMimeType = p.inlineData.mimeType || "image/png";
        generatedImageData = base64ToUint8(p.inlineData.data);
        break;
      }
    }

    if (!generatedImageData) {
      // If no image, check for text response
      const text = respParts.map((p) => p?.text).filter(Boolean).join("\n").trim();
      
      return new Response(
        JSON.stringify({ 
          error: "No image generated by AI", 
          message: text || "The AI did not return an image. Please try again." 
        }),
        { 
          status: 502, 
          headers: { "content-type": "application/json", ...CORS_HEADERS } 
        }
      );
    }

    // Upload generated image to Supabase Storage
    const ext = generatedMimeType.split("/")[1] || "png";
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const path = `${user.user.id}/${Date.now()}-${designTool}-${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, generatedImageData, {
        contentType: generatedMimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to upload generated image", 
          detail: uploadError.message 
        }),
        { 
          status: 500, 
          headers: { "content-type": "application/json", ...CORS_HEADERS } 
        }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(path);

    const duration_ms = Math.round(performance.now() - started);

    const result = {
      url: urlData.publicUrl,
      path,
      designTool,
      duration_ms,
      width: 1024, // Gemini typically returns 1024x1024
      height: 1024,
    };

    console.log("Interior design generated successfully:", result);

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { "content-type": "application/json", ...CORS_HEADERS } 
      }
    );

  } catch (err) {
    console.error("Error in generate-interior-design:", err);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        detail: String(err) 
      }),
      { 
        status: 500, 
        headers: { "content-type": "application/json", ...CORS_HEADERS } 
      }
    );
  }
});
