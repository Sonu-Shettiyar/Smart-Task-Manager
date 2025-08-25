 
import React, { useState } from 'react';
import { useTask } from '@/contexts/TaskContext';
import { User } from '@/types';
import { Navigation } from '@/components/Navigation';
import { LoginForm } from '@/components/LoginForm';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Users as UsersIcon, 
  Plus, 
  Mail, 
  Calendar,
  CheckCircle,
  Clock,
  Circle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

export const Users: React.FC = () => {
  const { state, actions } = useTask();
  const { users, tasks, currentUser } = state;
  const { toast } = useToast();
  
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  // If no current user, show login
  if (!currentUser) {
    return <LoginForm />;
  }

  const handleAddUser = () => {
    if (!newUserName.trim() || !newUserEmail.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all fields',
      });
      return;
    }

    // Check if email already exists
    if (users.some(user => user.email.toLowerCase() === newUserEmail.toLowerCase())) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'A user with this email already exists',
      });
      return;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      createdAt: new Date()
    };

    actions.addUser(newUser);
    
    toast({
      title: 'User added!',
      description: `${newUser.name} has been added to the team.`,
    });

    // Reset form
    setNewUserName('');
    setNewUserEmail('');
    setShowAddUser(false);
  };

  // Calculate user statistics
  const getUserStats = (userId: string) => {
    const userTasks = tasks.filter(task => task.assignedTo === userId);
    const createdTasks = tasks.filter(task => task.createdBy === userId);
    const completedTasks = userTasks.filter(task => task.status === 'done');
    const inProgressTasks = userTasks.filter(task => task.status === 'progress');
    const highPriorityTasks = userTasks.filter(task => task.priority === 'high' && task.status !== 'done');
    
    const completionRate = userTasks.length > 0 
      ? Math.round((completedTasks.length / userTasks.length) * 100) 
      : 0;

    return {
      assigned: userTasks.length,
      created: createdTasks.length,
      completed: completedTasks.length,
      inProgress: inProgressTasks.length,
      highPriority: highPriorityTasks.length,
      completionRate
    };
  };

  const UserCard: React.FC<{ user: User }> = ({ user }) => {
    const stats = getUserStats(user.id);
    const isCurrentUser = user.id === currentUser.id;

    return (
      <Card className={`transition-all duration-200 hover:shadow-md ${
        isCurrentUser ? 'ring-2 ring-primary/20 bg-primary/5' : ''
      }`}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="text-sm font-medium">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {user.name}
                  {isCurrentUser && (
                    <Badge variant="secondary" className="text-xs">You</Badge>
                  )}
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {user.email}
                </CardDescription>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
            <Calendar className="h-3 w-3" />
            <span>Joined {user.createdAt.toLocaleDateString()}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Task Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Assigned Tasks</div>
              <div className="text-2xl font-bold">{stats.assigned}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Created Tasks</div>
              <div className="text-2xl font-bold">{stats.created}</div>
            </div>
          </div>

          {/* Progress Bar */}
          {stats.assigned > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion Rate</span>
                <span className="font-medium">{stats.completionRate}%</span>
              </div>
              <Progress value={stats.completionRate} className="h-2" />
            </div>
          )}

          {/* Status Breakdown */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-muted rounded">
              <CheckCircle className="h-4 w-4 text-status-done mx-auto mb-1" />
              <div className="font-medium">{stats.completed}</div>
              <div className="text-muted-foreground">Done</div>
            </div>
            <div className="text-center p-2 bg-muted rounded">
              <Clock className="h-4 w-4 text-status-progress mx-auto mb-1" />
              <div className="font-medium">{stats.inProgress}</div>
              <div className="text-muted-foreground">Progress</div>
            </div>
            <div className="text-center p-2 bg-muted rounded">
              <AlertTriangle className="h-4 w-4 text-priority-high mx-auto mb-1" />
              <div className="font-medium">{stats.highPriority}</div>
              <div className="text-muted-foreground">High Priority</div>
            </div>
          </div>

          {/* Performance Indicator */}
          {stats.assigned > 0 && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <TrendingUp className={`h-4 w-4 ${
                stats.completionRate > 75 ? 'text-status-done' :
                stats.completionRate > 50 ? 'text-priority-medium' :
                'text-priority-high'
              }`} />
              <span className="text-sm text-muted-foreground">
                {stats.completionRate > 75 ? 'Excellent performance' :
                 stats.completionRate > 50 ? 'Good progress' :
                 'Needs attention'}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Calculate team statistics
  const totalTasks = tasks.length;
  const totalUsers = users.length;
  const activeTasks = tasks.filter(t => t.status !== 'done').length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const teamCompletionRate = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <UsersIcon className="h-8 w-8" />
              Team Members
            </h1>
            <p className="text-muted-foreground">
              Manage your team and track performance across all projects
            </p>
          </div>
          
          <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Team Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="userName">Full Name</Label>
                  <Input
                    id="userName"
                    placeholder="Enter full name"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userEmail">Email Address</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    placeholder="Enter email address"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddUser(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser}>
                    Add User
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Team Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Team Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                {totalUsers}
                <UsersIcon className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTasks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Active Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-progress">{activeTasks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Team Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-done">{teamCompletionRate}%</div>
              <Progress value={teamCompletionRate} className="h-1 mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>

        {/* Empty State */}
        {users.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <UsersIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No team members yet</h3>
              <p className="text-muted-foreground mb-6">
                Add your first team member to start collaborating on tasks.
              </p>
              <Button onClick={() => setShowAddUser(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First User
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};