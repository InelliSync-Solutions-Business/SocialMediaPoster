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
    <aside className={`w-64 border-r border-border/40 h-full bg-background ${className}`}>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-6">Menu</h2>
        <nav className="space-y-2">
          <Link 
            to="/dashboard" 
            className={`flex items-center p-2 rounded-md transition-colors ${
              isActive('/dashboard') 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-muted'
            }`}
          >
            <LayoutDashboard className="h-5 w-5 mr-3" />
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to="/generator" 
            className={`flex items-center p-2 rounded-md transition-colors ${
              isActive('/generator') 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-muted'
            }`}
          >
            <FileText className="h-5 w-5 mr-3" />
            <span>Content Generator</span>
          </Link>
          
          <Link 
            to="/templates" 
            className={`flex items-center p-2 rounded-md transition-colors ${
              isActive('/templates') 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-muted'
            }`}
          >
            <BookTemplate className="h-5 w-5 mr-3" />
            <span>Templates</span>
          </Link>
          
          <Link 
            to="/analytics" 
            className={`flex items-center p-2 rounded-md transition-colors ${
              isActive('/analytics') 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-muted'
            }`}
          >
            <BarChart className="h-5 w-5 mr-3" />
            <span>Analytics</span>
          </Link>
          
          <Link 
            to="/polls" 
            className={`flex items-center p-2 rounded-md transition-colors ${
              isActive('/polls') 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-muted'
            }`}
          >
            <PieChart className="h-5 w-5 mr-3" />
            <span>Polls</span>
          </Link>
          
          <Link 
            to="/newsletter" 
            className={`flex items-center p-2 rounded-md transition-colors ${
              isActive('/newsletter') 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-muted'
            }`}
          >
            <Mail className="h-5 w-5 mr-3" />
            <span>Newsletter</span>
          </Link>
          
          <Link 
            to="/history" 
            className={`flex items-center p-2 rounded-md transition-colors ${
              isActive('/history') 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-muted'
            }`}
          >
            <History className="h-5 w-5 mr-3" />
            <span>History</span>
          </Link>
          
          <div className="pt-4 mt-4 border-t border-border/40">
            <Link 
              to="/settings" 
              className={`flex items-center p-2 rounded-md transition-colors ${
                isActive('/settings') 
                  ? 'bg-primary/10 text-primary' 
                  : 'hover:bg-muted'
              }`}
            >
              <Settings className="h-5 w-5 mr-3" />
              <span>Settings</span>
            </Link>
            
            <Link 
              to="/help" 
              className={`flex items-center p-2 rounded-md transition-colors ${
                isActive('/help') 
                  ? 'bg-primary/10 text-primary' 
                  : 'hover:bg-muted'
              }`}
            >
              <HelpCircle className="h-5 w-5 mr-3" />
              <span>Help</span>
            </Link>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
