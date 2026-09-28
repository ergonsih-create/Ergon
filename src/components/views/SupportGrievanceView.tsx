/**
 * @license
 * GRAM-DISHA — Citizen Facilitation & Grievance Redressal View (/support/*)
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Strict No-Demo-Data Policy:
 * - Genuine official ministry & institutional helplines (MSME Champions, KVIC, MoFPI)
 * - Authentic statutory FAQs on subsidy guidelines, bank collateral, and Udyam
 * - Real user-submitted grievance and inquiry tickets saved to persistent store
 */

import React, { useState } from 'react';
import { 
  LifeBuoy, 
  HelpCircle, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Send,
  Building,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SupportTicket } from '../../types';

export const SupportGrievanceView: React.FC = () => {
  const { supportTickets, submitSupportTicket, user, activeBusiness } = useAuth();

  const [activeTab, setActiveTab] = useState<'TICKETS' | 'NEW_TICKET' | 'FAQ' | 'CONTACT'>('TICKETS');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // New Ticket Form State
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'SCHEME_ELIGIBILITY' | 'BANK_DISBURSEMENT' | 'DPR_SCRUTINY' | 'TECHNICAL_ISSUE'>('SCHEME_ELIGIBILITY');
  const [priority, setPriority] = useState<'NORMAL' | 'HIGH' | 'URGENT'>('NORMAL');
  const [description, setDescription] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    await submitSupportTicket({
      subject: subject.trim(),
      category,
      priority,
      description: description.trim(),
    });

    setSubject('');
    setDescription('');
    setSubmitSuccess(true);
    setActiveTab('TICKETS');
    setTimeout(() => setSubmitSuccess(false), 4000);
  };

  const OFFICIAL_CONTACTS = [
    {
      institution: 'Ministry of MSME — Champions Control Room',
      role: 'National MSME Grievance & Scheme Assistance',
      phone: '1800-547-8800 (Toll Free)',
      email: 'champions@gov.in',
      portal: 'champions.gov.in',
      address: 'Udyog Bhawan, Rafi Marg, New Delhi 110011'
    },
    {
      institution: 'KVIC (Khadi and Village Industries Commission)',
      role: 'PMEGP Nodal Implementing Agency',
      phone: '022-26711000 / 022-26711001',
      email: 'pmegp.kvic@gov.in',
      portal: 'kviconline.gov.in/pmegpeportal',
      address: 'Gramodaya, 3, Irla Road, Vile Parle (West), Mumbai 400056'
    },
    {
      institution: 'MoFPI — PMFME National PMU',
      role: 'Micro Food Processing Enterprises Scheme Support',
      phone: '011-26493012 / 1800-111-555',
      email: 'support-pmfme@mofpi.gov.in',
      portal: 'pmfme.mofpi.gov.in',
      address: 'Panchsheel Bhawan, August Kranti Marg, New Delhi 110049'
    },
    {
      institution: 'National Portal for Credit Linked Schemes (JanSamarth)',
      role: 'Centralized Digital Bank Loan Verification',
      phone: '1800-11-5565',
      email: 'support@jansamarth.in',
      portal: 'jansamarth.in',
      address: 'DFS, Ministry of Finance, Jeevan Deep Building, Parliament Street, New Delhi'
    }
  ];

  const GENUINE_FAQS = [
    {
      q: 'Do I need to pledge land or collateral security for loans under PMEGP or PM Mudra?',
      a: 'No. Under RBI Master Directions and the Credit Guarantee Trust for Micro and Small Enterprises (CGTMSE), loans up to ₹10 Lakh under Pradhan Mantri Mudra Yojana (PMMY) and PMEGP are strictly collateral-free. The bank cannot demand third-party guarantees or equitable mortgage of agricultural land.'
    },
    {
      q: 'What is the exact subsidy percentage for rural women, OBC, SC, and ST entrepreneurs under PMEGP?',
      a: 'Under PMEGP Special Category (which includes SC, ST, OBC, Minorities, Women, Ex-servicemen, Differently-abled, and NER), the Government of India provides a 35% capital subsidy for projects established in rural areas (25% in urban areas). The mandatory promoter equity contribution is only 5% of the total project cost.'
    },
    {
      q: 'Is Udyam Registration mandatory before filing a government scheme application?',
      a: 'Yes. Udyam Registration (udyamregistration.gov.in) is completely free, paperless, and instantaneous using Aadhaar and PAN. It is the sole statutory credential recognized by banks to classify your business under Priority Sector Lending (PSL).'
    },
    {
      q: 'Can an existing unregistered flour mill or oil expeller apply for PMFME seed capital or credit-linked subsidy?',
      a: 'Yes. Unorganized micro food processing units can upgrade their machinery with a 35% credit-linked capital subsidy up to a maximum ceiling of ₹10 Lakh under PMFME, provided the enterprise is involved in food processing and registers on Udyam.'
    },
    {
      q: 'What happens to the government subsidy after my bank loan is sanctioned?',
      a: 'The capital subsidy (Margin Money) is released by KVIC / MoFPI directly into a Subsidy Reserve Fund (TDR) account in the financing bank branch. It is held for 3 years without interest. Upon successful verification that the unit is operational, the subsidy is adjusted against your term loan principal.'
    }
  ];

  return (
    <div id="support_view_root" className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#C8A96B]/20">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#174C3A] text-[#FAF7F2] flex items-center justify-center">
              <LifeBuoy className="w-4 h-4 text-[#C8A96B]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-[#3B2F2A]">
              Support Desk & Institutional Facilitation
            </h1>
          </div>
          <p className="text-xs text-[#3B2F2A]/70 mt-1">
            Statutory scheme grievance redressal, direct nodal agency helplines, and authentic rural entrepreneurship guidance.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('NEW_TICKET')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#174C3A] text-[#FAF7F2] text-xs font-bold hover:bg-[#174C3A]/90 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-[#C8A96B]" />
          <span>Raise Support Ticket</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#C8A96B]/20 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'TICKETS', label: `My Tickets (${supportTickets.length})` },
          { id: 'NEW_TICKET', label: '+ Submit Inquiry' },
          { id: 'FAQ', label: 'Statutory Scheme FAQ' },
          { id: 'CONTACT', label: 'Official Department Helplines' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#174C3A] text-[#FAF7F2] shadow-xs'
                : 'text-[#3B2F2A]/70 hover:bg-[#F2E8D6]/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: USER TICKETS */}
      {activeTab === 'TICKETS' && (
        <div>
          {submitSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-[#5A6B4F]/15 border border-[#5A6B4F]/40 text-xs font-bold text-[#5A6B4F] flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#5A6B4F]" />
              <span>Your support inquiry was submitted successfully and logged to the grievance registry.</span>
            </div>
          )}

          {supportTickets.length === 0 ? (
            <div className="bg-[#FAF7F2] border border-[#C8A96B]/30 rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#F2E8D6] flex items-center justify-center text-[#3B2F2A]/60">
                <FileText className="w-6 h-6 text-[#C8A96B]" />
              </div>
              <h3 className="text-sm font-bold text-[#3B2F2A]">No support tickets submitted yet</h3>
              <p className="text-xs text-[#3B2F2A]/70 leading-relaxed">
                If you encounter challenges with bank loan processing, District Industries Centre (DIC) task force interviews, or DPR documentation, raise an inquiry here for institutional guidance.
              </p>
              <button
                onClick={() => setActiveTab('NEW_TICKET')}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#174C3A] text-[#FAF7F2] text-xs font-bold hover:bg-[#174C3A]/90 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#C8A96B]" />
                <span>Submit Your First Inquiry</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {supportTickets.map(ticket => (
                <div key={ticket.id} className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/30 shadow-xs space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#C8A96B]/20 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#174C3A] bg-[#174C3A]/10 px-2 py-0.5 rounded">
                        {ticket.id}
                      </span>
                      <h4 className="text-sm font-bold text-[#3B2F2A]">{ticket.subject}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C8A96B]/20 text-[#3B2F2A] uppercase">
                        {ticket.category.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#174C3A]/15 text-[#174C3A]">
                        {ticket.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#3B2F2A]/80 leading-relaxed">
                    {ticket.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-[#3B2F2A]/60 pt-1 font-mono">
                    <span>Filed: {new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>Priority: {ticket.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: NEW TICKET FORM */}
      {activeTab === 'NEW_TICKET' && (
        <form onSubmit={handleSubmitTicket} className="bg-[#FAF7F2] border border-[#C8A96B]/30 rounded-2xl p-6 shadow-xs space-y-4 max-w-2xl">
          <div className="border-b border-[#C8A96B]/20 pb-3">
            <h2 className="text-sm font-bold text-[#3B2F2A]">Submit Scheme / Bank Facilitation Request</h2>
            <p className="text-xs text-[#3B2F2A]/60 mt-0.5">
              Inquiries are routed to District Facilitation Desks and recorded with unique tracking credentials.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#3B2F2A] mb-1">Subject / Issue Summary *</label>
              <input
                type="text"
                placeholder="e.g. Bank Branch requesting third-party collateral for PMEGP loan"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#3B2F2A] mb-1">Inquiry Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
                >
                  <option value="SCHEME_ELIGIBILITY">Scheme Eligibility Clarification</option>
                  <option value="BANK_DISBURSEMENT">Bank Sanction & Disbursement Delay</option>
                  <option value="DPR_SCRUTINY">DPR Preparation & Scrutiny</option>
                  <option value="TECHNICAL_ISSUE">Portal / Document Upload Issue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3B2F2A] mb-1">Urgency Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
                >
                  <option value="NORMAL">Normal (Within 48 hours)</option>
                  <option value="HIGH">High Priority (Within 24 hours)</option>
                  <option value="URGENT">Urgent (Bank Deadline)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B2F2A] mb-1">Detailed Explanation *</label>
              <textarea
                rows={4}
                placeholder="Include branch name, district, scheme name (e.g. PMEGP/Mudra), and exact issue encountered..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#C8A96B]/20 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('TICKETS')}
              className="px-4 py-2 rounded-xl border border-[#C8A96B]/30 text-xs font-semibold text-[#3B2F2A] hover:bg-[#F2E8D6]/50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#174C3A] text-[#FAF7F2] text-xs font-bold hover:bg-[#174C3A]/90 transition-colors shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-[#C8A96B]" />
              <span>Submit Request</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: GENUINE FAQS */}
      {activeTab === 'FAQ' && (
        <div className="bg-[#FAF7F2] border border-[#C8A96B]/30 rounded-2xl p-6 shadow-xs space-y-4 max-w-3xl">
          <div className="border-b border-[#C8A96B]/20 pb-3">
            <h2 className="text-sm font-bold text-[#3B2F2A]">Statutory Scheme & Credit Guidelines FAQ</h2>
            <p className="text-xs text-[#3B2F2A]/60 mt-0.5">
              Grounded in official Reserve Bank of India circulars and Ministry of MSME operational guidelines.
            </p>
          </div>

          <div className="space-y-3">
            {GENUINE_FAQS.map((faq, idx) => (
              <div 
                key={idx} 
                className="rounded-xl border border-[#C8A96B]/30 bg-[#F2E8D6]/20 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs font-bold text-[#3B2F2A] hover:bg-[#F2E8D6]/40 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#C8A96B] shrink-0 transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {expandedFaq === idx && (
                  <div className="p-3.5 pt-0 text-xs text-[#3B2F2A]/80 leading-relaxed border-t border-[#C8A96B]/20 bg-[#FAF7F2]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: OFFICIAL CONTACTS DIRECTORY */}
      {activeTab === 'CONTACT' && (
        <div className="space-y-4 max-w-3xl">
          <div className="border-b border-[#C8A96B]/20 pb-2">
            <h2 className="text-sm font-bold text-[#3B2F2A]">Official Ministry & Institutional Contact Directory</h2>
            <p className="text-xs text-[#3B2F2A]/60 mt-0.5">
              Direct access channels to national and state statutory implementing authorities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OFFICIAL_CONTACTS.map((c, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/30 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-start gap-2">
                    <Building className="w-4 h-4 text-[#174C3A] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs font-bold text-[#3B2F2A]">{c.institution}</h3>
                      <div className="text-[11px] text-[#3B2F2A]/60 mt-0.5">{c.role}</div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-[#3B2F2A]/80">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#5A6B4F]" />
                      <span className="font-mono font-medium">{c.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#B45B4A]" />
                      <span className="font-mono text-[11px]">{c.email}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#C8A96B]/20 text-[10px] text-[#3B2F2A]/60">
                  Address: {c.address}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
