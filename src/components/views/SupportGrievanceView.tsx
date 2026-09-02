/**
 * @license
 * GRAM-DISHA — Grievance Redressal & Help Desk
 */

import React, { useState } from 'react';
import { 
  LifeBuoy, 
  Send, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Mail, 
  AlertCircle,
  HelpCircle,
  Building,
  ShieldCheck
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface GrievanceTicket {
  id: string;
  category: 'BANK_DISBURSEMENT' | 'DIC_SCRUTINY' | 'SUBSIDY_CLAIM' | 'TECHNICAL';
  subject: string;
  createdAt: string;
  status: 'OPEN' | 'IN_REVIEW' | 'RESOLVED';
  agency: string;
}

export const SupportGrievanceView: React.FC = () => {
  const [tickets, setTickets] = useState<GrievanceTicket[]>([
    {
      id: 'GRV-2026-091',
      category: 'BANK_DISBURSEMENT',
      subject: 'Inquiry regarding 6-month moratorium interest calculation schedule',
      createdAt: '2026-02-26',
      status: 'IN_REVIEW',
      agency: 'State Bank of India (Pusad Branch)'
    },
    {
      id: 'GRV-2026-042',
      category: 'DIC_SCRUTINY',
      subject: 'Correction in Rural Gram Panchayat classification code',
      createdAt: '2026-02-15',
      status: 'RESOLVED',
      agency: 'District Industries Centre (DIC) Yavatmal'
    }
  ]);

  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<GrievanceTicket['category']>('BANK_DISBURSEMENT');
  const [newAgency, setNewAgency] = useState('District Industries Centre (DIC)');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    const newTicket: GrievanceTicket = {
      id: `GRV-2026-${Math.floor(100 + Math.random() * 900)}`,
      category: newCategory,
      subject: newSubject,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'OPEN',
      agency: newAgency,
    };

    setTickets([newTicket, ...tickets]);
    setNewSubject('');
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  return (
    <div id="support_grievance_view" className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D9D3C7]/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-[#242522]">
            Grievance Redressal & Institutional Help Desk
          </h1>
          <p className="text-xs text-[#68655D] mt-0.5">
            Direct escalation bridge to DIC Yavatmal, Lead District Bank Officer, and KVIC portal nodal officers.
          </p>
        </div>
        <Badge variant="forest" size="md">Escalation TAT: 48 Hours</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Submit Grievance & Active Tickets */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* New Ticket Form */}
          <Card title="Register a Formal Grievance / Query" subtitle="Escalated directly to District MSME Facilitation Council">
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#242522] mb-1">Grievance Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#D9D3C7] text-[#242522] font-medium"
                  >
                    <option value="BANK_DISBURSEMENT">Bank Branch Delay / Loan Appraisal</option>
                    <option value="DIC_SCRUTINY">DIC Task Force Committee Delay</option>
                    <option value="SUBSIDY_CLAIM">PMEGP Margin Money Subsidy TDR Credit</option>
                    <option value="TECHNICAL">Portal Upload / Document Verification</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#242522] mb-1">Target Authority</label>
                  <select
                    value={newAgency}
                    onChange={(e) => setNewAgency(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#D9D3C7] text-[#242522] font-medium"
                  >
                    <option value="District Industries Centre (DIC) Yavatmal">District Industries Centre (DIC)</option>
                    <option value="Lead District Bank Officer (LDO)">Lead District Bank Officer (LDO)</option>
                    <option value="KVIC State Nodal Office (Mumbai)">KVIC State Nodal Office</option>
                    <option value="FSSAI District Food Safety Officer">FSSAI District Office</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#242522] mb-1">Issue Summary / Description</label>
                <textarea
                  rows={3}
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Describe your issue with application reference number if available..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#D9D3C7] text-[#242522] font-medium focus:ring-1 focus:ring-[#174C3A]"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                {isSubmitted && (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Ticket Registered Successfully!
                  </span>
                )}
                <Button variant="forest" size="sm" type="submit" className="ml-auto text-xs">
                  <Send className="w-3.5 h-3.5 mr-1" />
                  Submit Grievance
                </Button>
              </div>
            </form>
          </Card>

          {/* Active Grievances Table */}
          <Card title="Grievance History & Tracking" subtitle="Real-time status updates from nodal officers">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F8F5EE] text-[#242522] font-semibold border-b border-[#D9D3C7]">
                  <tr>
                    <th className="p-3">Ticket ID</th>
                    <th className="p-3">Authority</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9D3C7]/60">
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-[#F8F5EE]/60 transition-colors">
                      <td className="p-3 font-mono font-bold text-[#174C3A]">{t.id}</td>
                      <td className="p-3 text-[#242522] font-semibold">{t.agency}</td>
                      <td className="p-3 text-[#68655D]">{t.subject}</td>
                      <td className="p-3 font-mono text-[#68655D]">{t.createdAt}</td>
                      <td className="p-3 text-center">
                        <Badge variant={t.status === 'RESOLVED' ? 'forest' : t.status === 'IN_REVIEW' ? 'harvest' : 'terracotta'} size="sm">
                          {t.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

        </div>

        {/* Right 1 Col: Direct Official Contact Numbers */}
        <div className="space-y-4">
          <Card title="Nodal Helpline Directory" subtitle="Direct verified government contacts">
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#F8F5EE] border border-[#D9D3C7] space-y-1">
                <div className="font-bold text-[#242522]">DIC Yavatmal Helpline</div>
                <div className="text-[11px] text-[#68655D]">General Manager, District Industries Centre</div>
                <div className="flex items-center gap-1.5 text-[#174C3A] font-mono font-bold mt-1">
                  <Phone className="w-3.5 h-3.5" /> 07232-242190
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8F5EE] border border-[#D9D3C7] space-y-1">
                <div className="font-bold text-[#242522]">KVIC National PMEGP Portal Support</div>
                <div className="text-[11px] text-[#68655D]">Toll Free Beneficiary Grievance Cell</div>
                <div className="flex items-center gap-1.5 text-[#174C3A] font-mono font-bold mt-1">
                  <Phone className="w-3.5 h-3.5" /> 1800-3000-0034
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8F5EE] border border-[#D9D3C7] space-y-1">
                <div className="font-bold text-[#242522]">Lead Bank Office (SBI Yavatmal)</div>
                <div className="text-[11px] text-[#68655D]">Credit Appraisal Escalation Desk</div>
                <div className="flex items-center gap-1.5 text-[#174C3A] font-mono font-bold mt-1">
                  <Mail className="w-3.5 h-3.5" /> ldo.yavatmal@sbi.co.in
                </div>
              </div>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};
