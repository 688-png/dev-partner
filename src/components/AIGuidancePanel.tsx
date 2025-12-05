import { useState } from 'react';
import { Sparkles, Loader2, Lightbulb, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Project, RoadmapItem } from '@/types/project';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AIGuidancePanelProps {
  project: Project;
  onRoadmapGenerated: (roadmap: RoadmapItem[]) => void;
}

interface AIResponse {
  roadmap: RoadmapItem[];
  tips: string[];
  nextSteps: string[];
}

export const AIGuidancePanel = ({ project, onRoadmapGenerated }: AIGuidancePanelProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [guidance, setGuidance] = useState<AIResponse | null>(null);

  const generateGuidance = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/project-guidance`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
          },
          body: JSON.stringify({
            title: project.title,
            description: project.description,
            stack: project.stack,
            currentProgress: project.percentage,
            tasks: project.tasks?.map(t => ({ title: t.title, done: t.done })) || []
          })
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        if (response.status === 402) {
          throw new Error('AI credits exhausted. Please add more credits.');
        }
        throw new Error('Failed to generate guidance');
      }

      const data: AIResponse = await response.json();
      setGuidance(data);
      
      if (data.roadmap && data.roadmap.length > 0) {
        onRoadmapGenerated(data.roadmap);
        toast.success('AI guidance generated successfully!');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate guidance');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">AI Guidance</h3>
        </div>
        <Button 
          onClick={generateGuidance} 
          disabled={isLoading}
          size="sm"
          className="gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Guidance
            </>
          )}
        </Button>
      </div>

      {!guidance && !isLoading && (
        <div className="text-center py-8 text-muted-foreground">
          <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">
            Click "Generate Guidance" to get AI-powered roadmap and tips for your {project.stack} project.
          </p>
        </div>
      )}

      {guidance && (
        <div className="space-y-6">
          {guidance.tips && guidance.tips.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                Tips for Your Project
              </h4>
              <ul className="space-y-2">
                {guidance.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {guidance.nextSteps && guidance.nextSteps.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-accent" />
                Recommended Next Steps
              </h4>
              <ol className="space-y-2">
                {guidance.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 text-accent text-xs flex items-center justify-center font-mono">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
