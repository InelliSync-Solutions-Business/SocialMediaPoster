import React from 'react';
import { cn } from '@/lib/utils';

type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  cols?: {
    default: GridColumns;
    sm?: GridColumns;
    md?: GridColumns;
    lg?: GridColumns;
    xl?: GridColumns;
    '2xl'?: GridColumns;
  };
}

/**
 * A responsive grid component optimized for desktop layouts
 * 
 * @param children - The content to be rendered inside the grid
 * @param className - Additional classes to apply to the grid
 * @param gap - Size of the gap between grid items
 * @param cols - Number of columns at different breakpoints
 */
export function ResponsiveGrid({ 
  children, 
  className,
  gap = 'md',
  cols = { default: 1, md: 2, lg: 3 }
}: ResponsiveGridProps) {
  const gapClasses = {
    'none': 'gap-0',
    'sm': 'gap-2 sm:gap-3 md:gap-4',
    'md': 'gap-4 sm:gap-5 md:gap-6',
    'lg': 'gap-6 sm:gap-7 md:gap-8',
    'xl': 'gap-8 sm:gap-10 md:gap-12'
  };

  const getColsClass = (cols: GridColumns) => {
    return `grid-cols-${cols}` as const;
  };

  return (
    <div
      className={cn(
        'grid w-full',
        gapClasses[gap],
        getColsClass(cols.default),
        cols.sm && `sm:${getColsClass(cols.sm)}`,
        cols.md && `md:${getColsClass(cols.md)}`,
        cols.lg && `lg:${getColsClass(cols.lg)}`,
        cols.xl && `xl:${getColsClass(cols.xl)}`,
        cols['2xl'] && `2xl:${getColsClass(cols['2xl'])}`,
        className
      )}
    >
      {children}
    </div>
  );
}
