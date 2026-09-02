import React from 'react';
import { ShieldCheck, ExternalLink, HelpCircle } from 'lucide-react';
import { Badge } from '../common/Badge';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#D9D3C7] bg-[#FCFAF5] py-8 text-xs text-[#68655D] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-display font-bold text-sm text-[#242522]">GRAM-DISHA</span>
              <Badge variant="green" size="sm">Evidence-First</Badge>
            </div>
            <p className="text-[11px] leading-relaxed">
              Smart India Hackathon 2026 platform by Team ERGON. Deterministic financial calculations, versioned scheme rules, and explicit UNKNOWN uncertainty management.
            </p>
          </div>

          {/* Col 2: Official Sources */}
          <div>
            <span className="font-semibold text-xs text-[#242522] uppercase tracking-wider block mb-2">
              Official Reference Registers
            </span>
            <ul className="text-[11px] space-y-1 text-[#68655D]">
              <li>• Ministry of MSME / PMEGP & Udyam Portal</li>
              <li>• NABARD Model Bankable Project Profiles</li>
              <li>• AGMARKNET Agricultural Commodity Network</li>
              <li>• NSFDC & NBCFDC Target Group Schemes</li>
            </ul>
          </div>

          {/* Col 3: Disclaimer Policy */}
          <div className="p-3 rounded-xl bg-[#F8F5EE] border border-[#D9D3C7]/80">
            <div className="flex items-center gap-1.5 font-semibold text-xs text-[#9F452B] mb-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Decision Support Notice
            </div>
            <p className="text-[10px] leading-relaxed text-[#68655D]">
              GRAM-DISHA is an advisory and structuring tool. It does not predict guaranteed business success or replace formal institutional bank appraisals or government certifications.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#D9D3C7]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div>© 2026 GRAM-DISHA • Team ERGON • Built for SIH 2026</div>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#242522] cursor-pointer">Privacy & Data Governance</span>
            <span className="hover:text-[#242522] cursor-pointer">Terms of Advisory</span>
            <span className="hover:text-[#242522] cursor-pointer">Provenance Registry</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
