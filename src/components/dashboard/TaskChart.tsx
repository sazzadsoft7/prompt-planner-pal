
import { useTasks } from '@/contexts/TaskContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

const TaskChart = () => {
  const { tasks } = useTasks();
  const { theme } = useTheme();
  
  // Calculate counts by priority
  const highPriorityCount = tasks.filter(t => t.priority === 'high').length;
  const mediumPriorityCount = tasks.filter(t => t.priority === 'medium').length;
  const lowPriorityCount = tasks.filter(t => t.priority === 'low').length;
  
  // Calculate counts by status
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  
  const priorityData = [
    { name: 'High', value: highPriorityCount },
    { name: 'Medium', value: mediumPriorityCount },
    { name: 'Low', value: lowPriorityCount },
  ].filter(item => item.value > 0);
  
  const statusData = [
    { name: 'Completed', value: completedCount },
    { name: 'Pending', value: pendingCount },
  ].filter(item => item.value > 0);
  
  const PRIORITY_COLORS = ['#ef4444', '#f97316', '#22c55e'];
  const STATUS_COLORS = ['#22c55e', '#64748b'];
  
  // Default text color based on theme
  const textColor = theme === 'dark' ? '#e2e8f0' : '#334155';

  return (
    <Card className="col-span-1 lg:col-span-2 h-[350px]">
      <CardHeader>
        <CardTitle>Task Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[250px]">
          {priorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-priority-${index}`} fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  formatter={(value) => <span style={{ color: textColor }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No priority data</p>
            </div>
          )}
          
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-status-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  formatter={(value) => <span style={{ color: textColor }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No status data</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskChart;
