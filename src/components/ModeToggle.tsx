import { ModeType } from '@/data/stackTemplates';
import { cn } from '@/lib/utils';

interface ModeToggleProps {
  mode: ModeType;
  onModeChange: (mode: ModeType) => void;
}

export const ModeToggle = ({ mode, onModeChange }: ModeToggleProps) => {
  return (
    <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
      <button
        onClick={() => onModeChange('beginner')}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
          mode === 'beginner' 
            ? "bg-primary text-primary-foreground shadow-glow" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <span className="flex items-center gap-2">
          <span className="text-lg">🌱</span>
          Beginner
        </span>
      </button>
      <button
        onClick={() => onModeChange('pro')}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
          mode === 'pro' 
            ? "bg-primary text-primary-foreground shadow-glow" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <span className="flex items-center gap-2">
          <span className="text-lg">⚡</span>
          Pro
        </span>
      </button>
    </div>
  );
};
