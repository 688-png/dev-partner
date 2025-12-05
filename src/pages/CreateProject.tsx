import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { useProjects } from '@/hooks/useProjects';
import { StackType, CreateProjectInput } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const stacks: { value: StackType; label: string; color: string }[] = [
  { value: 'MERN', label: 'MERN Stack', color: 'bg-green-500' },
  { value: 'MEAN', label: 'MEAN Stack', color: 'bg-red-500' },
  { value: 'Next.js', label: 'Next.js', color: 'bg-white' },
  { value: 'React + Supabase', label: 'React + Supabase', color: 'bg-cyan-500' },
  { value: 'Vue + Firebase', label: 'Vue + Firebase', color: 'bg-orange-500' },
];

const CreateProject = () => {
  const navigate = useNavigate();
  const { createProject } = useProjects();
  const [formData, setFormData] = useState<CreateProjectInput>({
    title: '',
    description: '',
    stack: 'MERN',
    start_date: '',
    end_date: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const input: CreateProjectInput = {
      ...formData,
      start_date: formData.start_date || undefined,
      end_date: formData.end_date || undefined
    };

    createProject.mutate(input, {
      onSuccess: (data) => {
        navigate(`/projects/${data.id}`);
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-mono text-sm">Back to Projects</span>
        </button>

        <div className="bg-card border border-border rounded-xl p-6">
          <h1 className="text-xl font-bold text-foreground mb-6">Create New Project</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                placeholder="My Awesome App"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of your project..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stack">Tech Stack *</Label>
              <Select
                value={formData.stack}
                onValueChange={(value: StackType) => setFormData({ ...formData, stack: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stacks.map((stack) => (
                    <SelectItem key={stack.value} value={stack.value}>
                      <div className="flex items-center gap-2">
                        <span className={cn('w-2 h-2 rounded-full', stack.color)} />
                        {stack.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">Target End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/projects')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={!formData.title || createProject.isPending}
              >
                {createProject.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Project'
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateProject;
