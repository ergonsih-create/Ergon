/**
 * @license
 * GRAM-DISHA — Main Navigation Bar
 * 4 Pillars of Rural Enterprise Intelligence: Discover & Decide, Plan & Structure, Connect & Comply, Manage & Grow
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard,
  Lightbulb,
  MapPin, 
  TrendingUp, 
  Compass, 
  Calculator, 
  Landmark, 
  FileCheck2,
  FileText,
  Boxes,
  GraduationCap,
  LifeBuoy,
  Database,
  Grid,
  Sparkles,
  X,
  ChevronRight,
  SlidersHorizontal,
  Bell,
  User
} from 'lucide-react';
import { useDisha } from '../../context/DishaContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { DishaContextState } from '../../types';

export interface NavTabItem {
  id: DishaContextState['currentModule'];
  labelKey: string;
  defaultLabel: string;
  icon: React.ReactNode;
  pillar: 'DISCOVER' | 'PLAN' | 'CONNECT' | 'MANAGE' | 'SYSTEM';
}

export const NAV_TABS: NavTabItem[] = [
  { 
    id: 'DASHBOARD', 
    labelKey: 'dashboard', 
    defaultLabel: 'Home', 
    icon: <LayoutDashboard className="w-4 h-4" />, 
    pillar: 'DISCOVER' 
  },
  { 
    id: 'BUSINESS_IDEAS', 
    labelKey: 'myBusiness', 
    defaultLabel: 'My Business', 
    icon: <Lightbulb className="w-4 h-4" />, 
    pillar: 'DISCOVER' 
  },
  { 
    id: 'MARKET_INSIGHTS', 
    labelKey: 'marketInsights', 
    defaultLabel: 'Market', 
    icon: <TrendingUp className="w-4 h-4" />, 
    pillar: 'DISCOVER' 
  },
  { 
    id: 'FEASIBILITY', 
    labelKey: 'feasibility', 
    defaultLabel: 'Analysis', 
    icon: <Compass className="w-4 h-4" />, 
    pillar: 'DISCOVER' 
  },
  { 
    id: 'FINANCE', 
    labelKey: 'finance', 
    defaultLabel: 'Finance', 
    icon: <Calculator className="w-4 h-4" />, 
    pillar: 'PLAN' 
  },
  { 
    id: 'SCHEMES', 
    labelKey: 'schemes', 
    defaultLabel: 'Schemes', 
    icon: <Landmark className="w-4 h-4" />, 
    pillar: 'CONNECT' 
  },
  { 
    id: 'APPLICATIONS', 
    labelKey: 'applications', 
    defaultLabel: 'Applications', 
    icon: <FileText className="w-4 h-4" />, 
    pillar: 'CONNECT' 
  },
  { 
    id: 'REPORTS', 
    labelKey: 'reports', 
    defaultLabel: 'DPR & Reports', 
    icon: <FileCheck2 className="w-4 h-4" />, 
    pillar: 'CONNECT' 
  },
  { 
    id: 'INVENTORY', 
    labelKey: 'operations', 
    defaultLabel: 'Operations', 
    icon: <Boxes className="w-4 h-4" />, 
    pillar: 'MANAGE' 
  },
  { 
    id: 'LEARNING', 
    labelKey: 'resources', 
    defaultLabel: 'Learning', 
    icon: <GraduationCap className="w-4 h-4" />, 
    pillar: 'MANAGE' 
  },
  { 
    id: 'SUPPORT', 
    labelKey: 'support', 
    defaultLabel: 'Support', 
    icon: <LifeBuoy className="w-4 h-4" />, 
    pillar: 'MANAGE' 
  },
  { 
    id: 'NOTIFICATIONS', 
    labelKey: 'notifications', 
    defaultLabel: 'Notifications', 
    icon: <Bell className="w-4 h-4" />, 
    pillar: 'SYSTEM' 
  },
  { 
    id: 'PROFILE', 
    labelKey: 'profile', 
    defaultLabel: 'Profile & Settings', 
    icon: <User className="w-4 h-4" />, 
    pillar: 'SYSTEM' 
  },
  { 
    id: 'ADMIN', 
    labelKey: 'admin', 
    defaultLabel: 'Datasets', 
    icon: <Database className="w-4 h-4" />, 
    pillar: 'SYSTEM' 
  },
];

export const AppNavigation: React.FC<{
  activeModule: DishaContextState['currentModule'];
  onSelectModule: (m: DishaContextState['currentModule']) => void;
}> = ({ activeModule, onSelectModule }) => {
  const { openAdvisorWithInsight, openParticleAi } = useDisha();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabClick = (item: NavTabItem) => {
    onSelectModule(item.id);
    setIsMobileMenuOpen(false);
    openAdvisorWithInsight(
      `Switched to ${item.defaultLabel}. All data is bound to verified government registers and deterministic formulas.`,
      [],
      `Explore detailed parameters or adjust assumptions for ${item.defaultLabel}.`
    );
  };

  const pillars = [
    { key: 'DISCOVER', title: '1. Discover & Decide', color: 'border-[#C19A5B]' },
    { key: 'PLAN', title: '2. Plan & Structure', color: 'border-[#2EC4B6]' },
    { key: 'CONNECT', title: '3. Connect & Comply', color: 'border-[#5A6B4F]' },
    { key: 'MANAGE', title: '4. Manage & Grow', color: 'border-[#B45B4A]' },
    { key: 'SYSTEM', title: '5. Account & Tools', color: 'border-[#3B2F2A]' },
  ];

  return (
    <>
      {/* Desktop / Tablet Navigation Bar */}
      <nav id="gram_disha_main_nav" className="w-full bg-[#FCFAF5] border-b border-[#D9D3C7] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-2.5">
            {NAV_TABS.map((tab) => {
              const isActive = activeModule === tab.id;
              const label = t(tab.labelKey) !== tab.labelKey ? t(tab.labelKey) : tab.defaultLabel;
              const isAdminTab = tab.id === 'ADMIN';

              return (
                <button
                  key={tab.id}
                  id={`nav_tab_${tab.id.toLowerCase()}`}
                  onClick={() => handleTabClick(tab)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#174C3A] text-[#FCFAF5] shadow-xs'
                      : isAdminTab
                      ? 'text-[#B95736] hover:bg-[#B95736]/10 border border-[#B95736]/30'
                      : 'text-[#68655D] hover:text-[#242522] hover:bg-[#D9D3C7]/40'
                  }`}
                >
                  <span className={isActive ? 'text-[#C69A45]' : isAdminTab ? 'text-[#B95736]' : 'text-[#68655D]'}>
                    {tab.icon}
                  </span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Sticky Bottom Navigation Bar (Visible on screens < md) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#174C3A] text-[#FAF7F2] border-t border-[#C19A5B]/50 px-2 py-1.5 flex items-center justify-around shadow-2xl backdrop-blur-lg">
        <button
          onClick={() => onSelectModule('DASHBOARD')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors min-w-[56px] ${
            activeModule === 'DASHBOARD' ? 'text-[#C19A5B] font-bold' : 'text-[#FAF7F2]/70 hover:text-[#FAF7F2]'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        <button
          onClick={() => onSelectModule('BUSINESS_IDEAS')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors min-w-[56px] ${
            activeModule === 'BUSINESS_IDEAS' || activeModule === 'FEASIBILITY' ? 'text-[#C19A5B] font-bold' : 'text-[#FAF7F2]/70 hover:text-[#FAF7F2]'
          }`}
        >
          <Lightbulb className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Business</span>
        </button>

        {/* Center Prominent Voice AI Orb Launcher */}
        <button
          onClick={openParticleAi}
          className="flex flex-col items-center justify-center -mt-4 w-12 h-12 rounded-full bg-gradient-to-tr from-[#174C3A] via-[#C19A5B] to-[#2EC4B6] border-2 border-[#FAF7F2] shadow-xl text-[#FAF7F2] active:scale-95 transition-transform"
          title="Open Voice AI Assistant"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
        </button>

        <button
          onClick={() => onSelectModule('SCHEMES')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors min-w-[56px] ${
            activeModule === 'SCHEMES' || activeModule === 'APPLICATIONS' ? 'text-[#C19A5B] font-bold' : 'text-[#FAF7F2]/70 hover:text-[#FAF7F2]'
          }`}
        >
          <Landmark className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Schemes</span>
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors min-w-[56px] ${
            isMobileMenuOpen ? 'text-[#C19A5B] font-bold' : 'text-[#FAF7F2]/70 hover:text-[#FAF7F2]'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">All Modules</span>
        </button>
      </div>

      {/* Mobile All Modules Slide-up Sheet Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#3B2F2A]/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-[#FAF7F2] rounded-t-3xl border-t-2 border-[#C19A5B] max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-250">
            {/* Header */}
            <div className="p-4 border-b border-[#C8A96B]/30 flex items-center justify-between bg-[#FCFAF5]">
              <div className="flex items-center gap-2">
                <Grid className="w-5 h-5 text-[#174C3A]" />
                <h3 className="font-display font-extrabold text-sm text-[#3B2F2A]">Enterprise Workspace Modules</h3>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-full bg-[#EFE8DC] text-[#3B2F2A]/70 hover:text-[#3B2F2A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content List divided by 4 Pillars */}
            <div className="p-4 overflow-y-auto space-y-4">
              {pillars.map((pillar) => {
                const tabsInPillar = NAV_TABS.filter((t) => t.pillar === pillar.key);
                if (tabsInPillar.length === 0) return null;

                return (
                  <div key={pillar.key} className="space-y-1.5">
                    <div className="text-[11px] font-bold text-[#3B2F2A]/60 uppercase tracking-wider pl-1">
                      {pillar.title}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {tabsInPillar.map((tab) => {
                        const isActive = activeModule === tab.id;
                        const label = t(tab.labelKey) !== tab.labelKey ? t(tab.labelKey) : tab.defaultLabel;

                        return (
                          <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab)}
                            className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                              isActive
                                ? 'bg-[#174C3A] text-[#FAF7F2] border-[#174C3A] font-bold shadow-xs'
                                : 'bg-[#FCFAF5] text-[#3B2F2A] border-[#C8A96B]/30 hover:bg-[#F2E8D6]'
                            }`}
                          >
                            <span className={isActive ? 'text-[#C19A5B]' : 'text-[#174C3A]'}>
                              {tab.icon}
                            </span>
                            <span className="text-xs truncate">{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
