import React from 'react';
import { cn } from '@/lib/utils';

interface DesktopCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onClick?: () => void;
}

/**
 * A card component optimized for desktop viewing
 * 
 * @param children - The content to be rendered inside the card
 * @param className - Additional classes to apply to the card
 * @param padding - Size of the padding inside the card
 * @param elevation - Size of the drop shadow
 * @param interactive - Whether the card should have hover/active states
 * @param onClick - Click handler for the card
 */
export function DesktopCard({ 
  children, 
  className,
  padding = 'md',
  elevation = 'md',
  interactive = false,
  onClick
}: DesktopCardProps) {
  const paddingClasses = {
    'none': 'p-0',
    'sm': 'p-3 sm:p-4',
    'md': 'p-4 sm:p-5 md:p-6',
    'lg': 'p-5 sm:p-6 md:p-8',
    'xl': 'p-6 sm:p-8 md:p-10'
  };

  const elevationClasses = {
    'none': 'shadow-none',
    'sm': 'shadow-sm',
    'md': 'shadow-md',
    'lg': 'shadow-lg'
  };

  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700',
        paddingClasses[padding],
        elevationClasses[elevation],
        interactive && 'desktop-card cursor-pointer',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
