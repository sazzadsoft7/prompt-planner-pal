
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  CheckSquare, 
  CalendarClock, 
  Filter, 
  Settings, 
  ChevronLeft 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const { user } = useAuth();
  const location = useLocation();
  
  const menuItems = [
    { 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/dashboard' 
    },
    { 
      label: 'Tasks', 
      icon: CheckSquare, 
      path: '/tasks' 
    },
    { 
      label: 'Calendar', 
      icon: CalendarClock, 
      path: '/calendar' 
    },
    { 
      label: 'Filters', 
      icon: Filter, 
      path: '/filters' 
    },
    { 
      label: 'Settings', 
      icon: Settings, 
      path: '/settings' 
    }
  ];

  // Only show first two pages for now since we haven't implemented the others yet
  const visibleItems = menuItems.slice(0, 2);

  return (
    <aside
      className={cn(
        "fixed lg:relative inset-y-0 left-0 z-20 flex flex-col bg-sidebar border-r transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-0 lg:w-20"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b">
        {isOpen && (
          <Link to="/dashboard" className="flex items-center">
            <CheckSquare className="h-6 w-6 text-primary" />
            <span className="ml-2 font-semibold text-lg">TaskMaster</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden ml-auto"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-col flex-grow p-2 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link to={item.path} key={item.path}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5",
                  isOpen ? "mr-2" : "mx-auto"
                )} />
                {isOpen && <span>{item.label}</span>}
              </Button>
            </Link>
          );
        })}
      </div>

      {isOpen && (
        <div className="p-4 border-t">
          <div className="flex items-center">
            <CheckSquare className="h-5 w-5 text-muted-foreground" />
            <div className="ml-3">
              <p className="text-sm font-medium">Welcome back</p>
              <p className="text-xs text-muted-foreground truncate">{user?.name || 'User'}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
