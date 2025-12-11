import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encode as hexEncode } from "https://deno.land/std@0.168.0/encoding/hex.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, calendly-webhook-signature',
};

interface CalendlyPayload {
  event: string;
  payload: {
    event: {
      uuid: string;
      start_time: string;
      end_time: string;
    };
    invitee: {
      email: string;
      name: string;
    };
    questions_and_answers?: Array<{
      question: string;
      answer: string;
    }>;
  };
}

interface ProjectAnalysis {
  health_status: 'healthy' | 'at-risk' | 'critical';
  risk_level: 'low' | 'medium' | 'high';
  timeline_alignment: 'ahead' | 'on-track' | 'behind';
  delay_analysis: string;
  recommendations: string[];
  suggested_focus: string;
  action_plan: string[];
  adjusted_end_date: string | null;
  session_summary: string;
  next_milestone: string;
}

// Verify Calendly webhook signature using HMAC-SHA256
async function verifyCalendlySignature(payload: string, signatureHeader: string, signingKey: string): Promise<boolean> {
  try {
    // Calendly signature format: t=timestamp,v1=signature
    const parts = signatureHeader.split(',');
    const timestampPart = parts.find(p => p.startsWith('t='));
    const signaturePart = parts.find(p => p.startsWith('v1='));

    if (!timestampPart || !signaturePart) {
      console.error('Invalid signature header format');
      return false;
    }

    const timestamp = timestampPart.split('=')[1];
    const signature = signaturePart.split('=')[1];

    // Check timestamp is within 5 minutes to prevent replay attacks
    const timestampMs = parseInt(timestamp) * 1000;
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    if (Math.abs(now - timestampMs) > fiveMinutes) {
      console.error('Webhook timestamp too old, possible replay attack');
      return false;
    }

    // Create the signed payload string: timestamp + "." + payload
    const signedPayload = `${timestamp}.${payload}`;

    // Compute HMAC-SHA256
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(signingKey),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(signedPayload)
    );

    const computedSignature = new TextDecoder().decode(hexEncode(new Uint8Array(signatureBuffer)));

    // Compare signatures using timing-safe comparison
    if (computedSignature.length !== signature.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < computedSignature.length; i++) {
      result |= computedSignature.charCodeAt(i) ^ signature.charCodeAt(i);
    }

    return result === 0;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get raw body for signature verification
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    
    console.log('Received webhook request');

    // Handle direct API call for manual session creation (skip signature check)
    if (body.type === 'manual_session') {
      console.log('Processing manual session');
      return await handleManualSession(supabase, body);
    }

    // For Calendly webhooks, verify signature
    const signingKey = Deno.env.get('CALENDLY_WEBHOOK_SIGNING_KEY');
    const signatureHeader = req.headers.get('Calendly-Webhook-Signature');

    if (signingKey && signatureHeader) {
      const isValid = await verifyCalendlySignature(rawBody, signatureHeader, signingKey);
      
      if (!isValid) {
        console.error('Invalid webhook signature - rejecting request');
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      console.log('Webhook signature verified successfully');
    } else if (signingKey && !signatureHeader) {
      // Signing key is configured but no signature provided - reject
      console.error('Missing Calendly-Webhook-Signature header');
      return new Response(JSON.stringify({ error: 'Missing signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      console.log('No signing key configured - skipping signature verification');
    }

    // Handle Calendly webhook
    if (body.event === 'invitee.created' || body.event === 'invitee_created') {
      return await handleCalendlyEvent(supabase, body);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Webhook error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleManualSession(supabase: any, body: any) {
  const { project_id, progress_reported, blockers, needs_review, changes_since_last, target_milestone } = body;

  // Fetch project details
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', project_id)
    .single();

  if (projectError) {
    throw new Error(`Project not found: ${projectError.message}`);
  }

  // Generate AI analysis
  const analysis = await generateProjectAnalysis({
    project,
    progress_reported,
    blockers,
    needs_review,
    changes_since_last,
    target_milestone,
  });

  // Store session
  const { data: session, error: sessionError } = await supabase
    .from('project_sessions')
    .insert({
      project_id,
      scheduled_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      progress_reported,
      blockers,
      needs_review,
      changes_since_last,
      target_milestone,
      ...analysis,
    })
    .select()
    .single();

  if (sessionError) {
    throw new Error(`Failed to create session: ${sessionError.message}`);
  }

  return new Response(JSON.stringify({ session, analysis }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

async function handleCalendlyEvent(supabase: any, payload: CalendlyPayload) {
  const eventData = payload.payload;
  const qa = eventData.questions_and_answers || [];

  // Parse form responses
  const getAnswer = (q: string) => qa.find(item => 
    item.question.toLowerCase().includes(q.toLowerCase())
  )?.answer || '';

  const projectName = getAnswer('project');
  const progressStr = getAnswer('complete') || getAnswer('progress');
  const blockers = getAnswer('slow') || getAnswer('blocker');
  const needsReview = getAnswer('review');
  const changes = getAnswer('change');
  const milestone = getAnswer('milestone') || getAnswer('target');

  const progress = parseInt(progressStr.replace(/\D/g, '')) || 0;

  // Try to find matching project
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .ilike('title', `%${projectName}%`)
    .limit(1);

  const project = projects?.[0];

  // Generate AI analysis
  const analysis = await generateProjectAnalysis({
    project,
    progress_reported: progress,
    blockers,
    needs_review: needsReview,
    changes_since_last: changes,
    target_milestone: milestone,
  });

  // Store session
  const { data: session, error } = await supabase
    .from('project_sessions')
    .insert({
      project_id: project?.id || null,
      calendly_event_id: eventData.event.uuid,
      scheduled_at: eventData.event.start_time,
      progress_reported: progress,
      blockers,
      needs_review: needsReview,
      changes_since_last: changes,
      target_milestone: milestone,
      ...analysis,
    })
    .select()
    .single();

  console.log('Session created:', session);

  return new Response(JSON.stringify({ session, analysis }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

async function generateProjectAnalysis(data: {
  project: any;
  progress_reported: number;
  blockers: string;
  needs_review: string;
  changes_since_last: string;
  target_milestone: string;
}): Promise<ProjectAnalysis> {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  
  if (!LOVABLE_API_KEY) {
    console.error('LOVABLE_API_KEY not configured');
    return getDefaultAnalysis(data);
  }

  const prompt = `You are a project management AI. Analyze this project review session and provide actionable insights.

PROJECT DETAILS:
${data.project ? `
- Name: ${data.project.title}
- Stack: ${data.project.stack}
- Status: ${data.project.status}
- Current Progress: ${data.project.percentage}%
- Start Date: ${data.project.start_date || 'Not set'}
- Target End Date: ${data.project.end_date || 'Not set'}
- Description: ${data.project.description || 'None'}
` : 'No project linked - analyzing based on reported data only.'}

SESSION FORM RESPONSES:
- Reported Progress: ${data.progress_reported}%
- Blockers: ${data.blockers || 'None reported'}
- Needs Review: ${data.needs_review || 'Nothing specific'}
- Changes Since Last Session: ${data.changes_since_last || 'None reported'}
- Target Milestone: ${data.target_milestone || 'Not specified'}

Provide analysis in this exact JSON format:
{
  "health_status": "healthy" | "at-risk" | "critical",
  "risk_level": "low" | "medium" | "high",
  "timeline_alignment": "ahead" | "on-track" | "behind",
  "delay_analysis": "Brief analysis of any delays and their causes",
  "recommendations": ["Specific recommendation 1", "Specific recommendation 2", "Specific recommendation 3"],
  "suggested_focus": "The single most important area to focus on next",
  "action_plan": ["Action item 1", "Action item 2", "Action item 3", "Action item 4"],
  "adjusted_end_date": "YYYY-MM-DD or null if no adjustment needed",
  "session_summary": "2-3 sentence summary of this review session",
  "next_milestone": "Clear, measurable milestone for the next session"
}`;

  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a senior project manager AI. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error('Rate limited');
        return getDefaultAnalysis(data);
      }
      if (response.status === 402) {
        console.error('Payment required');
        return getDefaultAnalysis(data);
      }
      throw new Error(`AI API error: ${response.status}`);
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || '';
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Sanitize adjusted_end_date - handle "null" string and invalid dates
      let adjustedEndDate: string | null = null;
      if (parsed.adjusted_end_date && 
          parsed.adjusted_end_date !== 'null' && 
          parsed.adjusted_end_date !== 'None' &&
          /^\d{4}-\d{2}-\d{2}$/.test(parsed.adjusted_end_date)) {
        adjustedEndDate = parsed.adjusted_end_date;
      }
      
      return {
        health_status: parsed.health_status || 'at-risk',
        risk_level: parsed.risk_level || 'medium',
        timeline_alignment: parsed.timeline_alignment || 'on-track',
        delay_analysis: parsed.delay_analysis || '',
        recommendations: parsed.recommendations || [],
        suggested_focus: parsed.suggested_focus || '',
        action_plan: parsed.action_plan || [],
        adjusted_end_date: adjustedEndDate,
        session_summary: parsed.session_summary || '',
        next_milestone: parsed.next_milestone || '',
      };
    }

    return getDefaultAnalysis(data);
  } catch (error) {
    console.error('AI analysis error:', error);
    return getDefaultAnalysis(data);
  }
}

function getDefaultAnalysis(data: any): ProjectAnalysis {
  const progress = data.progress_reported || 0;
  const hasBlockers = !!data.blockers;
  
  return {
    health_status: hasBlockers ? 'at-risk' : progress >= 50 ? 'healthy' : 'at-risk',
    risk_level: hasBlockers ? 'medium' : 'low',
    timeline_alignment: 'on-track',
    delay_analysis: hasBlockers ? `Blockers reported: ${data.blockers}` : 'No delays detected',
    recommendations: [
      'Review current blockers and create action items',
      'Update task breakdown for remaining work',
      'Schedule follow-up session to track progress',
    ],
    suggested_focus: data.needs_review || 'Continue with current priorities',
    action_plan: [
      'Address reported blockers',
      'Update project documentation',
      'Review and adjust timeline if needed',
      'Prepare for next milestone',
    ],
    adjusted_end_date: null,
    session_summary: `Project at ${progress}% completion. ${hasBlockers ? 'Blockers identified that need attention.' : 'On track for current milestone.'}`,
    next_milestone: data.target_milestone || 'Define next milestone in upcoming session',
  };
}
