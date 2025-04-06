
import { useTasks } from '@/contexts/TaskContext';
import StatCard from '@/components/dashboard/StatCard';
import TaskChart from '@/components/dashboard/TaskChart';
import TaskProgress from '@/components/dashboard/TaskProgress';
import UpcomingTasks from '@/components/dashboard/UpcomingTasks';
import { Button } from '@/components/ui/button';
import { PlusCircle, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { stats } = useTasks();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your tasks and progress</p>
        </div>
        <Link to="/tasks">
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" /> 
            Add New Task
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Tasks" 
          value={stats.totalTasks} 
          icon={CheckCircle2}
          description="All your tasks" 
        />
        <StatCard 
          title="Pending Tasks" 
          value={stats.pendingTasks} 
          icon={Clock}
          description="Tasks waiting to be completed" 
        />
        <StatCard 
          title="Completed Tasks" 
          value={stats.completedTasks} 
          icon={CheckCircle2}
          description="Tasks you've finished" 
        />
        <StatCard 
          title="High Priority" 
          value={stats.highPriorityTasks} 
          icon={AlertTriangle}
          description="Tasks requiring immediate attention" 
        />
      </div>

      <TaskProgress />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TaskChart />
        <UpcomingTasks />
      </div>
    </div>
  );
};

export default Dashboard;
