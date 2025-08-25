 
import React from 'react';
import { Task } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface BlockedTasksAlertProps {
  blockedTasks: Task[];
}

export const BlockedTasksAlert: React.FC<BlockedTasksAlertProps> = ({
  blockedTasks
}) => {
  if (blockedTasks.length === 0) return null;

  return (
    <Card className="border-destructive/50 transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Blocked Tasks
        </CardTitle>
        <CardDescription>
          Tasks waiting for dependencies to complete
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {blockedTasks.slice(0, 3).map(task => (
            <div key={task.id} className="text-sm">
              <div className="font-medium">{task.title}</div>
              <div className="text-muted-foreground text-xs">
                {task.dependsOn.length} dependencies pending
              </div>
            </div>
          ))}
          {blockedTasks.length > 3 && (
            <div className="text-xs text-muted-foreground">
              +{blockedTasks.length - 3} more blocked tasks
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};