import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const Card = ({
  className,
  children,
  padding = 'md',
  hover = false,
  ...props
}: CardProps) => {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-secondary-200 shadow-sm',
        paddings[padding],
        hover && 'hover:shadow-md hover:border-secondary-300 transition-shadow cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: ReactNode;
}

export const CardHeader = ({
  title,
  description,
  action,
  className,
  ...props
}: CardHeaderProps) => {
  return (
    <div
      className={cn('flex items-start justify-between mb-4', className)}
      {...props}
    >
      <div>
        <h3 className="text-lg font-semibold text-secondary-900">{title}</h3>
        {description && (
          <p className="text-sm text-secondary-500 mt-0.5">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardFooter = ({
  children,
  className,
  ...props
}: CardFooterProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-2 mt-4 pt-4 border-t border-secondary-100',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
