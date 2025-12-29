import React from 'react';
import { cn } from './cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
  textareaClassName?: string;
  error?: boolean;
  showCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      containerClassName,
      textareaClassName,
      error = false,
      showCount = false,
      maxLength,
      value,
      ...props
    },
    ref
  ) => {
    const length = typeof value === 'string' ? value.length : 0;

    return (
      <div
        className={cn(
          'relative rounded-xl border bg-white/20 p-5 transition-all backdrop-blur',
          error ? 'border-red-400/60 focus-within:border-red-400' : 'border-white/30 focus-within:border-meteor-400/70',
          'focus-within:ring-4 focus-within:ring-meteor-400/20',
          containerClassName
        )}
      >
        <textarea
          ref={ref}
          className={cn(
            'w-full resize-none bg-transparent outline-none text-lg leading-relaxed text-sky-50 placeholder:text-sky-100/80',
            textareaClassName
          )}
          maxLength={maxLength}
          value={value}
          {...props}
        />
        {showCount && (
          <div className="absolute bottom-4 right-4 text-xs font-mono text-sky-100/80 bg-night-700/60 px-2 py-1 rounded-full border border-white/30">
            {length}{maxLength ? ` / ${maxLength}` : ''}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
