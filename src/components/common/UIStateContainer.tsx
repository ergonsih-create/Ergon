/**
 * @license
 * GRAM-DISHA — Universal UX State Container
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Guarantees standard UX states across all 30 screens:
 * 1. Loading / Skeleton
 * 2. Empty state / No-data state
 * 3. Error state with Retry action
 * 4. Offline / Low-bandwidth state
 * 5. UNKNOWN / Insufficient Data state
 * 6. Validation error / warning state
 * 7. Success state
 */

import React from 'react';
import { 
  AlertCircle, 
  RefreshCw, 
  WifiOff, 
  CheckCircle2, 
  HelpCircle, 
  PlusCircle, 
  Inbox, 
  AlertTriangle 
} from 'lucide-react';
import { LoadingSkeleton } from './LoadingSkeleton';
import { Button } from './Button';

export interface UIStateContainerProps {
  state: 'NORMAL' | 'LOADING' | 'EMPTY' | 'ERROR' | 'OFFLINE' | 'UNKNOWN' | 'SUCCESS' | 'VALIDATION';
  title?: string;
  description?: string;
  retryAction?: () => void;
  ctaText?: string;
  ctaAction?: () => void;
  children?: React.ReactNode;
  unknownEntity?: string;
  validationItems?: string[];
}

export const UIStateContainer: React.FC<UIStateContainerProps> = ({
  state,
  title,
  description,
  retryAction,
  ctaText,
  ctaAction,
  children,
  unknownEntity = 'Parameter Data',
  validationItems = [],
}) => {
  if (state === 'NORMAL') {
    return <>{children}</>;
  }

  if (state === 'LOADING') {
    return (
      <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/30 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#174C3A]/10 text-[#174C3A] flex items-center justify-center animate-spin">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="h-4 bg-[#C8A96B]/20 rounded-md w-1/3 animate-pulse" />
            <div className="h-3 bg-[#C8A96B]/15 rounded-md w-2/3 animate-pulse" />
          </div>
        </div>
        <LoadingSkeleton rows={3} height="h-3" />
      </div>
    );
  }

  if (state === 'EMPTY') {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-[#FAF7F2] border border-[#C8A96B]/30 text-center max-w-lg mx-auto shadow-xs space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F2E8D6] text-[#174C3A] flex items-center justify-center">
          <Inbox className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-[#3B2F2A]">
            {title || 'No Records Found'}
          </h3>
          <p className="text-xs sm:text-sm text-[#3B2F2A]/70 leading-relaxed">
            {description || 'There is no data available for this section yet. Configure your enterprise inputs or start a new assessment.'}
          </p>
        </div>
        {ctaText && ctaAction && (
          <Button onClick={ctaAction} variant="primary" size="sm" icon={<PlusCircle className="w-4 h-4" />}>
            {ctaText}
          </Button>
        )}
      </div>
    );
  }

  if (state === 'ERROR') {
    return (
      <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#B45B4A]/50 shadow-xs space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#B45B4A]/10 text-[#B45B4A] flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1 flex-1">
            <h4 className="text-sm font-bold text-[#B45B4A]">
              {title || 'Execution or Calculation Error'}
            </h4>
            <p className="text-xs text-[#3B2F2A]/80 leading-relaxed">
              {description || 'An unexpected issue occurred while processing parameters. Please verify inputs or retry.'}
            </p>
          </div>
        </div>
        {retryAction && (
          <div className="pt-3 border-t border-[#B45B4A]/20 flex justify-end">
            <button
              onClick={retryAction}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#B45B4A] text-[#FAF7F2] text-xs font-bold hover:bg-[#B45B4A]/90 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Calculation</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  if (state === 'OFFLINE') {
    return (
      <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/40 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#B45B4A]">
          <WifiOff className="w-4 h-4" />
          <span>Intermittent or Offline Network Connection</span>
        </div>
        <p className="text-xs text-[#3B2F2A]/80 leading-relaxed">
          {description || 'Operating in offline cached mode. All deterministic calculations (HBFS, Loan EMI, DSCR) continue locally without internet.'}
        </p>
        {retryAction && (
          <button
            onClick={retryAction}
            className="text-xs font-bold text-[#174C3A] hover:underline cursor-pointer"
          >
            Check Connection Again
          </button>
        )}
      </div>
    );
  }

  if (state === 'UNKNOWN') {
    return (
      <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-dashed border-[#C8A96B] shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-[#3B2F2A]/10 text-[#3B2F2A] font-mono text-[10px] font-bold uppercase tracking-wider">
            UNKNOWN STATE
          </span>
          <span className="text-xs font-bold text-[#3B2F2A]">{unknownEntity}</span>
        </div>
        <p className="text-xs text-[#3B2F2A]/80 leading-relaxed">
          {description || 'Official datasets currently do not establish verified benchmarks for this specific parameter in this LGD location.'}
        </p>
        {ctaText && ctaAction && (
          <button
            onClick={ctaAction}
            className="text-xs font-bold text-[#174C3A] hover:underline cursor-pointer block"
          >
            {ctaText} →
          </button>
        )}
      </div>
    );
  }

  if (state === 'VALIDATION') {
    return (
      <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#B45B4A]/40 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#B45B4A]">
          <AlertTriangle className="w-4 h-4" />
          <span>{title || 'Validation Rules Required'}</span>
        </div>
        <ul className="text-xs text-[#3B2F2A]/80 space-y-1 list-disc list-inside">
          {validationItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (state === 'SUCCESS') {
    return (
      <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#5A6B4F]/40 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#5A6B4F]">
          <CheckCircle2 className="w-4 h-4" />
          <span>{title || 'Action Completed Successfully'}</span>
        </div>
        <p className="text-xs text-[#3B2F2A]/80 leading-relaxed">
          {description || 'The requested operation has been validated and persisted.'}
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
