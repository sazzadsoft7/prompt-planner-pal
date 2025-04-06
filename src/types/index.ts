
// User type definition
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Authentication state
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Priority levels for tasks
export type PriorityLevel = 'high' | 'medium' | 'low';

// Task status
export type TaskStatus = 'pending' | 'completed';

// Task type definition
export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: PriorityLevel;
  status: TaskStatus;
  createdAt: string;
  updatedAt?: string;
  userId: string;
}

// Dashboard statistics
export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  highPriorityTasks: number;
  dueSoonTasks: number;
}

// Task filters
export interface TaskFilters {
  status?: TaskStatus;
  priority?: PriorityLevel;
  dateRange?: {
    start: string;
    end: string;
  };
  searchQuery?: string;
}
