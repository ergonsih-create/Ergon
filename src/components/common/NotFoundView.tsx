/**
 * @license
 * GRAM-DISHA — Custom 404 Not Found Page
 * Team ERGON — Smart India Hackathon 2026
 */

import React from 'react';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';
import { GramDishaIcon } from './GramDishaLogo';
import { Button } from './Button';

interface NotFoundViewProps {
  onGoHome?: () => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onGoHome }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-[#FAF7F2] p-8 rounded-3xl border border-[#C8A96B]/30 shadow-sm">
        {/* Animated Compass Motif */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-full bg-[#174C3A]/10 animate-ping opacity-25" />
          <div className="w-20 h-20 rounded-2xl bg-[#174C3A] flex items-center justify-center text-[#C8A96B] shadow-lg mx-auto">
            <GramDishaIcon size={40} color="#C8A96B" className="animate-spin" style={{ animationDuration: '20s' }} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="inline-block px-3 py-1 rounded-full bg-[#B45B4A]/10 border border-[#B45B4A]/25 text-[#B45B4A] font-mono text-xs font-bold">
            ERROR 404 — ROUTE UNCHARTED
          </div>
          <h1 className="text-2xl font-display font-bold text-[#174C3A]">
            Direction Uncharted
          </h1>
          <p className="text-xs text-[#3B2F2A]/75 leading-relaxed">
            The requested module or page path could not be located in the Gram-Disha decision index. Let us orient you back to your enterprise workspace.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="forest"
            size="md"
            onClick={onGoHome}
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-bold"
          >
            <Home className="w-4 h-4" /> Return to Gram-Disha Home
          </Button>
        </div>

        <div className="pt-4 border-t border-[#C8A96B]/20 text-[11px] text-[#3B2F2A]/60 font-mono">
          Gram-Disha Enterprise Platform
        </div>
      </div>
    </div>
  );
};
