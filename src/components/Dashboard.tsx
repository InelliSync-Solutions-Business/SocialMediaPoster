import React from 'react';
import { PenTool, Calendar, BarChart2, Mail, FileText, Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardProps {
  className?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ className }) => {
  // Main app features
  const features = [
    { 
      title: 'Content Generator', 
      description: 'Create AI-powered content for social media', 
      icon: PenTool, 
      path: '/app/generator',
      primary: true
    },
    { 
      title: 'Newsletter', 
      description: 'Build and send newsletters', 
      icon: Mail, 
      path: '/app/newsletter' 
    },
    { 
      title: 'Templates', 
      description: 'Use pre-made content templates', 
      icon: FileText, 
      path: '/app/templates' 
    },
    { 
      title: 'Analytics', 
      description: 'Track content performance', 
      icon: BarChart2, 
      path: '/app/analytics' 
    },
    { 
      title: 'Calendar', 
      description: 'Schedule and plan content', 
      icon: Calendar, 
      path: '/app/calendar' 
    },
    { 
      title: 'Settings', 
      description: 'Configure your preferences', 
      icon: Settings, 
      path: '/app/settings' 
    },
  ];

  return (
    <div className={`p-4 md:p-6 ${className}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to IntelliSync Solutions</p>
      </div>

      {/* Quick access section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="transition-all hover:shadow-md hover:border-primary/20">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-1">{feature.title}</CardTitle>
                <CardDescription className="mb-4">{feature.description}</CardDescription>
                <Button 
                  variant={feature.primary ? "default" : "outline"}
                  className="w-full"
                  onClick={() => window.location.href = feature.path}
                >
                  {feature.primary ? 'Create Now' : 'Open'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Help section */}
      <div className="mt-8">
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <HelpCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Need help getting started?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Check out our quick start guide or contact support for assistance.
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    View Guide
                  </Button>
                  <Button variant="ghost" size="sm">
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
