import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Project, Task, CreateProjectInput, CreateTaskInput, RoadmapItem } from '@/types/project';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

export const useProjects = () => {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<Project[]> => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(p => ({
        ...p,
        roadmap: (p.roadmap as unknown as RoadmapItem[]) || []
      }));
    }
  });

  const createProject = useMutation({
    mutationFn: async (input: CreateProjectInput) => {
      const { data, error } = await supabase
        .from('projects')
        .insert(input)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create project: ' + error.message);
    }
  });

  const updateProject = useMutation({
    mutationFn: async ({ id, roadmap, ...updates }: Partial<Project> & { id: string }) => {
      const updateData: Record<string, unknown> = { ...updates };
      if (roadmap !== undefined) {
        updateData.roadmap = roadmap as unknown as Json;
      }
      
      const { data, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project'] });
      toast.success('Project updated');
    },
    onError: (error) => {
      toast.error('Failed to update project: ' + error.message);
    }
  });

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete project: ' + error.message);
    }
  });

  return {
    projects: projectsQuery.data || [],
    isLoading: projectsQuery.isLoading,
    error: projectsQuery.error,
    createProject,
    updateProject,
    deleteProject
  };
};

export const useProject = (id: string) => {
  const queryClient = useQueryClient();

  const projectQuery = useQuery({
    queryKey: ['project', id],
    queryFn: async (): Promise<Project & { tasks: Task[] }> => {
      const [projectRes, tasksRes] = await Promise.all([
        supabase.from('projects').select('*').eq('id', id).single(),
        supabase.from('tasks').select('*').eq('project_id', id).order('sort_order')
      ]);
      
      if (projectRes.error) throw projectRes.error;
      if (tasksRes.error) throw tasksRes.error;
      
      return {
        ...projectRes.data,
        roadmap: (projectRes.data.roadmap as unknown as RoadmapItem[]) || [],
        tasks: tasksRes.data || []
      };
    },
    enabled: !!id
  });

  const createTask = useMutation({
    mutationFn: async (input: CreateTaskInput) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert({ ...input, percentage: input.percentage || 20 })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      toast.error('Failed to create task: ' + error.message);
    }
  });

  const updateTask = useMutation({
    mutationFn: async ({ taskId, ...updates }: Partial<Task> & { taskId: string }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      toast.error('Failed to update task: ' + error.message);
    }
  });

  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      toast.error('Failed to delete task: ' + error.message);
    }
  });

  return {
    project: projectQuery.data,
    isLoading: projectQuery.isLoading,
    error: projectQuery.error,
    createTask,
    updateTask,
    deleteTask
  };
};
