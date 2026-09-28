/**
 * @license
 * GRAM-DISHA — Cookie & Local Storage Consent Banner
 * Team ERGON — Smart India Hackathon 2026
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, Check, X } from 'lucide-react';
import { Button } from './Button';

export const CookieConsentBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('gramdisha_cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('gramdisha_cookie_consent', 'ACCEPTED_ALL');
    setShowBanner(false);
  };

  const handleNecessaryOnly = () => {
    localStorage.setItem('gramdisha_cookie_consent', 'NECESSARY_ONLY');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-lg z-50 bg-[#174C3A] text-[#FAF7F2] p-5 rounded-2xl shadow-2xl border border-[#C8A96B]/40 space-y-3 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-[#C8A96B]/20 rounded-xl shrink-0 text-[#C8A96B]">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-xs flex items-center gap-1.5 text-[#FAF7F2]">
            <span>Local Storage &amp; Data Notice</span>
            <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-[#C8A96B]/30 text-[#C8A96B]">DPDPA 2023</span>
          </h4>
          <p className="text-[11px] text-[#E8DCC6] leading-relaxed">
            Gram-Disha uses local session storage strictly for offline-first rural draft saving and session security. We do not track you across external sites or sell advertising data.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#FAF7F2]/15 text-xs">
        <button
          onClick={handleNecessaryOnly}
          className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-[#E8DCC6] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          Necessary Only
        </button>
        <button
          onClick={handleAcceptAll}
          className="px-4 py-1.5 rounded-xl text-[11px] font-bold bg-[#C8A96B] hover:bg-[#B8985B] text-[#174C3A] transition-colors cursor-pointer"
        >
          Accept &amp; Continue
        </button>
      </div>
    </div>
  );
};
