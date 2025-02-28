import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, 
  MessageSquare, 
  PieChart, 
  LayoutDashboard, 
  History, 
  Settings, 
  HelpCircle,
  BarChart,
  BookTemplate,
  Mail
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className={`w-64 border-r border-border/40 h-full bg-card-gradient shadow-inner ${className}`}>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-6 text-foreground">Menu</h2>
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
