import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
}

/**
 * A responsive container component optimized for desktop viewing
 * 
 * @param children - The content to be rendered inside the container
 * @param className - Additional classes to apply to the container
 * @param maxWidth - Maximum width constraint for the container
 * @param padding - Whether to apply default padding
 */
export function ResponsiveContainer({ 
  children, 
  className, 
  maxWidth = 'xl',
  padding = true 
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    'full': 'max-w-full'
  };

  return (
    <div
      className={cn(
        'mx-auto w-full desktop-container',
        maxWidthClasses[maxWidth],
        padding && 'px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12',
        className
      )}
    >
      {children}
    </div>
  );
}
