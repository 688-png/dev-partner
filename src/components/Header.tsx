import { Code2, Github, Sparkles, LogOut, FolderKanban, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Scaffold', icon: Home },
    { path: '/projects', label: 'Tracker', icon: FolderKanban },
  ];

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3">
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
          </Link>

          <nav className="hidden sm:flex items-center gap-1 ml-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === item.path || 
                  (item.path === '/projects' && location.pathname.startsWith('/projects'))
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
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
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-destructive/20 hover:text-destructive transition-colors text-sm font-mono"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
