 
import React, { useState } from 'react';
import { useTask } from '@/contexts/TaskContext';
import { Task, Priority, CreateTaskData, UpdateTaskData } from '@/types';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, X, AlertTriangle, Clock, Circle } from 'lucide-react';

interface TaskFormProps {
  task?: Task;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ 
  task, 
  onSubmit, 
  onCancel 
}) => {
  const { state, actions } = useTask();
  const { users, tasks, currentUser } = state;
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium' as Priority,
    assignedTo: task?.assignedTo || 'unassigned',
    dependsOn: task?.dependsOn || [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Available tasks for dependencies (exclude current task and its dependencies)
  const availableTasks = tasks.filter(t => 
    t.id !== task?.id && 
    !t.dependsOn.includes(task?.id || '') &&
    t.status !== 'done'
  );

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    // Check for circular dependencies
    if (task && formData.dependsOn.includes(task.id)) {
      newErrors.dependsOn = 'A task cannot depend on itself';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!currentUser) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to create tasks',
      });
      return;
    }

    try {
      if (task) {
        // Update existing task
        const updates: UpdateTaskData = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          priority: formData.priority,
          assignedTo: formData.assignedTo === 'unassigned' ? null : formData.assignedTo,
          dependsOn: formData.dependsOn
        };
        
        actions.updateTask(task.id, updates);
        
        toast({
          title: 'Task updated!',
          description: `"${formData.title}" has been updated successfully.`,
        });
      } else {
        // Create new task
        const taskData: CreateTaskData = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          priority: formData.priority,
          assignedTo: formData.assignedTo === 'unassigned' ? null : formData.assignedTo,
          dependsOn: formData.dependsOn
        };
        
        actions.createTask(taskData, currentUser.id);
        
        toast({
          title: 'Task created!',
          description: `"${formData.title}" has been added to your tasks.`,
        });

        // Reset form for new task
        if (!task) {
          setFormData({
            title: '',
            description: '',
            priority: 'medium',
            assignedTo: 'unassigned',
            dependsOn: []
          });
        }
      }

      onSubmit?.();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save task. Please try again.',
      });
    }
  };

  const handleDependencyToggle = (taskId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      dependsOn: checked 
        ? [...prev.dependsOn, taskId]
        : prev.dependsOn.filter(id => id !== taskId)
    }));
  };

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      case 'low': return Circle;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {task ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          {task ? 'Edit Task' : 'Create New Task'}
        </CardTitle>
        <CardDescription>
          {task 
            ? 'Update task details and settings' 
            : 'Fill in the details to create a new task'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                placeholder="Enter task title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the task in detail"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={`min-h-[100px] ${errors.description ? 'border-destructive' : ''}`}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Task Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value: Priority) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['low', 'medium', 'high'] as Priority[]).map(priority => {
                    const Icon = getPriorityIcon(priority);
                    return (
                      <SelectItem key={priority} value={priority}>
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${
                            priority === 'high' ? 'text-priority-high' :
                            priority === 'medium' ? 'text-priority-medium' :
                            'text-priority-low'
                          }`} />
                          <span className="capitalize">{priority} Priority</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assign To</Label>
              <Select 
                value={formData.assignedTo} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dependencies */}
          {availableTasks.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label>Task Dependencies</Label>
                <p className="text-sm text-muted-foreground">
                  Select tasks that must be completed before this task can be marked as done.
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {availableTasks.map(availableTask => (
                    <div key={availableTask.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`dep-${availableTask.id}`}
                        checked={formData.dependsOn.includes(availableTask.id)}
                        onCheckedChange={(checked) => 
                          handleDependencyToggle(availableTask.id, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`dep-${availableTask.id}`}
                        className="text-sm flex-1 cursor-pointer"
                      >
                        {availableTask.title}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.dependsOn && (
                  <p className="text-sm text-destructive">{errors.dependsOn}</p>
                )}
              </div>
            </>
          )}

          <Separator />

          {/* Form Actions */}
          <div className="flex items-center gap-2 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
            <Button type="submit">
              {task ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {task ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};