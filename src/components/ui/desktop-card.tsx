import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

interface DesktopCardProps {
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
  interactive?: boolean;
  hoverable?: boolean;
  elevated?: boolean;
  border?: boolean;
  fullHeight?: boolean;
}

/**
 * A desktop-optimized card component with hover effects and desktop-specific styling
 */
export function DesktopCard({
  className,
  title,
  description,
  children,
  footer,
  onClick,
  interactive = false,
  hoverable = true,
  elevated = false,
  border = false,
  fullHeight = false,
}: DesktopCardProps) {
  return (
    <Card
      className={cn(
        elevated && 'shadow-md',
        border && 'border border-border/50',
        fullHeight && 'h-full flex flex-col',
        interactive && 'cursor-pointer',
        hoverable && 
          'transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] hover:border-primary/20',
        className
      )}
      onClick={interactive ? onClick : undefined}
    >
      {(title || description) && (
        <CardHeader className="pb-2">
          {title && <CardTitle className="text-lg">{title}</CardTitle>}
          {description && (
            <CardDescription className="text-sm text-muted-foreground mt-1">
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className={cn('px-4 py-3', fullHeight && 'flex-grow')}>
        {children}
      </CardContent>
      {footer && <CardFooter className="px-4 py-3 border-t">{footer}</CardFooter>}
    </Card>
  );
}

/**
 * A desktop-optimized card grid for displaying multiple cards
 */
interface DesktopCardGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}

export function DesktopCardGrid({
  children,
  className,
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 'md',
}: DesktopCardGridProps) {
  const gapSizes = {
    sm: 'gap-3',
    md: 'gap-4 md:gap-5',
    lg: 'gap-5 md:gap-6',
  };

  return (
    <div
      className={cn(
        'grid grid-cols-1',
        columns.md && `sm:grid-cols-${columns.md}`,
        columns.lg && `lg:grid-cols-${columns.lg}`,
        columns.xl && `xl:grid-cols-${columns.xl}`,
        gapSizes[gap],
        className
      )}
    >
      {children}
    </div>
  );
}
