 

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { 
  CheckSquare, 
  Users, 
  Activity, 
  BarChart3,
  Settings,
  FileText
} from 'lucide-react';
import { useRouter } from 'next/router';

export const QuickActions: React.FC = () => {
  const router = useRouter();

  const actions = [
    {
      label: 'View All Tasks',
      icon: CheckSquare,
      onClick: () => router.push('/tasks'),
      description: 'Browse and manage all tasks'
    },
    {
      label: 'My Tasks',
      icon: Users,
      onClick: () => router.push('/my-tasks'),
      description: 'View tasks assigned to you'
    },
    {
      label: 'Team Management',
      icon: Users,
      onClick: () => router.push('/users'),
      description: 'Manage team members'
    },
    {
      label: 'Reports',
      icon: BarChart3,
      onClick: () => {},
      description: 'View task analytics',
      disabled: true
    },
    {
      label: 'Settings',
      icon: Settings,
      onClick: () => router.push('/profile'),
      description: 'Configure your preferences'
    },
    {
      label: 'Export Data',
      icon: FileText,
      onClick: () => {},
      description: 'Export task data',
      disabled: true
    }
  ];

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.label}
              variant="outline"
              className="w-full justify-start h-auto p-3"
              onClick={action.onClick}
              disabled={action.disabled}
            >
              <div className="flex items-center gap-3 w-full">
                <Icon className="h-4 w-4 shrink-0" />
                <div className="text-left flex-1">
                  <div className="font-medium text-sm">{action.label}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};