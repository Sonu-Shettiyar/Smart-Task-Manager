 
import React, { useState } from 'react';
import { Task } from '@/types';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Plus, CheckSquare } from 'lucide-react';

interface RecentActivityProps {
  recentTasks: Task[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  recentTasks
}) => {
  const [showTaskForm, setShowTaskForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <TaskForm 
              onSubmit={() => setShowTaskForm(false)}
              onCancel={() => setShowTaskForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {recentTasks.length > 0 ? (
          recentTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              showActions={false}
            />
          ))
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first task to get started!
                </p>
                <Button onClick={() => setShowTaskForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};