/**
 * @license
 * GRAM-DISHA — Breadcrumbs Component
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Provides clear navigation hierarchy from App Root -> Pillar -> Active Module -> Enterprise Location
 */

import React from 'react';
import { ChevronRight, Home, Building, MapPin, Sparkles } from 'lucide-react';
import { useDisha } from '../../context/DishaContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { DishaContextState } from '../../types';

const MODULE_LABELS: Record<DishaContextState['currentModule'], { name: string; pillar: string }> = {
  PUBLIC: { name: 'Public Landing', pillar: 'Public' },
  ONBOARDING: { name: 'Entrepreneur Onboarding', pillar: 'Onboarding' },
  BUSINESS_PROFILE: { name: 'Business Profile Setup', pillar: 'Discover & Decide' },
  DASHBOARD: { name: 'Executive Overview', pillar: 'Discover & Decide' },
  BUSINESS_IDEAS: { name: 'Business Requirements', pillar: 'Discover & Decide' },
  LOCATION: { name: 'Location & LGD Hierarchy', pillar: 'Discover & Decide' },
  MARKET_INSIGHTS: { name: 'Market Intelligence', pillar: 'Discover & Decide' },
  FEASIBILITY: { name: 'Feasibility & SWOT', pillar: 'Discover & Decide' },
  SWOT: { name: 'SWOT Analysis', pillar: 'Discover & Decide' },
  OUTLOOK: { name: 'Longevity & Expansion', pillar: 'Discover & Decide' },
  FINANCE: { name: 'Financial Plan & CAPEX', pillar: 'Plan & Structure' },
  PROJECT_COST: { name: 'Project Outlay', pillar: 'Plan & Structure' },
  FINANCIAL_STRUCTURE: { name: 'Loan & Subsidy Structure', pillar: 'Plan & Structure' },
  LOANS_EMI: { name: 'EMI Amortizer', pillar: 'Plan & Structure' },
  CASH_FLOW: { name: 'Cash Flow Projection', pillar: 'Plan & Structure' },
  WORKING_CAPITAL: { name: 'Working Capital', pillar: 'Plan & Structure' },
  SCHEMES: { name: 'Scheme Matcher', pillar: 'Connect & Comply' },
  DOCUMENTS: { name: 'Document Checklist', pillar: 'Connect & Comply' },
  APPLICATIONS: { name: 'Bankable DPR Filing', pillar: 'Connect & Comply' },
  REPORTS: { name: 'DPR & Reports Generator', pillar: 'Connect & Comply' },
  INVENTORY: { name: 'Inventory & Operations', pillar: 'Manage & Grow' },
  SALES: { name: 'Sales Planner', pillar: 'Manage & Grow' },
  ACTION_PLAN: { name: 'Milestone Roadmap', pillar: 'Manage & Grow' },
  PROGRESS: { name: 'Enterprise Progress', pillar: 'Manage & Grow' },
  LEARNING: { name: 'Training & Resources', pillar: 'Support & Capacity' },
  SUPPORT: { name: 'Help Desk & Grievances', pillar: 'Support & Capacity' },
  ADMIN: { name: 'LGD Admin Datasets', pillar: 'System Control' },
  NOTIFICATIONS: { name: 'Notifications & Alerts', pillar: 'System Control' },
  SETTINGS: { name: 'System Settings', pillar: 'System Control' },
  PROFILE: { name: 'User Profile', pillar: 'System Control' },
};

export const Breadcrumbs: React.FC = () => {
  const { dishaState, setModule } = useDisha();
  const { activeBusiness, user } = useAuth();
  const { t } = useLanguage();

  const currentMod = dishaState.currentModule;
  const modInfo = MODULE_LABELS[currentMod] || { name: currentMod, pillar: 'Workspace' };

  return (
    <nav id="breadcrumbs_root" aria-label="Breadcrumb" className="w-full py-1.5 px-1 flex flex-wrap items-center gap-1.5 text-xs text-[#3B2F2A]/70 font-medium">
      
      {/* Home node */}
      <button
        onClick={() => setModule('DASHBOARD')}
        className="flex items-center gap-1 hover:text-[#174C3A] transition-colors cursor-pointer"
        title="Return to Dashboard"
      >
        <Home className="w-3.5 h-3.5 text-[#174C3A]" />
        <span>Gram-Disha</span>
      </button>

      <ChevronRight className="w-3 h-3 text-[#3B2F2A]/40 shrink-0" />

      {/* Pillar node */}
      <span className="text-[#3B2F2A]/60 font-mono text-[11px] uppercase tracking-wider">
        {modInfo.pillar}
      </span>

      <ChevronRight className="w-3 h-3 text-[#3B2F2A]/40 shrink-0" />

      {/* Active Module */}
      <span className="font-bold text-[#174C3A] bg-[#174C3A]/10 px-2 py-0.5 rounded-md border border-[#174C3A]/20">
        {modInfo.name}
      </span>

      {/* Active Business Context Badge if present */}
      {activeBusiness && (
        <>
          <ChevronRight className="w-3 h-3 text-[#3B2F2A]/40 shrink-0 hidden sm:inline" />
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#5A6B4F] bg-[#5A6B4F]/10 px-2 py-0.5 rounded-md border border-[#5A6B4F]/20">
            <Building className="w-3 h-3 text-[#5A6B4F]" />
            <span className="font-bold truncate max-w-[140px]">{activeBusiness.title}</span>
            {activeBusiness?.proposedLocation?.district && (
              <span className="text-[#3B2F2A]/60">({activeBusiness.proposedLocation?.district})</span>
            )}
          </div>
        </>
      )}
    </nav>
  );
};
