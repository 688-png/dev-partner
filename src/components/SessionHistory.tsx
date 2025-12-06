import { useSessions } from '@/hooks/useSessions';
import { ProjectAnalysisCard } from './ProjectAnalysisCard';
import { Loader2, History } from 'lucide-react';

interface SessionHistoryProps {
  projectId: string;
}

export const SessionHistory = ({ projectId }: SessionHistoryProps) => {
  const { sessions, isLoading } = useSessions(projectId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-border rounded-xl">
        <History className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
        <p className="text-muted-foreground">No review sessions yet</p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Start a review session to get AI-powered project analysis
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <History className="w-5 h-5 text-muted-foreground" />
        Review Sessions ({sessions.length})
      </h3>
      <div className="space-y-4">
        {sessions.map((session) => (
          <ProjectAnalysisCard key={session.id} session={session} />
        ))}
      </div>
    </div>
  );
};
