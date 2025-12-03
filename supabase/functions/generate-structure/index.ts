import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GenerateRequest {
  description: string;
}

const systemPrompt = `You are DevScaffold AI, an expert software architect that generates folder structures and roadmaps for development projects.

When given a project description, you MUST respond with a valid JSON object containing:

1. "stack" - The recommended tech stack (one of: "mern", "mean", "nextjs", "react-supabase", "vue-firebase", or a custom stack name)
2. "stackName" - Human readable stack name
3. "stackIcon" - An emoji representing the stack
4. "structure" - A folder tree structure object with:
   - "name": folder/file name
   - "type": "folder" or "file"
   - "description": optional description
   - "children": array of child nodes (for folders)
5. "roadmap" - Array of build steps, each with:
   - "step": step number
   - "title": step title
   - "description": what to do
   - "commands": array of terminal commands (optional)
   - "tips": array of helpful tips (optional)
6. "tips" - Array of 3-5 contextual tips specific to this project type

Consider:
- Project complexity (beginner vs enterprise)
- Best practices for the chosen stack
- Scalability and maintainability
- Security considerations
- Testing strategies

Respond ONLY with valid JSON. No markdown, no explanation, just the JSON object.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description }: GenerateRequest = await req.json();
    
    if (!description || description.trim().length < 5) {
      return new Response(
        JSON.stringify({ error: "Please provide a more detailed project description" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service is not configured");
    }

    console.log("Generating structure for:", description.substring(0, 100));

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate a complete project structure and roadmap for: ${description}` }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("Failed to generate structure");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response:", data);
      throw new Error("Invalid AI response");
    }

    console.log("AI response received, parsing...");

    // Parse the JSON response
    let parsed;
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.slice(7);
      } else if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith("```")) {
        cleanContent = cleanContent.slice(0, -3);
      }
      parsed = JSON.parse(cleanContent.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI response");
    }

    console.log("Successfully generated structure for stack:", parsed.stackName);

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in generate-structure:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
