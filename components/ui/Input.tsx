import React from 'react';
import { cn } from './cn';

export type InputSize = 'md' | 'lg';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  error?: boolean;
  size?: InputSize;
}

const sizeStyles: Record<InputSize, string> = {
  md: 'h-12 text-base',
  lg: 'h-14 text-lg'
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      leftIcon,
      rightElement,
      containerClassName,
      inputClassName,
      error = false,
      size = 'md',
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          'flex items-center gap-3 rounded-xl border bg-white/20 px-4 transition-all backdrop-blur',
          sizeStyles[size],
          error ? 'border-red-400/60 focus-within:border-red-400' : 'border-white/30 focus-within:border-meteor-400/70',
          'focus-within:ring-4 focus-within:ring-meteor-400/20',
          containerClassName
        )}
      >
        {leftIcon && <span className="text-sky-100/80">{leftIcon}</span>}
        <input
          ref={ref}
          className={cn(
            'flex-1 bg-transparent outline-none text-sky-50 placeholder:text-sky-100/80',
            inputClassName
          )}
          {...props}
        />
        {rightElement && <div className="shrink-0">{rightElement}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
