import React, { useEffect } from 'react';
import { cn } from './cn';

export type ToastType = 'info' | 'success' | 'error';
export type ToastPosition = 'bottom-center' | 'bottom-right';

export interface ToastProps {
  open: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
  type?: ToastType;
  position?: ToastPosition;
  action?: React.ReactNode;
}

const typeStyles: Record<ToastType, string> = {
  info: 'bg-night-700/80 text-sky-100 border-white/30',
  success: 'bg-emerald-500/10 text-emerald-200 border-emerald-400/30',
  error: 'bg-rose-500/10 text-rose-200 border-rose-400/30'
};

const positionStyles: Record<ToastPosition, string> = {
  'bottom-center': 'left-1/2 -translate-x-1/2 bottom-6',
  'bottom-right': 'right-6 bottom-6'
};

const Toast: React.FC<ToastProps> = ({
  open,
  message,
  onClose,
  duration = 3500,
  type = 'info',
  position = 'bottom-center',
  action
}) => {
  useEffect(() => {
    if (!open) return;
    const timeoutId = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timeoutId);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div
      className={cn(
        'fixed z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-glass',
        typeStyles[type],
        positionStyles[position]
      )}
      role="status"
      aria-live="polite"
    >
      <span className="text-sm font-medium">{message}</span>
      {action}
      <button
        type="button"
        onClick={onClose}
        className="ml-2 text-sky-100 hover:text-sky-50"
        aria-label="Close"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
          <path
            d="M6 6l12 12M18 6l-12 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
