/**
 * @license
 * GRAM-DISHA — Terms and Conditions of Advisory Service
 * Team ERGON — Smart India Hackathon 2026
 */

import React from 'react';
import { FileText, ArrowLeft, ShieldCheck, Scale, AlertTriangle, Building2, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

interface TermsViewProps {
  onBack?: () => void;
}

export const TermsView: React.FC<TermsViewProps> = ({ onBack }) => {
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
            <Scale className="w-4 h-4 text-[#C8A96B]" />
            <span>Statutory Advisory Terms</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#174C3A] mt-1">
            Terms &amp; Conditions of Advisory Service
          </h1>
          <p className="text-xs text-[#3B2F2A]/70 mt-1">
            Gram-Disha Platform • Effective Date: September 7, 2026
          </p>
        </div>

        <div className="p-3 bg-[#174C3A]/5 border border-[#174C3A]/20 rounded-2xl text-right text-xs">
          <span className="font-bold text-[#174C3A] block">Legal &amp; Advisory Compliance</span>
          <span className="text-[#3B2F2A]/70 font-mono text-[11px]">legal@gramdisha.in</span>
        </div>
      </div>

      {/* Main Sections */}
      <div className="space-y-6 text-xs text-[#3B2F2A]/85 leading-relaxed">
        <section className="space-y-2 p-5 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/20">
          <h2 className="text-sm font-bold text-[#174C3A]">1. Scope of Decision Support System</h2>
          <p>
            Gram-Disha is an intelligent, evidence-informed decision support architecture designed for educational, structuring, and advisory assistance for micro-entrepreneurs in rural and semi-urban India.
          </p>
          <p>
            All evaluations, Holistic Business Feasibility Scores (HBFS), EMI calculations, and scheme eligibility matches are deterministic recommendations generated based on official public datasets (LGD Census 2011, AGMARKNET Mandi Price Feeds, PMEGP 2025 guidelines).
          </p>
        </section>

        <section className="space-y-2 p-5 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/20">
          <h2 className="text-sm font-bold text-[#174C3A]">2. Statutory Financial &amp; Loan Disclaimers</h2>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" /> Important Bank Underwriting Notice
            </div>
            <p className="text-[11px]">
              Gram-Disha generates credit-ready Detailed Project Reports (DPR) adhering to DIC and Lead Bank guidelines. However, Gram-Disha is not a commercial bank or financial institution. Final credit approval, loan sanction, and subsidy disbursement remain at the sole discretion of the respective Commercial Bank Branch Manager, District Industries Centre (DIC), and KVIC/Nodal Agency.
            </p>
          </div>
        </section>

        <section className="space-y-2 p-5 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/20">
          <h2 className="text-sm font-bold text-[#174C3A]">3. Permissible Platform Use</h2>
          <p>
            By accessing Gram-Disha, you agree to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[11px]">
            <li>Provide truthful parameters for your enterprise location, capital requirements, and demographic profile.</li>
            <li>Use generated DPR reports and feasibility assessments solely for legitimate business setup and bank credit applications.</li>
            <li>Not attempt to reverse-engineer, exploit, or inject malicious code into Gram-Disha API gateways.</li>
          </ul>
        </section>

        <section className="space-y-2 p-5 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/20">
          <h2 className="text-sm font-bold text-[#174C3A]">4. Intellectual Property &amp; Open Source Attribution</h2>
          <p>
            Gram-Disha is an enterprise intelligence platform. Data registers from LGD, AGMARKNET, and Ministry of MSME are attributed to their respective official government sources under Open Government Data (OGD) License India.
          </p>
        </section>

        <section className="space-y-2 p-5 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/20">
          <h2 className="text-sm font-bold text-[#174C3A]">5. Limitation of Liability &amp; Governing Law</h2>
          <p>
            Gram-Disha shall not be liable for any direct or indirect business losses, market price variations, or credit rejections arising from the reliance on public datasets or deterministic advice.
          </p>
          <p>
            These terms are governed by the laws of India. Any legal disputes shall be subject to the jurisdiction of the competent courts in New Delhi, India.
          </p>
        </section>
      </div>
    </div>
  );
};
