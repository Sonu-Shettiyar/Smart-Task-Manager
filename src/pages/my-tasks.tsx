 

import React, { useState } from 'react';
import { useTask } from '@/contexts/TaskContext';
import { Task } from '@/types';
import { Navigation } from '@/components/Navigation';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { TaskFilters } from '@/components/TaskFilters';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  Circle,
  AlertTriangle,
  User
} from 'lucide-react';

 const MyTasks: React.FC = () => {
  const { state, utils } = useTask();
  const { tasks, currentUser } = state;
  
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!currentUser) return null;

  // Get user's tasks
  const myTasks = utils.getUserTasks(currentUser.id, tasks);
  
  // Apply filters and search to user's tasks
  const filteredMyTasks = utils.getFilteredTasks(myTasks);
  
  const searchedTasks = filteredMyTasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats for user's tasks
  const todoTasks = myTasks.filter(t => t.status === 'todo');
  const progressTasks = myTasks.filter(t => t.status === 'progress');
  const doneTasks = myTasks.filter(t => t.status === 'done');
  const blockedTasks = myTasks.filter(t => utils.isTaskBlocked(t));
  const highPriorityTasks = myTasks.filter(t => t.priority === 'high' && t.status !== 'done');
  
  const completionRate = myTasks.length > 0 
    ? Math.round((doneTasks.length / myTasks.length) * 100) 
    : 0;

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  // Group tasks by status for better organization
  const tasksByStatus = {
    todo: searchedTasks.filter(t => t.status === 'todo'),
    progress: searchedTasks.filter(t => t.status === 'progress'),
    done: searchedTasks.filter(t => t.status === 'done')
  };

  const StatusSection: React.FC<{ 
    title: string; 
    tasks: Task[]; 
    icon: React.ComponentType<any>;
    color: string;
  }> = ({ title, tasks, icon: Icon, color }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className={`h-5 w-5 ${color}`} />
        <h3 className="text-lg font-semibold">{title}</h3>
        <Badge variant="secondary">{tasks.length}</Badge>
      </div>
      
      {tasks.length > 0 ? (
        <div className="grid gap-4">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <Icon className={`h-12 w-12 ${color} mx-auto mb-2 opacity-50`} />
            <p className="text-muted-foreground">No {title.toLowerCase()} tasks</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation onShowFilters={() => setShowFilters(true)} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <User className="h-8 w-8" />
              My Tasks
            </h1>
            <p className="text-muted-foreground">
              Tasks assigned to you - stay organized and productive
            </p>
          </div>
          
          <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <TaskForm 
                task={editingTask || undefined}
                onSubmit={handleCloseTaskForm}
                onCancel={handleCloseTaskForm}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myTasks.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">To Do</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">{todoTasks.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-status-progress">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-progress">{progressTasks.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-status-done">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-done">{doneTasks.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-destructive">Blocked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{blockedTasks.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Your Progress</CardTitle>
            <CardDescription>Task completion rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion Rate</span>
                <span className="font-medium">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{doneTasks.length} completed</span>
                <span>{myTasks.length - doneTasks.length} remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" className="sm:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <TaskFilters onClose={() => setShowFilters(false)} />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar (Desktop) */}
          <div className="hidden sm:block w-80 shrink-0">
            <TaskFilters />
          </div>

          {/* Tasks Content */}
          <div className="flex-1">
            {/* High Priority Alert */}
            {highPriorityTasks.length > 0 && (
              <Card className="border-priority-high/50 mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-priority-high">
                    <AlertTriangle className="h-5 w-5" />
                    High Priority Tasks
                  </CardTitle>
                  <CardDescription>
                    {highPriorityTasks.length} high priority task{highPriorityTasks.length === 1 ? '' : 's'} need{highPriorityTasks.length === 1 ? 's' : ''} your attention
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {highPriorityTasks.slice(0, 2).map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      showActions={false}
                    />
                  ))}
                  {highPriorityTasks.length > 2 && (
                    <p className="text-sm text-muted-foreground">
                      +{highPriorityTasks.length - 2} more high priority tasks
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-muted-foreground">
                Showing {searchedTasks.length} of {myTasks.length} tasks
              </span>
            </div>

            {/* Tasks by Status */}
            {myTasks.length > 0 ? (
              <div className="space-y-8">
                <StatusSection
                  title="To Do"
                  tasks={tasksByStatus.todo}
                  icon={Circle}
                  color="text-muted-foreground"
                />
                
                <StatusSection
                  title="In Progress"
                  tasks={tasksByStatus.progress}
                  icon={Clock}
                  color="text-status-progress"
                />
                
                <StatusSection
                  title="Completed"
                  tasks={tasksByStatus.done}
                  icon={CheckCircle}
                  color="text-status-done"
                />
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No tasks assigned</h3>
                  <p className="text-muted-foreground mb-6">
                    You don&apos;t have any tasks assigned to you yet. Create your first task to get started!
                  </p>
                  <Button onClick={() => setShowTaskForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Task
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
 };

export default MyTasks;