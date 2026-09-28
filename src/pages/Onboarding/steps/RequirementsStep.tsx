/**
 * @license
 * GRAM-DISHA — Onboarding Step 4: Operational & Resource Requirements
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Truth-First Requirements Assessment incorporating the UNKNOWN Principle.
 */

import React, { useState } from 'react';
import { 
  Building2, 
  Zap, 
  Droplets, 
  Truck, 
  Wrench, 
  FileCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { UnknownBadge } from '../../../components/ui/UnknownBadge';

interface RequirementsStepProps {
  initialRequirements?: string[];
  onChange: (requirements: {
    landStatus: string;
    powerStatus: string;
    waterStatus: string;
    machineryStatus: string;
    rawMaterialStatus: string;
    statutoryDocsReady: string[];
    unknownFactors: string[];
  }) => void;
  onNext: () => void;
  onBack: () => void;
}

export const RequirementsStep: React.FC<RequirementsStepProps> = ({
  onChange,
  onNext,
  onBack,
}) => {
  const [landStatus, setLandStatus] = useState<'OWNED' | 'LEASED' | 'NEEDED'>('OWNED');
  const [powerStatus, setPowerStatus] = useState<'THREE_PHASE' | 'UPGRADE_NEEDED' | 'SOLAR_NEEDED'>('THREE_PHASE');
  const [waterStatus, setWaterStatus] = useState<'AVAILABLE' | 'NEEDED'>('AVAILABLE');
  const [machineryStatus, setMachineryStatus] = useState<'QUOTED' | 'SOURCING' | 'UNKNOWN'>('QUOTED');
  const [rawMaterialStatus, setRawMaterialStatus] = useState<'LOCAL_FARMERS' | 'APMC_MANDI' | 'UNKNOWN'>('LOCAL_FARMERS');

  const [docsReady, setDocsReady] = useState<string[]>([
    'AADHAAR_CARD',
    'PAN_CARD',
    'BANK_PASSBOOK',
  ]);

  const toggleDoc = (docId: string) => {
    setDocsReady((prev) =>
      prev.includes(docId) ? prev.filter((d) => d !== docId) : [...prev, docId]
    );
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const unknownList: string[] = [];
    if (machineryStatus === 'UNKNOWN') unknownList.push('Machinery supplier quotations & vendor AMC terms');
    if (rawMaterialStatus === 'UNKNOWN') unknownList.push('Seasonal raw material mandi rate fluctuations');
    if (!docsReady.includes('LAND_RECORDS') && landStatus === 'OWNED') {
      unknownList.push('Land 7/12 extract / mutation certificate verification');
    }
    if (!docsReady.includes('UDYAM_MSME')) {
      unknownList.push('Udyam MSME certificate (to be applied via DIC)');
    }

    onChange({
      landStatus,
      powerStatus,
      waterStatus,
      machineryStatus,
      rawMaterialStatus,
      statutoryDocsReady: docsReady,
      unknownFactors: unknownList,
    });
    onNext();
  };

  return (
    <form onSubmit={handleContinue} className="space-y-6">
      {/* Step Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#C8A96B] bg-[#3B2F2A] px-2.5 py-0.5 rounded-md">
            Step 4 of 5
          </span>
          <span className="text-xs text-[#5A6B4F] font-semibold">
            Infrastructure & Ground Readiness Audit
          </span>
        </div>
        <h2 className="text-2xl font-display font-bold text-[#3B2F2A]">
          Infrastructure, Machinery & Statutory Readiness
        </h2>
        <p className="text-xs sm:text-sm text-[#3B2F2A]/75 leading-relaxed">
          Audit your physical premises, utilities, and documents. Gram-Disha applies the <strong>UNKNOWN Principle</strong>: unverified factors are flagged transparently for your action plan.
        </p>
      </div>

      {/* Grid: Utilities and Physical Infra */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Land & Shed Status */}
        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/40 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#3B2F2A] flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#B45B4A]" /> Land & Shed Premises
            </label>
            {landStatus === 'NEEDED' && <UnknownBadge size="sm" />}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'OWNED', label: 'Owned Land' },
              { id: 'LEASED', label: 'Leased/Rented' },
              { id: 'NEEDED', label: 'To Acquire' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setLandStatus(opt.id as any)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                  landStatus === opt.id
                    ? 'bg-[#3B2F2A] text-[#FAF7F2]'
                    : 'bg-[#F2E8D6]/50 text-[#3B2F2A] border border-[#C8A96B]/30'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Electricity / Power Status */}
        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/40 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#3B2F2A] flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#C8A96B]" /> Electricity Grid Connection
            </label>
            {powerStatus === 'UPGRADE_NEEDED' && <UnknownBadge size="sm" label="Grid Load Audit Needed" />}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'THREE_PHASE', label: '3-Phase Ready' },
              { id: 'UPGRADE_NEEDED', label: 'Needs Upgrade' },
              { id: 'SOLAR_NEEDED', label: 'Solar Backup' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPowerStatus(opt.id as any)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                  powerStatus === opt.id
                    ? 'bg-[#3B2F2A] text-[#FAF7F2]'
                    : 'bg-[#F2E8D6]/50 text-[#3B2F2A] border border-[#C8A96B]/30'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Machinery & Equipment Procurement */}
        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/40 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#3B2F2A] flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-[#5A6B4F]" /> Machinery & Equipment Sourcing
            </label>
            {machineryStatus === 'UNKNOWN' && <UnknownBadge size="sm" label="Vendor UNKNOWN" />}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'QUOTED', label: 'Quotes In-Hand' },
              { id: 'SOURCING', label: 'In Negotiation' },
              { id: 'UNKNOWN', label: 'Not Identified' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setMachineryStatus(opt.id as any)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                  machineryStatus === opt.id
                    ? 'bg-[#3B2F2A] text-[#FAF7F2]'
                    : 'bg-[#F2E8D6]/50 text-[#3B2F2A] border border-[#C8A96B]/30'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Raw Material Sourcing Channel */}
        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/40 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#3B2F2A] flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#B45B4A]" /> Raw Material Procurement Channel
            </label>
            {rawMaterialStatus === 'UNKNOWN' && <UnknownBadge size="sm" label="Supply UNKNOWN" />}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'LOCAL_FARMERS', label: 'Local Farmers' },
              { id: 'APMC_MANDI', label: 'APMC Mandi' },
              { id: 'UNKNOWN', label: 'To Be Decided' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setRawMaterialStatus(opt.id as any)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                  rawMaterialStatus === opt.id
                    ? 'bg-[#3B2F2A] text-[#FAF7F2]'
                    : 'bg-[#F2E8D6]/50 text-[#3B2F2A] border border-[#C8A96B]/30'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Statutory Documentation Readiness Checklist */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#F2E8D6]/45 border border-[#C8A96B]/35 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#3B2F2A] block">
              Statutory & Compliance Readiness Checklist
            </span>
            <span className="text-[11px] text-[#3B2F2A]/70">
              Select all documents and registrations currently available in-hand.
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-[#5A6B4F]">
            {docsReady.length} of 6 Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
          {[
            { id: 'AADHAAR_CARD', name: 'Aadhaar (Linked Mobile)', auth: 'UIDAI', ready: true },
            { id: 'PAN_CARD', name: 'PAN Card (Individual/Firm)', auth: 'ITD', ready: true },
            { id: 'BANK_PASSBOOK', name: 'Bank Account & 6M Statement', auth: 'Scheduled Bank', ready: true },
            { id: 'LAND_RECORDS', name: 'Land 7/12 Extract / Rent Deed', auth: 'Revenue Dept', ready: false },
            { id: 'UDYAM_MSME', name: 'Udyam MSME Registration', auth: 'Ministry of MSME', ready: false },
            { id: 'FSSAI_TRADE', name: 'FSSAI / Local Panchayat NOC', auth: 'FSSAI / GP', ready: false },
          ].map((doc) => {
            const isChecked = docsReady.includes(doc.id);
            return (
              <button
                key={doc.id}
                type="button"
                onClick={() => toggleDoc(doc.id)}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                  isChecked
                    ? 'bg-[#FAF7F2] border-[#5A6B4F] shadow-xs'
                    : 'bg-[#FAF7F2]/60 border-[#C8A96B]/30 hover:border-[#C8A96B]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center shrink-0 border ${
                    isChecked
                      ? 'bg-[#5A6B4F] border-[#5A6B4F] text-[#FAF7F2]'
                      : 'border-[#C8A96B]/60'
                  }`}
                >
                  {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-[#3B2F2A] block truncate">
                    {doc.name}
                  </span>
                  <span className="text-[10px] text-[#3B2F2A]/60 block">
                    {doc.auth}
                  </span>
                </div>
              </button>
            );
          })}
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
          <span>Synthesize with DISHA AI Brief</span>
          <span>→</span>
        </button>
      </div>
    </form>
  );
};
