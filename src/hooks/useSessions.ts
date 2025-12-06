import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProjectSession, CreateSessionInput } from '@/types/session';
import { toast } from '@/hooks/use-toast';

export function useSessions(projectId?: string) {
  const queryClient = useQueryClient();

  const sessionsQuery = useQuery({
    queryKey: ['sessions', projectId],
    queryFn: async () => {
      let query = supabase
        .from('project_sessions')
        .select('*')
        .order('scheduled_at', { ascending: false });
      
      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return data.map(session => ({
        ...session,
        recommendations: session.recommendations as string[] | null,
        action_plan: session.action_plan as string[] | null,
      })) as ProjectSession[];
    },
  });

  const createSession = useMutation({
    mutationFn: async (input: CreateSessionInput) => {
      const { data, error } = await supabase.functions.invoke('calendly-webhook', {
        body: {
          type: 'manual_session',
          ...input,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast({
        title: 'Session created',
        description: 'AI analysis has been generated for your project review.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    sessions: sessionsQuery.data || [],
    isLoading: sessionsQuery.isLoading,
    createSession,
  };
}
