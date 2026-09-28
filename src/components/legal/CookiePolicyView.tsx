/**
 * @license
 * GRAM-DISHA — Cookie & Storage Policy
 * Team ERGON — Smart India Hackathon 2026
 */

import React from 'react';
import { Cookie, ArrowLeft, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '../common/Button';

interface CookiePolicyViewProps {
  onBack?: () => void;
}

export const CookiePolicyView: React.FC<CookiePolicyViewProps> = ({ onBack }) => {
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
            <Cookie className="w-4 h-4 text-[#C8A96B]" />
            <span>Browser Storage Notice</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#174C3A] mt-1">
            Cookie &amp; Local Storage Policy
          </h1>
          <p className="text-xs text-[#3B2F2A]/70 mt-1">
            Gram-Disha Platform • Effective Date: September 7, 2026
          </p>
        </div>
      </div>

      <div className="space-y-6 text-xs text-[#3B2F2A]/85 leading-relaxed">
        <section className="space-y-2 p-5 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/20">
          <h2 className="text-sm font-bold text-[#174C3A]">1. How We Use Browser Storage</h2>
          <p>
            Gram-Disha does not use invasive tracking cookies or third-party advertising cookies. We utilize standard browser <code className="bg-[#E8DCC6] px-1 rounded font-mono">localStorage</code> and session state to store essential preferences for offline-first rural usage.
          </p>
        </section>

        <section className="space-y-2 p-5 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/20">
          <h2 className="text-sm font-bold text-[#174C3A]">2. Essential Local Storage Items</h2>
          <div className="space-y-2 text-[11px]">
            <div className="p-3 bg-white rounded-xl border border-[#D9D3C7]/60 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#174C3A] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#174C3A]">JWT Session Token (<code className="font-mono">gramdisha_jwt_token</code>):</strong>
                <p className="text-[#3B2F2A]/70">Stores encrypted session credentials to keep you authenticated across page reloads.</p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#D9D3C7]/60 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#174C3A] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#174C3A]">Onboarding Draft State (<code className="font-mono">gramdisha_onboarding_draft</code>):</strong>
                <p className="text-[#3B2F2A]/70">Saves your location and financial parameters locally so you don't lose progress if your internet connection drops.</p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#D9D3C7]/60 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#174C3A] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#174C3A]">Language Preference (<code className="font-mono">gramdisha_lang</code>):</strong>
                <p className="text-[#3B2F2A]/70">Saves your preferred Indic script (Hindi, Marathi, Gujarati, Tamil, etc.).</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-2 p-5 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/20">
          <h2 className="text-sm font-bold text-[#174C3A]">3. Managing Your Cookie Preferences</h2>
          <p>
            You can clear your local storage at any time by clicking "Logout &amp; Reset Profile" in Profile Settings or by clearing your browser cache.
          </p>
        </section>
      </div>
    </div>
  );
};
