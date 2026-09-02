import React from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';
import { useDisha } from '../../context/DishaContext';

export const DishaOrb: React.FC = () => {
  const { dishaState, toggleAdvisor } = useDisha();

  return (
    <button
      onClick={toggleAdvisor}
      aria-label="Open DISHA AI OS Advisor"
      className="group relative flex items-center gap-2.5 px-3.5 py-2 rounded-full liquid-glass-disha transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
    >
      <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-[#174C3A] text-[#FCFAF5] shadow-sm">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#C69A45]" />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#B95736] animate-ping" />
      </div>
      <div className="text-left hidden sm:block">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold tracking-wider text-[#174C3A] uppercase font-display">
            DISHA
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#174C3A]/15 text-[#174C3A] font-semibold">
            AI OS
          </span>
        </div>
      </div>
      <MessageSquare className="w-3.5 h-3.5 text-[#174C3A] ml-0.5 opacity-80 group-hover:opacity-100" />
    </button>
  );
};
