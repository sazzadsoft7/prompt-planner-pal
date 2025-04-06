
import { useTasks } from '@/contexts/TaskContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const UpcomingTasks = () => {
  const { filteredTasks } = useTasks();
  
  // Get pending tasks and sort by due date (closest first)
  const pendingTasks = filteredTasks
    .filter(task => task.status === 'pending')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5); // Show only the first 5

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Upcoming Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingTasks.length > 0 ? (
          <ul className="space-y-3">
            {pendingTasks.map((task) => {
              const dueDate = new Date(task.dueDate);
              const isPastDue = dueDate < new Date();
              
              return (
                <li 
                  key={task.id}
                  className="flex items-center gap-2 p-3 rounded-md border transition-colors hover:bg-muted/50"
                >
                  <span 
                    className={cn(
                      "w-2 h-2 rounded-full",
                      task.priority === 'high' ? "bg-priority-high" :
                      task.priority === 'medium' ? "bg-priority-medium" : "bg-priority-low"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{task.title}</p>
                    <p 
                      className={cn(
                        "text-xs",
                        isPastDue ? "text-destructive" : "text-muted-foreground"
                      )}
                    >
                      Due {formatDistanceToNow(dueDate, { addSuffix: true })}
                    </p>
                  </div>
                  <button 
                    className="p-1.5 rounded-md hover:bg-muted"
                    title="Mark as completed"
                    aria-label="Mark as completed"
                  >
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No upcoming tasks</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingTasks;
