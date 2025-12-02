import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Code2, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = login(username, password);
    
    if (success) {
      navigate('/');
    } else {
      setError('Invalid credentials. Access denied.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background grid-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute -inset-2 bg-primary/20 rounded-xl blur-lg animate-pulse-glow" />
              <div className="relative bg-primary p-3 rounded-xl">
                <Code2 className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">DevScaffold</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">Authentication Required</p>
        </div>

        {/* Login Card */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-accent to-primary rounded-xl opacity-30 blur" />
          <div className="relative bg-card border border-border rounded-xl overflow-hidden">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-xs text-muted-foreground font-mono ml-2">login@devscaffold</span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="font-mono">{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground font-mono flex items-center gap-2">
                  <User className="w-3 h-3" />
                  username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground font-mono text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="Enter username"
                  required
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground font-mono flex items-center gap-2">
                  <Lock className="w-3 h-3" />
                  password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground font-mono text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all",
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                  "shadow-glow-sm hover:shadow-glow",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span className="font-mono">Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span className="font-mono">Access System</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="px-6 pb-4">
              <div className="text-xs text-muted-foreground/50 font-mono text-center">
                <span className="text-primary">$</span> Authorized personnel only
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
