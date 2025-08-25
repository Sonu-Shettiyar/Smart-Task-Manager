
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    Plus,
    Search,
    Filter,
    Grid3X3,
    List,
    SortAsc,
    SortDesc
} from 'lucide-react';

type SortOption = 'created' | 'updated' | 'priority' | 'title';
type SortOrder = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

const Tasks: React.FC = () => {
    const { state, utils } = useTask();
    const { tasks, currentUser } = state;

    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('updated');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');

    if (!currentUser) return null;

    const filteredTasks = utils.getFilteredTasks(tasks);

    const searchedTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort tasks
    const sortedTasks = [...searchedTasks].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortBy) {
            case 'created':
                aValue = a.createdAt.getTime();
                bValue = b.createdAt.getTime();
                break;
            case 'updated':
                aValue = a.updatedAt.getTime();
                bValue = b.updatedAt.getTime();
                break;
            case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                aValue = priorityOrder[a.priority];
                bValue = priorityOrder[b.priority];
                break;
            case 'title':
                aValue = a.title.toLowerCase();
                bValue = b.title.toLowerCase();
                break;
            default:
                return 0;
        }

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setShowTaskForm(true);
    };

    const handleCloseTaskForm = () => {
        setShowTaskForm(false);
        setEditingTask(null);
    };

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const sortOptions = [
        { value: 'updated', label: 'Last Updated' },
        { value: 'created', label: 'Date Created' },
        { value: 'priority', label: 'Priority' },
        { value: 'title', label: 'Title' }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navigation onShowFilters={() => setShowFilters(true)} />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">All Tasks</h1>
                        <p className="text-muted-foreground">
                            Manage and track all tasks across your projects
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

                {/* Search and Controls */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Sort Controls */}
                    <div className="flex items-center gap-2">
                        <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {sortOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleSortOrder}
                            className="flex items-center gap-1"
                        >
                            {sortOrder === 'asc' ? (
                                <SortAsc className="h-4 w-4" />
                            ) : (
                                <SortDesc className="h-4 w-4" />
                            )}
                        </Button>

                        {/* View Mode Toggle */}
                        <div className="flex items-center border rounded-md">
                            <Button
                                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('grid')}
                                className="rounded-r-none"
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                                className="rounded-l-none"
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Mobile Filters */}
                        <Sheet open={showFilters} onOpenChange={setShowFilters}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="sm" className="sm:hidden">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <TaskFilters onClose={() => setShowFilters(false)} />
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                <div className="flex gap-6">
                    {/* Filters Sidebar (Desktop) */}
                    <div className="hidden sm:block w-80 flex-shrink-0">
                        <TaskFilters />
                    </div>

                    {/* Tasks Content */}
                    <div className="flex-1">
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                    {sortedTasks.length} task{sortedTasks.length === 1 ? '' : 's'} found
                                </span>
                                {(searchQuery || state.filters.priority !== 'all' || state.filters.status !== 'all') && (
                                    <Badge variant="secondary" className="text-xs">
                                        Filtered
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Tasks Grid/List */}
                        {sortedTasks.length > 0 ? (
                            <div className={
                                viewMode === 'grid'
                                    ? 'grid grid-cols-1 lg:grid-cols-2 gap-6'
                                    : 'space-y-4'
                            }>
                                {sortedTasks.map(task => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onEdit={handleEditTask}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="max-w-md mx-auto">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                                        <Search className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-medium mb-2">No tasks found</h3>
                                    <p className="text-muted-foreground mb-4">
                                        {searchQuery
                                            ? `No tasks match "${searchQuery}". Try adjusting your search or filters.`
                                            : 'No tasks match your current filters. Try adjusting them or create a new task.'}
                                    </p>
                                    <Button onClick={() => setShowTaskForm(true)}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Task
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Tasks;