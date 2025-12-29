import React from 'react';
import { cn } from './cn';

export type EmptyStateSize = 'sm' | 'md';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  size?: EmptyStateSize;
  className?: string;
}

const sizeStyles: Record<EmptyStateSize, string> = {
  sm: 'py-10',
  md: 'py-16'
};

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  size = 'md',
  className
}) => {
  return (
    <div
      className={cn(
        'glass-card w-full text-center bg-white/20 border border-white/30 rounded-2xl',
        sizeStyles[size],
        className
      )}
    >
      {icon && <div className="mx-auto mb-4 w-10 h-10 text-sky-100/70">{icon}</div>}
      <h3 className="font-serif font-semibold text-sky-50 text-lg">{title}</h3>
      {description && <p className="text-sky-100/80 text-sm mt-2">{description}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
};

export default EmptyState;
