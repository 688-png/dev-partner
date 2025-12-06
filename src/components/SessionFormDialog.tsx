import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Loader2, ClipboardCheck } from 'lucide-react';
import { useSessions } from '@/hooks/useSessions';

interface SessionFormDialogProps {
  projectId: string;
  projectTitle: string;
  currentProgress: number;
}

export const SessionFormDialog = ({ projectId, projectTitle, currentProgress }: SessionFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const { createSession } = useSessions(projectId);
  
  const [progress, setProgress] = useState(currentProgress);
  const [blockers, setBlockers] = useState('');
  const [needsReview, setNeedsReview] = useState('');
  const [changes, setChanges] = useState('');
  const [milestone, setMilestone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createSession.mutateAsync({
      project_id: projectId,
      progress_reported: progress,
      blockers: blockers || undefined,
      needs_review: needsReview || undefined,
      changes_since_last: changes || undefined,
      target_milestone: milestone || undefined,
    });

    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setProgress(currentProgress);
    setBlockers('');
    setNeedsReview('');
    setChanges('');
    setMilestone('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ClipboardCheck className="w-4 h-4" />
          Start Review Session
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Project Review Session</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Project Name (readonly) */}
          <div className="space-y-2">
            <Label>Project</Label>
            <Input value={projectTitle} disabled className="bg-muted" />
          </div>

          {/* Progress Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>What % is complete?</Label>
              <span className="text-sm font-mono text-primary">{progress}%</span>
            </div>
            <Slider
              value={[progress]}
              onValueChange={(v) => setProgress(v[0])}
              max={100}
              step={5}
            />
          </div>

          {/* Blockers */}
          <div className="space-y-2">
            <Label>What slowed you down?</Label>
            <Textarea
              placeholder="Technical challenges, dependencies, unclear requirements..."
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              rows={2}
            />
          </div>

          {/* Needs Review */}
          <div className="space-y-2">
            <Label>What needs review?</Label>
            <Textarea
              placeholder="Code review, architecture decisions, UI/UX feedback..."
              value={needsReview}
              onChange={(e) => setNeedsReview(e.target.value)}
              rows={2}
            />
          </div>

          {/* Changes Since Last */}
          <div className="space-y-2">
            <Label>What changed since last session?</Label>
            <Textarea
              placeholder="New requirements, scope changes, priority shifts..."
              value={changes}
              onChange={(e) => setChanges(e.target.value)}
              rows={2}
            />
          </div>

          {/* Target Milestone */}
          <div className="space-y-2">
            <Label>Target milestone for next meeting</Label>
            <Input
              placeholder="e.g., Complete authentication module"
              value={milestone}
              onChange={(e) => setMilestone(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createSession.isPending}>
              {createSession.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Generate Analysis'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
