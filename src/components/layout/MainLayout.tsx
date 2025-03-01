import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLocation, useNavigationType } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
  const mainRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigationType = useNavigationType();

  // Reset scroll position when location changes
  useEffect(() => {
    if (mainRef.current) {
      // Reset scroll position of the main container
      mainRef.current.scrollTop = 0;
      
      // For POP navigation (browser back/forward), add a small delay
      // to ensure content is loaded before scrolling
      if (navigationType === 'POP') {
        setTimeout(() => {
          if (mainRef.current) {
            mainRef.current.scrollTop = 0;
          }
        }, 0);
      }
    }
  }, [location.pathname, navigationType]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'min-h-screen bg-gradient-subtle light:bg-gradient-subtle dark:from-background dark:to-background/95',
        'flex flex-col',
        className
      )}
    >
      <main ref={mainRef} className="flex-1 container mx-auto py-3 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 max-w-full xl:max-w-screen-2xl">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </motion.div>
  );
}
