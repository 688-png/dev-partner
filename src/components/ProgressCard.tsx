import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Trash2 } from 'lucide-react';
import { Project } from '@/types/project';
import { ProgressBar } from './ProgressBar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ProgressCardProps {
  project: Project;
  onDelete?: (id: string) => void;
}

const stackColors: Record<string, string> = {
  'MERN': 'bg-green-500/10 text-green-400 border-green-500/30',
  'MEAN': 'bg-red-500/10 text-red-400 border-red-500/30',
  'Next.js': 'bg-white/10 text-white border-white/30',
  'React + Supabase': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  'Vue + Firebase': 'bg-orange-500/10 text-orange-400 border-orange-500/30'
};

const statusConfig = {
  'not-started': { label: 'Not Started', class: 'bg-muted text-muted-foreground' },
  'in-progress': { label: 'In Progress', class: 'bg-yellow-500/10 text-yellow-400' },
  'complete': { label: 'Complete', class: 'bg-primary/10 text-primary' }
};

export const ProgressCard = ({ project, onDelete }: ProgressCardProps) => {
  const status = statusConfig[project.status];

  return (
    <div className="group relative bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        {onDelete && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(project.id);
            }}
            className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-start justify-between mb-4">
        <div>
          <span className={cn(
            'inline-block px-2 py-0.5 rounded-full text-xs font-mono border mb-2',
            stackColors[project.stack] || 'bg-muted text-muted-foreground'
          )}>
            {project.stack}
          </span>
          <h3 className="font-semibold text-foreground text-lg line-clamp-1">{project.title}</h3>
          {project.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <span className={cn('inline-block px-2 py-0.5 rounded text-xs font-mono', status.class)}>
          {status.label}
        </span>
      </div>

      <ProgressBar percentage={project.percentage} size="md" />

      {(project.start_date || project.end_date) && (
        <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground font-mono">
          <Calendar className="w-3 h-3" />
          <span>
            {project.start_date && format(new Date(project.start_date), 'MMM d')}
            {project.start_date && project.end_date && ' - '}
            {project.end_date && format(new Date(project.end_date), 'MMM d, yyyy')}
          </span>
        </div>
      )}

      <Link
        to={`/projects/${project.id}`}
        className="mt-4 flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
      >
        View Details
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};
