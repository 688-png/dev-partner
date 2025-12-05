import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, description, stack, currentProgress, tasks } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert software architect and project manager. Generate guidance for a ${stack} development project.

Your response MUST be valid JSON with this exact structure:
{
  "roadmap": [
    {
      "phase": "Phase 1",
      "title": "Phase title",
      "description": "What this phase accomplishes",
      "duration": "1-2 weeks",
      "tasks": ["Task 1", "Task 2", "Task 3"]
    }
  ],
  "tips": ["Tip 1", "Tip 2", "Tip 3"],
  "nextSteps": ["Step 1", "Step 2", "Step 3"]
}

Guidelines:
- Create 4-6 phases for the roadmap
- Each phase should have 3-5 specific tasks
- Tips should be specific to the ${stack} stack
- Next steps should consider current progress (${currentProgress}%)
- Make recommendations practical and actionable`;

    const userPrompt = `Project: ${title}
Description: ${description || 'No description provided'}
Stack: ${stack}
Current Progress: ${currentProgress}%
Existing Tasks: ${tasks?.length ? tasks.map((t: any) => `${t.title} (${t.done ? 'done' : 'pending'})`).join(', ') : 'None'}

Generate a comprehensive roadmap, tips, and next steps for this project.`;

    console.log('Calling Lovable AI for project guidance...');

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
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log('AI response received successfully');
    
    const parsed = JSON.parse(content);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Project guidance error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Failed to generate guidance" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
