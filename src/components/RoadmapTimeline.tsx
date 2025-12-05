import { Clock, CheckCircle2, Circle } from 'lucide-react';
import { RoadmapItem } from '@/types/project';
import { cn } from '@/lib/utils';

interface RoadmapTimelineProps {
  roadmap: RoadmapItem[];
  currentPhase?: number;
}

export const RoadmapTimeline = ({ roadmap, currentPhase = 0 }: RoadmapTimelineProps) => {
  if (!roadmap || roadmap.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-4">Project Roadmap</h3>
        <p className="text-sm text-muted-foreground text-center py-8">
          No roadmap generated yet. Use AI to generate one!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="font-semibold text-foreground mb-6">Project Roadmap</h3>
      
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
        
        <div className="space-y-6">
          {roadmap.map((item, index) => {
            const isComplete = index < currentPhase;
            const isCurrent = index === currentPhase;
            
            return (
              <div key={index} className="relative flex gap-4 ml-1">
                {/* Icon */}
                <div className={cn(
                  'relative z-10 flex items-center justify-center w-7 h-7 rounded-full border-2',
                  isComplete && 'bg-primary border-primary',
                  isCurrent && 'bg-accent border-accent',
                  !isComplete && !isCurrent && 'bg-card border-border'
                )}>
                  {isComplete ? (
                    <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                  ) : isCurrent ? (
                    <Circle className="w-3 h-3 text-accent-foreground fill-current" />
                  ) : (
                    <Circle className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
                
                {/* Content */}
                <div className={cn(
                  'flex-1 pb-6',
                  !isComplete && !isCurrent && 'opacity-60'
                )}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-primary">{item.phase}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {item.duration}
                    </span>
                  </div>
                  <h4 className="font-medium text-foreground mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  
                  {item.tasks && item.tasks.length > 0 && (
                    <ul className="space-y-1">
                      {item.tasks.map((task, taskIdx) => (
                        <li key={taskIdx} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
