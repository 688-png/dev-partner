import { RoadmapStep } from '@/data/stackTemplates';
import { cn } from '@/lib/utils';
import { Check, Copy, Terminal } from 'lucide-react';
import { useState } from 'react';

interface RoadmapCardProps {
  steps: RoadmapStep[];
}

export const RoadmapCard = ({ steps }: RoadmapCardProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCommands = (commands: string[], index: number) => {
    navigator.clipboard.writeText(commands.join('\n'));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div
          key={step.step}
          className={cn(
            "relative pl-8 pb-6 last:pb-0",
            "before:absolute before:left-3 before:top-8 before:bottom-0 before:w-px",
            index < steps.length - 1 ? "before:bg-border" : ""
          )}
        >
          <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">{step.step}</span>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-4 ml-4">
            <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
            <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
            
            {step.commands && step.commands.length > 0 && (
              <div className="bg-muted rounded-lg p-3 relative group">
                <div className="flex items-center gap-2 mb-2">
                  <Terminal className="w-3 h-3 text-primary" />
                  <span className="text-xs text-muted-foreground">Terminal</span>
                </div>
                <code className="text-xs font-mono text-foreground block">
                  {step.commands.map((cmd, i) => (
                    <div key={i} className="py-0.5">
                      <span className="text-primary">$</span> {cmd}
                    </div>
                  ))}
                </code>
                <button
                  onClick={() => copyCommands(step.commands!, index)}
                  className="absolute top-3 right-3 p-1.5 rounded-md bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copiedIndex === index ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : (
                    <Copy className="w-3 h-3 text-muted-foreground" />
                  )}
                </button>
              </div>
            )}
            
            {step.tips && step.tips.length > 0 && (
              <div className="mt-3 space-y-1">
                {step.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="text-primary">💡</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
