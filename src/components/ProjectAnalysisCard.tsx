import { ProjectSession } from '@/types/session';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Target, 
  TrendingUp,
  Calendar,
  ListChecks
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ProjectAnalysisCardProps {
  session: ProjectSession;
}

const healthConfig = {
  'healthy': { icon: CheckCircle2, class: 'text-green-400 bg-green-500/10', label: 'Healthy' },
  'at-risk': { icon: AlertTriangle, class: 'text-yellow-400 bg-yellow-500/10', label: 'At Risk' },
  'critical': { icon: AlertTriangle, class: 'text-red-400 bg-red-500/10', label: 'Critical' },
};

const riskConfig = {
  'low': { class: 'bg-green-500/20 text-green-400', label: 'Low Risk' },
  'medium': { class: 'bg-yellow-500/20 text-yellow-400', label: 'Medium Risk' },
  'high': { class: 'bg-red-500/20 text-red-400', label: 'High Risk' },
};

const alignmentConfig = {
  'ahead': { icon: TrendingUp, class: 'text-green-400', label: 'Ahead of Schedule' },
  'on-track': { icon: Clock, class: 'text-primary', label: 'On Track' },
  'behind': { icon: AlertTriangle, class: 'text-red-400', label: 'Behind Schedule' },
};

export const ProjectAnalysisCard = ({ session }: ProjectAnalysisCardProps) => {
  const health = session.health_status ? healthConfig[session.health_status] : null;
  const risk = session.risk_level ? riskConfig[session.risk_level] : null;
  const alignment = session.timeline_alignment ? alignmentConfig[session.timeline_alignment] : null;

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Project Analysis</h3>
            <p className="text-sm text-muted-foreground">
              {format(new Date(session.scheduled_at), 'MMM d, yyyy h:mm a')}
            </p>
          </div>
        </div>
        {health && (
          <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full', health.class)}>
            <health.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{health.label}</span>
          </div>
        )}
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2">
        {risk && (
          <span className={cn('px-3 py-1 rounded-full text-xs font-mono', risk.class)}>
            {risk.label}
          </span>
        )}
        {alignment && (
          <span className={cn('flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono bg-muted', alignment.class)}>
            <alignment.icon className="w-3 h-3" />
            {alignment.label}
          </span>
        )}
        <span className="px-3 py-1 rounded-full text-xs font-mono bg-muted text-muted-foreground">
          {session.progress_reported}% Complete
        </span>
      </div>

      {/* Summary */}
      {session.session_summary && (
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-foreground">{session.session_summary}</p>
        </div>
      )}

      {/* Delay Analysis */}
      {session.delay_analysis && (
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            Delay Analysis
          </h4>
          <p className="text-sm text-muted-foreground">{session.delay_analysis}</p>
        </div>
      )}

      {/* Recommendations */}
      {session.recommendations && session.recommendations.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            Recommendations
          </h4>
          <ul className="space-y-2">
            {session.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary mt-1">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Plan */}
      {session.action_plan && session.action_plan.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-muted-foreground" />
            Action Plan
          </h4>
          <ol className="space-y-2">
            {session.action_plan.map((action, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary font-mono text-xs">{i + 1}.</span>
                {action}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Focus & Next Milestone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {session.suggested_focus && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="text-xs font-medium text-primary uppercase tracking-wider mb-1">Suggested Focus</h4>
            <p className="text-sm text-foreground">{session.suggested_focus}</p>
          </div>
        )}
        {session.next_milestone && (
          <div className="bg-muted rounded-lg p-4">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Next Milestone</h4>
            <p className="text-sm text-foreground">{session.next_milestone}</p>
          </div>
        )}
      </div>

      {/* Adjusted End Date */}
      {session.adjusted_end_date && (
        <div className="flex items-center gap-2 text-sm text-yellow-400">
          <Calendar className="w-4 h-4" />
          <span>Adjusted end date: {format(new Date(session.adjusted_end_date), 'MMM d, yyyy')}</span>
        </div>
      )}
    </div>
  );
};
