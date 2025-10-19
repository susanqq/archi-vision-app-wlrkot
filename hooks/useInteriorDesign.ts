
// hooks/useInteriorDesign.ts
import { useState, useCallback, useRef } from "react";
import { supabase } from "../integrations/supabase/client";

export type DesignTool = "wall-color" | "furniture" | "lighting" | "flooring";

export type InteriorDesignParams = {
  imageUri: string;
  imageName?: string;
  imageType?: string;
  designTool: DesignTool;
  customPrompt?: string;
};

export type InteriorDesignResult = {
  url: string;
  path: string;
  designTool: string;
  duration_ms: number;
  width: number;
  height: number;
};

type State =
  | { status: "idle"; data: null; error: null }
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: InteriorDesignResult; error: null }
  | { status: "error"; data: null; error: string };

export function useInteriorDesign() {
  const [state, setState] = useState<State>({ 
    status: "idle", 
    data: null, 
    error: null 
  });
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    setState({ status: "idle", data: null, error: null });
  }, []);

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const generate = useCallback(
    async (params: InteriorDesignParams): Promise<InteriorDesignResult | null> => {
      // Validate inputs
      if (!params.imageUri) {
        setState({ 
          status: "error", 
          data: null, 
          error: "Image is required" 
        });
        return null;
      }

      if (!params.designTool) {
        setState({ 
          status: "error", 
          data: null, 
          error: "Design tool selection is required" 
        });
        return null;
      }

      setState({ status: "loading", data: null, error: null });

      try {
        const controller = new AbortController();
        abortRef.current = controller;

        // Prepare form data
        const formData = new FormData();
        
        // Add image file
        const imageBlob = await fetch(params.imageUri).then(r => r.blob());
        formData.append("image", imageBlob, params.imageName || "image.jpg");
        
        // Add design tool
        formData.append("designTool", params.designTool);
        
        // Add custom prompt if provided
        if (params.customPrompt) {
          formData.append("customPrompt", params.customPrompt);
        }

        console.log("Calling generate-interior-design function...");
        console.log("Design tool:", params.designTool);

        // Call Supabase Edge Function
        const { data, error } = await supabase.functions.invoke(
          "generate-interior-design",
          {
            body: formData,
          }
        );

        if (error) {
          console.error("Function error:", error);
          const message = error.message || "Failed to generate design";
          throw new Error(message);
        }

        if (!data || !data.url) {
          throw new Error("Invalid response from server");
        }

        const result = data as InteriorDesignResult;
        console.log("Design generated successfully:", result);
        
        setState({ status: "success", data: result, error: null });
        return result;

      } catch (err: any) {
        if (err?.name === "AbortError") {
          console.log("Request aborted");
          return null;
        }
        
        const message = err?.message ?? "Unknown error occurred";
        console.error("Error generating design:", message);
        setState({ status: "error", data: null, error: message });
        return null;

      } finally {
        abortRef.current = null;
      }
    },
    []
  );

  const loading = state.status === "loading";
  const error = state.status === "error" ? state.error : null;
  const data = state.status === "success" ? state.data : null;

  return { 
    generate, 
    loading, 
    error, 
    data, 
    reset, 
    abort 
  };
}
