import React from 'react';
import { cn } from './cn';

export type ButtonVariant = 'primary' | 'secondary' | 'text';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm rounded-lg',
  md: 'h-12 px-5 text-sm rounded-xl',
  lg: 'h-14 px-6 text-base rounded-2xl'
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-meteor-400 via-aurora-400 to-dawn-400 text-night-950 shadow-glowMix hover:shadow-glowPurple',
  secondary: 'bg-white/20 text-sky-100 border border-white/30 hover:border-meteor-400/50 hover:bg-white/20',
  text: 'bg-transparent text-sky-100 hover:text-sky-50'
};

const spinnerSizes: Record<ButtonSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-5 h-5'
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-meteor-400/30',
          sizeStyles[size],
          variantStyles[variant],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading ? (
          <span className={cn('inline-flex items-center justify-center animate-spin', spinnerSizes[size])}>
            <svg viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                opacity="0.25"
              />
              <path
                d="M21 12a9 9 0 0 1-9 9"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>
        ) : (
          leftIcon
        )}
        <span className="whitespace-nowrap">{children}</span>
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
