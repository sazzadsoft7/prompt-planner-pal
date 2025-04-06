
import { useState } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import { Plus, Search, Filter } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuCheckboxItem, 
  DropdownMenuGroup, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { TaskFilters, PriorityLevel, TaskStatus } from '@/types';

const TaskList = () => {
  const { filteredTasks, filters, setFilters } = useTasks();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFilters({ ...filters, searchQuery: query });
  };

  const handleStatusFilter = (status: TaskStatus | undefined) => {
    setFilters({ ...filters, status });
  };

  const handlePriorityFilter = (priority: PriorityLevel | undefined) => {
    setFilters({ ...filters, priority });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-9"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-muted-foreground">Status</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={filters.status === 'pending'}
                  onCheckedChange={() => handleStatusFilter(filters.status === 'pending' ? undefined : 'pending')}
                >
                  Pending
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.status === 'completed'}
                  onCheckedChange={() => handleStatusFilter(filters.status === 'completed' ? undefined : 'completed')}
                >
                  Completed
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-muted-foreground">Priority</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={filters.priority === 'high'}
                  onCheckedChange={() => handlePriorityFilter(filters.priority === 'high' ? undefined : 'high')}
                >
                  High
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.priority === 'medium'}
                  onCheckedChange={() => handlePriorityFilter(filters.priority === 'medium' ? undefined : 'medium')}
                >
                  Medium
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.priority === 'low'}
                  onCheckedChange={() => handlePriorityFilter(filters.priority === 'low' ? undefined : 'low')}
                >
                  Low
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        ) : (
          <div className="text-center p-8 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">No tasks found. Create a new task to get started!</p>
          </div>
        )}
      </div>
      
      {isCreateModalOpen && (
        <TaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          mode="create"
        />
      )}
    </div>
  );
};

export default TaskList;
