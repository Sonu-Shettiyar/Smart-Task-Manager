 

import React from 'react';
import { useTask } from '@/contexts/TaskContext';
import { Priority, TaskStatus } from '@/types';
import { Button } from '@/components/ui/enhanced-button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Filter, 
  X, 
  AlertTriangle, 
  Clock, 
  Circle,
  CheckCircle,
  Play,
  User
} from 'lucide-react';

interface TaskFiltersProps {
  onClose?: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({ onClose }) => {
  const { state, actions } = useTask();
  const { filters, users, tasks } = state;

  const priorityOptions = [
    { value: 'all', label: 'All Priorities', icon: Filter },
    { value: 'high', label: 'High Priority', icon: AlertTriangle, color: 'text-priority-high' },
    { value: 'medium', label: 'Medium Priority', icon: Clock, color: 'text-priority-medium' },
    { value: 'low', label: 'Low Priority', icon: Circle, color: 'text-priority-low' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses', icon: Filter },
    { value: 'todo', label: 'To Do', icon: Circle, color: 'text-status-todo-foreground' },
    { value: 'progress', label: 'In Progress', icon: Play, color: 'text-status-progress' },
    { value: 'done', label: 'Done', icon: CheckCircle, color: 'text-status-done' }
  ];

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.priority !== 'all') count++;
    if (filters.status !== 'all') count++;
    if (filters.assignedTo !== 'all') count++;
    if (filters.showBlocked) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  const handleReset = () => {
    actions.resetFilters();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Priority Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Priority</Label>
          <Select 
            value={filters.priority || 'all'} 
            onValueChange={(value) => actions.setFilters({ 
              priority: value === 'all' ? 'all' : value as Priority 
            })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map(option => {
                const Icon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${option.color || ''}`} />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Status</Label>
          <Select 
            value={filters.status || 'all'} 
            onValueChange={(value) => actions.setFilters({ 
              status: value === 'all' ? 'all' : value as TaskStatus 
            })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => {
                const Icon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${option.color || ''}`} />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Assignee Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Assigned To</Label>
          <Select 
            value={filters.assignedTo || 'all'} 
            onValueChange={(value) => actions.setFilters({ assignedTo: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>All Users</span>
                </div>
              </SelectItem>
              <SelectItem value="unassigned">
                <div className="flex items-center gap-2">
                  <Circle className="h-4 w-4 text-muted-foreground" />
                  <span>Unassigned</span>
                </div>
              </SelectItem>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Blocked Tasks Toggle */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-blocked"
            checked={filters.showBlocked}
            onCheckedChange={(checked) => actions.setFilters({ showBlocked: checked as boolean })}
          />
          <Label htmlFor="show-blocked" className="text-sm font-medium cursor-pointer">
            Show only blocked tasks
          </Label>
        </div>

        {/* Filter Summary */}
        {activeFiltersCount > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {activeFiltersCount} filter{activeFiltersCount === 1 ? '' : 's'} active
              </span>
              <Button variant="outline" size="sm" onClick={handleReset}>
                Clear All
              </Button>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="pt-4 border-t space-y-2">
          <Label className="text-sm font-medium">Quick Stats</Label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center p-2 bg-muted rounded">
              <div className="font-medium">{tasks.length}</div>
              <div className="text-muted-foreground">Total Tasks</div>
            </div>
            <div className="text-center p-2 bg-muted rounded">
              <div className="font-medium">
                {tasks.filter(t => t.status === 'done').length}
              </div>
              <div className="text-muted-foreground">Completed</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};