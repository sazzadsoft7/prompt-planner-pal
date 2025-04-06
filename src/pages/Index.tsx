
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, ListChecks, Calendar, Filter, Settings } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">TaskMaster</span>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate('/login')} variant="outline">Login</Button>
            <Button onClick={() => navigate('/register')}>Sign Up</Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-16 md:py-24 container mx-auto text-center px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Manage Tasks 
              <span className="text-primary"> Efficiently</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Stay organized, focused, and in control of all your tasks in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="text-lg px-8"
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/login')}
                className="text-lg px-8"
              >
                Try Demo
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 bg-card rounded-lg border shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <ListChecks className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Task Management</h3>
                <p className="text-muted-foreground">
                  Create, update, and organize your tasks with ease and precision.
                </p>
              </div>
              
              <div className="p-6 bg-card rounded-lg border shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Due Dates</h3>
                <p className="text-muted-foreground">
                  Set deadlines and never miss an important task again.
                </p>
              </div>
              
              <div className="p-6 bg-card rounded-lg border shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Filter className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Priority Levels</h3>
                <p className="text-muted-foreground">
                  Assign priorities to focus on what matters most right now.
                </p>
              </div>
              
              <div className="p-6 bg-card rounded-lg border shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Customization</h3>
                <p className="text-muted-foreground">
                  Personalize your experience with filters and dark mode.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 TaskMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
