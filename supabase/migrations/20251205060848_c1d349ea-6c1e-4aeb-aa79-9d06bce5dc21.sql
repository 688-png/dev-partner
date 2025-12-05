-- Create enum for project status
CREATE TYPE public.project_status AS ENUM ('not-started', 'in-progress', 'complete');

-- Create enum for stack types
CREATE TYPE public.stack_type AS ENUM ('MERN', 'MEAN', 'Next.js', 'React + Supabase', 'Vue + Firebase');

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  stack stack_type NOT NULL,
  status project_status NOT NULL DEFAULT 'not-started',
  percentage INTEGER NOT NULL DEFAULT 0 CHECK (percentage >= 0 AND percentage <= 100),
  start_date DATE,
  end_date DATE,
  notes TEXT,
  roadmap JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false,
  percentage INTEGER NOT NULL DEFAULT 0 CHECK (percentage >= 0 AND percentage <= 100),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Since this is a single-user app with hardcoded auth, allow all operations
-- In production with real auth, these would check auth.uid()
CREATE POLICY "Allow all project operations" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all task operations" ON public.tasks FOR ALL USING (true) WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-calculate project percentage from tasks
CREATE OR REPLACE FUNCTION public.calculate_project_percentage()
RETURNS TRIGGER AS $$
DECLARE
  total_percentage INTEGER;
  task_count INTEGER;
BEGIN
  SELECT COUNT(*), COALESCE(SUM(CASE WHEN done THEN percentage ELSE 0 END), 0)
  INTO task_count, total_percentage
  FROM public.tasks
  WHERE project_id = COALESCE(NEW.project_id, OLD.project_id);
  
  IF task_count > 0 THEN
    UPDATE public.projects
    SET percentage = total_percentage / task_count,
        status = CASE 
          WHEN total_percentage / task_count = 100 THEN 'complete'::project_status
          WHEN total_percentage / task_count > 0 THEN 'in-progress'::project_status
          ELSE 'not-started'::project_status
        END
    WHERE id = COALESCE(NEW.project_id, OLD.project_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger to recalculate percentage when tasks change
CREATE TRIGGER calculate_project_percentage_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.calculate_project_percentage();

-- Create indexes for performance
CREATE INDEX idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX idx_projects_status ON public.projects(status);