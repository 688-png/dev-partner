export type ProjectStatus = 'not-started' | 'in-progress' | 'complete';
export type StackType = 'MERN' | 'MEAN' | 'Next.js' | 'React + Supabase' | 'Vue + Firebase';

export interface Task {
  id: string;
  project_id: string;
  title: string;
  done: boolean;
  percentage: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  stack: StackType;
  status: ProjectStatus;
  percentage: number;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  roadmap: RoadmapItem[];
  created_at: string;
  updated_at: string;
  tasks?: Task[];
}

export interface RoadmapItem {
  phase: string;
  title: string;
  description: string;
  duration: string;
  tasks: string[];
}

export interface CreateProjectInput {
  title: string;
  description?: string;
  stack: StackType;
  start_date?: string;
  end_date?: string;
  notes?: string;
}

export interface CreateTaskInput {
  project_id: string;
  title: string;
  percentage?: number;
}
