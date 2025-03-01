import React, { useState } from 'react';
import { 
  Globe, 
  Mail, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Github, 
  ChevronRight, 
  Heart, 
  Sparkles, 
  Zap, 
  Rocket, 
  ArrowUp,
  MessageCircle,
  Calendar,
  Headphones,
  Shield,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();
  // Start collapsed by default to maximize space
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Store user preference in localStorage
  const toggleExpanded = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    try {
      localStorage.setItem('footer-expanded', String(newState));
    } catch (error) {
      // Ignore storage errors
    }
  };
  
  // Load user preference on mount
  React.useEffect(() => {
    try {
      const savedState = localStorage.getItem('footer-expanded');
      if (savedState !== null) {
        setIsExpanded(savedState === 'true');
      }
    } catch (error) {
      // Ignore storage errors
    }
  }, []);
  
  const socialLinks = [
    {
      icon: Twitter,
      href: 'https://twitter.com/intellisync',
      name: 'Twitter',
      color: '#1DA1F2'
    },
    {
      icon: Linkedin,
      href: 'https://linkedin.com/company/intellisync-solutions',
      name: 'LinkedIn',
      color: '#0A66C2'
    },
    {
      icon: Instagram,
      href: 'https://instagram.com/intellisync',
      name: 'Instagram',
      color: '#E4405F'
    },
    {
      icon: Github,
      href: 'https://github.com/intellisync',
      name: 'GitHub',
      color: '#333'
    },
    {
      icon: MessageCircle,
      href: 'https://discord.gg/intellisync',
      name: 'Discord',
      color: '#5865F2'
    }
  ];

  const quickLinks = [
    { name: 'Dashboard', href: '/app/dashboard' },
    { name: 'Content Generator', href: '/app/generator' },
    { name: 'Newsletter', href: '/app/newsletter' },
    { name: 'Templates', href: '/app/templates' },
    { name: 'Analytics', href: '/app/analytics' }
  ];

  const resources = [
    { name: 'Help Center', href: '/app/help' },
    { name: 'Documentation', href: 'https://docs.intellisyncsolutions.io' },
    { name: 'API Reference', href: 'https://api.intellisyncsolutions.io' },
    { name: 'Pricing', href: '/app/pricing' },
    { name: 'Blog', href: 'https://blog.intellisyncsolutions.io' }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={[
      className,
      "relative overflow-hidden transition-all duration-300 bg-gradient-to-b from-background to-secondary/20 dark:from-background dark:to-secondary/30",
      isExpanded ? "pt-16 pb-8" : "py-3"
    ].filter(Boolean).join(' ')}>
      {/* Toggle Button */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary"></div>
      <div className="absolute -top-12 left-1/4 w-24 h-24 rounded-full bg-primary/5 blur-2xl"></div>
      <div className="absolute -top-8 right-1/3 w-32 h-32 rounded-full bg-accent/5 blur-3xl"></div>
      
      <div className="flex justify-center -mt-1 mb-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleExpanded}
          className="rounded-full h-6 w-10 flex items-center justify-center bg-primary/5 p-0"
        >
          {isExpanded ? 
            <ChevronDown className="h-4 w-4 text-primary/70" /> : 
            <ChevronUp className="h-4 w-4 text-primary/70" />}
        </Button>
      </div>
      
      {/* Compact Footer - Always Visible */}
      {!isExpanded && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                IntelliSync
              </h2>
            </div>
            
            <p className="text-sm text-foreground/60 dark:text-foreground/60">
              © {currentYear} IntelliSync Solutions. All rights reserved.
            </p>
            
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full transition-all hover:scale-110 bg-card/50 hover:bg-primary/10 group"
                  title={social.name}
                  aria-label={social.name}
                >
                  <social.icon className="w-3.5 h-3.5 text-foreground/60 group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Expanded Footer Content */}
      {isExpanded && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                IntelliSync
              </h2>
            </div>
            
            <p className="text-foreground/70 dark:text-foreground/80 text-sm leading-relaxed max-w-xs">
              Empowering businesses with intelligent content generation solutions that drive engagement and growth across social platforms.
            </p>
            
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    p-2.5
                    rounded-full 
                    transition-all 
                    duration-300 
                    hover:scale-110 
                    hover:shadow-lg
                    bg-card dark:bg-card/80
                    hover:bg-primary/10 dark:hover:bg-primary/20
                    group
                  "
                  title={social.name}
                  aria-label={social.name}
                >
                  <social.icon 
                    className="w-5 h-5 text-foreground/60 group-hover:text-primary transition-colors"
                  />
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground/90 dark:text-foreground/90 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-primary" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-foreground/70 hover:text-primary dark:text-foreground/70 dark:hover:text-primary transition-colors flex items-center group"
                  >
                    <ChevronRight className="h-3.5 w-3.5 mr-2 text-primary/70 group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground/90 dark:text-foreground/90 flex items-center">
              <Rocket className="h-5 w-5 mr-2 text-primary" />
              Resources
            </h3>
            <ul className="space-y-3">
              {resources.map((resource) => (
                <li key={resource.name}>
                  <a 
                    href={resource.href} 
                    className="text-foreground/70 hover:text-primary dark:text-foreground/70 dark:hover:text-primary transition-colors flex items-center group"
                  >
                    <ChevronRight className="h-3.5 w-3.5 mr-2 text-primary/70 group-hover:translate-x-1 transition-transform" />
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground/90 dark:text-foreground/90 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-primary" />
              Contact Us
            </h3>
            <div className="space-y-4">
              <p className="text-foreground/70 dark:text-foreground/70 flex items-start gap-3">
                <Globe className="w-5 h-5 text-primary/80 mt-0.5 flex-shrink-0" />
                <span>
                  <a 
                    href="https://home.intellisyncsolutions.io" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-primary transition-colors"
                  >
                    home.intellisyncsolutions.io
                  </a>
                </span>
              </p>
              <p className="text-foreground/70 dark:text-foreground/70 flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary/80 mt-0.5 flex-shrink-0" />
                <span>
                  <a 
                    href="mailto:chris.june@intellisync.ca" 
                    className="hover:text-primary transition-colors"
                  >
                    chris.june@intellisync.ca
                  </a>
                </span>
              </p>
              <p className="text-foreground/70 dark:text-foreground/70 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary/80 mt-0.5 flex-shrink-0" />
                <span>Chatham-Kent, Ontario, Canada</span>
              </p>
              <p className="text-foreground/70 dark:text-foreground/70 flex items-start gap-3">
                <Headphones className="w-5 h-5 text-primary/80 mt-0.5 flex-shrink-0" />
                <span>
                  <a 
                    href="tel:+15555555555" 
                    className="hover:text-primary transition-colors"
                  >
                    +1 (555) 555-5555
                  </a>
                </span>
              </p>
            </div>
          </div>
          </div>
          
          {/* Features Highlight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-10 border-t border-b border-border/30 mb-10">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-foreground/90">Lightning Fast</h4>
              <p className="text-sm text-foreground/60">Generate content in seconds</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-foreground/90">Enterprise Grade</h4>
              <p className="text-sm text-foreground/60">Secure and reliable platform</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-foreground/90">24/7 Support</h4>
              <p className="text-sm text-foreground/60">We're here when you need us</p>
            </div>
          </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-foreground/60 dark:text-foreground/60">
              © {currentYear} IntelliSync Solutions. All rights reserved.
            </p>
            <span className="text-foreground/30">•</span>
            <a href="/privacy" className="text-sm text-foreground/60 hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <span className="text-foreground/30">•</span>
            <a href="/terms" className="text-sm text-foreground/60 hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
          
          <div className="flex items-center">
            <p className="text-sm text-foreground/60 dark:text-foreground/60 mr-2 flex items-center">
              Made with <Heart className="h-3.5 w-3.5 mx-1 text-red-500 animate-pulse" /> in Canada
            </p>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-9 w-9 rounded-full bg-card hover:bg-primary/10 border-border/40"
              onClick={scrollToTop}
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-4 w-4 text-primary" />
            </Button>
          </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
