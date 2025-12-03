import { useState } from 'react';
import { Send, Sparkles, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  onAIGenerate: (message: string) => void;
  isLoading?: boolean;
  isGenerating?: boolean;
}

const suggestions = [
  "E-commerce platform with user auth, cart, and payments",
  "Real-time chat app with file sharing",
  "Project management dashboard with Kanban boards",
  "Blog platform with CMS and SEO optimization",
];

export const ChatInput = ({ onSubmit, onAIGenerate, isLoading, isGenerating }: ChatInputProps) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && !isGenerating) {
      onSubmit(input.trim());
    }
  };

  const handleAIGenerate = () => {
    if (input.trim() && !isGenerating) {
      onAIGenerate(input.trim());
    }
  };

  const disabled = isLoading || isGenerating;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <div className={cn(
            "absolute -inset-0.5 bg-gradient-to-r from-primary via-accent to-primary rounded-xl blur transition-opacity",
            isGenerating ? "opacity-60 animate-pulse" : "opacity-30 group-hover:opacity-50"
          )} />
          <div className="relative bg-card border border-border rounded-xl overflow-hidden">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your project in detail... (e.g., 'A SaaS dashboard with user authentication, subscription management, and analytics')"
              className="w-full bg-transparent px-4 py-4 pr-24 text-foreground placeholder:text-muted-foreground focus:outline-none font-mono text-sm resize-none min-h-[80px]"
              disabled={disabled}
              rows={2}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                type="button"
                onClick={handleAIGenerate}
                disabled={!input.trim() || disabled}
                className={cn(
                  "p-2 rounded-lg transition-all flex items-center gap-1",
                  input.trim() && !disabled
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-sm"
                    : "bg-muted text-muted-foreground"
                )}
                title="Generate with AI"
              >
                {isGenerating ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <Wand2 className="w-4 h-4" />
                )}
              </button>
              <button
                type="submit"
                disabled={!input.trim() || disabled}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  input.trim() && !disabled
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    : "bg-muted text-muted-foreground"
                )}
                title="Use templates"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </form>
      
      {isGenerating && (
        <div className="flex items-center gap-2 text-sm text-primary font-mono">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>AI is analyzing your project and generating structure...</span>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground font-mono mr-1">Try:</span>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setInput(suggestion)}
            disabled={disabled}
            className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors font-mono disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};
