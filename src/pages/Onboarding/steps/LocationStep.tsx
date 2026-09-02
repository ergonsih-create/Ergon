/**
 * @license
 * GRAM-DISHA — Onboarding Step 1: Location & LGD Hierarchy
 * Team ERGON — Smart India Hackathon 2026
 */

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Navigation,
  Compass,
  Building2
} from 'lucide-react';
import { LocationContext } from '../../../types';
import { LGD_STATES } from '../../../data/lgdLocations';

interface LocationStepProps {
  location: LocationContext;
  onChange: (updated: Partial<LocationContext>) => void;
  onNext: () => void;
}

export const LocationStep: React.FC<LocationStepProps> = ({
  location,
  onChange,
  onNext,
}) => {
  const [selectedState, setSelectedState] = useState(location.state || 'Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState(location.district || 'Yavatmal');
  const [selectedBlock, setSelectedBlock] = useState(location.block || 'Pusad');
  const [gramPanchayat, setGramPanchayat] = useState(location.gramPanchayat || 'Shendurjana');
  const [village, setVillage] = useState(location.villageOrLocality || 'Shendurjana Khurd');
  const [pincode, setPincode] = useState(location.pincode || '445204');
  const [isRural, setIsRural] = useState(location.isRural ?? true);
  const [opportunityRadiusKm, setOpportunityRadiusKm] = useState<5 | 10>(location.opportunityRadiusKm || 10);

  const currentStateRecord = LGD_STATES.find((s) => s.stateName === selectedState) || LGD_STATES[0];
  const currentDistrictRecord =
    currentStateRecord.districts.find((d) => d.districtName === selectedDistrict) ||
    currentStateRecord.districts[0];

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const stateRec = LGD_STATES.find((s) => s.stateName === stateName) || LGD_STATES[0];
    const firstDist = stateRec.districts[0];
    setSelectedDistrict(firstDist.districtName);
    setSelectedBlock(firstDist.blocks[0] || '');
    setGramPanchayat(firstDist.sampleGPs[0] || '');
    setVillage(`${firstDist.sampleGPs[0] || ''} Gaon`);
  };

  const handleDistrictChange = (distName: string) => {
    setSelectedDistrict(distName);
    const distRec = currentStateRecord.districts.find((d) => d.districtName === distName);
    if (distRec) {
      setSelectedBlock(distRec.blocks[0] || '');
      setGramPanchayat(distRec.sampleGPs[0] || '');
      setVillage(`${distRec.sampleGPs[0] || ''} Gaon`);
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    onChange({
      state: selectedState,
      district: selectedDistrict,
      block: selectedBlock,
      gramPanchayat,
      villageOrLocality: village,
      pincode,
      isRural,
      opportunityRadiusKm,
    });
    onNext();
  };

  return (
    <form onSubmit={handleContinue} className="space-y-6">
      {/* Header info */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#C8A96B] bg-[#3B2F2A] px-2.5 py-0.5 rounded-md">
            Step 1 of 5
          </span>
          <span className="text-xs text-[#5A6B4F] font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> LGD Official Directory Integration
          </span>
        </div>
        <h2 className="text-2xl font-display font-bold text-[#3B2F2A]">
          Where is your enterprise located?
        </h2>
        <p className="text-xs sm:text-sm text-[#3B2F2A]/75 leading-relaxed">
          Select your local administrative hierarchy. Gram-Disha maps hyper-local APMC mandis, raw material clusters, and special rural scheme subsidies (e.g. 35% PMEGP rural subsidy).
        </p>
      </div>

      {/* LGD Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* State */}
        <div>
          <label className="block text-xs font-bold text-[#3B2F2A] mb-1.5">
            State / UT <span className="text-[#B45B4A]">*</span>
          </label>
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 focus:border-[#B45B4A] focus:outline-hidden text-sm text-[#3B2F2A] font-medium"
          >
            {LGD_STATES.map((st) => (
              <option key={st.stateCode} value={st.stateName}>
                {st.stateName} (LGD Code: {st.stateCode})
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="block text-xs font-bold text-[#3B2F2A] mb-1.5">
            District <span className="text-[#B45B4A]">*</span>
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 focus:border-[#B45B4A] focus:outline-hidden text-sm text-[#3B2F2A] font-medium"
          >
            {currentStateRecord.districts.map((d) => (
              <option key={d.districtCode} value={d.districtName}>
                {d.districtName} (Code: {d.districtCode})
              </option>
            ))}
          </select>
        </div>

        {/* Block / Taluka */}
        <div>
          <label className="block text-xs font-bold text-[#3B2F2A] mb-1.5">
            Sub-District / Block / Taluka <span className="text-[#B45B4A]">*</span>
          </label>
          <select
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 focus:border-[#B45B4A] focus:outline-hidden text-sm text-[#3B2F2A] font-medium"
          >
            {currentDistrictRecord.blocks.map((blk) => (
              <option key={blk} value={blk}>
                {blk} Block
              </option>
            ))}
          </select>
        </div>

        {/* Gram Panchayat */}
        <div>
          <label className="block text-xs font-bold text-[#3B2F2A] mb-1.5">
            Gram Panchayat / Local Body <span className="text-[#B45B4A]">*</span>
          </label>
          <input
            type="text"
            required
            value={gramPanchayat}
            onChange={(e) => setGramPanchayat(e.target.value)}
            placeholder="e.g. Shendurjana"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 focus:border-[#B45B4A] focus:outline-hidden text-sm text-[#3B2F2A]"
          />
        </div>

        {/* Village / Locality */}
        <div>
          <label className="block text-xs font-bold text-[#3B2F2A] mb-1.5">
            Village / Habitation Name <span className="text-[#B45B4A]">*</span>
          </label>
          <input
            type="text"
            required
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            placeholder="e.g. Shendurjana Khurd"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 focus:border-[#B45B4A] focus:outline-hidden text-sm text-[#3B2F2A]"
          />
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-xs font-bold text-[#3B2F2A] mb-1.5">
            PIN Code
          </label>
          <input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="e.g. 445204"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 focus:border-[#B45B4A] focus:outline-hidden text-sm text-[#3B2F2A]"
          />
        </div>
      </div>

      {/* Rural vs Urban Classification */}
      <div className="p-4 rounded-2xl bg-[#F2E8D6]/50 border border-[#C8A96B]/30 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-[#3B2F2A] block">
              Area Classification (Census 2026 / LGD)
            </span>
            <span className="text-[11px] text-[#3B2F2A]/70">
              Rural locations receive 10% higher subsidy in PMEGP and priority in PMFME & NABARD schemes.
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-[#C8A96B]/30 shrink-0">
            <button
              type="button"
              onClick={() => setIsRural(true)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isRural
                  ? 'bg-[#5A6B4F] text-[#FAF7F2] shadow-xs'
                  : 'text-[#3B2F2A]/70 hover:text-[#3B2F2A]'
              }`}
            >
              🌾 Rural (Gram Panchayat)
            </button>
            <button
              type="button"
              onClick={() => setIsRural(false)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                !isRural
                  ? 'bg-[#B45B4A] text-[#FAF7F2] shadow-xs'
                  : 'text-[#3B2F2A]/70 hover:text-[#3B2F2A]'
              }`}
            >
              🏢 Semi-Urban / Town
            </button>
          </div>
        </div>

        {/* Opportunity Radius */}
        <div className="pt-2 border-t border-[#C8A96B]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs text-[#3B2F2A] font-medium">
            Local Market & Supply Radius:
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOpportunityRadiusKm(5)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                opportunityRadiusKm === 5
                  ? 'bg-[#3B2F2A] text-[#FAF7F2]'
                  : 'bg-[#FAF7F2] text-[#3B2F2A] border border-[#C8A96B]/30'
              }`}
            >
              5 km (Immediate Catchment)
            </button>
            <button
              type="button"
              onClick={() => setOpportunityRadiusKm(10)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                opportunityRadiusKm === 10
                  ? 'bg-[#3B2F2A] text-[#FAF7F2]'
                  : 'bg-[#FAF7F2] text-[#3B2F2A] border border-[#C8A96B]/30'
              }`}
            >
              10 km (Inter-Village Market Hub)
            </button>
          </div>
        </div>
      </div>

      {/* LGD Verification Seal */}
      <div className="flex items-center gap-2 text-xs text-[#5A6B4F] bg-[#5A6B4F]/10 border border-[#5A6B4F]/30 p-3 rounded-xl">
        <CheckCircle2 className="w-4 h-4 text-[#5A6B4F] shrink-0" />
        <span>
          <strong>LGD Anchor:</strong> {gramPanchayat} GP, {selectedBlock} Block, {selectedDistrict}, {selectedState} (Standard ID: LGD-{currentStateRecord.stateCode}-{currentDistrictRecord.districtCode}).
        </span>
      </div>

      {/* Form CTA */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="px-6 py-3 rounded-2xl bg-[#3B2F2A] hover:bg-[#2D2420] text-sm font-bold text-[#FAF7F2] shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Continue to Business Details</span>
          <span>→</span>
        </button>
      </div>
    </form>
  );
};
