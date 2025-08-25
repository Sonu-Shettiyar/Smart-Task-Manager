
import React from 'react';
import { useTask } from '@/contexts/TaskContext';
import { Navigation } from '@/components/Navigation';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { ProgressOverview } from '@/components/dashboard/ProgressOverview';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { MyTasksSummary } from '@/components/dashboard/MyTasksSummary';
import { BlockedTasksAlert } from '@/components/dashboard/BlockedTasksAlert';
import { QuickActions } from '@/components/dashboard/QuickActions';

export default function Dashboard() {
  const { state, utils } = useTask();
  const { tasks, currentUser } = state;

  if (!currentUser) return null;

  // Get user's tasks and stats
  const myTasks = utils.getUserTasks(currentUser.id, tasks);
  const recentTasks = tasks
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 6);

  const blockedTasks = utils.getBlockedTasks(tasks);

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'progress').length;
  const highPriorityTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'done').length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {currentUser.name}!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your tasks today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8">
          <StatsGrid
            totalTasks={totalTasks}
            inProgressTasks={inProgressTasks}
            highPriorityTasks={highPriorityTasks}
            blockedTasks={blockedTasks.length}
          />
        </div>

        {/* Progress Overview */}
        <div className="mb-8">
          <ProgressOverview
            completedTasks={completedTasks}
            totalTasks={totalTasks}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <RecentActivity recentTasks={recentTasks} />

          {/* Side Panel */}
          <div className="space-y-6">
            <MyTasksSummary myTasks={myTasks} />
            <BlockedTasksAlert blockedTasks={blockedTasks} />
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};