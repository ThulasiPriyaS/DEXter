import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  ...props
}) => {
  const variantClasses = {
    default: 'bg-white shadow-md dark:bg-gray-800',
    bordered: 'bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700',
    glass: 'bg-white/10 backdrop-blur-md border border-gray-200/20 dark:border-gray-700/20',
  };
  
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  };
  
  return (
    <div
      className={clsx(
        'rounded-xl',
        variantClasses[variant],
        paddingClasses[padding],
        hoverable && 'transition-all duration-200 hover:shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};