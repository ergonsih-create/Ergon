/**
 * @license
 * GRAM-DISHA — Privacy Policy & Data Governance Notice
 * DPDPA 2023 (Digital Personal Data Protection Act, India) Compliant
 * Team ERGON — Smart India Hackathon 2026
 */

import React from 'react';
import { ShieldCheck, ArrowLeft, Lock, Database, Eye, FileText, Mail, Calendar, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

interface PrivacyPolicyViewProps {
  onBack?: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onBack }) => {
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
            <ShieldCheck className="w-4 h-4 text-[#C8A96B]" />
            <span>DPDPA 2023 Statutory Data Notice</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#174C3A] mt-1">
            Privacy &amp; Data Governance Policy
          </h1>
          <p className="text-xs text-[#3B2F2A]/70 mt-1">
            Gram-Disha Platform • Effective Date: September 7, 2026
          </p>
        </div>

        <div className="p-3 bg-[#174C3A]/5 border border-[#174C3A]/20 rounded-2xl text-right text-xs">
          <span className="font-bold text-[#174C3A] block">Data Protection Officer</span>
          <span className="text-[#3B2F2A]/70 font-mono text-[11px]">dpo@gramdisha.in</span>
        </div>
      </div>

      {/* Highlights Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/30 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-[#174C3A]/10 flex items-center justify-center text-[#174C3A]">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-xs text-[#3B2F2A]">Data Minimization</h3>
          <p className="text-[11px] text-[#3B2F2A]/70 leading-relaxed">
            We only collect data necessary for LGD location mapping, financial EMI structuring, and scheme eligibility matching.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/30 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-[#174C3A]/10 flex items-center justify-center text-[#174C3A]">
            <Database className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-xs text-[#3B2F2A]">Zero Data Monetization</h3>
          <p className="text-[11px] text-[#3B2F2A]/70 leading-relaxed">
            Your business inputs and financial parameters are never sold, leased, or transmitted to third-party ad networks.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/30 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-[#174C3A]/10 flex items-center justify-center text-[#174C3A]">
            <Eye className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-xs text-[#3B2F2A]">Full Data Principal Control</h3>
          <p className="text-[11px] text-[#3B2F2A]/70 leading-relaxed">
            Under DPDPA 2023, you retain full rights to request complete data erasure, profile resets, or export your saved DPRs.
          </p>
        </div>
      </div>

      {/* Detailed Articles */}
      <div className="space-y-6 text-xs text-[#3B2F2A]/85 leading-relaxed">
        <section className="space-y-2 p-5 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/20">
          <h2 className="text-sm font-bold text-[#174C3A] flex items-center gap-2">
            <span>1. Information We Collect</span>
          </h2>
          <p>
            Gram-Disha collects information voluntarily provided during onboarding and session interaction:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[11px]">
            <li><strong>Entrepreneur Demographics:</strong> Name, optional email, gender, category (for subsidy matching), and educational background.</li>
            <li><strong>Location Identifiers:</strong> State, District, Sub-District, Gram Panchayat (mapped to official LGD codes), and urban/rural classification.</li>
            <li><strong>Enterprise Parameters:</strong> Sector activity, proposed capital outlay, land area, power availability, and raw material access.</li>
            <li><strong>Voice Input Audio Data:</strong> Audio clips recorded via DISHA voice copilot are processed transiently for speech-to-text transcription and are not permanently archived.</li>
          </ul>
        </section>

        <section className="space-y-2 p-5 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/20">
          <h2 className="text-sm font-bold text-[#174C3A] flex items-center gap-2">
            <span>2. Purpose of Data Processing</span>
          </h2>
          <p>
            All processed data is strictly limited to the following public-good purposes:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[11px]">
            <li>Calculating the Holistic Business Feasibility Score (HBFS) against local AGMARKNET and Census data.</li>
            <li>Matching eligible government schemes (PMEGP, PMFME, DAY-NRLM, Mudra Yojana).</li>
            <li>Generating bank-ready Detailed Project Reports (DPR) for DIC and Lead Bank loan applications.</li>
            <li>Improving local language translation accuracy for Indic dialects.</li>
          </ul>
        </section>

        <section className="space-y-2 p-5 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/20">
          <h2 className="text-sm font-bold text-[#174C3A] flex items-center gap-2">
            <span>3. Data Storage &amp; Encryption Standards</span>
          </h2>
          <p>
            Gram-Disha implements industry-standard security measures:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[11px]">
            <li>TLS 1.3 encryption in transit for all network API calls.</li>
            <li>Local browser session storage for draft onboarding states with client-side clearing support.</li>
            <li>Role-based access restrictions and encrypted auth tokens.</li>
          </ul>
        </section>

        <section className="space-y-2 p-5 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/20">
          <h2 className="text-sm font-bold text-[#174C3A] flex items-center gap-2">
            <span>4. Your Statutory Rights Under DPDPA 2023</span>
          </h2>
          <p>
            As a Data Principal under the Digital Personal Data Protection Act 2023 (India), you have the right to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[11px]">
            <li>Request a copy of all personal and enterprise profile data held in your active session.</li>
            <li>Request immediate deletion or correction of inaccurate profile attributes.</li>
            <li>Withdraw consent at any time without affecting prior processing legality.</li>
            <li>Lodge a grievance with our Data Protection Officer at <code className="bg-[#E8DCC6] px-1 rounded font-mono">dpo@gramdisha.in</code>.</li>
          </ul>
        </section>

        <section className="space-y-2 p-5 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/20">
          <h2 className="text-sm font-bold text-[#174C3A] flex items-center gap-2">
            <span>5. Contact &amp; Grievance Redressal</span>
          </h2>
          <p>
            Gram-Disha is built as an open public digital platform. For questions or statutory data privacy requests, contact:
          </p>
          <div className="p-3 bg-[#174C3A]/5 rounded-xl border border-[#174C3A]/20 font-mono text-[11px] space-y-1">
            <div>Gram-Disha Data Governance Cell</div>
            <div>Email: privacy@gramdisha.in / dpo@gramdisha.in</div>
            <div>Address: New Delhi, India</div>
          </div>
        </section>
      </div>
    </div>
  );
};
