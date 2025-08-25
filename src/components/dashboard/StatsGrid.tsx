 
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  Activity 
} from 'lucide-react';

interface StatItem {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

interface StatsGridProps {
  totalTasks: number;
  inProgressTasks: number;
  highPriorityTasks: number;
  blockedTasks: number;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  totalTasks,
  inProgressTasks,
  highPriorityTasks,
  blockedTasks
}) => {
  const stats: StatItem[] = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: CheckSquare,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'In Progress',
      value: inProgressTasks,
      icon: Clock,
      color: 'text-status-progress',
      bgColor: 'bg-status-progress/10'
    },
    {
      title: 'High Priority',
      value: highPriorityTasks,
      icon: AlertTriangle,
      color: 'text-priority-high',
      bgColor: 'bg-priority-high/10'
    },
    {
      title: 'Blocked',
      value: blockedTasks,
      icon: Activity,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="transition-all duration-200 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};