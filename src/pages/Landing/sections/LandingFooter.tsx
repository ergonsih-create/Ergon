import React from 'react';
import { Compass, ShieldCheck, Heart } from 'lucide-react';
import { LANDING_DATA } from '../data/landingContent';

interface LandingFooterProps {
  onNavigateSection?: (sectionId: string) => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenAccessibility?: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onNavigateSection,
  onOpenPrivacy,
  onOpenTerms,
  onOpenAccessibility,
}) => {
  const { footer, brand } = LANDING_DATA;

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (onNavigateSection) {
        onNavigateSection(targetId);
      }
    } else if (href === '#privacy' && onOpenPrivacy) {
      e.preventDefault();
      onOpenPrivacy();
    } else if (href === '#terms' && onOpenTerms) {
      e.preventDefault();
      onOpenTerms();
    } else if (href === '#accessibility' && onOpenAccessibility) {
      e.preventDefault();
      onOpenAccessibility();
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
              <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#3B2F2A] flex items-center justify-center shadow-xs">
                <Compass className="w-4 h-4 text-[#C8A96B]" />
              </div>
              <span className="font-display font-bold text-xl text-[#FAF7F2]">
                {brand.name}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#C8A96B]/20 text-[#C8A96B] font-bold uppercase">
                {brand.team}
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

        {/* Bottom Copyright & Accreditation */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF7F2]/60">
          <div>{footer.copyright}</div>
          <div className="flex items-center gap-1">
            <span>Built by Team ERGON for Smart India Hackathon 2026</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
