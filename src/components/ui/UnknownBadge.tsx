import React from 'react';
import { HelpCircle } from 'lucide-react';

export interface UnknownBadgeProps {
  label?: string;
  reason?: string;
  className?: string;
}

export const UnknownBadge: React.FC<UnknownBadgeProps> = ({
  label = 'UNKNOWN',
  reason = 'Requires local survey or user input; not fabricated',
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-dashed border-[#C8A96B] text-[#6B5324] text-[11px] font-mono group relative cursor-help ${className}`}
      title={reason}
    >
      <HelpCircle className="w-3 h-3 text-[#C8A96B] shrink-0" />
      <span className="font-semibold tracking-wider">{label}</span>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 w-56 p-2 rounded-xl bg-[#3B2F2A] text-[#FAF7F2] text-[10px] leading-snug shadow-xl border border-[#C8A96B]/30 font-sans pointer-events-none">
        <div className="font-bold text-[#C8A96B] mb-0.5">Evidence Status: Unknown</div>
        {reason}
      </div>
    </div>
  );
};
