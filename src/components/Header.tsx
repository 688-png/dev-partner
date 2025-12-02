import { Code2, Github, Sparkles } from 'lucide-react';

export const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 bg-primary/20 rounded-lg blur-sm" />
            <div className="relative bg-primary p-2 rounded-lg">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-foreground flex items-center gap-2">
              DevScaffold
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">
                AI
              </span>
            </h1>
            <p className="text-xs text-muted-foreground font-mono">Project Structure Generator</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="font-mono">Powered by AI</span>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
