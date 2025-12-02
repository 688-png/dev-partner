import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
}

const suggestions = [
  "Generate MERN folder structure for e-commerce",
  "Create Next.js project with auth",
  "Set up React + Supabase for a todo app",
  "Build a blog with Vue + Firebase",
];

export const ChatInput = ({ onSubmit, isLoading }: ChatInputProps) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-accent to-primary rounded-xl opacity-30 group-hover:opacity-50 blur transition-opacity" />
          <div className="relative bg-card border border-border rounded-xl overflow-hidden">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe what you want to build..."
              className="w-full bg-transparent px-4 py-4 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none font-mono text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all",
                input.trim() && !isLoading
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {isLoading ? (
                <Sparkles className="w-4 h-4 animate-pulse" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </form>
      
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setInput(suggestion)}
            className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors font-mono"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};
