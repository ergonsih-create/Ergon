import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Compass, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { LANDING_DATA } from '../../pages/Landing/data/landingContent';

interface LandingNavbarProps {
  onOpenAuth?: (mode: 'GET_STARTED' | 'GOOGLE_SIGNIN') => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onOpenAuth,
  onNavigateSection,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['how-it-works', 'features', 'disha-os', 'feasibility', 'schemes', 'about'];
      const scrollPos = window.scrollY + 120;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLinkClick = (href: string, sectionId?: string) => {
    setMobileMenuOpen(false);
    if (sectionId && onNavigateSection) {
      onNavigateSection(sectionId);
    } else if (href.startsWith('#')) {
      const targetId = href.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#C8A96B]/25 py-3 shadow-xs'
          : 'bg-[#FAF7F2]/40 backdrop-blur-xs py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo / Wordmark */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 group select-none"
            aria-label="Gram-Disha Home"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#3B2F2A] text-[#FAF7F2] flex items-center justify-center shadow-xs border border-[#C8A96B]/40 group-hover:border-[#C8A96B] transition-colors">
              <Compass className="w-5 h-5 text-[#C8A96B]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg sm:text-xl text-[#3B2F2A] tracking-tight">
                  Gram-Disha
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#5A6B4F]/15 text-[#5A6B4F] font-semibold border border-[#5A6B4F]/30 uppercase">
                  ERGON
                </span>
              </div>
              <span className="text-[10px] text-[#3B2F2A]/65 hidden sm:block font-editorial">
                Rural Business Guidance & Structuring
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {LANDING_DATA.navigation.links.map((link: { label: string; href: string; sectionId?: string }) => {
              const targetId = link.sectionId || link.href.replace('#', '');
              const isActive = activeSection === targetId;
              return (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick(link.href, targetId)}
                  className={`px-3 py-1.5 rounded-xl text-xs lg:text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-[#B45B4A] bg-[#B45B4A]/10 font-semibold'
                      : 'text-[#3B2F2A]/80 hover:text-[#3B2F2A] hover:bg-[#F2E8D6]/50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenAuth && onOpenAuth('GOOGLE_SIGNIN')}
              className="text-xs"
            >
              <svg className="w-3.5 h-3.5 mr-1.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Sign in with Google
            </Button>

            <Button
              variant="terracotta"
              size="sm"
              onClick={() => onOpenAuth && onOpenAuth('GET_STARTED')}
              className="text-xs"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:hidden">
            <Button
              variant="terracotta"
              size="sm"
              onClick={() => onOpenAuth && onOpenAuth('GET_STARTED')}
              className="text-xs px-3"
            >
              Get Started
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#3B2F2A] hover:bg-[#F2E8D6] focus:outline-none focus:ring-2 focus:ring-[#C8A96B]"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="sm:hidden bg-[#FAF7F2] border-b border-[#C8A96B]/30 px-4 pt-3 pb-6 shadow-xl"
          >
            <nav className="flex flex-col space-y-2">
              {LANDING_DATA.navigation.links.map((link: { label: string; href: string; sectionId?: string }) => {
                const targetId = link.sectionId || link.href.replace('#', '');
                return (
                  <button
                    key={link.label}
                    onClick={() => handleLinkClick(link.href, targetId)}
                    className="text-left px-3 py-2.5 rounded-xl text-sm font-medium text-[#3B2F2A] hover:bg-[#F2E8D6] flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C8A96B]" />
                  </button>
                );
              })}

              <div className="pt-3 border-t border-[#C8A96B]/25 flex flex-col gap-2.5">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth && onOpenAuth('GOOGLE_SIGNIN');
                  }}
                  className="w-full justify-center text-xs"
                >
                  Sign in with Google
                </Button>
                <Button
                  variant="terracotta"
                  size="md"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth && onOpenAuth('GET_STARTED');
                  }}
                  className="w-full justify-center text-xs"
                >
                  Get Started with Gram-Disha
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
