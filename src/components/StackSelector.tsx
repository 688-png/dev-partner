import { StackType, stackTemplates } from '@/data/stackTemplates';
import { cn } from '@/lib/utils';

interface StackSelectorProps {
  selectedStack: StackType;
  onStackChange: (stack: StackType) => void;
}

export const StackSelector = ({ selectedStack, onStackChange }: StackSelectorProps) => {
  const stacks = Object.entries(stackTemplates) as [StackType, typeof stackTemplates[StackType]][];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {stacks.map(([key, stack]) => (
        <button
          key={key}
          onClick={() => onStackChange(key)}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300",
            selectedStack === key
              ? "border-primary bg-primary/10 shadow-glow"
              : "border-border bg-card hover:border-primary/50 hover:bg-card/80"
          )}
        >
          <span className="text-2xl">{stack.icon}</span>
          <span className="font-mono text-xs text-center">{stack.name}</span>
        </button>
      ))}
    </div>
  );
};
