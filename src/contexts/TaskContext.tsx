
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Task, TaskFilters, PriorityLevel, TaskStatus, DashboardStats } from '@/types';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

// Sample tasks for demo
const generateSampleTasks = (userId: string): Task[] => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  return [
    {
      id: uuidv4(),
      title: "Complete Project Proposal",
      description: "Finish the draft and send it to the client for review",
      dueDate: tomorrow.toISOString(),
      priority: 'high',
      status: 'pending',
      createdAt: new Date().toISOString(),
      userId
    },
    {
      id: uuidv4(),
      title: "Weekly Team Meeting",
      description: "Discuss project progress and next steps",
      dueDate: tomorrow.toISOString(),
      priority: 'medium',
      status: 'pending',
      createdAt: new Date().toISOString(),
      userId
    },
    {
      id: uuidv4(),
      title: "Review Budget Reports",
      description: "Analyze Q2 expenses and prepare summary",
      dueDate: nextWeek.toISOString(),
      priority: 'medium',
      status: 'pending',
      createdAt: new Date().toISOString(),
      userId
    },
    {
      id: uuidv4(),
      title: "Update Website Content",
      description: "Replace outdated information on the company website",
      dueDate: yesterday.toISOString(),
      priority: 'low',
      status: 'completed',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      userId
    }
  ];
};

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  filters: TaskFilters;
  stats: DashboardStats;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'userId'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  setFilters: (filters: TaskFilters) => void;
  clearFilters: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    highPriorityTasks: 0,
    dueSoonTasks: 0
  });

  // Load tasks from localStorage or generate sample tasks on mount
  useEffect(() => {
    if (user) {
      const storedTasks = localStorage.getItem(`tasks_${user.id}`);
      let userTasks: Task[];
      
      if (storedTasks) {
        userTasks = JSON.parse(storedTasks);
      } else {
        userTasks = generateSampleTasks(user.id);
        localStorage.setItem(`tasks_${user.id}`, JSON.stringify(userTasks));
      }
      
      setTasks(userTasks);
    } else {
      setTasks([]);
    }
  }, [user]);

  // Update filtered tasks when tasks or filters change
  useEffect(() => {
    if (tasks.length === 0) {
      setFilteredTasks([]);
      return;
    }

    let filtered = [...tasks];

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    // Apply priority filter
    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Apply date range filter
    if (filters.dateRange) {
      const startDate = new Date(filters.dateRange.start).getTime();
      const endDate = new Date(filters.dateRange.end).getTime();
      
      filtered = filtered.filter(task => {
        const dueDate = new Date(task.dueDate).getTime();
        return dueDate >= startDate && dueDate <= endDate;
      });
    }

    // Apply search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        task => 
          task.title.toLowerCase().includes(query) || 
          (task.description && task.description.toLowerCase().includes(query))
      );
    }

    // Sort by due date (closest first)
    filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    
    setFilteredTasks(filtered);
  }, [tasks, filters]);

  // Calculate dashboard stats whenever tasks change
  useEffect(() => {
    if (tasks.length === 0) {
      setStats({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        highPriorityTasks: 0,
        dueSoonTasks: 0
      });
      return;
    }

    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const pendingTasks = tasks.filter(task => task.status === 'pending').length;
    const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
    
    // Calculate tasks due within the next 24 hours
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dueSoonTasks = tasks.filter(task => {
      if (task.status === 'completed') return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= now && dueDate <= tomorrow;
    }).length;

    setStats({
      totalTasks: tasks.length,
      completedTasks,
      pendingTasks,
      highPriorityTasks,
      dueSoonTasks
    });
  }, [tasks]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (user && tasks.length > 0) {
      localStorage.setItem(`tasks_${user.id}`, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  // Add a new task
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) return;

    const newTask: Task = {
      id: uuidv4(),
      ...taskData,
      createdAt: new Date().toISOString(),
      userId: user.id
    };

    setTasks(prevTasks => [...prevTasks, newTask]);
    toast({
      title: "Task created",
      description: "Your task has been created successfully",
    });
  };

  // Update an existing task
  const updateTask = (updatedTask: Task) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id
          ? { ...updatedTask, updatedAt: new Date().toISOString() }
          : task
      )
    );
    
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully",
    });
  };

  // Delete a task
  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    
    toast({
      title: "Task deleted",
      description: "Your task has been deleted",
    });
  };

  // Toggle task status between completed and pending
  const toggleTaskStatus = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id
          ? { 
              ...task, 
              status: task.status === 'completed' ? 'pending' : 'completed',
              updatedAt: new Date().toISOString()
            }
          : task
      )
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        filters,
        stats,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        setFilters,
        clearFilters
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
