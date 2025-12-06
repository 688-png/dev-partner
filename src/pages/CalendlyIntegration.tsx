import { Header } from '@/components/Header';
import { CalendlySetupGuide } from '@/components/CalendlySetupGuide';
import { useSessions } from '@/hooks/useSessions';
import { ProjectAnalysisCard } from '@/components/ProjectAnalysisCard';
import { Loader2, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CalendlyIntegration = () => {
  const { sessions, isLoading } = useSessions();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Link to="/projects" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-mono text-sm">Back to Projects</span>
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Calendly Integration
              </h1>
              <p className="text-muted-foreground mt-1">
                AI-powered project review sessions
              </p>
            </div>
          </div>
          <a href="https://calendly.com/sirmakau" target="_blank" rel="noopener noreferrer">
            <Button className="gap-2">
              <Calendar className="w-4 h-4" />
              Book a Session
            </Button>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Setup Guide */}
          <div>
            <CalendlySetupGuide />
          </div>

          {/* Recent Sessions */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Recent Sessions</h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-xl">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No review sessions yet</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Book a session or start a manual review from a project
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {sessions.slice(0, 5).map((session) => (
                  <ProjectAnalysisCard key={session.id} session={session} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalendlyIntegration;
