import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FolderNode, RoadmapStep } from '@/data/stackTemplates';
import { toast } from '@/hooks/use-toast';

export interface AIGeneratedResult {
  stack: string;
  stackName: string;
  stackIcon: string;
  structure: FolderNode;
  roadmap: RoadmapStep[];
  tips: string[];
}

export const useAIGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<AIGeneratedResult | null>(null);

  const generate = async (description: string): Promise<AIGeneratedResult | null> => {
    if (!description.trim()) {
      toast({
        title: "Description required",
        description: "Please describe your project to generate a structure.",
        variant: "destructive",
      });
      return null;
    }

    setIsGenerating(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-structure', {
        body: { description },
      });

      if (error) {
        console.error('AI generation error:', error);
        throw new Error(error.message || 'Failed to generate structure');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      toast({
        title: "Structure generated!",
        description: `Created ${data.stackName} project structure with ${data.roadmap?.length || 0} steps.`,
      });

      return data;
    } catch (error) {
      console.error('Generation failed:', error);
      const message = error instanceof Error ? error.message : 'Failed to generate structure';
      
      toast({
        title: "Generation failed",
        description: message,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const clearResult = () => {
    setResult(null);
  };

  return {
    generate,
    isGenerating,
    result,
    clearResult,
  };
};
