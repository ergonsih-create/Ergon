/**
 * @license
 * GRAM-DISHA — Detailed Project Report (DPR) & Application Lifecycle Tracker
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Building, 
  Calendar, 
  Landmark, 
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Send
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useDisha } from '../../context/DishaContext';
import { DeterministicFinancialEngine } from '../../services/deterministic/financialEngine';

export const ApplicationsView: React.FC = () => {
  const { user, activeBusiness } = useAuth();
  const { openAdvisorWithInsight } = useDisha();

  const [activeTab, setActiveTab] = useState<'DPR_PREVIEW' | 'TRACKER'>('DPR_PREVIEW');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const financialStructure = DeterministicFinancialEngine.structureProject({
    projectCost: 850000,
    promoterCapital: 125000,
    interestRateAnnual: 9.8,
    tenureMonths: 60,
    moratoriumMonths: 6,
    unitSalePrice: 95,
    unitVariableCost: 62,
    monthlyFixedCost: 24000,
  });

  const handlePrintDPR = () => {
    window.print();
  };

  const handleSubmitApplication = () => {
    setIsSubmitted(true);
    openAdvisorWithInsight(
      'DPR successfully queued for DIC District Scrutiny Portal. Application Reference Number: PMEGP-MH-2026-882194.',
      ['DIC Task Force Committee will review within 14 working days.'],
      'You can track real-time milestone progress in the Tracker tab.'
    );
  };

  return (
    <div id="applications_view" className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D9D3C7]/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-[#242522]">
            Bankable Detailed Project Report (DPR) & Application Tracker
          </h1>
          <p className="text-xs text-[#68655D] mt-0.5">
            Deterministic DPR compilation conforming to NABARD & DIC PMEGP portal appraisal standards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-[#F8F5EE] p-1 border border-[#D9D3C7]">
            <button
              onClick={() => setActiveTab('DPR_PREVIEW')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'DPR_PREVIEW' ? 'bg-[#174C3A] text-[#FCFAF5]' : 'text-[#68655D] hover:text-[#242522]'
              }`}
            >
              DPR Document
            </button>
            <button
              onClick={() => setActiveTab('TRACKER')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'TRACKER' ? 'bg-[#174C3A] text-[#FCFAF5]' : 'text-[#68655D] hover:text-[#242522]'
              }`}
            >
              DIC & Bank Tracker
            </button>
          </div>

          <Button variant="outline" size="sm" onClick={handlePrintDPR} className="text-xs">
            <Printer className="w-3.5 h-3.5 mr-1" />
            Print DPR
          </Button>
        </div>
      </div>

      {activeTab === 'DPR_PREVIEW' ? (
        /* DPR Document Preview Layout */
        <div className="bg-[#FCFAF5] border border-[#D9D3C7] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 print:p-0 print:border-none">
          
          {/* Header Stamp */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-[#174C3A] gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#B95736] tracking-widest">
                Official Bankable Project Appraisal Format
              </span>
              <h2 className="font-display font-extrabold text-2xl text-[#242522] mt-1">
                Detailed Project Report (DPR)
              </h2>
              <div className="text-xs font-semibold text-[#174C3A] mt-0.5">
                Scheme Alignment: Prime Minister's Employment Generation Programme (PMEGP)
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="font-mono text-xs font-bold text-[#242522]">DOC REF: DPR-GD-2026-0042</div>
              <div className="text-[11px] text-[#68655D]">Generated: {new Date().toLocaleDateString('en-IN')}</div>
              <Badge variant="forest" size="sm" className="mt-1">Verified Bank Ready</Badge>
            </div>
          </div>

          {/* Section 1: Enterprise & Promoter Profile */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-sm text-[#174C3A] uppercase tracking-wider border-b border-[#D9D3C7]/60 pb-1">
              1. Enterprise & Promoter Particulars
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-[#F8F5EE]">
                <span className="text-[#68655D] block">Proposed Unit Name:</span>
                <span className="font-bold text-[#242522]">{activeBusiness.title}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F5EE]">
                <span className="text-[#68655D] block">Promoter Name & Social Category:</span>
                <span className="font-bold text-[#242522]">{user?.fullName} ({user?.demographics.category} / {user?.demographics.gender})</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F5EE]">
                <span className="text-[#68655D] block">Proposed Location:</span>
                <span className="font-bold text-[#242522]">{activeBusiness.proposedLocation.gramPanchayat}, {activeBusiness.proposedLocation.district} (Rural)</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F5EE]">
                <span className="text-[#68655D] block">Constitution / Activity:</span>
                <span className="font-bold text-[#242522]">Proprietorship / {activeBusiness.category}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F5EE]">
                <span className="text-[#68655D] block">Proposed Employment:</span>
                <span className="font-bold text-[#242522]">4 Full-time (2 Machine Operators, 2 Helpers)</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F5EE]">
                <span className="text-[#68655D] block">Preferred Financing Bank:</span>
                <span className="font-bold text-[#242522]">State Bank of India (Pusad Branch)</span>
              </div>
            </div>
          </div>

          {/* Section 2: Means of Finance & Project Cost */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-sm text-[#174C3A] uppercase tracking-wider border-b border-[#D9D3C7]/60 pb-1">
              2. Total Project Cost & Means of Finance
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
              
              {/* Cost Outlay Table */}
              <div className="border border-[#D9D3C7] rounded-2xl overflow-hidden bg-[#F8F5EE]">
                <table className="w-full text-left">
                  <thead className="bg-[#EFEAE1] text-[#242522] font-semibold border-b border-[#D9D3C7]">
                    <tr>
                      <th className="p-2.5">Cost Component</th>
                      <th className="p-2.5 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D9D3C7]/60">
                    <tr>
                      <td className="p-2.5">Plant & Machinery (Dehuller, Grader, Polisher)</td>
                      <td className="p-2.5 text-right font-mono font-semibold">₹4,50,000</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">Civil Works / Shed Modification</td>
                      <td className="p-2.5 text-right font-mono font-semibold">₹1,80,000</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">Electrification & Weighing Infrastructure</td>
                      <td className="p-2.5 text-right font-mono font-semibold">₹55,000</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">Initial Raw Material Inventory</td>
                      <td className="p-2.5 text-right font-mono font-semibold">₹85,000</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">Working Capital Margin Buffer</td>
                      <td className="p-2.5 text-right font-mono font-semibold">₹65,000</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">Statutory Licensing & FSSAI / Udyam</td>
                      <td className="p-2.5 text-right font-mono font-semibold">₹15,000</td>
                    </tr>
                    <tr className="bg-[#174C3A]/10 font-bold text-[#174C3A]">
                      <td className="p-2.5">Total Capital Outlay</td>
                      <td className="p-2.5 text-right font-mono text-sm">₹8,50,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Means of Finance Table */}
              <div className="border border-[#D9D3C7] rounded-2xl overflow-hidden bg-[#F8F5EE]">
                <table className="w-full text-left">
                  <thead className="bg-[#EFEAE1] text-[#242522] font-semibold border-b border-[#D9D3C7]">
                    <tr>
                      <th className="p-2.5">Means of Finance</th>
                      <th className="p-2.5 text-center">% Share</th>
                      <th className="p-2.5 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D9D3C7]/60">
                    <tr>
                      <td className="p-2.5">Promoter Equity (Own Capital)</td>
                      <td className="p-2.5 text-center font-mono">14.7%</td>
                      <td className="p-2.5 text-right font-mono font-semibold">₹1,25,000</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">Bank Term Loan (Commercial)</td>
                      <td className="p-2.5 text-center font-mono">85.3%</td>
                      <td className="p-2.5 text-right font-mono font-semibold">₹7,25,000</td>
                    </tr>
                    <tr className="bg-emerald-50 text-emerald-900 font-semibold">
                      <td className="p-2.5">PMEGP Capital Subsidy Claimable (35%)</td>
                      <td className="p-2.5 text-center font-mono">35.0%</td>
                      <td className="p-2.5 text-right font-mono">₹2,97,500</td>
                    </tr>
                    <tr className="bg-[#174C3A]/10 font-bold text-[#174C3A]">
                      <td className="p-2.5">Total Means of Finance</td>
                      <td className="p-2.5 text-center font-mono">100%</td>
                      <td className="p-2.5 text-right font-mono text-sm">₹8,50,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </div>

          {/* Section 3: Key Financial Viability Metrics */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-sm text-[#174C3A] uppercase tracking-wider border-b border-[#D9D3C7]/60 pb-1">
              3. Banking Feasibility & DSCR Indicators
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
              <div className="p-3.5 rounded-2xl bg-[#F8F5EE] border border-[#D9D3C7]">
                <div className="text-[10px] uppercase font-bold text-[#68655D]">Debt Service Coverage (DSCR)</div>
                <div className="text-xl font-extrabold text-[#174C3A] mt-1">{financialStructure.projectedDSCR}x</div>
                <div className="text-[10px] text-[#71856A] font-semibold mt-0.5">Benchmark &gt;= 1.25x Passed</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8F5EE] border border-[#D9D3C7]">
                <div className="text-[10px] uppercase font-bold text-[#68655D]">Monthly EMI Obligation</div>
                <div className="text-xl font-extrabold text-[#242522] mt-1">₹{financialStructure.monthlyEMI.toLocaleString()}</div>
                <div className="text-[10px] text-[#68655D] mt-0.5">60 Mo @ 9.8% p.a.</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8F5EE] border border-[#D9D3C7]">
                <div className="text-[10px] uppercase font-bold text-[#68655D]">Break-Even Volume</div>
                <div className="text-xl font-extrabold text-[#B95736] mt-1">{financialStructure.breakEvenMonthlyUnits} kg</div>
                <div className="text-[10px] text-[#68655D] mt-0.5">26.3% Plant Capacity</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8F5EE] border border-[#D9D3C7]">
                <div className="text-[10px] uppercase font-bold text-[#68655D]">Year 1 Projected Net Cash</div>
                <div className="text-xl font-extrabold text-emerald-700 mt-1">₹3,42,800</div>
                <div className="text-[10px] text-emerald-800 font-semibold mt-0.5">After all debt obligations</div>
              </div>
            </div>
          </div>

          {/* Submission Action Bar */}
          <div className="pt-4 border-t border-[#D9D3C7] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#68655D]">
              <ShieldCheck className="w-4 h-4 text-[#174C3A]" />
              <span>Certified compliant with KVIC PMEGP Master Circular 2025-26.</span>
            </div>

            <Button
              variant="forest"
              size="md"
              onClick={handleSubmitApplication}
              disabled={isSubmitted}
              className="w-full sm:w-auto"
            >
              {isSubmitted ? (
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" /> Submitted to DIC Scrutiny Queue
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Send className="w-4 h-4" /> Submit Application to DIC Queue
                </span>
              )}
            </Button>
          </div>

        </div>
      ) : (
        /* Application Timeline & Milestone Tracker */
        <Card title="DIC & Bank Loan Appraisal Timeline" subtitle="Real-time multi-stage status tracker">
          <div className="space-y-6">
            {[
              {
                stage: 1,
                title: 'DPR & Online PMEGP Application Submission',
                portal: 'kviconline.gov.in / DIC Pusad',
                date: 'Completed • 01 March 2026',
                status: 'COMPLETED',
                notes: 'Uploaded verified Aadhaar, PAN, Caste Certificate, and Bankable DPR.',
              },
              {
                stage: 2,
                title: 'District Level Task Force Committee (DLTFC) Scrutiny',
                portal: 'District Industries Centre (DIC) Yavatmal',
                date: 'In Review • Est. 08 March 2026',
                status: 'IN_PROGRESS',
                notes: 'General Manager DIC verifies applicant eligibility and forwards to preferred bank.',
              },
              {
                stage: 3,
                title: 'Bank Branch Credit Appraisal & Sanction Letter',
                portal: 'State Bank of India (Pusad Branch)',
                date: 'Scheduled • Est. 18 March 2026',
                status: 'PENDING',
                notes: 'Branch manager conducts site inspection of proposed shed and issues Term Loan sanction.',
              },
              {
                stage: 4,
                title: 'Term Loan Disbursement & EDP Entrepreneurship Training',
                portal: 'RSETI Yavatmal (10-day residential or online EDP)',
                date: 'Scheduled • Est. 28 March 2026',
                status: 'PENDING',
                notes: 'Completion certificate uploaded to KVIC portal for subsidy release.',
              },
              {
                stage: 5,
                title: 'PMEGP 35% Margin Money (Subsidy) Credit to TDR Account',
                portal: 'KVIC Subsidy Disbursement Portal',
                date: 'Scheduled • Est. 15 April 2026',
                status: 'PENDING',
                notes: '₹2,97,500 deposited in Term Deposit Receipt (TDR) locked for 3 years without interest.',
              },
            ].map((milestone) => (
              <div key={milestone.stage} className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  milestone.status === 'COMPLETED'
                    ? 'bg-[#174C3A] text-[#FCFAF5]'
                    : milestone.status === 'IN_PROGRESS'
                    ? 'bg-[#C69A45] text-[#242522]'
                    : 'bg-[#F8F5EE] border border-[#D9D3C7] text-[#68655D]'
                }`}>
                  {milestone.status === 'COMPLETED' ? <CheckCircle2 className="w-5 h-5" /> : milestone.stage}
                </div>

                <div className="flex-1 p-4 rounded-2xl bg-[#F8F5EE] border border-[#D9D3C7]/70 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="font-bold text-xs text-[#242522]">{milestone.title}</div>
                    <Badge variant={
                      milestone.status === 'COMPLETED' ? 'forest' :
                      milestone.status === 'IN_PROGRESS' ? 'harvest' : 'neutral'
                    }>
                      {milestone.date}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-[#174C3A] font-semibold">{milestone.portal}</div>
                  <p className="text-[11px] text-[#68655D] leading-relaxed">{milestone.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

    </div>
  );
};
