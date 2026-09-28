import React from 'react';
import { GramDishaLogoBox } from '../../../components/common/GramDishaLogo';
import { useLandingData } from '../data/landingContent';
import { LanguageSelector } from '../../../components/common/LanguageSelector';
import { useLanguage } from '../../../context/LanguageContext';

interface LandingFooterProps {
  onNavigateSection?: (sectionId: string) => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenCookies?: () => void;
  onOpenRefund?: () => void;
  onOpenAccessibility?: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onNavigateSection,
  onOpenPrivacy,
  onOpenTerms,
  onOpenCookies,
  onOpenRefund,
  onOpenAccessibility,
}) => {
  const { footer, brand } = useLandingData();

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (href === '#privacy' && onOpenPrivacy) {
      e.preventDefault();
      onOpenPrivacy();
    } else if (href === '#terms' && onOpenTerms) {
      e.preventDefault();
      onOpenTerms();
    } else if (href === '#cookies' && onOpenCookies) {
      e.preventDefault();
      onOpenCookies();
    } else if (href === '#refund' && onOpenRefund) {
      e.preventDefault();
      onOpenRefund();
    } else if (href === '#accessibility' && onOpenAccessibility) {
      e.preventDefault();
      onOpenAccessibility();
    } else if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (onNavigateSection) {
        onNavigateSection(targetId);
      }
    }
  };

  return (
    <footer className="bg-[#2D2420] text-[#FAF7F2] border-t border-[#C8A96B]/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#C8A96B]/20">
          
          {/* Brand & Mission Column */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <GramDishaLogoBox size="sm" />
              <span className="font-display font-bold text-xl text-[#FAF7F2]">
                {brand.name}
              </span>
            </div>

            <p className="text-xs text-[#FAF7F2]/75 leading-relaxed font-sans pr-4">
              {footer.about}
            </p>

            <div className="p-3 rounded-xl bg-[#FAF7F2]/5 border border-[#C8A96B]/20 text-[11px] text-[#FAF7F2]/65 leading-snug">
              <strong>Statutory Notice:</strong> {footer.disclaimer}
            </div>
          </div>

          {/* Nav Section Links */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {footer.sections.map((sec, idx) => (
              <div key={idx} className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C8A96B] font-sans">
                  {sec.title}
                </h4>
                <ul className="space-y-2">
                  {sec.links.map((lnk, lIdx) => (
                    <li key={lIdx}>
                      <a
                        href={lnk.href}
                        onClick={(e) => handleLinkClick(e, lnk.href)}
                        className="text-xs text-[#FAF7F2]/75 hover:text-[#FAF7F2] hover:underline transition-colors"
                      >
                        {lnk.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Copyright, Language & Accreditation */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF7F2]/60">
          <div>
            © 2026 Gram-Disha. Rural Enterprise Intelligence Platform.
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#FAF7F2]/75">Interface Language:</span>
            <LanguageSelector variant="compact" />
          </div>
        </div>

      </div>
    </footer>
  );
};
