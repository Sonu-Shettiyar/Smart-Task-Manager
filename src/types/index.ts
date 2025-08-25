 
export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'progress' | 'done';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  assignedTo: string | null; // User ID
  createdBy: string; // User ID
  dependsOn: string[]; // Array of Task IDs
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface TaskFilters {
  priority?: Priority | 'all';
  status?: TaskStatus | 'all';
  assignedTo?: string | 'all';
  showBlocked?: boolean;
}

export interface AppState {
  users: User[];
  tasks: Task[];
  currentUser: User | null;
  filters: TaskFilters;
}

export interface CreateTaskData {
  title: string;
  description: string;
  priority: Priority;
  assignedTo?: string | null;
  dependsOn?: string[];
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: TaskStatus;
  assignedTo?: string | null;
  dependsOn?: string[];
}