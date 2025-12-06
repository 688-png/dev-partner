-- Create table for project review sessions from Calendly
CREATE TABLE public.project_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  calendly_event_id TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Pre-meeting form data
  progress_reported INTEGER DEFAULT 0,
  blockers TEXT,
  needs_review TEXT,
  changes_since_last TEXT,
  target_milestone TEXT,
  
  -- AI-generated analysis
  health_status TEXT CHECK (health_status IN ('healthy', 'at-risk', 'critical')),
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
  timeline_alignment TEXT CHECK (timeline_alignment IN ('ahead', 'on-track', 'behind')),
  delay_analysis TEXT,
  recommendations TEXT[],
  suggested_focus TEXT,
  action_plan TEXT[],
  adjusted_end_date DATE,
  
  -- Summary
  session_summary TEXT,
  next_milestone TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_sessions ENABLE ROW LEVEL SECURITY;

-- Allow all operations (matching existing pattern)
CREATE POLICY "Allow all session operations"
ON public.project_sessions
FOR ALL
USING (true)
WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_project_sessions_updated_at
BEFORE UPDATE ON public.project_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for faster lookups
CREATE INDEX idx_project_sessions_project_id ON public.project_sessions(project_id);
CREATE INDEX idx_project_sessions_scheduled_at ON public.project_sessions(scheduled_at DESC);