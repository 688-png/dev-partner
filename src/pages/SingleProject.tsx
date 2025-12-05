import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Loader2, Edit2, Save, X } from 'lucide-react';
import { useState } from 'react';
import { Header } from '@/components/Header';
import { ProgressBar } from '@/components/ProgressBar';
import { TaskChecklist } from '@/components/TaskChecklist';
import { RoadmapTimeline } from '@/components/RoadmapTimeline';
import { AIGuidancePanel } from '@/components/AIGuidancePanel';
import { useProject, useProjects } from '@/hooks/useProjects';
import { RoadmapItem } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const stackColors: Record<string, string> = {
  'MERN': 'bg-green-500/10 text-green-400 border-green-500/30',
  'MEAN': 'bg-red-500/10 text-red-400 border-red-500/30',
  'Next.js': 'bg-white/10 text-white border-white/30',
  'React + Supabase': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  'Vue + Firebase': 'bg-orange-500/10 text-orange-400 border-orange-500/30'
};

const statusConfig = {
  'not-started': { label: 'Not Started', class: 'bg-muted text-muted-foreground' },
  'in-progress': { label: 'In Progress', class: 'bg-yellow-500/10 text-yellow-400' },
  'complete': { label: 'Complete', class: 'bg-primary/10 text-primary' }
};

const SingleProject = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { project, isLoading, createTask, updateTask, deleteTask } = useProject(id!);
  const { updateProject } = useProjects();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: '', description: '', notes: '' });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Project not found</p>
          <Button onClick={() => navigate('/projects')} className="mt-4">
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const status = statusConfig[project.status];

  const handleStartEdit = () => {
    setEditData({
      title: project.title,
      description: project.description || '',
      notes: project.notes || ''
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    updateProject.mutate({
      id: project.id,
      title: editData.title,
      description: editData.description || null,
      notes: editData.notes || null
    });
    setIsEditing(false);
  };

  const handleToggleTask = (taskId: string, done: boolean) => {
    updateTask.mutate({ taskId, done });
  };

  const handleAddTask = (title: string) => {
    createTask.mutate({ project_id: project.id, title });
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask.mutate(taskId);
  };

  const handleRoadmapGenerated = (roadmap: RoadmapItem[]) => {
    updateProject.mutate({ id: project.id, roadmap });
  };

  const currentPhase = Math.floor((project.percentage / 100) * (project.roadmap?.length || 1));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-mono text-sm">Back to Projects</span>
        </button>

        {/* Project Header */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-mono border',
                  stackColors[project.stack]
                )}>
                  {project.stack}
                </span>
                <span className={cn('px-2 py-0.5 rounded text-xs font-mono', status.class)}>
                  {status.label}
                </span>
              </div>
              
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="text-xl font-bold"
                  />
                  <Textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    placeholder="Project description..."
                    rows={2}
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-foreground">{project.title}</h1>
                  {project.description && (
                    <p className="text-muted-foreground mt-2">{project.description}</p>
                  )}
                </>
              )}
            </div>
            
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={handleSaveEdit}>
                    <Save className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={handleStartEdit}>
                  <Edit2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <ProgressBar percentage={project.percentage} size="lg" />

          {(project.start_date || project.end_date) && (
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground font-mono">
              <Calendar className="w-4 h-4" />
              <span>
                {project.start_date && format(new Date(project.start_date), 'MMM d, yyyy')}
                {project.start_date && project.end_date && ' → '}
                {project.end_date && format(new Date(project.end_date), 'MMM d, yyyy')}
              </span>
            </div>
          )}

          {isEditing ? (
            <div className="mt-4">
              <Textarea
                value={editData.notes}
                onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                placeholder="Notes..."
                rows={2}
              />
            </div>
          ) : project.notes && (
            <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">{project.notes}</p>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <TaskChecklist
              tasks={project.tasks || []}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
            />
            <AIGuidancePanel 
              project={project} 
              onRoadmapGenerated={handleRoadmapGenerated}
            />
          </div>
          
          <div>
            <RoadmapTimeline 
              roadmap={project.roadmap || []} 
              currentPhase={currentPhase}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SingleProject;
