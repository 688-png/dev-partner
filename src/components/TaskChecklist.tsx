import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Task } from '@/types/project';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TaskChecklistProps {
  tasks: Task[];
  onToggleTask: (taskId: string, done: boolean) => void;
  onAddTask: (title: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskChecklist = ({ 
  tasks, 
  onToggleTask, 
  onAddTask, 
  onDeleteTask 
}: TaskChecklistProps) => {
  const [newTask, setNewTask] = useState('');

  const handleAddTask = () => {
    if (newTask.trim()) {
      onAddTask(newTask.trim());
      setNewTask('');
    }
  };

  const completedCount = tasks.filter(t => t.done).length;

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Tasks</h3>
        <span className="text-xs font-mono text-muted-foreground">
          {completedCount}/{tasks.length} completed
        </span>
      </div>

      <div className="space-y-2 mb-4 max-h-80 overflow-y-auto">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No tasks yet. Add your first task below.
          </p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                'group flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30 transition-all',
                task.done && 'bg-primary/5 border-primary/20'
              )}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground/50 cursor-grab" />
              <Checkbox
                checked={task.done}
                onCheckedChange={(checked) => onToggleTask(task.id, checked as boolean)}
                className="border-muted-foreground/50"
              />
              <span className={cn(
                'flex-1 text-sm font-mono',
                task.done && 'line-through text-muted-foreground'
              )}>
                {task.title}
              </span>
              <span className="text-xs font-mono text-muted-foreground">
                {task.percentage}%
              </span>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-destructive transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          className="flex-1 font-mono text-sm"
        />
        <Button onClick={handleAddTask} size="sm" className="gap-1">
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>
    </div>
  );
};
