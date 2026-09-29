import React from 'react';
import { Sparkles, MessageSquare, Mic } from 'lucide-react';
import { useDisha } from '../../context/DishaContext';

export const DishaOrb: React.FC = () => {
  const { toggleAdvisor, openParticleAi } = useDisha();

  return (
    <div className="flex items-center gap-1.5">
      {/* DISHA AI OS Advisor Launcher */}
      <button
        onClick={toggleAdvisor}
        aria-label="Open DISHA AI OS Advisor"
        className="group relative flex items-center gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full liquid-glass-disha transition-all duration-300 hover:scale-102 active:scale-95 cursor-pointer"
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

      {/* DISHA Voice AI Launcher (TTS + STT) */}
      <button
        onClick={openParticleAi}
        aria-label="DISHA Voice AI (TTS + STT)"
        title="DISHA Voice AI Assistant (Speak in Indian Languages)"
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#174C3A] hover:bg-[#113327] border border-[#C8A96B]/60 text-[#C69A45] flex items-center justify-center shadow-xs transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
      >
        <Mic className="w-4 h-4 text-[#C69A45]" />
      </button>
    </div>
  );
};

