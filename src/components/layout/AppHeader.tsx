/**
 * @license
 * GRAM-DISHA — App Header Component
 * Multi-Language Switcher (23 Indian Languages), Role Selection, Location & Active Business State
 */

import React, { useState, useEffect } from 'react';
import { 
  User, 
  LogOut, 
  ShieldCheck, 
  MapPin, 
  Globe, 
  Layers, 
  ChevronDown, 
  Sparkles,
  Building,
  Check,
  Search,
  Bell
} from 'lucide-react';
import { GramDishaLogoBox, GramDishaIcon } from '../common/GramDishaLogo';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useDisha } from '../../context/DishaContext';
import { DishaOrb } from '../disha/DishaOrb';
import { NetworkStatus } from '../common/NetworkStatus';
import { Badge } from '../common/Badge';
import { CURATED_BUSINESS_TEMPLATES } from '../../data/sampleBusinesses';
import { UserRole, SupportedLanguageCode } from '../../types';
import { LanguageSelector } from '../common/LanguageSelector';
import { GlobalSearchModal } from '../common/GlobalSearchModal';

export const AppHeader: React.FC<{
  onNavigateToAdmin?: () => void;
  onOpenJWTModal?: () => void;
  onStartNewOnboarding?: () => void;
  onExitToLanding?: () => void;
  onNavigateToNotifications?: () => void;
  onNavigateToProfile?: () => void;
}> = ({
  onNavigateToAdmin,
  onOpenJWTModal,
  onStartNewOnboarding,
  onExitToLanding,
  onNavigateToNotifications,
  onNavigateToProfile,
}) => {
  const { user, activeBusiness, switchBusinessTemplate, setUserRole, logout, notifications } = useAuth();
  const { currentLanguage, setLanguage, availableLanguages, t } = useLanguage();
  
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isBizMenuOpen, setIsBizMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { setModule, openParticleAi } = useDisha();
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Ctrl+K / Cmd+K listener for Global Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header id="gram_disha_header" className="sticky top-0 z-40 w-full liquid-glass border-b border-[#C8A96B]/25 bg-[#FAF7F2]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <GramDishaLogoBox
            size="md"
            onClick={onExitToLanding}
            title="Return to Public Landing Page"
          />
          <div>
            <div className="flex items-center gap-2">
              <span 
                onClick={onExitToLanding}
                className="font-display font-extrabold text-lg sm:text-xl text-[#3B2F2A] tracking-tight cursor-pointer hover:text-[#B45B4A] transition-colors"
              >
                {t('appName')}
              </span>
            </div>
            <p className="text-[10px] text-[#3B2F2A]/70 font-medium hidden md:block truncate max-w-xs">
              {t('tagline')}
            </p>
          </div>
        </div>

        {/* Center: Active Location & Business Quick-Switch */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Active Location */}
          <div 
            id="header_active_location"
            className="flex items-center gap-1.5 text-xs text-[#3B2F2A] bg-[#F2E8D6]/50 hover:bg-[#F2E8D6] px-3 py-1.5 rounded-xl border border-[#C8A96B]/30 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-[#B45B4A] shrink-0" />
            <span className="font-semibold">
              {activeBusiness?.proposedLocation?.district || (user?.location?.district !== 'UNKNOWN' ? user?.location?.district : t('header.allIndia'))}
            </span>
            <span className="text-[#3B2F2A]/70">
              ({activeBusiness?.proposedLocation?.gramPanchayat || (user?.location?.gramPanchayat !== 'UNKNOWN' ? user?.location?.gramPanchayat : t('badges.lgdVerified'))})
            </span>
          </div>

          {/* Active Business Template Switcher */}
          {activeBusiness && (
            <div className="relative">
              <button
                id="header_business_selector_btn"
                onClick={() => setIsBizMenuOpen(!isBizMenuOpen)}
                className="flex items-center gap-2 text-xs font-semibold text-[#3B2F2A] bg-[#FAF7F2] hover:bg-[#F2E8D6]/60 px-3 py-1.5 rounded-xl border border-[#C8A96B]/40 transition-colors cursor-pointer"
              >
                <Building className="w-3.5 h-3.5 text-[#3B2F2A]" />
                <span className="max-w-[180px] truncate">{activeBusiness?.title || 'Enterprise'}</span>
                <ChevronDown className="w-3 h-3 text-[#3B2F2A]/60" />
              </button>

              {isBizMenuOpen && (
                <div 
                  id="header_business_dropdown"
                  className="absolute left-0 mt-2 w-80 bg-[#FAF7F2] rounded-2xl shadow-xl border border-[#C8A96B]/40 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold text-[#3B2F2A]/60 uppercase tracking-wider flex items-center justify-between">
                    <span>{t('header.selectEnterprise')}</span>
                    <span className="text-[10px] text-[#5A6B4F] font-mono">Curated</span>
                  </div>
                  {CURATED_BUSINESS_TEMPLATES.map((tmpl) => {
                    const isSelected = activeBusiness?.id === tmpl.context.id;
                    return (
                      <button
                        key={tmpl.context.id}
                        onClick={() => {
                          switchBusinessTemplate(tmpl.context.id);
                          setIsBizMenuOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-start justify-between gap-2 cursor-pointer ${
                          isSelected ? 'bg-[#3B2F2A] text-[#FAF7F2]' : 'hover:bg-[#F2E8D6]/60 text-[#3B2F2A]'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{tmpl.context.title}</div>
                          <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#FAF7F2]/80' : 'text-[#3B2F2A]/60'}`}>
                            ₹{(tmpl.defaultFinancials.projectCost / 100000).toFixed(1)}L Cost • {tmpl.context.category}
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 shrink-0 text-[#C8A96B]" />}
                      </button>
                    );
                  })}

                  {/* Quick Add / Onboard new */}
                  <div className="pt-2 mt-1 border-t border-[#C8A96B]/25">
                    <button
                      onClick={() => {
                        setIsBizMenuOpen(false);
                        onStartNewOnboarding?.();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-[#5A6B4F]/10 hover:bg-[#5A6B4F]/20 text-xs font-bold text-[#5A6B4F] border border-[#5A6B4F]/30 text-center flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t('welcome.startPlanningBtn')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Search, Notifications, Network, JWT, Language, DISHA AI Copilot & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Global Command Search Launcher */}
          <button
            id="header_global_search_btn"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] hover:bg-[#F2E8D6]/60 text-xs font-medium text-[#3B2F2A] transition-colors cursor-pointer"
            title="Global Search (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#174C3A]" />
            <span className="hidden md:inline text-xs text-[#3B2F2A]/70">Search...</span>
            <kbd className="hidden lg:inline text-[10px] font-mono px-1.5 py-0.2 bg-[#F2E8D6] rounded border border-[#C8A96B]/30 text-[#3B2F2A]/60">
              ⌘K
            </kbd>
          </button>

          {/* Notifications Bell Button */}
          <button
            id="header_notifications_bell_btn"
            onClick={() => {
              if (onNavigateToNotifications) onNavigateToNotifications();
              else setModule('NOTIFICATIONS');
            }}
            className="relative p-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] hover:bg-[#F2E8D6]/60 text-[#3B2F2A] transition-colors cursor-pointer"
            title="Notifications & Activity Stream"
          >
            <Bell className="w-4 h-4 text-[#174C3A]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B45B4A] text-[#FAF7F2] text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Network Status Indicator */}
          <div className="hidden xl:block">
            <NetworkStatus />
          </div>

          {/* JWT Security Button */}
          <button
            onClick={onOpenJWTModal}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] hover:bg-[#F2E8D6]/60 text-xs font-mono font-semibold text-[#5A6B4F] transition-colors cursor-pointer"
            title="Inspect Active RS256 JWT Token Session"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#5A6B4F]" />
            <span className="text-[11px]">{t('header.jwtSession')}</span>
          </button>

          {/* Prominent Accessible Multilingual Dropdown (with RTL support) */}
          <LanguageSelector variant="prominent" />

          {/* Particle Voice AI Assistant Launcher */}
          <button
            id="header_particle_voice_btn"
            onClick={openParticleAi}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#C19A5B]/60 bg-[#174C3A] text-[#FAF7F2] hover:bg-[#113327] transition-all duration-200 cursor-pointer shadow-sm text-xs font-semibold"
            title="Open Particle AI Voice Assistant (TTS + STT)"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C19A5B] animate-pulse" />
            <span className="hidden md:inline text-xs font-display">Voice AI</span>
          </button>

          {/* DISHA AI OS Interactive Copilot Launcher */}
          <DishaOrb />

          {/* User Profile & Role Switcher */}
          {user && (
            <div className="relative">
              <button
                id="header_user_profile_btn"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] hover:bg-[#F2E8D6]/60 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#3B2F2A] text-[#FAF7F2] flex items-center justify-center text-xs font-bold shadow-2xs">
                  {user.fullName.charAt(0)}
                </div>
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-bold text-[#3B2F2A] leading-tight truncate max-w-[100px]">
                    {user.fullName}
                  </div>
                  <div className="text-[10px] text-[#B45B4A] font-semibold">
                    {user.role}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-[#3B2F2A]/60 hidden sm:block" />
              </button>

              {isUserMenuOpen && (
                <div 
                  id="header_user_menu_dropdown"
                  className="absolute right-0 mt-2 w-72 bg-[#FAF7F2] rounded-2xl shadow-xl border border-[#C8A96B]/40 p-3 z-50 space-y-2.5"
                >
                  <div className="border-b border-[#C8A96B]/25 pb-2">
                    <div className="text-xs font-bold text-[#3B2F2A]">{user.fullName}</div>
                    <div className="text-[11px] text-[#3B2F2A]/60">{user.email}</div>
                    <div className="text-[10px] text-[#5A6B4F] mt-1 font-medium bg-[#5A6B4F]/10 px-2 py-0.5 rounded-md inline-block">
                      {user.demographics.category} • {user.demographics.gender}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenJWTModal?.();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-[#3B2F2A] hover:bg-[#F2E8D6]/60 flex items-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#5A6B4F]" />
                      <span>{t('header.jwtSession')} (RS256)</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onStartNewOnboarding?.();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-[#3B2F2A] hover:bg-[#F2E8D6]/60 flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#B45B4A]" />
                      <span>{t('welcome.startPlanningBtn')}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onExitToLanding?.();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-[#3B2F2A] hover:bg-[#F2E8D6]/60 flex items-center gap-2 cursor-pointer"
                    >
                      <GramDishaIcon size={14} color="#C8A96B" />
                      <span>{t('nav.home')}</span>
                    </button>
                  </div>

                  {/* Switch Role */}
                  <div className="pt-2 border-t border-[#C8A96B]/25">
                    <div className="text-[10px] font-bold text-[#3B2F2A]/60 uppercase tracking-wider mb-1">
                      {t('header.myProfile')}
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {(['ENTREPRENEUR', 'FIELD_FACILITATOR', 'ADMIN'] as UserRole[]).map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            setUserRole(r);
                            setIsUserMenuOpen(false);
                          }}
                          className={`text-left px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                            user.role === r 
                              ? 'bg-[#3B2F2A] text-[#FAF7F2]' 
                              : 'hover:bg-[#F2E8D6]/60 text-[#3B2F2A]'
                          }`}
                        >
                          {r === 'ENTREPRENEUR' && 'Micro-Entrepreneur'}
                          {r === 'FIELD_FACILITATOR' && 'Field Facilitator / CSC'}
                          {r === 'ADMIN' && 'State / DIC Administrator'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    id="header_logout_btn"
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                      onExitToLanding?.();
                    }}
                    className="w-full pt-2 border-t border-[#C8A96B]/25 flex items-center justify-center gap-1.5 text-xs text-[#B45B4A] font-semibold hover:bg-[#B45B4A]/10 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    {t('header.logout')}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Global Search & Command Palette Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
};
