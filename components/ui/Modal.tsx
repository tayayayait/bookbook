import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { cn } from './cn';

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  showClose?: boolean;
  closeOnOverlayClick?: boolean;
}

const sizeStyles: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg'
};

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  showClose = true,
  closeOnOverlayClick = true
}) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-night-900/60 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'glass-card relative w-full rounded-2xl bg-night-700/80 shadow-glass border border-white/30 p-6',
          sizeStyles[size]
        )}
      >
        {(title || showClose) && (
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              {title && <h2 className="text-lg font-serif font-semibold text-sky-50">{title}</h2>}
              {description && <p className="text-sm text-sky-100/80 mt-1">{description}</p>}
            </div>
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-sky-100 hover:text-sky-50"
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                  <path
                    d="M6 6l12 12M18 6l-12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="text-sky-100">{children}</div>
        {footer && <div className="mt-6 flex items-center justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );

  if (typeof document === 'undefined') return modalContent;
  return ReactDOM.createPortal(modalContent, document.body);
};

export default Modal;
