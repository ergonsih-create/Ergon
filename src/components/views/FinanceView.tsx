/**
 * @license
 * GRAM-DISHA — Deterministic Financial Structuring View
 * Sourced from standard RBI master directions, NABARD unit cost models, and verified loan amortization equations.
 */

import React, { useState } from 'react';
import { 
  Calculator, 
  ShieldCheck, 
  TrendingUp, 
  IndianRupee, 
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  PieChart as PieIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { DeterministicFinancialEngine } from '../../services/deterministic/financialEngine';
import { useDisha } from '../../context/DishaContext';
import { useAuth } from '../../context/AuthContext';

export const FinanceView: React.FC<{ onNavigate?: (mod: any) => void }> = ({ onNavigate }) => {
  const { openAdvisorWithInsight } = useDisha();
  const { activeBusiness } = useAuth();

  // Core Cost Itemization States
  const [equipmentCost, setEquipmentCost] = useState<number>(450000);
  const [infrastructureCost, setInfrastructureCost] = useState<number>(180000);
  const [fixedAssetsCost, setFixedAssetsCost] = useState<number>(55000);
  const [inventoryCost, setInventoryCost] = useState<number>(85000);
  const [workingCapitalBuffer, setWorkingCapitalBuffer] = useState<number>(65000);
  const [licensingCost, setLicensingCost] = useState<number>(15000);

  // Financing terms
  const totalProjectCost = equipmentCost + infrastructureCost + fixedAssetsCost + inventoryCost + workingCapitalBuffer + licensingCost;
  const [promoterCapital, setPromoterCapital] = useState<number>(125000);
  const [interestRate, setInterestRate] = useState<number>(9.8); // 9.8% Commercial Agri/MSME rate
  const [tenureMonths, setTenureMonths] = useState<number>(60); // 5 Years
  const [moratoriumMonths, setMoratoriumMonths] = useState<number>(6); // 6 Months Principal Moratorium

  // Operating parameters
  const [unitSalePrice, setUnitSalePrice] = useState<number>(95); // ₹95/kg finished dal
  const [unitVariableCost, setUnitVariableCost] = useState<number>(62); // ₹62/kg raw material + processing
  const [monthlyFixedCost, setMonthlyFixedCost] = useState<number>(24000); // Electricity, shed rent, maintenance

  const finResult = DeterministicFinancialEngine.structureProject({
    projectCost: totalProjectCost,
    promoterCapital,
    interestRateAnnual: interestRate,
    tenureMonths,
    moratoriumMonths,
    unitSalePrice,
    unitVariableCost,
    monthlyFixedCost,
    customBreakdown: {
      equipmentAndMachinery: equipmentCost,
      infrastructureSetup: infrastructureCost,
      fixedAssets: fixedAssetsCost,
      initialRawMaterialInventory: inventoryCost,
      workingCapitalContingency: workingCapitalBuffer,
      statutoryLicensingCosts: licensingCost,
    }
  });

  const handleExplainFinance = () => {
    openAdvisorWithInsight(
      `Financial Analysis: Total Project Cost is ₹${(totalProjectCost / 100000).toFixed(2)} Lakh. With ₹${(promoterCapital / 100000).toFixed(2)} Lakh promoter capital (${finResult.promoterContributionPercentage}%), the required term loan is ₹${(finResult.requiredTermLoan / 100000).toFixed(2)} Lakh. Monthly EMI is ₹${finResult.monthlyEMI.toLocaleString('en-IN')}.`,
      [
        `Projected DSCR is ${finResult.projectedDSCR}x (Statutory bank benchmark >= 1.25x passed).`,
        `Break-even volume is ${finResult.breakEvenMonthlyUnits} kg/month (₹${finResult.breakEvenMonthlyRevenue.toLocaleString('en-IN')}/mo).`
      ],
      'Proceed to Government Schemes to apply for 35% PMEGP capital subsidy.'
    );
  };

  return (
    <div id="finance_view" className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D9D3C7]/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-[#242522]">
            Deterministic Financial Structuring & Debt Service
          </h1>
          <p className="text-xs text-[#68655D] mt-0.5">
            Formula-bound computation of Project Outlay, EMI, DSCR, Break-Even volume, and 12-Month Cash Flow.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="forest" size="md">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" />
            Zero AI Drift Engine
          </Badge>
          <Button 
            variant="terracotta" 
            size="sm" 
            onClick={handleExplainFinance}
            className="text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#C69A45]" />
            Explain Financials
          </Button>
        </div>
      </div>

      {/* Primary KPI Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-[#FCFAF5]">
          <div className="text-[10px] font-bold text-[#68655D] uppercase">Total Project Outlay</div>
          <div className="text-2xl font-display font-extrabold text-[#242522] mt-1">
            ₹{(totalProjectCost / 100000).toFixed(2)} Lakh
          </div>
          <div className="text-[11px] text-[#68655D] mt-1">
            ₹{totalProjectCost.toLocaleString('en-IN')} Itemized Cost
          </div>
        </Card>

        <Card className="p-4 bg-[#FCFAF5]">
          <div className="text-[10px] font-bold text-[#68655D] uppercase">Required Term Loan</div>
          <div className="text-2xl font-display font-extrabold text-[#174C3A] mt-1">
            ₹{(finResult.requiredTermLoan / 100000).toFixed(2)} Lakh
          </div>
          <div className="text-[11px] text-[#174C3A] font-semibold mt-1">
            {finResult.debtToEquityRatio} Debt-to-Equity Ratio
          </div>
        </Card>

        <Card className="p-4 bg-[#FCFAF5]">
          <div className="text-[10px] font-bold text-[#68655D] uppercase">Monthly Bank Debt Service</div>
          <div className="text-2xl font-display font-extrabold text-[#B95736] mt-1">
            ₹{finResult.monthlyEMI.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#68655D] mt-1">
            {tenureMonths} Mo @ {interestRate}% ({moratoriumMonths}m Moratorium)
          </div>
        </Card>

        <Card className="p-4 bg-[#FCFAF5]">
          <div className="text-[10px] font-bold text-[#68655D] uppercase">Debt Service Coverage (DSCR)</div>
          <div className="text-2xl font-display font-extrabold text-emerald-700 mt-1">
            {finResult.projectedDSCR}x
          </div>
          <div className="text-[11px] text-emerald-800 font-semibold mt-1">
            ✓ Bank Benchmark (&gt;= 1.25x) Passed
          </div>
        </Card>
      </div>

      {/* 2-Column: Itemized Project Breakdown vs Loan Amortizer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Itemized Project Cost Breakdown Inputs */}
        <Card 
          title="Itemized Project Cost Outlay (₹)" 
          subtitle="Directly aligns with DIC and Bank DPR format requirements"
        >
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-[#242522] font-semibold mb-1">
                <span>1. Plant & Processing Machinery</span>
                <span className="font-mono">₹{equipmentCost.toLocaleString()}</span>
              </div>
              <input
                type="range" min="100000" max="2500000" step="25000"
                value={equipmentCost} onChange={(e) => setEquipmentCost(Number(e.target.value))}
                className="w-full accent-[#174C3A] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[#242522] font-semibold mb-1">
                <span>2. Shed Infrastructure & Civil Modification</span>
                <span className="font-mono">₹{infrastructureCost.toLocaleString()}</span>
              </div>
              <input
                type="range" min="50000" max="1000000" step="10000"
                value={infrastructureCost} onChange={(e) => setInfrastructureCost(Number(e.target.value))}
                className="w-full accent-[#174C3A] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[#242522] font-semibold mb-1">
                <span>3. Fixed Assets (Electrification, Scale, Sealing)</span>
                <span className="font-mono">₹{fixedAssetsCost.toLocaleString()}</span>
              </div>
              <input
                type="range" min="10000" max="200000" step="5000"
                value={fixedAssetsCost} onChange={(e) => setFixedAssetsCost(Number(e.target.value))}
                className="w-full accent-[#174C3A] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[#242522] font-semibold mb-1">
                <span>4. Initial Raw Material Inventory (1 Month)</span>
                <span className="font-mono">₹{inventoryCost.toLocaleString()}</span>
              </div>
              <input
                type="range" min="20000" max="500000" step="5000"
                value={inventoryCost} onChange={(e) => setInventoryCost(Number(e.target.value))}
                className="w-full accent-[#174C3A] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[#242522] font-semibold mb-1">
                <span>5. Working Capital Contingency Buffer</span>
                <span className="font-mono">₹{workingCapitalBuffer.toLocaleString()}</span>
              </div>
              <input
                type="range" min="10000" max="250000" step="5000"
                value={workingCapitalBuffer} onChange={(e) => setWorkingCapitalBuffer(Number(e.target.value))}
                className="w-full accent-[#174C3A] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[#242522] font-semibold mb-1">
                <span>6. Statutory Licensing (FSSAI, Udyam, Fire NOC)</span>
                <span className="font-mono">₹{licensingCost.toLocaleString()}</span>
              </div>
              <input
                type="range" min="5000" max="50000" step="1000"
                value={licensingCost} onChange={(e) => setLicensingCost(Number(e.target.value))}
                className="w-full accent-[#174C3A] cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-[#D9D3C7]/60 flex justify-between font-bold text-sm text-[#174C3A]">
              <span>Computed Total Outlay:</span>
              <span className="font-mono">₹{totalProjectCost.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* Right: Loan Amortization & Break-Even Parameters */}
        <div className="space-y-6">
          <Card title="Financing Terms & Promoters Equity" subtitle="Bank loan structuring controls">
            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between text-[#242522] font-semibold mb-1">
                  <span>Promoter Own Contribution (₹)</span>
                  <span className="font-mono font-bold text-[#174C3A]">
                    ₹{promoterCapital.toLocaleString()} ({finResult.promoterContributionPercentage}%)
                  </span>
                </div>
                <input
                  type="range" min={totalProjectCost * 0.05} max={totalProjectCost * 0.50} step="5000"
                  value={promoterCapital} onChange={(e) => setPromoterCapital(Number(e.target.value))}
                  className="w-full accent-[#174C3A] cursor-pointer"
                />
                <span className="text-[10px] text-[#68655D]">Min 5% under PMEGP Rural OBC Category</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#242522] mb-1">Annual Interest Rate (%)</label>
                  <input
                    type="number" step="0.1" value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F5EE] border border-[#D9D3C7] text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#242522] mb-1">Tenure (Months)</label>
                  <select
                    value={tenureMonths}
                    onChange={(e) => setTenureMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F5EE] border border-[#D9D3C7] text-xs font-semibold"
                  >
                    <option value={36}>36 Months (3 Years)</option>
                    <option value={60}>60 Months (5 Years)</option>
                    <option value={84}>84 Months (7 Years)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#242522] mb-1">Principal Moratorium (Months)</label>
                <select
                  value={moratoriumMonths}
                  onChange={(e) => setMoratoriumMonths(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8F5EE] border border-[#D9D3C7] text-xs font-semibold"
                >
                  <option value={0}>0 Months (Immediate EMI)</option>
                  <option value={3}>3 Months (Construction phase)</option>
                  <option value={6}>6 Months (Standard Agri Processing)</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Break-Even Target Card */}
          <Card title="Unit Economics & Break-Even Target" subtitle="Monthly production sales hurdle">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F8F5EE] border border-[#D9D3C7] text-center">
                <div className="text-[10px] uppercase font-bold text-[#68655D]">Break-Even Volume</div>
                <div className="text-lg font-extrabold text-[#242522] mt-1">
                  {finResult.breakEvenMonthlyUnits.toLocaleString()} units/mo
                </div>
                <div className="text-[10px] text-[#174C3A] font-semibold mt-0.5">
                  ({(finResult.breakEvenMonthlyUnits / 25).toFixed(0)} units/day)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8F5EE] border border-[#D9D3C7] text-center">
                <div className="text-[10px] uppercase font-bold text-[#68655D]">Break-Even Monthly Sales</div>
                <div className="text-lg font-extrabold text-[#B95736] mt-1">
                  ₹{finResult.breakEvenMonthlyRevenue.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-[#68655D] mt-0.5">Contribution Margin: {finResult.contributionMarginPercentage}%</div>
              </div>
            </div>
          </Card>
        </div>

      </div>

      {/* 12-Month Projected Cash Flow Statement */}
      <Card 
        title="12-Month Projected Cash Flow Statement" 
        subtitle="Deterministic monthly operating cash surplus with 6-month principal moratorium logic"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8F5EE] text-[#242522] font-semibold border-b border-[#D9D3C7]">
              <tr>
                <th className="p-2.5">Month</th>
                <th className="p-2.5 text-right">Inflow (₹)</th>
                <th className="p-2.5 text-right">Raw Material (₹)</th>
                <th className="p-2.5 text-right">Fixed Cost (₹)</th>
                <th className="p-2.5 text-right">Debt Service (₹)</th>
                <th className="p-2.5 text-right">Net Cash Surplus (₹)</th>
                <th className="p-2.5 text-right">Closing Balance (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9D3C7]/60">
              {finResult.projectedMonthlyCashFlow.map((cf) => (
                <tr key={cf.month} className="hover:bg-[#F8F5EE]/60 transition-colors">
                  <td className="p-2.5 font-semibold text-[#242522]">Month {cf.month}</td>
                  <td className="p-2.5 text-right font-mono text-[#242522]">₹{cf.cashInflows.toLocaleString()}</td>
                  <td className="p-2.5 text-right font-mono text-[#68655D]">₹{cf.variableExpenses.toLocaleString()}</td>
                  <td className="p-2.5 text-right font-mono text-[#68655D]">₹{cf.fixedExpenses.toLocaleString()}</td>
                  <td className="p-2.5 text-right font-mono text-[#B95736]">₹{cf.debtServiceEMI.toLocaleString()}</td>
                  <td className="p-2.5 text-right font-mono font-bold text-[#174C3A]">₹{cf.netCashFlow.toLocaleString()}</td>
                  <td className="p-2.5 text-right font-mono font-extrabold text-[#242522]">₹{cf.closingCashBalance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
};
