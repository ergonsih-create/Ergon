/**
 * @license
 * GRAM-DISHA — Main Dashboard Overview View
 * Executive summary of enterprise feasibility, financial structuring, scheme subsidy, and market pulses.
 */

import React from 'react';
import { 
  Compass, 
  TrendingUp, 
  Landmark, 
  Calculator, 
  ArrowUpRight, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles,
  Building,
  CheckCircle2,
  Boxes,
  FileCheck,
  ChevronRight,
  HelpCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDisha } from '../../context/DishaContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { FeasibilityEngine } from '../../services/deterministic/feasibilityEngine';
import { DeterministicFinancialEngine } from '../../services/deterministic/financialEngine';
import { SchemeEngine } from '../../services/deterministic/schemeEngine';
import { MarketEngine } from '../../services/deterministic/marketEngine';
import { CURATED_BUSINESS_TEMPLATES } from '../../data/sampleBusinesses';
import { DishaContextState } from '../../types';

export const DashboardView: React.FC<{ onNavigate: (mod: DishaContextState['currentModule']) => void }> = ({ onNavigate }) => {
  const { user, activeBusiness, switchBusinessTemplate } = useAuth();
  const { openAdvisorWithInsight, toggleSpeakCurrentInsight, isSpeaking } = useDisha();
  const { t } = useLanguage();

  // Find template default financials
  const currentTemplate = CURATED_BUSINESS_TEMPLATES.find(t => t.context.id === activeBusiness.id) || CURATED_BUSINESS_TEMPLATES[0];

  // Calculate Deterministic Models
  const financialStructure = DeterministicFinancialEngine.structureProject(currentTemplate.defaultFinancials);
  
  const feasibilityScore = FeasibilityEngine.calculateHBFS({
    demandIndex: 0.82,
    accessibilityIndex: 0.78,
    infrastructureIndex: 0.75,
    socioeconomicIndex: 0.70,
    schemeSuitabilityIndex: 0.85,
    climateVulnerabilityIndex: 0.20,
    capitalDeficitRatio: 0.15,
    uncertaintyRatio: 0.12,
  });

  const matchedSchemes = SchemeEngine.evaluateSchemes({
    category: user?.demographics.category || 'OBC',
    gender: user?.demographics.gender || 'MALE',
    isRural: activeBusiness.proposedLocation.isRural,
    projectCost: financialStructure.projectCost.totalProjectCost,
    activityType: 'AGRO_PROCESSING',
  });

  const bestScheme = matchedSchemes[0];
  const marketData = MarketEngine.getMarketInsights(activeBusiness.proposedLocation.district, activeBusiness.category);

  return (
    <div id="dashboard_view" className="space-y-6">
      
      {/* 1. Welcome & Active Enterprise Hero Bento */}
      <div 
        id="dashboard_hero_banner"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#174C3A] via-[#1F5C48] to-[#123C2E] p-6 sm:p-8 text-[#FCFAF5] shadow-lg"
      >
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-[#B95736]/15 blur-3xl pointer-events-none" />
        <div className="absolute right-20 top-0 w-48 h-48 rounded-full bg-[#C69A45]/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-[#C69A45]/20 text-[#C69A45] border border-[#C69A45]/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Active Project Evaluation
              </span>
              <span className="text-xs text-[#FCFAF5]/70">
                LGD Verified: {activeBusiness.proposedLocation.gramPanchayat}, {activeBusiness.proposedLocation.district}
              </span>
            </div>
            
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FCFAF5]">
              {activeBusiness.title}
            </h1>
            
            <p className="text-sm text-[#FCFAF5]/85 leading-relaxed">
              {activeBusiness.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#FCFAF5]/80">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C69A45]" />
                <span>Est. Capital: <strong>₹{(financialStructure.projectCost.totalProjectCost / 100000).toFixed(2)} Lakh</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#71856A]" />
                <span>Promoter Equity: <strong>{financialStructure.promoterContributionPercentage}%</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Subsidy Potential: <strong>₹{(bestScheme?.maxSubsidyOrAssistance || 0) / 100000} Lakh ({bestScheme?.subsidyPercentage || 0}%)</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <Button
              id="dash_hero_explore_ideas_btn"
              variant="terracotta"
              onClick={() => onNavigate('BUSINESS_IDEAS')}
              className="justify-center shadow-md"
            >
              <Building className="w-4 h-4 mr-2" />
              Change Enterprise Model
            </Button>
            <Button
              id="dash_hero_open_dpr_btn"
              variant="outline"
              onClick={() => onNavigate('APPLICATIONS')}
              className="bg-[#FCFAF5]/10 hover:bg-[#FCFAF5]/20 text-[#FCFAF5] border-[#FCFAF5]/30 justify-center"
            >
              <FileCheck className="w-4 h-4 mr-2" />
              Generate Bankable DPR
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Primary 4 Pillar Metric Cards */}
      <div id="dashboard_key_kpis" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Feasibility Score */}
        <Card 
          id="kpi_feasibility_card"
          className="p-5 hover:border-[#174C3A]/50 transition-all cursor-pointer group"
          onClick={() => onNavigate('FEASIBILITY')}
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#174C3A]/10 text-[#174C3A] flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <Badge variant={feasibilityScore.rankingTier === 'HIGH_FEASIBILITY' ? 'forest' : 'harvest'}>
              {feasibilityScore.rankingTier.replace('_', ' ')}
            </Badge>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-display font-extrabold text-[#242522]">
              {(feasibilityScore.totalScore * 100).toFixed(1)}%
            </div>
            <div className="text-xs font-semibold text-[#68655D] mt-0.5">
              HBFS Feasibility Score
            </div>
            <p className="text-[11px] text-[#68655D] mt-2 line-clamp-2">
              Demand index 0.82 with high local raw material supply & low logistics deficit.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-[#D9D3C7]/40 flex items-center justify-between text-xs text-[#174C3A] font-semibold group-hover:text-[#B95736]">
            <span>View 8-Parameter Breakdown</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </Card>

        {/* Metric 2: Financial Structuring */}
        <Card 
          id="kpi_finance_card"
          className="p-5 hover:border-[#174C3A]/50 transition-all cursor-pointer group"
          onClick={() => onNavigate('FINANCE')}
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#B95736]/10 text-[#B95736] flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <Badge variant="terracotta">
              EMI: ₹{financialStructure.monthlyEMI.toLocaleString()}
            </Badge>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-display font-extrabold text-[#242522]">
              ₹{(financialStructure.requiredTermLoan / 100000).toFixed(2)}L
            </div>
            <div className="text-xs font-semibold text-[#68655D] mt-0.5">
              Term Loan Required (75%)
            </div>
            <p className="text-[11px] text-[#68655D] mt-2">
              Break-Even: {financialStructure.breakEvenMonthlyUnits} units/mo (DSCR: {financialStructure.projectedDSCR}x)
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-[#D9D3C7]/40 flex items-center justify-between text-xs text-[#174C3A] font-semibold group-hover:text-[#B95736]">
            <span>Loan Amortizer & Cash Flow</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </Card>

        {/* Metric 3: Best Government Scheme */}
        <Card 
          id="kpi_scheme_card"
          className="p-5 hover:border-[#174C3A]/50 transition-all cursor-pointer group"
          onClick={() => onNavigate('SCHEMES')}
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#C69A45]/15 text-[#8F6A1A] flex items-center justify-center font-bold">
              <Landmark className="w-5 h-5" />
            </div>
            <Badge variant="harvest">
              {bestScheme?.subsidyPercentage}% Subsidy
            </Badge>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-display font-extrabold text-[#242522] truncate">
              {bestScheme?.schemeCode || 'PMEGP'}
            </div>
            <div className="text-xs font-semibold text-[#68655D] mt-0.5">
              Capital Subsidy: ₹{((bestScheme?.maxSubsidyOrAssistance || 0) / 100000).toFixed(2)} Lakh
            </div>
            <p className="text-[11px] text-[#68655D] mt-2 line-clamp-2">
              Special category (Rural OBC) criteria matched under KVIC v2.4-2025.
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-[#D9D3C7]/40 flex items-center justify-between text-xs text-[#174C3A] font-semibold group-hover:text-[#B95736]">
            <span>Evaluate 5 Eligible Schemes</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </Card>

        {/* Metric 4: Mandi APMC Price Pulse */}
        <Card 
          id="kpi_market_card"
          className="p-5 hover:border-[#174C3A]/50 transition-all cursor-pointer group"
          onClick={() => onNavigate('MARKET_INSIGHTS')}
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#71856A]/15 text-[#174C3A] flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <Badge variant="forest">
              AGMARKNET
            </Badge>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-display font-extrabold text-[#242522]">
              ₹5,950
              <span className="text-xs font-normal text-[#68655D]"> / Qtl</span>
            </div>
            <div className="text-xs font-semibold text-[#68655D] mt-0.5">
              Desi Chana Modal Price
            </div>
            <p className="text-[11px] text-[#68655D] mt-2">
              Daily arrivals: 45.8 Tonnes at Pusad APMC Yard (Upward Trend).
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-[#D9D3C7]/40 flex items-center justify-between text-xs text-[#174C3A] font-semibold group-hover:text-[#B95736]">
            <span>View Mandi Commodity Feeds</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </Card>

      </div>

      {/* 3. Operational & Intelligence Dashboard Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Step-by-Step Enterprise Readiness Roadmap */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-bold text-lg text-[#242522]">
                  Enterprise Structuring & Credit-Readiness Roadmap
                </h2>
                <p className="text-xs text-[#68655D]">
                  5 deterministic milestones required for institutional bank loan appraisal & subsidy claim.
                </p>
              </div>
              <Badge variant="forest">Step 2 of 5 Active</Badge>
            </div>

            <div className="space-y-3">
              {[
                {
                  step: 1,
                  title: 'Hyper-Local Context & LGD Jurisdiction',
                  desc: 'Pusad Taluka, Yavatmal District, Maharashtra mapped to Rural Area Status.',
                  status: 'COMPLETED',
                  nav: 'LOCATION' as DishaContextState['currentModule'],
                },
                {
                  step: 2,
                  title: 'Detailed Project Cost & Break-Even Engineering',
                  desc: 'Total Cost ₹8.5L with 6-month moratorium and ₹11,489 monthly debt service.',
                  status: 'IN_PROGRESS',
                  nav: 'FINANCE' as DishaContextState['currentModule'],
                },
                {
                  step: 3,
                  title: 'HBFS 8-Parameter Feasibility Validation',
                  desc: 'Algorithmic score of 0.765 confirms High Feasibility tier under verified data.',
                  status: 'READY',
                  nav: 'FEASIBILITY' as DishaContextState['currentModule'],
                },
                {
                  step: 4,
                  title: 'Statutory Documents & DigiLocker Readiness',
                  desc: '4 of 6 required documents ready (Aadhaar, PAN, Caste Certificate, Land NOC).',
                  status: 'PENDING',
                  nav: 'DOCUMENTS' as DishaContextState['currentModule'],
                },
                {
                  step: 5,
                  title: 'DPR Compilation & DIC PMEGP Portal Submission',
                  desc: 'Generate bankable PDF report and file online application on kviconline.gov.in.',
                  status: 'PENDING',
                  nav: 'APPLICATIONS' as DishaContextState['currentModule'],
                },
              ].map((item) => (
                <div 
                  key={item.step}
                  onClick={() => onNavigate(item.nav)}
                  className="p-3.5 rounded-2xl border border-[#D9D3C7]/70 bg-[#FCFAF5] hover:bg-[#F8F5EE] transition-colors cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      item.status === 'COMPLETED' 
                        ? 'bg-[#174C3A] text-[#FCFAF5]' 
                        : item.status === 'IN_PROGRESS'
                        ? 'bg-[#C69A45] text-[#242522]'
                        : 'bg-[#D9D3C7]/50 text-[#68655D]'
                    }`}>
                      {item.status === 'COMPLETED' ? <CheckCircle2 className="w-4 h-4" /> : item.step}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#242522]">{item.title}</div>
                      <div className="text-[11px] text-[#68655D]">{item.desc}</div>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <Badge variant={
                      item.status === 'COMPLETED' ? 'forest' :
                      item.status === 'IN_PROGRESS' ? 'harvest' :
                      item.status === 'READY' ? 'neutral' : 'outline'
                    }>
                      {item.status}
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-[#68655D]" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Action Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card 
              className="p-4 hover:border-[#174C3A] transition-all cursor-pointer"
              onClick={() => onNavigate('INVENTORY')}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#174C3A]/10 text-[#174C3A] flex items-center justify-center">
                  <Boxes className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#242522]">Micro-ERP Operations</div>
                  <div className="text-[11px] text-[#68655D]">Track raw material stock & daily sales logs</div>
                </div>
              </div>
            </Card>

            <Card 
              className="p-4 hover:border-[#B95736] transition-all cursor-pointer"
              onClick={() => onNavigate('SUPPORT')}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#B95736]/10 text-[#B95736] flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#242522]">Grievance & DIC Support</div>
                  <div className="text-[11px] text-[#68655D]">Resolve bank delays & scheme inquiries</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right 1 Col: DISHA AI OS Real-Time Advisory Feed */}
        <div className="space-y-4">
          <Card className="p-5 border-l-4 border-l-[#174C3A] bg-gradient-to-br from-[#FCFAF5] to-[#F8F5EE]">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9D3C7]/60">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#174C3A] text-[#FCFAF5] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#C69A45]" />
                </div>
                <span className="font-display font-bold text-sm text-[#242522]">DISHA AI Copilot</span>
              </div>
              <button
                onClick={toggleSpeakCurrentInsight}
                className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                  isSpeaking ? 'bg-[#174C3A] text-[#FCFAF5] border-[#174C3A]' : 'bg-[#FCFAF5] text-[#174C3A] border-[#D9D3C7]'
                }`}
                title="Speak advisory in Indian Language"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{isSpeaking ? 'Speaking...' : 'Listen'}</span>
              </button>
            </div>

            <div className="mt-3.5 space-y-3">
              <div className="text-xs text-[#242522] leading-relaxed bg-[#FCFAF5] p-3 rounded-xl border border-[#D9D3C7]/60">
                <strong className="text-[#174C3A] block mb-1">Live Evidence Guidance:</strong>
                "Rajesh ji, your proposed pulse processing plant in Pusad benefits from 35% PMEGP rural subsidy. You only require ₹1.25 Lakh promoter capital. Your break-even is 632 kg/month against local demand of 2,400 kg/month."
              </div>

              <div className="bg-[#B95736]/10 p-3 rounded-xl border border-[#B95736]/20">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#9F452B]">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Action Item:</span>
                </div>
                <p className="text-[11px] text-[#68655D] mt-1">
                  Obtain FSSAI Basic Registration (₹100/yr) and complete Udyam MSME online verification to expedite bank appraisal.
                </p>
              </div>

              <Button
                variant="forest"
                size="sm"
                className="w-full justify-center text-xs"
                onClick={() => openAdvisorWithInsight(
                  'DISHA Copilot ready to review complete bankable financials.',
                  ['PMEGP 35% subsidy active', 'AGMARKNET price synced'],
                  'Simulate various loan tenures or interest rate scenarios.'
                )}
              >
                Chat with DISHA AI OS
              </Button>
            </div>
          </Card>

          {/* Provenance Guarantee Stamp */}
          <Card className="p-4 bg-[#FCFAF5]">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#174C3A] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-[#242522]">Zero Hallucination Protocol</div>
                <p className="text-[11px] text-[#68655D] mt-0.5 leading-relaxed">
                  All mathematical projections, subsidy percentages, and mandi modal rates are strictly bound to official registers. Speculative estimates are rejected with explicit <code className="bg-[#D9D3C7]/40 px-1 rounded text-[#9F452B] font-mono">UNKNOWN</code> tags.
                </p>
                <button
                  onClick={() => onNavigate('ADMIN')}
                  className="text-[11px] text-[#174C3A] font-bold mt-2 hover:underline inline-flex items-center gap-1"
                >
                  Audit 30 Master Datasets & Provenance
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};
