 
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, Task, AppState, CreateTaskData, UpdateTaskData, TaskFilters, Priority, TaskStatus } from '@/types';

type AppAction =
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'CREATE_TASK'; payload: { taskData: CreateTaskData; createdBy: string } }
  | { type: 'UPDATE_TASK'; payload: { taskId: string; updates: UpdateTaskData } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<TaskFilters> }
  | { type: 'RESET_FILTERS' };

// Initial state with mock data
const initialState: AppState = {
  users: [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      createdAt: new Date()
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol@example.com',
      createdAt: new Date()
    }
  ],
  tasks: [
    {
      id: '1',
      title: 'Setup Project Architecture',
      description: 'Initialize the project structure and define core components',
      priority: 'high' as Priority,
      status: 'done' as TaskStatus,
      assignedTo: '1',
      createdBy: '1',
      dependsOn: [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
      completedAt: new Date('2024-01-02')
    },
    {
      id: '2',
      title: 'Design Database Schema',
      description: 'Define the data models for users, tasks, and relationships',
      priority: 'medium' as Priority,
      status: 'progress' as TaskStatus,
      assignedTo: '2',
      createdBy: '1',
      dependsOn: ['1'],
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-03')
    },
    {
      id: '3',
      title: 'Implement User Interface',
      description: 'Create beautiful components for task management',
      priority: 'high' as Priority,
      status: 'todo' as TaskStatus,
      assignedTo: '3',
      createdBy: '1',
      dependsOn: ['1', '2'],
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03')
    }
  ],
  currentUser: null,
  filters: {
    priority: 'high',
    status: 'all',
    assignedTo: 'all',
    showBlocked: false
  }
};

const generateId = (): string => Math.random().toString(36).substr(2, 9);

const isTaskBlocked = (task: Task, allTasks: Task[]): boolean => {
  return task.dependsOn.some(depId => {
    const depTask = allTasks.find(t => t.id === depId);
    return !depTask || depTask.status !== 'done';
  });
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { 
        ...state, 
        currentUser: action.payload,
         
        filters: {
          priority: 'high',
          status: 'all', 
          assignedTo: 'all',
          showBlocked: false
        }
      };

    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };

    case 'CREATE_TASK': {
      const newTask: Task = {
        id: generateId(),
        ...action.payload.taskData,
        assignedTo: action.payload.taskData.assignedTo || null,
        status: 'todo',
        createdBy: action.payload.createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
        dependsOn: action.payload.taskData.dependsOn || []
      };
      return { ...state, tasks: [...state.tasks, newTask] };
    }

    case 'UPDATE_TASK': {
      const updatedTasks = state.tasks.map(task =>
        task.id === action.payload.taskId
          ? {
              ...task,
              ...action.payload.updates,
              updatedAt: new Date(),
              ...(action.payload.updates.status === 'done' && { completedAt: new Date() })
            }
          : task
      );
      return { ...state, tasks: updatedTasks };
    }

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };

    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };

    case 'RESET_FILTERS':
      return {
        ...state,
        filters: {
          priority: 'high',
          status: 'all',
          assignedTo: 'all',
          showBlocked: false
        }
      };

    default:
      return state;
  }
};

interface TaskContextType {
  state: AppState;
  actions: {
    setCurrentUser: (user: User | null) => void;
    addUser: (user: User) => void;
    createTask: (taskData: CreateTaskData, createdBy: string) => void;
    updateTask: (taskId: string, updates: UpdateTaskData) => void;
    deleteTask: (taskId: string) => void;
    setFilters: (filters: Partial<TaskFilters>) => void;
    resetFilters: () => void;
  };
  utils: {
    isTaskBlocked: (task: Task) => boolean;
    getFilteredTasks: (tasks: Task[]) => Task[];
    getUserTasks: (userId: string, tasks: Task[]) => Task[];
    getBlockedTasks: (tasks: Task[]) => Task[];
  };
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = {
    setCurrentUser: (user: User | null) => 
      dispatch({ type: 'SET_CURRENT_USER', payload: user }),
    
    addUser: (user: User) => 
      dispatch({ type: 'ADD_USER', payload: user }),
    
    createTask: (taskData: CreateTaskData, createdBy: string) => 
      dispatch({ type: 'CREATE_TASK', payload: { taskData, createdBy } }),
    
    updateTask: (taskId: string, updates: UpdateTaskData) => 
      dispatch({ type: 'UPDATE_TASK', payload: { taskId, updates } }),
    
    deleteTask: (taskId: string) => 
      dispatch({ type: 'DELETE_TASK', payload: taskId }),
    
    setFilters: (filters: Partial<TaskFilters>) => 
      dispatch({ type: 'SET_FILTERS', payload: filters }),
    
    resetFilters: () => 
      dispatch({ type: 'RESET_FILTERS' })
  };

  const utils = {
    isTaskBlocked: (task: Task) => isTaskBlocked(task, state.tasks),
    
    getFilteredTasks: (tasks: Task[]) => {
      return tasks.filter(task => {
        const { priority, status, assignedTo, showBlocked } = state.filters;
        
        if (priority !== 'all' && task.priority !== priority) return false;
        if (status !== 'all' && task.status !== status) return false;
        if (assignedTo !== 'all' && assignedTo !== 'unassigned' && task.assignedTo !== assignedTo) return false;
        if (assignedTo === 'unassigned' && task.assignedTo !== null) return false;
        if (showBlocked && !isTaskBlocked(task, tasks)) return false;
        
        return true;
      });
    },
    
    getUserTasks: (userId: string, tasks: Task[]) => 
      tasks.filter(task => task.assignedTo === userId),
    
    getBlockedTasks: (tasks: Task[]) => 
      tasks.filter(task => isTaskBlocked(task, tasks))
  };

  return (
    <TaskContext.Provider value={{ state, actions, utils }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};