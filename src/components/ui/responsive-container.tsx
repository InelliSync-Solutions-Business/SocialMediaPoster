import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  fullHeight?: boolean;
  noPadding?: boolean;
}

/**
 * A responsive container component that provides consistent 
 * layout and spacing across different screen sizes
 */
export function ResponsiveContainer({
  children,
  className,
  fullHeight = false,
  noPadding = false,
}: ResponsiveContainerProps) {
  return (
    <div
      className={cn(
        'w-full mx-auto',
        fullHeight && 'h-full flex flex-col',
        !noPadding && 'p-2 sm:p-3 md:p-4 lg:p-5',
        'bg-card/20 rounded-md',
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * A responsive grid component with configurable columns for different breakpoints
 */
interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'none' | 'small' | 'medium' | 'large';
}

export function ResponsiveGrid({
  children,
  className,
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 'medium',
}: ResponsiveGridProps) {
  const gapClasses = {
    none: 'gap-0',
    small: 'gap-2 sm:gap-3',
    medium: 'gap-3 sm:gap-4 md:gap-5',
    large: 'gap-4 sm:gap-6 md:gap-8',
  };
  
  const gridClasses = [
    'grid',
    cols.sm && `grid-cols-1`,
    cols.md && `sm:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    gapClasses[gap],
  ];

  return (
    <div className={cn(gridClasses, className)}>
      {children}
    </div>
  );
}

/**
 * A section container with optional title
 */
interface SectionProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  rightElement?: React.ReactNode;
}

export function Section({ 
  children, 
  title, 
  description,
  className,
  contentClassName,
  rightElement
}: SectionProps) {
  return (
    <div className={cn('mb-6', className)}>
      {(title || rightElement) && (
        <div className="flex items-center justify-between mb-3">
          <div>
            {title && (
              <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            )}
            {description && (
              <div className="text-sm text-foreground/60 mt-1">{description}</div>
            )}
          </div>
          {rightElement && (
            <div className="flex items-center">{rightElement}</div>
          )}
        </div>
      )}
      <div className={cn(contentClassName)}>
        {children}
      </div>
    </div>
  );
}
