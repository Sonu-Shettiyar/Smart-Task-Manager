 
import React, { useState } from 'react';
import { useTask } from '@/contexts/TaskContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Users, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const LoginForm: React.FC = () => {
  const { state, actions } = useTask();
  const { users } = state;
  const { toast } = useToast();
  
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  const handleLogin = () => {
    const user = users.find(u => u.id === selectedUserId);
    if (user) {
      actions.setCurrentUser(user);
      toast({
        title: 'Welcome back!',
        description: `Logged in as ${user.name}`,
      });
    }
  };

  const handleCreateUser = () => {
    if (!newUserName.trim() || !newUserEmail.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all fields',
      });
      return;
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      createdAt: new Date()
    };

    actions.addUser(newUser);
    actions.setCurrentUser(newUser);
    
    toast({
      title: 'Account created!',
      description: `Welcome, ${newUser.name}!`,
    });

    setNewUserName('');
    setNewUserEmail('');
    setShowNewUserForm(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Users className="h-6 w-6" />
            Smart Task Manager
          </CardTitle>
          <CardDescription>
            Sign in to manage your tasks and collaborate with your team
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {!showNewUserForm ? (
            <>
              {/* Existing User Login */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user-select">Select User</Label>
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your account" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleLogin}
                  disabled={!selectedUserId}
                  className="w-full"
                  size="lg"
                >
                  Sign In
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowNewUserForm(true)}
                className="w-full"
                size="lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Account
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateUser}
                    className="flex-1"
                    size="lg"
                  >
                    Create Account
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewUserForm(false)}
                    size="lg"
                  >
                    Back
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
