
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { AuthState, User } from '@/types';
import { useToast } from '@/components/ui/use-toast';

// Mock user data for demo purposes
const MOCK_USERS = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
    password: "password123",
    avatar: "https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff"
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    avatar: "https://ui-avatars.com/api/?name=Admin+User&background=FF5733&color=fff"
  }
];

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);
  const { toast } = useToast();

  // Check for existing user session on load
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setAuthState({
            isAuthenticated: true,
            user,
            loading: false,
            error: null
          });
        } catch (err) {
          localStorage.removeItem('user');
          setAuthState({
            ...initialState,
            loading: false
          });
        }
      } else {
        setAuthState({
          ...initialState,
          loading: false
        });
      }
    };

    checkAuth();
  }, []);

  // Login function - simulated
  const login = async (email: string, password: string) => {
    setAuthState({
      ...authState,
      loading: true,
      error: null
    });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user exists and password matches
      const user = MOCK_USERS.find(u => u.email === email);
      
      if (!user || user.password !== password) {
        throw new Error('Invalid email or password');
      }

      // Omit password from user object
      const { password: _, ...userWithoutPassword } = user;
      
      // Store user in local storage
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      setAuthState({
        isAuthenticated: true,
        user: userWithoutPassword as User,
        loading: false,
        error: null
      });

      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });
    } catch (error) {
      setAuthState({
        ...authState,
        loading: false,
        error: error instanceof Error ? error.message : 'Login failed'
      });
      
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };

  // Register function - simulated
  const register = async (name: string, email: string, password: string) => {
    setAuthState({
      ...authState,
      loading: true,
      error: null
    });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if email already exists
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error('Email already exists');
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
      };

      // Store user in local storage
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setAuthState({
        isAuthenticated: true,
        user: newUser,
        loading: false,
        error: null
      });

      toast({
        title: "Registration successful",
        description: `Welcome, ${name}!`,
      });
    } catch (error) {
      setAuthState({
        ...authState,
        loading: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      });
      
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null
    });
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
