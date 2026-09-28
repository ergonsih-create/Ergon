/**
 * @license
 * GRAM-DISHA — Refund & Zero-Fee Policy Notice
 * Team ERGON — Smart India Hackathon 2026
 */

import React from 'react';
import { IndianRupee, ArrowLeft, ShieldCheck, CheckCircle2, HeartHandshake } from 'lucide-react';
import { Button } from '../common/Button';

interface RefundPolicyViewProps {
  onBack?: () => void;
}

export const RefundPolicyView: React.FC<RefundPolicyViewProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C8A96B]/30 pb-6">
        <div>
          {onBack && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="mb-3 flex items-center gap-1.5 text-xs text-[#3B2F2A]"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Button>
          )}
          <div className="flex items-center gap-2 text-xs font-bold text-[#174C3A] uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4 text-[#C8A96B]" />
            <span>Public Good Service Notice</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#174C3A] mt-1">
            Refund &amp; Fee Policy
          </h1>
          <p className="text-xs text-[#3B2F2A]/70 mt-1">
            Gram-Disha Platform • Effective Date: September 7, 2026
          </p>
        </div>
      </div>

      <div className="space-y-6 text-xs text-[#3B2F2A]/85 leading-relaxed">
        <section className="space-y-2 p-5 rounded-2xl bg-[#174C3A]/5 border border-[#174C3A]/20">
          <div className="flex items-center gap-2 text-sm font-bold text-[#174C3A]">
            <CheckCircle2 className="w-5 h-5 text-[#174C3A]" />
            <span>100% Free Public Digital Good (Zero Fee Engine)</span>
          </div>
          <p className="text-xs leading-relaxed text-[#3B2F2A]">
            Gram-Disha is built as an open public digital good for rural entrepreneurship.
          </p>
          <p className="text-xs font-bold text-[#174C3A]">
            Gram-Disha does NOT charge any subscription fees, DPR download fees, registration charges, or processing fees to any rural entrepreneur or user.
          </p>
        </section>

        <section className="space-y-2 p-5 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/20">
          <h2 className="text-sm font-bold text-[#174C3A]">Refund Applicability</h2>
          <p>
            Because Gram-Disha is completely free of cost for all rural users, there are no monetary transactions, credit card charges, or paid subscriptions processed on this platform.
          </p>
          <p>
            As a result, no refunds or fee disputes are applicable. If you encounter any fraudulent agent charging money in the name of Gram-Disha, please report it immediately to <code className="bg-[#E8DCC6] px-1 rounded font-mono">vigilance@gramdisha.in</code>.
          </p>
        </section>
      </div>
    </div>
  );
};
