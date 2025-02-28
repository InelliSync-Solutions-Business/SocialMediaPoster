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
        'min-h-screen bg-gradient-subtle light:bg-gradient-subtle dark:from-background dark:to-background/95',
        'flex flex-col',
        className
      )}
    >
      <main className="flex-1 container mx-auto px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12 max-w-screen-2xl">
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
