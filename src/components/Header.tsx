import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, Sun, Moon, FileText, Layout, BookTemplate, DollarSign, Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface HeaderProps {
  isDark: boolean;
  toggleDarkMode: () => void;
  openPreferences: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDark, toggleDarkMode, openPreferences }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="IntelliSync Solutions" className="h-8 w-8" />
            <span className="font-bold">IntelliSync Solutions</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            <Link to="/generator" className="px-4 py-2 text-sm font-medium hover:text-primary flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Content Generator
            </Link>
            <Link to="/templates" className="px-4 py-2 text-sm font-medium hover:text-primary flex items-center">
              <BookTemplate className="h-4 w-4 mr-2" />
              Templates
            </Link>
            <Link to="/pricing" className="px-4 py-2 text-sm font-medium hover:text-primary flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Pricing
            </Link>
          </nav>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="h-9 w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={openPreferences}
              className="h-9 w-9"
            >
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
