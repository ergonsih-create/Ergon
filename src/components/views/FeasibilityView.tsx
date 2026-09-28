/**
 * @license
 * GRAM-DISHA — Feasibility Analysis & SWOT Matrix (HBFS Engine)
 * Equation: HBFS = 0.25*D + 0.15*A + 0.10*I + 0.10*S + 0.10*Sc - 0.05*C - 0.15*Cap - 0.20*U
 */

import React, { useState } from 'react';
import { 
  Compass, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles,
  Sliders,
  TrendingUp,
  Award,
  AlertCircle,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { UnknownState } from '../common/UnknownState';
import { FeasibilityEngine } from '../../services/deterministic/feasibilityEngine';
import { useDisha } from '../../context/DishaContext';
import { useAuth } from '../../context/AuthContext';

export const FeasibilityView: React.FC<{ onNavigate?: (mod: any) => void }> = ({ onNavigate }) => {
  const { openAdvisorWithInsight } = useDisha();
  const { activeBusiness } = useAuth();

  const [demandIndex, setDemandIndex] = useState(0.82);
  const [accessibilityIndex, setAccessibilityIndex] = useState(0.78);
  const [infrastructureIndex, setInfrastructureIndex] = useState(0.75);
  const [socioeconomicIndex, setSocioeconomicIndex] = useState(0.70);
  const [schemeSuitabilityIndex, setSchemeSuitabilityIndex] = useState(0.85);
  const [climateVulnerabilityIndex, setClimateVulnerabilityIndex] = useState(0.20);
  const [capitalDeficitRatio, setCapitalDeficitRatio] = useState(0.15);
  const [uncertaintyRatio, setUncertaintyRatio] = useState(0.12);

  const hbfsResult = FeasibilityEngine.calculateHBFS({
    demandIndex,
    accessibilityIndex,
    infrastructureIndex,
    socioeconomicIndex,
    schemeSuitabilityIndex,
    climateVulnerabilityIndex,
    capitalDeficitRatio,
    uncertaintyRatio,
    strengths: [
      'Raw desi chana & pulse supply readily available at Pusad APMC yard (8.5 km)',
      '35% PMEGP rural subsidy eligibility provides strong capital buffer',
      'Low factory shed rental overhead compared to urban municipal zones',
      'High absorption demand in weekly haats and local Kirana store network',
    ],
    weaknesses: [
      'Initial working capital cycle requires strict cash collection discipline',
      'Trained machine operator availability is moderate in the immediate village',
    ],
    opportunities: [
      'Direct packaging supply tie-up with local SHG Mahila Gruhudyog federations',
      'PMFME seed capital and branding support for local agro-processing brand creation',
      'Byproduct sale (chana husk & chuni) as high-protein livestock feed to dairy farmers',
    ],
    threats: [
      'Monsoon logistics slowdown on rural connecting roads during July-August',
      'Mandi spot raw material price volatility due to unseasonal rains',
    ],
  });

  const handleExplainScore = () => {
    openAdvisorWithInsight(
      `Your HBFS Feasibility score is ${(hbfsResult.totalScore * 100).toFixed(1)}% (${hbfsResult.rankingTier.replace('_', ' ')}). High demand (+${(0.25 * demandIndex).toFixed(3)}) and scheme alignment (+${(0.10 * schemeSuitabilityIndex).toFixed(3)}) heavily outweigh uncertainty penalties (-${(0.20 * uncertaintyRatio).toFixed(3)}).`,
      ['Capital deficit penalty is low due to comfortable equity planning.'],
      'Proceed to Financial Structuring to finalize the itemized Project Cost Breakdown.'
    );
  };

  const breakdown = hbfsResult.scoreBreakdown || {
    demand: 0.25 * demandIndex,
    accessibility: 0.15 * accessibilityIndex,
    infrastructure: 0.10 * infrastructureIndex,
    socioeconomic: 0.10 * socioeconomicIndex,
    schemes: 0.10 * schemeSuitabilityIndex,
    climate: 0.05 * climateVulnerabilityIndex,
    capitalPenalty: 0.15 * capitalDeficitRatio,
    uncertaintyPenalty: 0.20 * uncertaintyRatio,
  };

  return (
    <div id="feasibility_view" className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D9D3C7]/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-[#242522]">
            Feasibility Analysis & SWOT Matrix (HBFS Engine)
          </h1>
          <p className="text-xs text-[#68655D] mt-0.5">
            Deterministic 8-Parameter Feasibility Scoring with explicit uncertainty deductions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="forest" size="md">HBFS v2.0 Formula Bound</Badge>
          <Button 
            variant="terracotta" 
            size="sm" 
            onClick={handleExplainScore}
            className="text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#C69A45]" />
            Explain Score
          </Button>
        </div>
      </div>

      {/* Primary Score Hero Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#174C3A] via-[#1E5744] to-[#12382B] text-[#FCFAF5] shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-[#FCFAF5] text-[#174C3A] flex flex-col items-center justify-center shadow-md shrink-0">
            <span className="text-[10px] uppercase font-bold text-[#B95736]">HBFS Score</span>
            <span className="text-3xl font-extrabold font-display leading-tight">
              {(hbfsResult.totalScore * 100).toFixed(1)}%
            </span>
            <span className="text-[9px] text-[#68655D] font-mono">Tier Score</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="harvest" size="md">
                {hbfsResult.rankingTier.replace('_', ' ')}
              </Badge>
              <span className="text-xs text-[#FCFAF5]/80 font-medium">
                Recommendation: Bankable & Credit-Ready
              </span>
            </div>
            <p className="text-xs text-[#FCFAF5]/90 max-w-xl leading-relaxed">
              Standardized Formula: <code className="text-[11px] bg-[#FCFAF5]/20 text-[#FCFAF5] px-1.5 py-0.5 rounded font-mono">
                0.25·D + 0.15·A + 0.10·I + 0.10·S + 0.10·Sc − 0.05·C − 0.15·Cap − 0.20·U
              </code>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate && onNavigate('FINANCE')}
            className="bg-[#FCFAF5]/10 hover:bg-[#FCFAF5]/20 text-[#FCFAF5] border-[#FCFAF5]/40 text-xs"
          >
            Review Financial Structuring →
          </Button>
        </div>
      </div>

      {/* 2-Column: Live Parameter Sliders vs Mathematical Telemetry Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Interactive 8 Parameter Sliders */}
        <Card 
          title="HBFS Parameter Assumptions & Sensitivity" 
          subtitle="Adjust parameter indicators to simulate risk scenarios"
        >
          <div className="space-y-4 text-xs">
            
            {/* Positive Drivers Group */}
            <div className="space-y-3 pb-3 border-b border-[#D9D3C7]/60">
              <div className="font-bold text-[#174C3A] text-[11px] uppercase tracking-wider">
                Positive Feasibility Drivers (+Weights)
              </div>

              <div>
                <div className="flex justify-between font-semibold text-[#242522] mb-1">
                  <span>Demand Index (D) • 25% Weight</span>
                  <span className="font-mono text-[#174C3A]">{(demandIndex * 100).toFixed(0)}% (+{(0.25 * demandIndex).toFixed(3)})</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" 
                  value={demandIndex} onChange={(e) => setDemandIndex(parseFloat(e.target.value))}
                  className="w-full accent-[#174C3A] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-[#242522] mb-1">
                  <span>Accessibility Index (A) • 15% Weight</span>
                  <span className="font-mono text-[#174C3A]">{(accessibilityIndex * 100).toFixed(0)}% (+{(0.15 * accessibilityIndex).toFixed(3)})</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" 
                  value={accessibilityIndex} onChange={(e) => setAccessibilityIndex(parseFloat(e.target.value))}
                  className="w-full accent-[#174C3A] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-[#242522] mb-1">
                  <span>Infrastructure Index (I) • 10% Weight</span>
                  <span className="font-mono text-[#174C3A]">{(infrastructureIndex * 100).toFixed(0)}% (+{(0.10 * infrastructureIndex).toFixed(3)})</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" 
                  value={infrastructureIndex} onChange={(e) => setInfrastructureIndex(parseFloat(e.target.value))}
                  className="w-full accent-[#174C3A] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-[#242522] mb-1">
                  <span>Socioeconomic Index (S) • 10% Weight</span>
                  <span className="font-mono text-[#174C3A]">{(socioeconomicIndex * 100).toFixed(0)}% (+{(0.10 * socioeconomicIndex).toFixed(3)})</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" 
                  value={socioeconomicIndex} onChange={(e) => setSocioeconomicIndex(parseFloat(e.target.value))}
                  className="w-full accent-[#174C3A] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-[#242522] mb-1">
                  <span>Scheme Suitability (Sc) • 10% Weight</span>
                  <span className="font-mono text-[#174C3A]">{(schemeSuitabilityIndex * 100).toFixed(0)}% (+{(0.10 * schemeSuitabilityIndex).toFixed(3)})</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" 
                  value={schemeSuitabilityIndex} onChange={(e) => setSchemeSuitabilityIndex(parseFloat(e.target.value))}
                  className="w-full accent-[#174C3A] cursor-pointer"
                />
              </div>
            </div>

            {/* Negative Deductions Group */}
            <div className="space-y-3">
              <div className="font-bold text-[#9F452B] text-[11px] uppercase tracking-wider">
                Negative Penalty Deductions (-Weights)
              </div>

              <div>
                <div className="flex justify-between font-semibold text-[#242522] mb-1">
                  <span>Climate Vulnerability (C) • -5% Penalty</span>
                  <span className="font-mono text-[#9F452B]">{(climateVulnerabilityIndex * 100).toFixed(0)}% (-{(0.05 * climateVulnerabilityIndex).toFixed(3)})</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" 
                  value={climateVulnerabilityIndex} onChange={(e) => setClimateVulnerabilityIndex(parseFloat(e.target.value))}
                  className="w-full accent-[#9F452B] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-[#242522] mb-1">
                  <span>Capital Deficit Ratio (Cap) • -15% Penalty</span>
                  <span className="font-mono text-[#9F452B]">{(capitalDeficitRatio * 100).toFixed(0)}% (-{(0.15 * capitalDeficitRatio).toFixed(3)})</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" 
                  value={capitalDeficitRatio} onChange={(e) => setCapitalDeficitRatio(parseFloat(e.target.value))}
                  className="w-full accent-[#9F452B] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-[#242522] mb-1">
                  <span>Uncertainty Ratio (U) • -20% Penalty</span>
                  <span className="font-mono text-[#9F452B]">{(uncertaintyRatio * 100).toFixed(0)}% (-{(0.20 * uncertaintyRatio).toFixed(3)})</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" 
                  value={uncertaintyRatio} onChange={(e) => setUncertaintyRatio(parseFloat(e.target.value))}
                  className="w-full accent-[#9F452B] cursor-pointer"
                />
              </div>
            </div>

          </div>
        </Card>

        {/* Right: Mathematical Score Telemetry & Viability Outlook */}
        <div className="space-y-6">
          <Card title="Deterministic Score Composition" subtitle="Exact mathematical audit trail">
            <div className="border border-[#D9D3C7] rounded-2xl overflow-hidden bg-[#F8F5EE] text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#EFEAE1] text-[#242522] font-semibold border-b border-[#D9D3C7]">
                  <tr>
                    <th className="p-2.5">Component</th>
                    <th className="p-2.5 text-center">Weight</th>
                    <th className="p-2.5 text-right">Raw Value</th>
                    <th className="p-2.5 text-right">Contribution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9D3C7]/60">
                  <tr>
                    <td className="p-2.5 text-[#242522]">Demand (D)</td>
                    <td className="p-2.5 text-center font-mono">+0.25</td>
                    <td className="p-2.5 text-right font-mono">{demandIndex.toFixed(2)}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-[#174C3A]">+{breakdown.demand.toFixed(3)}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-[#242522]">Accessibility (A)</td>
                    <td className="p-2.5 text-center font-mono">+0.15</td>
                    <td className="p-2.5 text-right font-mono">{accessibilityIndex.toFixed(2)}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-[#174C3A]">+{breakdown.accessibility.toFixed(3)}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-[#242522]">Infrastructure (I)</td>
                    <td className="p-2.5 text-center font-mono">+0.10</td>
                    <td className="p-2.5 text-right font-mono">{infrastructureIndex.toFixed(2)}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-[#174C3A]">+{breakdown.infrastructure.toFixed(3)}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-[#242522]">Socioeconomic (S)</td>
                    <td className="p-2.5 text-center font-mono">+0.10</td>
                    <td className="p-2.5 text-right font-mono">{socioeconomicIndex.toFixed(2)}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-[#174C3A]">+{breakdown.socioeconomic.toFixed(3)}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-[#242522]">Scheme Suitability (Sc)</td>
                    <td className="p-2.5 text-center font-mono">+0.10</td>
                    <td className="p-2.5 text-right font-mono">{schemeSuitabilityIndex.toFixed(2)}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-[#174C3A]">+{breakdown.schemes.toFixed(3)}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-[#9F452B]">Climate Vulnerability (C)</td>
                    <td className="p-2.5 text-center font-mono text-[#9F452B]">-0.05</td>
                    <td className="p-2.5 text-right font-mono">{climateVulnerabilityIndex.toFixed(2)}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-[#9F452B]">-{breakdown.climate.toFixed(3)}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-[#9F452B]">Capital Deficit (Cap)</td>
                    <td className="p-2.5 text-center font-mono text-[#9F452B]">-0.15</td>
                    <td className="p-2.5 text-right font-mono">{capitalDeficitRatio.toFixed(2)}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-[#9F452B]">-{breakdown.capitalPenalty.toFixed(3)}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-[#9F452B]">Uncertainty Ratio (U)</td>
                    <td className="p-2.5 text-center font-mono text-[#9F452B]">-0.20</td>
                    <td className="p-2.5 text-right font-mono">{uncertaintyRatio.toFixed(2)}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-[#9F452B]">-{breakdown.uncertaintyPenalty.toFixed(3)}</td>
                  </tr>
                  <tr className="bg-[#174C3A]/10 font-extrabold">
                    <td colSpan={3} className="p-2.5 text-[#174C3A]">Final Calculated HBFS Total</td>
                    <td className="p-2.5 text-right font-mono text-[#174C3A] text-sm">{hbfsResult.totalScore.toFixed(3)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* 3-Pillar Viability Outlook */}
          <Card title="Viability & Longevity Projections" subtitle="Deterministic 3-Horizon Viability Index">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-center">
              <div className="p-3 rounded-2xl bg-[#F8F5EE] border border-[#D9D3C7]">
                <div className="text-[10px] uppercase font-bold text-[#68655D]">Month 1-6 Survival</div>
                <div className="text-sm font-extrabold text-[#174C3A] mt-1">
                  88% Buffer
                </div>
                <div className="text-[10px] text-[#71856A] font-semibold mt-0.5">High Stability</div>
              </div>

              <div className="p-3 rounded-2xl bg-[#F8F5EE] border border-[#D9D3C7]">
                <div className="text-[10px] uppercase font-bold text-[#68655D]">Year 1 Operating Cash</div>
                <div className="text-sm font-extrabold text-[#174C3A] mt-1">
                  82% Positive
                </div>
                <div className="text-[10px] text-[#71856A] font-semibold mt-0.5">DSCR 1.82x</div>
              </div>

              <div className="p-3 rounded-2xl bg-[#F8F5EE] border border-[#D9D3C7]">
                <div className="text-[10px] uppercase font-bold text-[#68655D]">Year 3-5 Expansion</div>
                <div className="text-sm font-extrabold text-[#B95736] mt-1">
                  76% Potential
                </div>
                <div className="text-[10px] text-[#B95736] font-semibold mt-0.5">Scale Capable</div>
              </div>
            </div>
          </Card>
        </div>

      </div>

      {/* 4-Quadrant Evidence-Bound SWOT Matrix */}
      <Card title="Hyper-Local SWOT Matrix" subtitle="Evidence-bound operational strengths, vulnerabilities, and market conduits">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Strengths */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Strengths (Local Advantages)
            </div>
            <ul className="space-y-1.5 text-xs text-emerald-950">
              {hbfsResult.swotAnalysis.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Weaknesses (Operating Constraints)
            </div>
            <ul className="space-y-1.5 text-xs text-amber-950">
              {hbfsResult.swotAnalysis.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Opportunities (Market Conduits)
            </div>
            <ul className="space-y-1.5 text-xs text-blue-950">
              {hbfsResult.swotAnalysis.opportunities.map((o, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Threats */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              Threats (External & Climate Risks)
            </div>
            <ul className="space-y-1.5 text-xs text-rose-950">
              {hbfsResult.swotAnalysis.threats.map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </Card>

    </div>
  );
};
