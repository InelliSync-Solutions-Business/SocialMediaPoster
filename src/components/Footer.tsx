import React from 'react';
import { Globe, Mail, MapPin, Twitter, Linkedin, Instagram, Github } from 'lucide-react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const socialLinks = [
    {
      icon: Twitter,
      href: 'https://twitter.com/intellisync', // Placeholder link
      name: 'Twitter',
      color: '#1DA1F2'
    },
    {
      icon: Linkedin,
      href: 'https://linkedin.com/company/intellisync-solutions', // Placeholder link
      name: 'LinkedIn',
      color: '#0A66C2'
    },
    {
      icon: Instagram,
      href: 'https://instagram.com/intellisync', // Placeholder link
      name: 'Instagram',
      color: '#E4405F'
    },
    {
      icon: Github,
      href: 'https://github.com/intellisync', // Placeholder link
      name: 'GitHub',
      color: '#333'
    }
  ];

  return (
    <footer className={[className, "bg-secondary/10 dark:bg-secondary/20 py-8 mt-8 border-t border-border/20"].filter(Boolean).join(' ')}>
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h3 className="text-xl font-bold text-foreground/80 dark:text-foreground/90 mb-4">
            IntelliSync Solutions
          </h3>
          <p className="text-foreground/60 dark:text-foreground/70 mb-2 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary/70" />
            <a 
              href="https://home.intellisyncsolutions.io" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline hover:text-primary transition-colors"
            >
              home.intellisyncsolutions.io
            </a>
          </p>
          <p className="text-foreground/60 dark:text-foreground/70 mb-2 flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary/70" />
            <a 
              href="mailto:chris.june@intellisync.ca" 
              className="hover:underline hover:text-primary transition-colors"
            >
              chris.june@intellisync.ca
            </a>
          </p>
          <p className="text-foreground/60 dark:text-foreground/70 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary/70" />
            Chatham-Kent, Ontario, Canada
          </p>
        </div>
        
        <div className="flex flex-col items-end space-y-4">
          <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-4 inline-block mb-4">
            <p className="text-sm font-medium text-foreground/70 dark:text-foreground/80">
              Powered by IntelliSync Solutions
            </p>
            <p className="text-xs text-foreground/50 dark:text-foreground/60 mt-1">
              {new Date().getFullYear()} All Rights Reserved
            </p>
          </div>

          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  p-2 
                  rounded-full 
                  transition-all 
                  duration-300 
                  hover:scale-110 
                  hover:shadow-lg
                  dark:bg-secondary/20 
                  bg-secondary/10
                  hover:bg-opacity-50
                "
                title={social.name}
              >
                <social.icon 
                  className="w-6 h-6"
                  style={{ 
                    color: social.color,
                    opacity: 0.7,
                    transition: 'opacity 0.3s ease'
                  }}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
