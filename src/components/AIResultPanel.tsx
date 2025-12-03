import { AIGeneratedResult } from '@/hooks/useAIGeneration';
import { FolderTree } from './FolderTree';
import { RoadmapCard } from './RoadmapCard';
import { Sparkles, Lightbulb, X, Layers, Map } from 'lucide-react';
import { useState } from 'react';

interface AIResultPanelProps {
  result: AIGeneratedResult;
  onClose: () => void;
}

export const AIResultPanel = ({ result, onClose }: AIResultPanelProps) => {
  const [activeTab, setActiveTab] = useState<'structure' | 'roadmap'>('structure');

  return (
    <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 bg-primary/20 rounded-lg blur-sm animate-pulse-glow" />
            <div className="relative bg-primary/10 border border-primary/30 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              AI Generated
              <span className="text-xl">{result.stackIcon}</span>
              <span className="text-primary">{result.stackName}</span>
            </h3>
            <p className="text-xs text-muted-foreground font-mono">Custom structure based on your description</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Contextual Tips */}
      {result.tips && result.tips.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">AI Recommendations</span>
          </div>
          <div className="grid gap-2">
            {result.tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary font-mono">→</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab('structure')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
            activeTab === 'structure'
              ? 'bg-card text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="font-mono text-sm">Folder Structure</span>
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
            activeTab === 'roadmap'
              ? 'bg-card text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Map className="w-4 h-4" />
          <span className="font-mono text-sm">Build Roadmap ({result.roadmap?.length || 0} steps)</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'structure' ? (
        <FolderTree node={result.structure} />
      ) : (
        <RoadmapCard steps={result.roadmap || []} />
      )}
    </div>
  );
};
