
import { useState } from 'react';
import { Task } from '@/types';
import { useTasks } from '@/contexts/TaskContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow, isPast, format } from 'date-fns';
import { cn } from '@/lib/utils';
import TaskModal from './TaskModal';

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const { toggleTaskStatus, deleteTask } = useTasks();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const dueDate = new Date(task.dueDate);
  const isPastDue = isPast(dueDate) && task.status === 'pending';
  const formattedDate = format(dueDate, 'MMM dd, yyyy');
  const relativeDate = formatDistanceToNow(dueDate, { addSuffix: true });
  
  const getPriorityBadge = () => {
    switch (task.priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-priority-medium">Medium Priority</Badge>;
      case 'low':
        return <Badge className="bg-priority-low">Low Priority</Badge>;
      default:
        return null;
    }
  };

  return (
    <>
      <Card className={cn(
        "task-card border-l-4 animate-fade-in", 
        task.status === 'completed' ? "completed border-l-muted" : 
        isPastDue ? "border-l-destructive" : 
        task.priority === 'high' ? "border-l-priority-high" :
        task.priority === 'medium' ? "border-l-priority-medium" : 
        "border-l-priority-low"
      )}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-2">
              <Checkbox 
                checked={task.status === 'completed'} 
                onCheckedChange={() => toggleTaskStatus(task.id)}
                className="mt-1"
              />
              <div>
                <CardTitle className={cn(
                  "text-lg font-medium", 
                  task.status === 'completed' && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </CardTitle>
                {task.description && (
                  <CardDescription className="mt-1 text-sm">
                    {task.description}
                  </CardDescription>
                )}
              </div>
            </div>
            {getPriorityBadge()}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Due {formattedDate}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span className={isPastDue ? "text-destructive font-semibold" : ""}>
                {relativeDate}
              </span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-2 flex justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the task.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteTask(task.id)}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
      
      {isEditModalOpen && (
        <TaskModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          task={task}
          mode="edit"
        />
      )}
    </>
  );
};

export default TaskCard;
