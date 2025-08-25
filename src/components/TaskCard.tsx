 

import React from 'react';
import { Task,   Priority, TaskStatus } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { useTask } from '@/contexts/TaskContext';
import { 
  Clock, 
  User as UserIcon, 
  AlertTriangle, 
  CheckCircle, 
  Circle, 
  Play,
  Trash2,
  Edit,
  Link
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  showActions?: boolean;
  onEdit?: (task: Task) => void;
}

 
const getPriorityDetails = (priority: Priority) => {
  switch (priority) {
    case 'high':
      return { icon: AlertTriangle, colorClass: 'text-priority-high', bgClass: 'bg-priority-high/10' };
    case 'medium':
      return { icon: Clock, colorClass: 'text-priority-medium', bgClass: 'bg-priority-medium/10' };
    case 'low':
      return { icon: Circle, colorClass: 'text-priority-low', bgClass: 'bg-priority-low/10' };
  }
};

 
const getStatusDetails = (status: TaskStatus) => {
  switch (status) {
    case 'done':
      return { icon: CheckCircle, label: 'Done', variant: 'status-done' as const };
    case 'progress':
      return { icon: Play, label: 'In Progress', variant: 'status-progress' as const };
    case 'todo':
      return { icon: Circle, label: 'To Do', variant: 'status-todo' as const };
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  showActions = true, 
  onEdit 
}) => {
  const { state, actions, utils } = useTask();
  const { users } = state;

  // Find assigned user
  const assignedUser = users.find(user => user.id === task.assignedTo);
  const createdUser = users.find(user => user.id === task.createdBy);

  // Get priority and status details
  const priorityDetails = getPriorityDetails(task.priority);
  const statusDetails = getStatusDetails(task.status);

  // Check if task is blocked
  const isBlocked = utils.isTaskBlocked(task);

  // Get dependency tasks
  const dependencyTasks = task.dependsOn
    .map(depId => state.tasks.find(t => t.id === depId))
    .filter(Boolean) as Task[];

  const handleStatusChange = (newStatus: TaskStatus) => {
    // Don't allow marking as done if blocked
    if (newStatus === 'done' && isBlocked) {
      return;
    }
    actions.updateTask(task.id, { status: newStatus });
  };

  const handleDelete = () => {
    actions.deleteTask(task.id);
  };

  const PriorityIcon = priorityDetails.icon;
  const StatusIcon = statusDetails.icon;

  return (
    <Card className={`transition-all duration-300 hover:shadow-md ${
      isBlocked ? 'opacity-75 border-destructive/50' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold mb-1 flex items-center gap-2">
              {task.title}
              {isBlocked && (
                <Badge variant="destructive" className="text-xs">
                  Blocked
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-sm">
              {task.description}
            </CardDescription>
          </div>
          
          {/* Priority indicator */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${priorityDetails.bgClass}`}>
            <PriorityIcon className={`h-3 w-3 ${priorityDetails.colorClass}`} />
            <span className={`text-xs font-medium capitalize ${priorityDetails.colorClass}`}>
              {task.priority}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status and assignment info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon className="h-4 w-4" />
            <span className="text-sm font-medium">{statusDetails.label}</span>
          </div>
          
          {assignedUser && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <UserIcon className="h-3 w-3" />
              <span>{assignedUser.name}</span>
            </div>
          )}
        </div>

        {/* Dependencies */}
        {dependencyTasks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-sm font-medium">
              <Link className="h-3 w-3" />
              <span>Dependencies:</span>
            </div>
            <div className="space-y-1">
              {dependencyTasks.map(depTask => (
                <div key={depTask.id} className="flex items-center gap-2 text-xs">
                  <Circle className={`h-2 w-2 ${
                    depTask.status === 'done' ? 'text-status-done' : 'text-muted-foreground'
                  }`} />
                  <span className={depTask.status === 'done' ? 'line-through text-muted-foreground' : ''}>
                    {depTask.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        {showActions && (
          <div className="flex items-center gap-2 pt-2 border-t">
            {/* Status change buttons */}
            <div className="flex items-center gap-1">
              {task.status !== 'todo' && (
                <Button
                  variant="status-todo"
                  size="sm"
                  onClick={() => handleStatusChange('todo')}
                >
                  To Do
                </Button>
              )}
              {task.status !== 'progress' && (
                <Button
                  variant="status-progress"
                  size="sm"
                  onClick={() => handleStatusChange('progress')}
                >
                  Progress
                </Button>
              )}
              {task.status !== 'done' && (
                <Button
                  variant="status-done"
                  size="sm"
                  onClick={() => handleStatusChange('done')}
                  disabled={isBlocked}
                  title={isBlocked ? 'Cannot complete: dependencies not finished' : 'Mark as done'}
                >
                  Done
                </Button>
              )}
            </div>

            {/* Edit and delete actions */}
            <div className="flex items-center gap-1 ml-auto">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(task)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="text-xs text-muted-foreground pt-2 border-t">
          <div>Created by {createdUser?.name} • {task.createdAt.toLocaleDateString()}</div>
          {task.completedAt && (
            <div>Completed on {task.completedAt.toLocaleDateString()}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};