import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, 
  PieChart, 
  LayoutDashboard, 
  History, 
  Settings, 
  HelpCircle,
  BarChart,
  BookTemplate,
  Mail,
  DollarSign,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
  isDark?: boolean;
  toggleDarkMode?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '', isDark = false, toggleDarkMode = () => {} }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className={`w-64 border-r border-border/40 h-full bg-card-gradient shadow-inner ${className}`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-foreground">Menu</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="h-8 w-8 rounded-full hover:bg-primary/10"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
        <nav className="space-y-2">
           <Link 
             to="/app/dashboard" 
             className={`flex items-center p-2 rounded-md transition-colors ${
               isActive('/app/dashboard') 
                 ? 'bg-gradient-primary text-foreground shadow-primary' 
                 : 'hover:bg-card-hover-gradient text-foreground hover:shadow-soft'
             }`}
           >
             <LayoutDashboard className={`h-5 w-5 mr-3 ${isActive('/app/dashboard') ? 'text-foreground' : 'text-primary'}`} />
             <span>Dashboard</span>
           </Link>
           
           <Link 
             to="/app/generator" 
             className={`flex items-center p-2 rounded-md transition-colors ${
               isActive('/app/generator') 
                 ? 'bg-gradient-primary text-foreground shadow-primary' 
                 : 'hover:bg-card-hover-gradient text-foreground hover:shadow-soft'
             }`}
           >
             <FileText className={`h-5 w-5 mr-3 ${isActive('/app/generator') ? 'text-foreground' : 'text-primary'}`} />
             <span>Content Generator</span>
           </Link>
           
           <Link 
             to="/app/polls" 
             className={`flex items-center p-2 rounded-md transition-colors ${
               isActive('/app/polls') 
                 ? 'bg-gradient-primary text-foreground shadow-primary' 
                 : 'hover:bg-card-hover-gradient text-foreground hover:shadow-soft'
             }`}
           >
             <BarChart className={`h-5 w-5 mr-3 ${isActive('/app/polls') ? 'text-foreground' : 'text-primary'}`} />
             <span>Polls</span>
           </Link>
           
           <Link 
             to="/app/newsletter" 
             className={`flex items-center p-2 rounded-md transition-colors ${
               isActive('/app/newsletter') 
                 ? 'bg-gradient-primary text-foreground shadow-primary' 
                 : 'hover:bg-card-hover-gradient text-foreground hover:shadow-soft'
             }`}
           >
             <Mail className={`h-5 w-5 mr-3 ${isActive('/app/newsletter') ? 'text-foreground' : 'text-primary'}`} />
             <span>Newsletter</span>
           </Link>
           
           <Link 
             to="/app/templates" 
             className={`flex items-center p-2 rounded-md transition-colors ${
               isActive('/app/templates') 
                 ? 'bg-gradient-primary text-foreground shadow-primary' 
                 : 'hover:bg-card-hover-gradient text-foreground hover:shadow-soft'
             }`}
           >
             <BookTemplate className={`h-5 w-5 mr-3 ${isActive('/app/templates') ? 'text-foreground' : 'text-primary'}`} />
             <span>Templates</span>
           </Link>
           
           <Link 
             to="/app/analytics" 
             className={`flex items-center p-2 rounded-md transition-colors ${
               isActive('/app/analytics') 
                 ? 'bg-gradient-secondary text-foreground shadow-accent' 
                 : 'hover:bg-card-hover-gradient text-foreground hover:shadow-soft'
             }`}
           >
             <PieChart className={`h-5 w-5 mr-3 ${isActive('/app/analytics') ? 'text-foreground' : 'text-primary'}`} />
             <span>Analytics</span>
           </Link>
           
           <Link 
             to="/app/history" 
             className={`flex items-center p-2 rounded-md transition-colors ${
               isActive('/app/history') 
                 ? 'bg-gradient-secondary text-foreground shadow-accent' 
                 : 'hover:bg-card-hover-gradient text-foreground hover:shadow-soft'
             }`}
           >
             <History className={`h-5 w-5 mr-3 ${isActive('/app/history') ? 'text-foreground' : 'text-primary'}`} />
             <span>History</span>
           </Link>
           
           <div className="pt-4 mt-4 border-t border-border/40">
             <Link 
               to="/pricing" 
               className={`flex items-center p-2 rounded-md transition-colors ${
                 isActive('/pricing') 
                   ? 'bg-gradient-secondary text-foreground shadow-accent' 
                   : 'hover:bg-card-hover-gradient text-foreground hover:shadow-soft'
               }`}
             >
               <DollarSign className={`h-5 w-5 mr-3 ${isActive('/pricing') ? 'text-foreground' : 'text-primary'}`} />
               <span>Pricing</span>
             </Link>

             <Link 
               to="/app/settings" 
               className={`flex items-center p-2 rounded-md transition-colors ${
                 isActive('/app/settings') 
                   ? 'bg-gradient-secondary text-foreground shadow-accent' 
                   : 'hover:bg-card-hover-gradient text-foreground hover:shadow-soft'
               }`}
             >
               <Settings className={`h-5 w-5 mr-3 ${isActive('/app/settings') ? 'text-foreground' : 'text-primary'}`} />
               <span>Settings</span>
             </Link>
             
             <Link 
               to="/app/help" 
               className={`flex items-center p-2 rounded-md transition-colors ${
                 isActive('/app/help') 
                   ? 'bg-gradient-secondary text-foreground shadow-accent' 
                   : 'hover:bg-card-hover-gradient text-foreground hover:shadow-soft'
               }`}
             >
               <HelpCircle className={`h-5 w-5 mr-3 ${isActive('/app/help') ? 'text-foreground' : 'text-primary'}`} />
               <span>Help</span>
             </Link>


           </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
