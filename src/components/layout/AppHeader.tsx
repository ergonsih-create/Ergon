/**
 * @license
 * GRAM-DISHA — App Header Component
 * Multi-Language Switcher (23 Indian Languages), Role Selection, Location & Active Business State
 */

import React, { useState } from 'react';
import { 
  Compass, 
  User, 
  LogOut, 
  ShieldCheck, 
  MapPin, 
  Globe, 
  Layers, 
  ChevronDown, 
  Sparkles,
  Building,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { DishaOrb } from '../disha/DishaOrb';
import { NetworkStatus } from '../common/NetworkStatus';
import { Badge } from '../common/Badge';
import { CURATED_BUSINESS_TEMPLATES } from '../../data/sampleBusinesses';
import { UserRole, SupportedLanguageCode } from '../../types';

export const AppHeader: React.FC<{
  onNavigateToAdmin?: () => void;
  onOpenJWTModal?: () => void;
  onStartNewOnboarding?: () => void;
  onExitToLanding?: () => void;
}> = ({
  onNavigateToAdmin,
  onOpenJWTModal,
  onStartNewOnboarding,
  onExitToLanding,
}) => {
  const { user, activeBusiness, switchBusinessTemplate, setUserRole, logout } = useAuth();
  const { currentLanguage, setLanguage, availableLanguages, t } = useLanguage();
  
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isBizMenuOpen, setIsBizMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header id="gram_disha_header" className="sticky top-0 z-40 w-full liquid-glass border-b border-[#C8A96B]/25 bg-[#FAF7F2]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div 
            id="brand_logo_icon"
            onClick={onExitToLanding}
            title="Return to Public Landing Page"
            className="w-10 h-10 rounded-xl bg-[#3B2F2A] border border-[#C8A96B]/40 flex items-center justify-center text-[#FAF7F2] shadow-xs cursor-pointer hover:border-[#C8A96B] transition-colors"
          >
            <Compass className="w-5 h-5 text-[#C8A96B]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span 
                onClick={onExitToLanding}
                className="font-display font-extrabold text-lg sm:text-xl text-[#3B2F2A] tracking-tight cursor-pointer hover:text-[#B45B4A] transition-colors"
              >
                Gram-Disha
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#5A6B4F]/15 text-[#5A6B4F] font-semibold border border-[#5A6B4F]/30 uppercase">
                SIH 2026
              </span>
            </div>
            <p className="text-[10px] text-[#3B2F2A]/70 font-medium hidden md:block truncate max-w-xs">
              Evidence-Informed Rural Enterprise Intelligence
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
            <span className="font-semibold">{activeBusiness.proposedLocation.district}</span>
            <span className="text-[#3B2F2A]/70">({activeBusiness.proposedLocation.gramPanchayat})</span>
          </div>

          {/* Active Business Template Switcher */}
          <div className="relative">
            <button
              id="header_business_selector_btn"
              onClick={() => setIsBizMenuOpen(!isBizMenuOpen)}
              className="flex items-center gap-2 text-xs font-semibold text-[#3B2F2A] bg-[#FAF7F2] hover:bg-[#F2E8D6]/60 px-3 py-1.5 rounded-xl border border-[#C8A96B]/40 transition-colors cursor-pointer"
            >
              <Building className="w-3.5 h-3.5 text-[#3B2F2A]" />
              <span className="max-w-[180px] truncate">{activeBusiness.title}</span>
              <ChevronDown className="w-3 h-3 text-[#3B2F2A]/60" />
            </button>

            {isBizMenuOpen && (
              <div 
                id="header_business_dropdown"
                className="absolute left-0 mt-2 w-80 bg-[#FAF7F2] rounded-2xl shadow-xl border border-[#C8A96B]/40 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold text-[#3B2F2A]/60 uppercase tracking-wider flex items-center justify-between">
                  <span>Active Enterprise Models</span>
                  <span className="text-[10px] text-[#5A6B4F] font-mono">Curated</span>
                </div>
                {CURATED_BUSINESS_TEMPLATES.map((tmpl) => {
                  const isSelected = activeBusiness.id === tmpl.context.id;
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
                    <span>Onboard New Enterprise Plan</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: JWT Inspector, Language, DISHA AI Copilot & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* JWT Security Button */}
          <button
            onClick={onOpenJWTModal}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] hover:bg-[#F2E8D6]/60 text-xs font-mono font-semibold text-[#5A6B4F] transition-colors cursor-pointer"
            title="Inspect Active RS256 JWT Token Session"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#5A6B4F]" />
            <span className="text-[11px]">JWT Session</span>
          </button>

          {/* 23 Indian Languages Selector */}
          <div className="relative">
            <button
              id="header_language_switcher_btn"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] hover:bg-[#F2E8D6]/60 text-xs font-medium text-[#3B2F2A] transition-colors cursor-pointer"
              title="Select Language (23 Indian Languages)"
            >
              <Globe className="w-3.5 h-3.5 text-[#3B2F2A]" />
              <span className="uppercase font-semibold text-[11px]">{currentLanguage}</span>
              <ChevronDown className="w-3 h-3 text-[#3B2F2A]/60" />
            </button>

            {isLangMenuOpen && (
              <div 
                id="header_language_dropdown"
                className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto bg-[#FAF7F2] rounded-2xl shadow-xl border border-[#C8A96B]/40 p-2 z-50 grid grid-cols-1 gap-1"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold text-[#3B2F2A]/60 uppercase tracking-wider sticky top-0 bg-[#FAF7F2] border-b border-[#C8A96B]/30">
                  23 Official Indian Languages
                </div>
                {availableLanguages.map((lang) => {
                  const isSelected = currentLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as SupportedLanguageCode);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected 
                          ? 'bg-[#3B2F2A] text-[#FAF7F2] font-semibold' 
                          : 'hover:bg-[#F2E8D6]/60 text-[#3B2F2A]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[#3B2F2A]/60">{lang.code.toUpperCase()}</span>
                        <span>{lang.nativeName}</span>
                      </div>
                      <span className={`text-[10px] ${isSelected ? 'text-[#FAF7F2]/80' : 'text-[#3B2F2A]/60'}`}>
                        {lang.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

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
                      Category: {user.demographics.category} • {user.demographics.gender}
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
                      <span>Inspect RS256 JWT Session</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onStartNewOnboarding?.();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-[#3B2F2A] hover:bg-[#F2E8D6]/60 flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#B45B4A]" />
                      <span>Start New Enterprise Onboarding</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onExitToLanding?.();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-[#3B2F2A] hover:bg-[#F2E8D6]/60 flex items-center gap-2 cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5 text-[#C8A96B]" />
                      <span>Return to Public Landing Page</span>
                    </button>
                  </div>

                  {/* Switch Role */}
                  <div className="pt-2 border-t border-[#C8A96B]/25">
                    <div className="text-[10px] font-bold text-[#3B2F2A]/60 uppercase tracking-wider mb-1">
                      Active User Role
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
                    Sign Out & Return to Landing
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
