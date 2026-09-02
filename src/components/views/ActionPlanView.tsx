import React, { useState } from 'react';
import { CheckSquare, ArrowRight, Clock, FileCheck, Landmark, ShieldCheck, Sparkles } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useDisha } from '../../context/DishaContext';

export const ActionPlanView: React.FC = () => {
  const { openAdvisorWithInsight } = useDisha();

  const [milestones, setMilestones] = useState([
    { id: 1, title: 'Udyam MSME Registration (Online)', status: 'COMPLETED', timeframe: 'Day 1–3', authority: 'Ministry of MSME' },
    { id: 2, title: 'Chartered DPR Preparation & Financial Ratios', status: 'IN_PROGRESS', timeframe: 'Day 4–7', authority: 'Empaneled CA / Self' },
    { id: 3, title: 'PMEGP e-Portal Application Submission', status: 'PENDING', timeframe: 'Day 8–10', authority: 'KVIC / DIC Sehore' },
    { id: 4, title: 'Bank Branch Appraisal & In-Principle Sanction', status: 'PENDING', timeframe: 'Day 11–25', authority: 'Lead Bank (SBI Ashta)' },
    { id: 5, title: 'Equipment Procurement & Installation', status: 'PENDING', timeframe: 'Day 26–40', authority: 'Verified Machinery Vendors' },
  ]);

  const handleToggle = (id: number) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          status: m.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED',
        };
      }
      return m;
    }));
  };

  const handleExplainAction = () => {
    openAdvisorWithInsight(
      'Action Execution Status: 1 of 5 critical milestones completed. Your immediate priority is finalizing the Detailed Project Report (DPR) with DSCR matching bank criteria.',
      ['Ensure Aadhaar is linked with active bank account for direct benefit subsidy transfer.'],
      'Review document guidance checklist to avoid bank appraisal rejections.'
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#242522]">
            Action Plan & Execution Roadmap
          </h1>
          <p className="text-xs text-[#68655D] mt-0.5">
            Step 6 of Decision Pipeline: Structured operational milestones and institutional escalation guidance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="verified" size="md">5 Sequenced Milestones</Badge>
          <Button variant="secondary" size="sm" onClick={handleExplainAction} leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#C69A45]" />}>
            Explain with DISHA
          </Button>
        </div>
      </div>

      <Card title="Execution Milestones" subtitle="Track regulatory, banking, and physical setup progress">
        <div className="space-y-3">
          {milestones.map((m) => {
            const isDone = m.status === 'COMPLETED';
            return (
              <div
                key={m.id}
                onClick={() => handleToggle(m.id)}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${
                  isDone
                    ? 'bg-[#174C3A]/5 border-[#174C3A]/25 text-[#174C3A]'
                    : 'bg-[#FCFAF5] border-[#D9D3C7] text-[#242522] hover:border-[#174C3A]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isDone ? 'bg-[#174C3A] text-[#FCFAF5]' : 'bg-[#D9D3C7]/40 text-[#68655D]'
                  }`}>
                    {isDone ? '✓' : m.id}
                  </div>
                  <div>
                    <h4 className={`text-sm font-semibold ${isDone ? 'line-through text-[#68655D]' : 'text-[#242522]'}`}>
                      {m.title}
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] text-[#68655D] mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#B95736]" /> {m.timeframe}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Landmark className="w-3 h-3 text-[#174C3A]" /> {m.authority}
                      </span>
                    </div>
                  </div>
                </div>

                <Badge variant={isDone ? 'verified' : 'sage'} size="sm">
                  {m.status.replace('_', ' ')}
                </Badge>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
