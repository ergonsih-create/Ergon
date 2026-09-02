/**
 * @license
 * GRAM-DISHA — Document Readiness & DigiLocker Checklist View
 */

import React, { useState } from 'react';
import { 
  FileCheck2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Upload, 
  ShieldCheck, 
  FileText,
  ExternalLink,
  Lock,
  Sparkles
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useDisha } from '../../context/DishaContext';

interface DocumentItem {
  id: string;
  name: string;
  category: 'IDENTITY' | 'LEGAL' | 'FINANCIAL' | 'TECHNICAL';
  issuingAuthority: string;
  status: 'VERIFIED' | 'DIGILOCKER_SYNCED' | 'PENDING' | 'OPTIONAL';
  requiredFor: string[];
}

export const DocumentsView: React.FC = () => {
  const { openAdvisorWithInsight } = useDisha();

  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'doc_1',
      name: 'Aadhaar Card (UIDAI Verified)',
      category: 'IDENTITY',
      issuingAuthority: 'UIDAI',
      status: 'VERIFIED',
      requiredFor: ['PMEGP', 'MUDRA', 'PMFME', 'Udyam']
    },
    {
      id: 'doc_2',
      name: 'PAN Card (Income Tax Department)',
      category: 'IDENTITY',
      issuingAuthority: 'NSDL / UTIITSL',
      status: 'VERIFIED',
      requiredFor: ['PMEGP', 'MUDRA', 'Current Bank Account']
    },
    {
      id: 'doc_3',
      name: 'Caste / Community Certificate (OBC)',
      category: 'IDENTITY',
      issuingAuthority: 'Sub-Divisional Officer (Revenue)',
      status: 'VERIFIED',
      requiredFor: ['PMEGP 35% Special Subsidy', 'NSFDC']
    },
    {
      id: 'doc_4',
      name: 'Rural Area Certificate (Gram Panchayat NOC)',
      category: 'LEGAL',
      issuingAuthority: 'Gram Panchayat Sarpanch / Gram Sevak',
      status: 'VERIFIED',
      requiredFor: ['PMEGP Rural Classification']
    },
    {
      id: 'doc_5',
      name: 'Bankable Detailed Project Report (DPR)',
      category: 'TECHNICAL',
      issuingAuthority: 'GRAM-DISHA Deterministic Engine',
      status: 'DIGILOCKER_SYNCED',
      requiredFor: ['Bank Credit Appraisal', 'DIC Scrutiny']
    },
    {
      id: 'doc_6',
      name: 'Machinery Quotation & Proforma Invoice',
      category: 'TECHNICAL',
      issuingAuthority: 'Authorized Equipment Vendor (GST Registered)',
      status: 'PENDING',
      requiredFor: ['Term Loan Sanction', 'PMEGP Subsidy Claim']
    },
    {
      id: 'doc_7',
      name: 'Udyam MSME Registration Certificate',
      category: 'LEGAL',
      issuingAuthority: 'Ministry of MSME',
      status: 'PENDING',
      requiredFor: ['Priority Sector Lending', 'PMFME']
    },
    {
      id: 'doc_8',
      name: 'FSSAI Food Safety Basic Registration',
      category: 'LEGAL',
      issuingAuthority: 'Food Safety and Standards Authority of India',
      status: 'PENDING',
      requiredFor: ['Agro Processing', 'Retail Packaging']
    }
  ]);

  const verifiedCount = documents.filter(d => d.status === 'VERIFIED' || d.status === 'DIGILOCKER_SYNCED').length;
  const totalCount = documents.length;
  const readinessPercent = Math.round((verifiedCount / totalCount) * 100);

  const handleToggleStatus = (id: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === id) {
        const nextStatus = doc.status === 'PENDING' ? 'VERIFIED' : 'PENDING';
        return { ...doc, status: nextStatus };
      }
      return doc;
    }));
  };

  return (
    <div id="documents_view" className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D9D3C7]/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-[#242522]">
            Statutory Document Readiness & DigiLocker Vault
          </h1>
          <p className="text-xs text-[#68655D] mt-0.5">
            Checklist of mandatory certificates, NOCs, and invoices required for DIC scrutiny and bank loan sanction.
          </p>
        </div>
        <Badge variant={readinessPercent >= 75 ? 'forest' : 'harvest'} size="md">
          {verifiedCount} / {totalCount} Documents Ready ({readinessPercent}%)
        </Badge>
      </div>

      {/* DigiLocker Sync Banner */}
      <div className="p-5 rounded-3xl bg-[#174C3A] text-[#FCFAF5] flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FCFAF5]/10 text-[#C69A45] flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base">DigiLocker Direct Verification</span>
              <Badge variant="harvest" size="sm">National e-Governance</Badge>
            </div>
            <p className="text-xs text-[#FCFAF5]/80 mt-0.5">
              Securely fetch Aadhaar, PAN, and Caste certificates directly from issuing authorities without physical paper scanning.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="bg-[#FCFAF5]/10 hover:bg-[#FCFAF5]/20 text-[#FCFAF5] border-[#FCFAF5]/40 text-xs shrink-0"
          onClick={() => openAdvisorWithInsight(
            'DigiLocker synchronization verified Aadhaar and PAN credentials against UIDAI and Income Tax registers.',
            [],
            'Upload the machinery vendor proforma invoice to achieve 100% document readiness.'
          )}
        >
          Sync with DigiLocker
        </Button>
      </div>

      {/* Documents Table */}
      <Card title="Mandatory Document Checklist" subtitle="Categorized according to banking compliance standards">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8F5EE] text-[#242522] font-semibold border-b border-[#D9D3C7]">
              <tr>
                <th className="p-3">Document Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Issuing Authority</th>
                <th className="p-3">Required For</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9D3C7]/60">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#F8F5EE]/60 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-[#242522]">{doc.name}</div>
                  </td>
                  <td className="p-3">
                    <Badge variant="neutral" size="sm">{doc.category}</Badge>
                  </td>
                  <td className="p-3 text-[#68655D] font-medium">
                    {doc.issuingAuthority}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {doc.requiredFor.map((rf, i) => (
                        <span key={i} className="text-[10px] bg-[#F8F5EE] border border-[#D9D3C7] px-1.5 py-0.5 rounded text-[#242522]">
                          {rf}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    {doc.status === 'VERIFIED' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    )}
                    {doc.status === 'DIGILOCKER_SYNCED' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Auto-Generated
                      </span>
                    )}
                    {doc.status === 'PENDING' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                        <Clock className="w-3 h-3" /> Pending Upload
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleToggleStatus(doc.id)}
                      className="text-xs font-semibold text-[#174C3A] hover:text-[#B95736] underline cursor-pointer"
                    >
                      {doc.status === 'PENDING' ? 'Mark Ready' : 'Change'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
};
