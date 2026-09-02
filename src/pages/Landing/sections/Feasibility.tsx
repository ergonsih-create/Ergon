import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calculator, 
  TrendingUp, 
  Plus, 
  Minus, 
  ShieldCheck, 
  AlertTriangle, 
  Info,
  Sliders,
  HelpCircle
} from 'lucide-react';
import { BentoCard } from '../../../components/ui/BentoCard';
import { Badge } from '../../../components/ui/Badge';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { LANDING_DATA } from '../data/landingContent';

export const Feasibility: React.FC = () => {
  const { feasibility } = LANDING_DATA;

  // Interactive Feasibility Simulator Parameters
  const [demand, setDemand] = useState(0.85);
  const [access, setAccess] = useState(0.80);
  const [infra, setInfra] = useState(0.75);
  const [socio, setSocio] = useState(0.70);
  const [scheme, setScheme] = useState(0.80);
  const [climate, setClimate] = useState(0.20);
  const [capitalDeficit, setCapitalDeficit] = useState(0.15);
  const [uncertainty, setUncertainty] = useState(0.10);

  // Deterministic HBFS calculation:
  // HBFS = 0.25*D + 0.15*A + 0.10*I + 0.10*S + 0.10*Sc - 0.05*C - 0.15*Cap - 0.20*U
  const rawScore =
    0.25 * demand +
    0.15 * access +
    0.10 * infra +
    0.10 * socio +
    0.10 * scheme -
    0.05 * climate -
    0.15 * capitalDeficit -
    0.20 * uncertainty;

  const score = Math.max(0, Math.min(1, rawScore));
  const scorePercent = (score * 100).toFixed(1);

  const getTier = (val: number) => {
    if (val >= 0.75) return { label: 'High Bankability & Viability Signal', variant: 'olive' as const };
    if (val >= 0.55) return { label: 'Moderate Feasibility • Address Gaps', variant: 'gold' as const };
    return { label: 'High Structural Risk • Review Parameters', variant: 'terracotta' as const };
  };

  const tier = getTier(score);

  return (
    <section id="feasibility" className="py-16 md:py-24 bg-[#F2E8D6]/30 relative border-b border-[#C8A96B]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionHeader
          eyebrow={feasibility.eyebrow}
          headline={feasibility.headline}
          description={feasibility.description}
          align="center"
          className="mb-14"
        />

        {/* Formula Banner */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-[#3B2F2A] text-[#FAF7F2] border border-[#C8A96B]/40 shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left space-y-1">
              <span className="text-[10px] font-mono text-[#C8A96B] uppercase tracking-widest font-bold block">
                Official Mathematical Model
              </span>
              <div className="font-mono text-xs sm:text-sm font-semibold tracking-wide text-[#FAF7F2] overflow-x-auto py-1">
                {feasibility.equation}
              </div>
            </div>
            <Badge variant="gold" size="sm" className="shrink-0">
              Audit-Trailed Logic
            </Badge>
          </div>
        </div>

        {/* 2-Column Layout: Parameter Breakdown & Interactive Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: 8-Parameter Component Breakdown */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {feasibility.components.map((comp, idx) => {
              const isPositive = comp.role === 'Positive Driver';
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    isPositive
                      ? 'bg-[#FAF7F2] border-[#5A6B4F]/25 hover:border-[#5A6B4F]/50'
                      : 'bg-[#FAF7F2] border-[#B45B4A]/25 hover:border-[#B45B4A]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      {isPositive ? (
                        <Plus className="w-3.5 h-3.5 text-[#5A6B4F]" />
                      ) : (
                        <Minus className="w-3.5 h-3.5 text-[#B45B4A]" />
                      )}
                      <span className="font-bold text-xs text-[#3B2F2A] font-display">
                        {comp.name}
                      </span>
                    </div>
                    <span
                      className={`text-[11px] font-mono font-bold ${
                        isPositive ? 'text-[#5A6B4F]' : 'text-[#B45B4A]'
                      }`}
                    >
                      {comp.weight}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#3B2F2A]/70 leading-snug">
                    {comp.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right: Live Interactive Decision-Support Signal Panel */}
          <div className="lg:col-span-5 flex flex-col">
            <BentoCard variant="elevated" className="flex-1 flex flex-col justify-between p-6 sm:p-7 space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#C8A96B]/20">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#B45B4A]" />
                  <span className="text-xs font-bold text-[#3B2F2A] uppercase tracking-wider">
                    Interactive HBFS Feasibility Signal
                  </span>
                </div>
                <Badge variant={tier.variant} size="xs">
                  {tier.label}
                </Badge>
              </div>

              {/* Large Score Metric Display */}
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/25 text-center space-y-2">
                <span className="text-xs uppercase font-bold tracking-widest text-[#3B2F2A]/60 block">
                  Computed Feasibility Index
                </span>
                <div className="text-4xl sm:text-5xl font-display font-bold text-[#3B2F2A]">
                  {score.toFixed(2)}{' '}
                  <span className="text-lg text-[#3B2F2A]/60 font-sans font-normal">/ 1.00</span>
                </div>
                <div className="w-full bg-[#E4D8C5] h-2.5 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-[#5A6B4F] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${scorePercent}%` }}
                  />
                </div>
              </div>

              {/* Quick Sliders for Demo Interaction */}
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-[#3B2F2A]/70">
                    <span>Local Demand & Consumption Index (D)</span>
                    <span className="font-mono font-bold">{(demand * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={demand}
                    onChange={(e) => setDemand(parseFloat(e.target.value))}
                    className="w-full accent-[#5A6B4F] h-1.5 bg-[#E4D8C5] rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-[#3B2F2A]/70">
                    <span>Data Uncertainty & Gaps Penalty (U)</span>
                    <span className="font-mono font-bold text-[#B45B4A]">{(uncertainty * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.05"
                    value={uncertainty}
                    onChange={(e) => setUncertainty(parseFloat(e.target.value))}
                    className="w-full accent-[#B45B4A] h-1.5 bg-[#E4D8C5] rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Disclaimer Notice */}
              <div className="pt-3 border-t border-[#C8A96B]/20 flex items-start gap-2 text-[10px] text-[#3B2F2A]/65 leading-normal">
                <Info className="w-3.5 h-3.5 text-[#C8A96B] shrink-0 mt-0.5" />
                <span>{feasibility.disclaimer}</span>
              </div>

            </BentoCard>
          </div>

        </div>

      </div>
    </section>
  );
};
