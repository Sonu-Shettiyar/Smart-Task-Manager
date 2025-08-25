

import React from 'react';
import { useTask } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/enhanced-button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  User,
  LogOut,
  Settings,
  Filter
} from 'lucide-react';
import { useRouter } from 'next/router';
 
interface NavigationProps {
  onShowFilters?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onShowFilters }) => {
  const { state, actions } = useTask();
  const { currentUser } = state;
  
  const router = useRouter();
  const handleLogout = () => {
    actions.setCurrentUser(null);
    router.push('/');
  };

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/tasks', label: 'All Tasks', icon: CheckSquare },
    { path: '/my-tasks', label: 'My Tasks', icon: User },
    { path: '/users', label: 'Users', icon: Users },
  ];

  if (!currentUser) return null;

  return (
    <nav className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Smart Tasks</h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-1 ml-8">
              {navigationItems.map(({ path, label, icon: Icon }) => (
                <Button
                  key={path}
                  variant={router.pathname === path ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => router.push(path)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Filter button (shown on task pages) */}
            {(router.pathname === '/tasks' || router.pathname === '/my-tasks') && onShowFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onShowFilters}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            )}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-10">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline font-medium">{currentUser.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t">
          <div className="flex items-center justify-around py-2">
            {navigationItems.map(({ path, label, icon: Icon }) => (
              <Button
                key={path}
                variant={router.pathname === path ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => router.push(path)}
                className="flex flex-col items-center gap-1 h-auto py-2"
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};