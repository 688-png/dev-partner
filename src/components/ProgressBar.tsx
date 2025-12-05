import { cn } from '@/lib/utils';

interface ProgressBarProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar = ({ 
  percentage, 
  size = 'md', 
  showLabel = true,
  className 
}: ProgressBarProps) => {
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  const getColorClass = () => {
    if (percentage === 100) return 'bg-primary';
    if (percentage >= 50) return 'bg-accent';
    if (percentage > 0) return 'bg-yellow-500';
    return 'bg-muted-foreground/30';
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-mono text-muted-foreground">Progress</span>
          <span className="text-xs font-mono font-semibold text-foreground">{percentage}%</span>
        </div>
      )}
      <div className={cn('w-full bg-muted rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            getColorClass()
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
