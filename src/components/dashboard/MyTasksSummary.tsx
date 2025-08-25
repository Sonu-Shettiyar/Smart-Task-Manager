 

import React from 'react';
import { Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface MyTasksSummaryProps {
  myTasks: Task[];
}

export const MyTasksSummary: React.FC<MyTasksSummaryProps> = ({
  myTasks
}) => {
  const tasksByStatus = {
    todo: myTasks.filter(t => t.status === 'todo').length,
    progress: myTasks.filter(t => t.status === 'progress').length,
    done: myTasks.filter(t => t.status === 'done').length
  };

  const statusLabels = {
    todo: 'To Do',
    progress: 'In Progress',
    done: 'Done'
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          My Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Assigned to me</span>
            <Badge variant="secondary">{myTasks.length}</Badge>
          </div>
          
          <div className="space-y-2">
            {(['todo', 'progress', 'done'] as const).map(status => {
              const count = tasksByStatus[status];
              const label = statusLabels[status];
              
              return (
                <div key={status} className="flex items-center justify-between text-sm">
                  <span className="capitalize">{label}</span>
                  <span className="font-medium">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};