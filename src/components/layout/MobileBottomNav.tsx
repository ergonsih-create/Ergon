/**
 * @license
 * GRAM-DISHA — Mobile Bottom Navigation Bar
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Provides thumb-friendly access on mobile devices with high touch target compliance (>= 44px)
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Lightbulb, 
  Calculator, 
  Landmark, 
  Sparkles, 
  Menu, 
  X,
  TrendingUp,
  Compass,
  FileCheck2,
  Boxes,
  FileText,
  GraduationCap,
  LifeBuoy,
  Settings,
  Database
} from 'lucide-react';
import { DishaContextState } from '../../types';
import { useDisha } from '../../context/DishaContext';
import { useLanguage } from '../../context/LanguageContext';

interface MobileBottomNavProps {
  activeModule: DishaContextState['currentModule'];
  onSelectModule: (m: DishaContextState['currentModule']) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeModule,
  onSelectModule,
}) => {
  const { openVoiceModal, toggleAdvisor } = useDisha();
  const { t } = useLanguage();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainTabs = [
    { id: 'DASHBOARD' as const, label: 'Home', icon: LayoutDashboard },
    { id: 'BUSINESS_IDEAS' as const, label: 'Business', icon: Lightbulb },
    { id: 'FINANCE' as const, label: 'Finance', icon: Calculator },
    { id: 'SCHEMES' as const, label: 'Schemes', icon: Landmark },
  ];

  const moreItems = [
    { id: 'MARKET_INSIGHTS' as const, label: 'Market & Mandi', icon: TrendingUp },
    { id: 'FEASIBILITY' as const, label: 'HBFS Feasibility', icon: Compass },
    { id: 'APPLICATIONS' as const, label: 'Scheme Applications', icon: FileCheck2 },
    { id: 'INVENTORY' as const, label: 'Inventory & Operations', icon: Boxes },
    { id: 'REPORTS' as const, label: 'Reports & DPR', icon: FileText },
    { id: 'LEARNING' as const, label: 'Training & Resources', icon: GraduationCap },
    { id: 'SUPPORT' as const, label: 'Support & Grievance', icon: LifeBuoy },
    { id: 'SETTINGS' as const, label: 'Settings & Profile', icon: Settings },
    { id: 'ADMIN' as const, label: 'Government Datasets', icon: Database },
  ];

  const handleSelect = (m: DishaContextState['currentModule']) => {
    onSelectModule(m);
    setIsMoreOpen(false);
  };

  return (
    <>
      {/* "More" Drawer / Modal for Mobile */}
      {isMoreOpen && (
        <div className="fixed inset-0 z-50 sm:hidden flex flex-col justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="w-full bg-[#FAF7F2] rounded-t-3xl border-t border-[#C8A96B]/30 p-5 shadow-2xl max-h-[80vh] overflow-y-auto space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#C8A96B]/20">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#174C3A]" />
                <h3 className="font-display font-bold text-sm text-[#3B2F2A]">Enterprise Modules</h3>
              </div>
              <button 
                onClick={() => setIsMoreOpen(false)}
                className="p-1.5 rounded-full bg-[#F2E8D6] text-[#3B2F2A] hover:bg-[#E8DCC6]"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#174C3A] text-[#FAF7F2] border-[#174C3A]'
                        : 'bg-[#FAF7F2] text-[#3B2F2A] border-[#C8A96B]/20 hover:bg-[#F2E8D6]/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#C8A96B]' : 'text-[#174C3A]'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar on Mobile */}
      <nav 
        id="mobile_bottom_nav"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#C8A96B]/30 sm:hidden shadow-lg pb-safe"
      >
        <div className="flex items-center justify-around h-16 px-1">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeModule === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelect(tab.id)}
                className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-1 rounded-xl transition-all cursor-pointer ${
                  isActive ? 'text-[#174C3A]' : 'text-[#3B2F2A]/60 hover:text-[#3B2F2A]'
                }`}
              >
                <div className={`p-1 rounded-lg transition-transform ${isActive ? 'bg-[#174C3A]/10 scale-110' : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#174C3A]' : 'text-[#3B2F2A]/60'}`} />
                </div>
                <span className={`text-[10px] font-semibold mt-0.5 ${isActive ? 'font-bold text-[#174C3A]' : ''}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* Central DISHA Copilot Action Button */}
          <button
            onClick={openVoiceModal}
            className="flex flex-col items-center justify-center -mt-5 min-w-[56px] min-h-[44px] cursor-pointer"
            title="Ask DISHA AI"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#174C3A] text-[#FAF7F2] border-2 border-[#C8A96B] shadow-md flex items-center justify-center transform hover:scale-105 transition-all">
              <Sparkles className="w-6 h-6 text-[#C8A96B] animate-pulse" />
            </div>
            <span className="text-[10px] font-bold text-[#174C3A] mt-0.5">DISHA</span>
          </button>

          {/* More button */}
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-1 rounded-xl transition-all cursor-pointer ${
              isMoreOpen ? 'text-[#174C3A]' : 'text-[#3B2F2A]/60 hover:text-[#3B2F2A]'
            }`}
          >
            <div className={`p-1 rounded-lg ${isMoreOpen ? 'bg-[#174C3A]/10' : ''}`}>
              <Menu className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold mt-0.5">More</span>
          </button>
        </div>
      </nav>
    </>
  );
};
