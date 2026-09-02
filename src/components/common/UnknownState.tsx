import React from 'react';
import { HelpCircle, AlertTriangle } from 'lucide-react';
import { Badge } from './Badge';

export interface UnknownStateProps {
  entityName: string;
  reason?: string;
  suggestedAction?: string;
  isCompact?: boolean;
}

/**
 * UNKNOWN is a first-class state in GRAM-DISHA.
 * When local datasets, prices, scheme rules, or competitor densities
 * are not reliably established from official sources, the system
 * renders UNKNOWN rather than hallucinating or assuming values.
 */
export const UnknownState: React.FC<UnknownStateProps> = ({
  entityName,
  reason = 'Official source datasets currently do not establish verified benchmarks for this specific parameter.',
  suggestedAction = 'You may supply localized estimates during assessment or proceed with standard national baseline parameters.',
  isCompact = false,
}) => {
  if (isCompact) {
    return (
      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#68655D]/10 border border-dashed border-[#68655D]/40 text-xs text-[#68655D]">
        <HelpCircle className="w-3.5 h-3.5 text-[#68655D]" />
        <span className="font-semibold uppercase tracking-wider">UNKNOWN:</span>
        <span className="truncate max-w-[200px]">{entityName}</span>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl border border-dashed border-[#D9D3C7] bg-[#FCFAF5]/80 text-[#68655D]">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-[#68655D]/10 text-[#68655D] shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Badge variant="unknown" size="sm">UNKNOWN</Badge>
            <span className="font-semibold text-sm text-[#242522]">{entityName}</span>
          </div>
          <p className="text-xs text-[#68655D] leading-relaxed mb-2">
            {reason}
          </p>
          {suggestedAction && (
            <p className="text-[11px] text-[#B95736] font-medium bg-[#B95736]/5 px-2.5 py-1.5 rounded-md border border-[#B95736]/15">
              💡 <span className="font-semibold">Guidance:</span> {suggestedAction}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
