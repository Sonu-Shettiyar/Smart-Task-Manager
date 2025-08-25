 

import React from 'react';
import { User, Task } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
 
import { 
   
  Mail, 
  Calendar, 
  CheckSquare, 
  Clock,
  TrendingUp,
  Award
} from 'lucide-react';

interface UserProfileProps {
  user: User;
  userTasks: Task[];
  allTasks: Task[];
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  userTasks,
  allTasks
}) => {
  // Calculate user statistics
  const completedTasks = userTasks.filter(t => t.status === 'done').length;
  const inProgressTasks = userTasks.filter(t => t.status === 'progress').length;
  const completionRate = userTasks.length > 0 ? Math.round((completedTasks / userTasks.length) * 100) : 0;
  
  // Calculate tasks created by user
  const createdTasks = allTasks.filter(t => t.createdBy === user.id).length;
  
  // Calculate priority distribution
  const highPriorityTasks = userTasks.filter(t => t.priority === 'high').length;
  const mediumPriorityTasks = userTasks.filter(t => t.priority === 'medium').length;
  const lowPriorityTasks = userTasks.filter(t => t.priority === 'low').length;

  const stats = [
    {
      label: 'Tasks Assigned',
      value: userTasks.length,
      icon: CheckSquare,
      color: 'text-primary'
    },
    {
      label: 'Tasks Completed',
      value: completedTasks,
      icon: Award,
      color: 'text-status-done'
    },
    {
      label: 'In Progress',
      value: inProgressTasks,
      icon: Clock,
      color: 'text-status-progress'
    },
    {
      label: 'Tasks Created',
      value: createdTasks,
      icon: TrendingUp,
      color: 'text-priority-medium'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {user.createdAt.toLocaleDateString()}
                </span>
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{completionRate}%</div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Priority Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Task Priority Distribution</CardTitle>
          <CardDescription>
            Breakdown of assigned tasks by priority level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-priority-high"></div>
                High Priority
              </span>
              <Badge variant="destructive">{highPriorityTasks}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-priority-medium"></div>
                Medium Priority
              </span>
              <Badge variant="secondary">{mediumPriorityTasks}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-priority-low"></div>
                Low Priority
              </span>
              <Badge variant="outline">{lowPriorityTasks}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};