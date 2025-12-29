import React from 'react';
import { cn } from './cn';

export type SkeletonVariant = 'rect' | 'text' | 'circle';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
}

const variantStyles: Record<SkeletonVariant, string> = {
  rect: 'rounded-xl',
  text: 'rounded-md',
  circle: 'rounded-full'
};

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rect',
  ...props
}) => {
  return (
    <div
      className={cn('animate-pulse bg-white/20', variantStyles[variant], className)}
      {...props}
    />
  );
};

export default Skeleton;
