/**
 * @license
 * GRAM-DISHA — Onboarding Step 3: Financial Structuring & Subsidy Preview
 * Team ERGON — Smart India Hackathon 2026
 */

import React, { useState } from 'react';
import { 
  Calculator, 
  Coins, 
  Landmark, 
  Percent, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle,
  AlertCircle,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { BusinessContext } from '../../../types';

interface FinanceStepProps {
  business: Partial<BusinessContext>;
  isRural: boolean;
  userCategory?: string;
  onChange: (updated: {
    projectCost: number;
    promoterMargin: number;
    existingAssetsValue: number;
    workingCapitalNeed: number;
  }) => void;
  onNext: () => void;
  onBack: () => void;
}

const COST_PRESETS = [
  { label: '₹3 Lakhs', value: 300000, desc: 'Micro cottage setup / Small processing' },
  { label: '₹5 Lakhs', value: 500000, desc: 'Semi-automatic grinding & packaging' },
  { label: '₹10 Lakhs', value: 1000000, desc: 'Commercial Dal/Flour Mill with shed' },
  { label: '₹20 Lakhs', value: 2000000, desc: 'High-throughput automated facility' },
  { label: '₹35 Lakhs', value: 3500000, desc: 'Cold chain / Integrated food hub' },
];

export const FinanceStep: React.FC<FinanceStepProps> = ({
  business,
  isRural,
  userCategory = 'OBC',
  onChange,
  onNext,
  onBack,
}) => {
  const [totalCost, setTotalCost] = useState<number>(1000000);
  const [marginPercent, setMarginPercent] = useState<number>(10);
  const [existingAssets, setExistingAssets] = useState<number>(150000);
  const [workingCapitalMonths, setWorkingCapitalMonths] = useState<number>(3);

  // Derived Calculations
  const promoterContribution = (totalCost * marginPercent) / 100;
  const loanRequired = totalCost - promoterContribution;
  
  // PMEGP Subsidy Rate: 35% for Special Category (OBC/SC/ST/Women) in Rural, 25% for General Rural
  const isSpecialCategory = ['SC', 'ST', 'OBC', 'WOMEN', 'MINORITY', 'EWS'].includes(userCategory);
  const subsidyPercent = isRural ? (isSpecialCategory ? 35 : 25) : (isSpecialCategory ? 25 : 15);
  const estimatedSubsidy = (totalCost * subsidyPercent) / 100;

  // Monthly EMI Estimate @ 9.5% for 5 years (60 months)
  const monthlyRate = 0.095 / 12;
  const tenureMonths = 60;
  const estimatedMonthlyEMI = Math.round(
    (loanRequired * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    onChange({
      projectCost: totalCost,
      promoterMargin: promoterContribution,
      existingAssetsValue: existingAssets,
      workingCapitalNeed: Math.round(totalCost * 0.2),
    });
    onNext();
  };

  return (
    <form onSubmit={handleContinue} className="space-y-6">
      {/* Step Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#C8A96B] bg-[#3B2F2A] px-2.5 py-0.5 rounded-md">
            Step 3 of 5
          </span>
          <span className="text-xs text-[#5A6B4F] font-semibold">
            Deterministic Financial Modeling
          </span>
        </div>
        <h2 className="text-2xl font-display font-bold text-[#3B2F2A]">
          Project Capital & Financial Structuring
        </h2>
        <p className="text-xs sm:text-sm text-[#3B2F2A]/75 leading-relaxed">
          Define your target enterprise budget and available equity. Gram-Disha calculates margin money norms, bank loan requirements, and verified government subsidies.
        </p>
      </div>

      {/* Target Project Cost Quick Presets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-[#3B2F2A]">
            Target Total Project Cost (Machinery + Infra + Working Capital)
          </label>
          <span className="font-mono font-bold text-sm text-[#B45B4A]">
            ₹{totalCost.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {COST_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => setTotalCost(preset.value)}
              className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                totalCost === preset.value
                  ? 'bg-[#3B2F2A] text-[#FAF7F2] border-[#3B2F2A] shadow-xs'
                  : 'bg-[#FAF7F2] text-[#3B2F2A] border-[#C8A96B]/30 hover:border-[#C8A96B]'
              }`}
            >
              <span className="font-bold text-xs block">{preset.label}</span>
              <span className={`text-[10px] block truncate ${totalCost === preset.value ? 'text-[#FAF7F2]/75' : 'text-[#3B2F2A]/60'}`}>
                {preset.desc.split('/')[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Range Slider for granular control */}
        <div className="pt-2">
          <input
            type="range"
            min={100000}
            max={5000000}
            step={50000}
            value={totalCost}
            onChange={(e) => setTotalCost(Number(e.target.value))}
            className="w-full accent-[#B45B4A] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#3B2F2A]/60 font-mono">
            <span>₹1 Lakh</span>
            <span>₹25 Lakhs</span>
            <span>₹50 Lakhs</span>
          </div>
        </div>
      </div>

      {/* Promoter Margin & Existing Assets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Margin Money % */}
        <div className="p-4 rounded-2xl bg-[#F2E8D6]/40 border border-[#C8A96B]/30 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#3B2F2A]">
              Promoter Equity Margin
            </label>
            <span className="font-mono text-xs font-bold text-[#5A6B4F]">
              {marginPercent}% = ₹{promoterContribution.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[5, 10, 15, 25].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setMarginPercent(pct)}
                className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  marginPercent === pct
                    ? 'bg-[#5A6B4F] text-[#FAF7F2]'
                    : 'bg-[#FAF7F2] text-[#3B2F2A] border border-[#C8A96B]/30'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
          <p className="text-[10px] text-[#3B2F2A]/70">
            *Special category beneficiaries (OBC/SC/ST/Women in Rural areas) require only 5% to 10% own contribution under PMEGP/PMFME guidelines.
          </p>
        </div>

        {/* Existing Assets Valuation */}
        <div className="p-4 rounded-2xl bg-[#F2E8D6]/40 border border-[#C8A96B]/30 space-y-2">
          <label className="block text-xs font-bold text-[#3B2F2A]">
            Existing Owned Assets Value (Land / Shed / Vehicle)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-[#3B2F2A]/60 font-mono">₹</span>
            <input
              type="number"
              value={existingAssets}
              onChange={(e) => setExistingAssets(Number(e.target.value))}
              placeholder="150000"
              className="w-full pl-7 pr-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 focus:border-[#B45B4A] focus:outline-hidden text-sm text-[#3B2F2A] font-mono"
            />
          </div>
          <p className="text-[10px] text-[#3B2F2A]/70">
            Owned land or existing farm sheds reduce upfront fixed capital burden and strengthen bank appraisal.
          </p>
        </div>
      </div>

      {/* Real-time Deterministic Financial Summary Bento */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#3B2F2A] text-[#FAF7F2] space-y-4 shadow-md">
        <div className="flex items-center justify-between border-b border-[#C8A96B]/30 pb-3">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-[#C8A96B]" />
            <span className="font-display font-bold text-sm tracking-wide">
              Deterministic Financial Structure Preview
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#C8A96B]/20 text-[#C8A96B] font-mono font-semibold">
            RBI MSME Guidelines
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-[#FAF7F2]/70 block">Total Project Cost</span>
            <span className="font-mono font-bold text-sm sm:text-base text-[#FAF7F2]">
              ₹{totalCost.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-[#FAF7F2]/70 block">Own Margin Money</span>
            <span className="font-mono font-bold text-sm sm:text-base text-[#C8A96B]">
              ₹{promoterContribution.toLocaleString('en-IN')} ({marginPercent}%)
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-[#FAF7F2]/70 block">Bank Loan Required</span>
            <span className="font-mono font-bold text-sm sm:text-base text-[#FAF7F2]">
              ₹{loanRequired.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#5A6B4F]/30 border border-[#5A6B4F]/50">
            <span className="text-[10px] text-[#C8A96B] font-bold block">PMEGP Subsidy Match</span>
            <span className="font-mono font-bold text-sm sm:text-base text-[#FAF7F2]">
              ₹{estimatedSubsidy.toLocaleString('en-IN')} ({subsidyPercent}%)
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#FAF7F2]/80 pt-1 gap-2">
          <span>
            Estimated Monthly Debt Service (EMI): <strong className="text-[#FAF7F2]">₹{estimatedMonthlyEMI.toLocaleString('en-IN')}/mo</strong> (5 yr tenure @ 9.5% p.a.)
          </span>
          <span className="text-[11px] text-[#C8A96B]">
            *Subsidy is back-ended & held in TDR for 3 years
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-2xl bg-[#F2E8D6] hover:bg-[#E8DCC6] text-xs font-bold text-[#3B2F2A] cursor-pointer"
        >
          ← Back
        </button>
        <button
          type="submit"
          className="px-6 py-3 rounded-2xl bg-[#3B2F2A] hover:bg-[#2D2420] text-sm font-bold text-[#FAF7F2] shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Continue to Operational Requirements</span>
          <span>→</span>
        </button>
      </div>
    </form>
  );
};
