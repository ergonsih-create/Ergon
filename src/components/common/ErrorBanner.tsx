import React from 'react';
import { AlertCircle, RefreshCw, XCircle } from 'lucide-react';
import { Button } from './Button';

export interface ErrorBannerProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'error' | 'warning';
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  title = 'System Notice',
  message,
  onRetry,
  onDismiss,
  variant = 'error',
}) => {
  const isError = variant === 'error';
  return (
    <div
      className={`p-4 rounded-xl border ${
        isError
          ? 'bg-[#A63D2D]/5 border-[#A63D2D]/20 text-[#A63D2D]'
          : 'bg-[#B78332]/10 border-[#B78332]/25 text-[#B78332]'
      } flex items-start justify-between gap-3`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-sm text-[#242522]">{title}</h4>
          <p className="text-xs text-[#68655D] mt-0.5 leading-relaxed">{message}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} leftIcon={<RefreshCw className="w-3 h-3" />}>
            Retry
          </Button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 rounded-lg hover:bg-[#D9D3C7]/30 text-[#68655D] hover:text-[#242522]"
            aria-label="Dismiss error"
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
