import React from 'react';
import { cn } from './cn';

export interface ToggleRowProps {
  title: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

const ToggleRow: React.FC<ToggleRowProps> = ({
  title,
  description,
  checked,
  disabled = false,
  onChange,
  className
}) => {
  const handleClick = () => {
    if (disabled) return;
    onChange(!checked);
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        'w-full flex items-center justify-between gap-4 rounded-xl border px-4 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-meteor-400/20',
        checked ? 'bg-white/20 border-meteor-400/40' : 'bg-white/20 border-white/30',
        disabled && 'opacity-60 cursor-not-allowed',
        className
      )}
    >
      <div className="flex flex-col">
        <span className="font-semibold text-sky-50 text-sm">{title}</span>
        {description && <span className="text-xs text-sky-100/80">{description}</span>}
      </div>
      <span
        className={cn(
          'w-6 h-6 rounded border flex items-center justify-center transition-all',
          checked ? 'bg-meteor-400 border-meteor-400 text-night-950 scale-110' : 'bg-night-700/40 border-white/30 text-sky-100'
        )}
      >
        {checked && (
          <svg viewBox="0 0 16 12" className="w-4 h-4" aria-hidden="true">
            <path
              d="M2 6l3 3 9-9"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </button>
  );
};

export default ToggleRow;
