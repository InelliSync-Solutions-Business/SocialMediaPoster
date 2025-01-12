import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'min-h-screen bg-gradient-to-b from-background to-background/95 dark:from-background dark:to-background/95',
        'flex flex-col',
        className
      )}
    >
      <main className="flex-1 container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-7xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </motion.div>
  );
}
