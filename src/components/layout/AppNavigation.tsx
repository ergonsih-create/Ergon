/**
 * @license
 * GRAM-DISHA — Main Navigation Bar
 * 4 Pillars of Rural Enterprise Intelligence: Discover & Decide, Plan & Structure, Connect & Comply, Manage & Grow
 */

import React from 'react';
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
  Database
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
    defaultLabel: 'Dashboard', 
    icon: <LayoutDashboard className="w-4 h-4" />, 
    pillar: 'DISCOVER' 
  },
  { 
    id: 'BUSINESS_IDEAS', 
    labelKey: 'myBusiness', 
    defaultLabel: 'Business Models', 
    icon: <Lightbulb className="w-4 h-4" />, 
    pillar: 'DISCOVER' 
  },
  { 
    id: 'LOCATION', 
    labelKey: 'location', 
    defaultLabel: 'Local Context', 
    icon: <MapPin className="w-4 h-4" />, 
    pillar: 'DISCOVER' 
  },
  { 
    id: 'MARKET_INSIGHTS', 
    labelKey: 'marketInsights', 
    defaultLabel: 'Market Intelligence', 
    icon: <TrendingUp className="w-4 h-4" />, 
    pillar: 'DISCOVER' 
  },
  { 
    id: 'FEASIBILITY', 
    labelKey: 'feasibility', 
    defaultLabel: 'Feasibility & SWOT', 
    icon: <Compass className="w-4 h-4" />, 
    pillar: 'DISCOVER' 
  },
  { 
    id: 'FINANCE', 
    labelKey: 'finance', 
    defaultLabel: 'Financial Structuring', 
    icon: <Calculator className="w-4 h-4" />, 
    pillar: 'PLAN' 
  },
  { 
    id: 'SCHEMES', 
    labelKey: 'schemes', 
    defaultLabel: 'Government Schemes', 
    icon: <Landmark className="w-4 h-4" />, 
    pillar: 'CONNECT' 
  },
  { 
    id: 'DOCUMENTS', 
    labelKey: 'documents', 
    defaultLabel: 'Document Checklist', 
    icon: <FileCheck2 className="w-4 h-4" />, 
    pillar: 'CONNECT' 
  },
  { 
    id: 'APPLICATIONS', 
    labelKey: 'applications', 
    defaultLabel: 'DPR & Applications', 
    icon: <FileText className="w-4 h-4" />, 
    pillar: 'CONNECT' 
  },
  { 
    id: 'INVENTORY', 
    labelKey: 'operations', 
    defaultLabel: 'Operations & Sales', 
    icon: <Boxes className="w-4 h-4" />, 
    pillar: 'MANAGE' 
  },
  { 
    id: 'LEARNING', 
    labelKey: 'resources', 
    defaultLabel: 'Learn & Resources', 
    icon: <GraduationCap className="w-4 h-4" />, 
    pillar: 'MANAGE' 
  },
  { 
    id: 'SUPPORT', 
    labelKey: 'support', 
    defaultLabel: 'Grievance & Support', 
    icon: <LifeBuoy className="w-4 h-4" />, 
    pillar: 'MANAGE' 
  },
  { 
    id: 'ADMIN', 
    labelKey: 'admin', 
    defaultLabel: '30 Datasets Registry', 
    icon: <Database className="w-4 h-4" />, 
    pillar: 'SYSTEM' 
  },
];

export const AppNavigation: React.FC<{
  activeModule: DishaContextState['currentModule'];
  onSelectModule: (m: DishaContextState['currentModule']) => void;
}> = ({ activeModule, onSelectModule }) => {
  const { openAdvisorWithInsight } = useDisha();
  const { t } = useLanguage();
  const { user } = useAuth();

  const handleTabClick = (item: NavTabItem) => {
    onSelectModule(item.id);
    openAdvisorWithInsight(
      `Switched to ${item.defaultLabel}. All data is bound to verified government registers and deterministic formulas.`,
      [],
      `Explore detailed parameters or adjust assumptions for ${item.defaultLabel}.`
    );
  };

  return (
    <nav id="gram_disha_main_nav" className="w-full bg-[#FCFAF5] border-b border-[#D9D3C7] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-2.5">
          {NAV_TABS.map((tab) => {
            const isActive = activeModule === tab.id;
            const label = t(tab.labelKey) !== tab.labelKey ? t(tab.labelKey) : tab.defaultLabel;

            // Highlight admin tab differently
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
  );
};
