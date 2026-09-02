import React from 'react';
import { BarChart2, TrendingUp, Package, ShieldCheck, AlertCircle } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { UnknownState } from '../common/UnknownState';

export const ProgressView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#242522]">
            Enterprise Progress & Operational Benchmarks
          </h1>
          <p className="text-xs text-[#68655D] mt-0.5">
            Step 7 of Decision Pipeline: Post-setup tracking, inventory planning, and grievance support.
          </p>
        </div>
        <Badge variant="verified" size="md">Milestone Audit Active</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Sales Target Tracking" subtitle="Monthly progress against break-even threshold">
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#68655D]">Target Revenue:</span>
              <span className="font-bold text-[#242522]">₹1,15,000 / mo</span>
            </div>
            <div className="w-full bg-[#D9D3C7]/40 h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#174C3A] h-full w-[68%]" />
            </div>
            <span className="text-[10px] text-[#174C3A] font-semibold block text-right">
              68% of capacity reached
            </span>
          </div>
        </Card>

        <Card title="Inventory Turnover Buffer" subtitle="Standard agro-commodity cycle">
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#68655D]">Raw Stock Holding:</span>
              <span className="font-bold text-[#242522]">18 Days</span>
            </div>
            <div className="w-full bg-[#D9D3C7]/40 h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#B78332] h-full w-[80%]" />
            </div>
            <span className="text-[10px] text-[#68655D] block text-right">
              Recommended: 15–20 Days Buffer
            </span>
          </div>
        </Card>

        <Card title="Grievance Redressal" subtitle="Institutional escalation desks">
          <div className="text-xs space-y-2">
            <p className="text-[#68655D] leading-relaxed text-[11px]">
              Direct contact channels for district industries centers and lead bank nodal officers.
            </p>
            <div className="p-2.5 rounded-lg bg-[#F8F5EE] border border-[#D9D3C7] font-semibold text-[#174C3A]">
              DIC Sehore Helpline: 07562-224412
            </div>
          </div>
        </Card>
      </div>

      <Card title="Operational Limitations & Unknowns" subtitle="Honest data logging">
        <UnknownState
          entityName="Daily Village Retail Footfall Variance"
          reason="No direct sensors installed in local market stalls."
          suggestedAction="Manual bi-weekly inventory audits recommended."
        />
      </Card>
    </div>
  );
};
