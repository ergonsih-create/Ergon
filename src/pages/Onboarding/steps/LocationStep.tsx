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
  Building2,
  Sparkles,
  Zap,
  Home,
  Layers
} from 'lucide-react';
import { LocationContext } from '../../../types';
import { 
  LGD_STATES, 
  calculatePMEGPSubsidyRate,
  getDistrictByName,
  getStateByName,
  VillageHabitationRecord
} from '../../../data/lgdLocations';
import { useLanguage } from '../../../context/LanguageContext';

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
  const { t } = useLanguage();
  const [selectedState, setSelectedState] = useState(location.state || 'Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState(location.district || 'Yavatmal');
  const [selectedBlock, setSelectedBlock] = useState(location.block || 'ALL_BLOCKS');
  const [gramPanchayat, setGramPanchayat] = useState(location.gramPanchayat || 'ALL_GPS');
  const [village, setVillage] = useState(location.villageOrLocality || 'Shendurjana Khurd');
  const [selectedHabitation, setSelectedHabitation] = useState<string>('Khurd Main Gaothan');
  const [pincode, setPincode] = useState(location.pincode || '445204');
  const [isRural, setIsRural] = useState(location.isRural ?? true);
  const [opportunityRadiusKm, setOpportunityRadiusKm] = useState<5 | 10>(location.opportunityRadiusKm || 10);
  const [isCustomVillage, setIsCustomVillage] = useState(false);
  const [villageSearch, setVillageSearch] = useState('');

  const currentStateRecord = LGD_STATES.find((s) => s.stateName === selectedState) || LGD_STATES[0];
  const currentDistrictRecord =
    currentStateRecord.districts.find((d) => d.districtName === selectedDistrict) ||
    currentStateRecord.districts[0];

  // Block-filtered villages and GPs
  const blockVillages = selectedBlock === 'ALL_BLOCKS'
    ? currentDistrictRecord.villages
    : currentDistrictRecord.villages.filter(
        (v) => v.block.toLowerCase() === selectedBlock.toLowerCase()
      );

  const availableGPs = Array.from(new Set(
    blockVillages.length > 0
      ? blockVillages.map((v) => v.gramPanchayat)
      : (selectedBlock === 'ALL_BLOCKS'
          ? currentDistrictRecord.sampleGPs
          : currentDistrictRecord.sampleGPs.filter(g => g.toLowerCase().includes(selectedBlock.toLowerCase())))
  ));

  const baseVillages = gramPanchayat === 'ALL_GPS'
    ? blockVillages
    : blockVillages.filter((v) => v.gramPanchayat.toLowerCase() === gramPanchayat.toLowerCase());

  const availableVillages = baseVillages.length > 0
    ? baseVillages
    : (blockVillages.length > 0 ? blockVillages : currentDistrictRecord.villages);

  const filteredVillages = villageSearch.trim()
    ? availableVillages.filter((v) =>
        v.villageName.toLowerCase().includes(villageSearch.toLowerCase()) ||
        v.block.toLowerCase().includes(villageSearch.toLowerCase()) ||
        v.gramPanchayat.toLowerCase().includes(villageSearch.toLowerCase()) ||
        (v.pincode && v.pincode.includes(villageSearch.trim()))
      )
    : availableVillages;

  const currentVillageRecord: VillageHabitationRecord | undefined = currentDistrictRecord.villages.find(
    (v) => v.villageName.toLowerCase() === village.toLowerCase() || v.gramPanchayat.toLowerCase() === gramPanchayat.toLowerCase()
  );

  const availableHabitations = currentVillageRecord ? currentVillageRecord.habitations : [];

  // PMEGP subsidy preview
  const subsidyInfo = calculatePMEGPSubsidyRate(isRural, true, selectedState);

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const stateRec = LGD_STATES.find((s) => s.stateName === stateName) || LGD_STATES[0];
    const firstDist = stateRec.districts[0];
    setSelectedDistrict(firstDist.districtName);
    setIsRural(firstDist.urbanityClassification !== 'URBAN' && firstDist.urbanityClassification !== 'METROPOLITAN');
    setSelectedBlock('ALL_BLOCKS');
    setGramPanchayat('ALL_GPS');
    setVillageSearch('');
    
    if (firstDist.villages && firstDist.villages.length > 0) {
      const v = firstDist.villages[0];
      setVillage(v.villageName);
      setSelectedHabitation(v.habitations[0] || '');
      setPincode(v.pincode || '');
      setIsCustomVillage(false);
    } else {
      setVillage(`${firstDist.districtName} Gaon`);
      setSelectedHabitation('');
      setIsCustomVillage(true);
    }
  };

  const handleDistrictChange = (distName: string) => {
    setSelectedDistrict(distName);
    const distRec = currentStateRecord.districts.find((d) => d.districtName === distName);
    if (distRec) {
      setIsRural(distRec.urbanityClassification !== 'URBAN' && distRec.urbanityClassification !== 'METROPOLITAN');
      setSelectedBlock('ALL_BLOCKS');
      setGramPanchayat('ALL_GPS');
      setVillageSearch('');
      
      if (distRec.villages && distRec.villages.length > 0) {
        const v = distRec.villages[0];
        setVillage(v.villageName);
        setSelectedHabitation(v.habitations[0] || '');
        setPincode(v.pincode || '');
        setIsCustomVillage(false);
      } else {
        setVillage(`${distRec.districtName} Gaon`);
        setSelectedHabitation('');
        setIsCustomVillage(true);
      }
    }
  };

  const handleBlockChange = (blockName: string) => {
    setSelectedBlock(blockName);
    setGramPanchayat('ALL_GPS');
    setVillageSearch('');

    if (blockName === 'ALL_BLOCKS') {
      if (currentDistrictRecord.villages.length > 0) {
        const v = currentDistrictRecord.villages[0];
        setVillage(v.villageName);
        setSelectedHabitation(v.habitations[0] || '');
        setPincode(v.pincode || '');
        setIsCustomVillage(false);
      }
      return;
    }

    const matchingVillages = currentDistrictRecord.villages.filter(
      (v) => v.block.toLowerCase() === blockName.toLowerCase()
    );
    if (matchingVillages.length > 0) {
      const v = matchingVillages[0];
      setVillage(v.villageName);
      setSelectedHabitation(v.habitations[0] || '');
      setPincode(v.pincode || pincode);
      setIsCustomVillage(false);
    } else {
      setVillage(`${blockName} Gaon`);
      setSelectedHabitation('');
    }
  };

  const handleGPChange = (gpName: string) => {
    setGramPanchayat(gpName);
    setVillageSearch('');

    if (gpName === 'ALL_GPS') {
      return;
    }

    const matchV = currentDistrictRecord.villages.find((v) => v.gramPanchayat.toLowerCase() === gpName.toLowerCase());
    if (matchV) {
      setVillage(matchV.villageName);
      if (selectedBlock === 'ALL_BLOCKS') {
        setSelectedBlock(matchV.block);
      }
      setSelectedHabitation(matchV.habitations[0] || '');
      setPincode(matchV.pincode);
    }
  };

  const handleVillageSelect = (villageName: string) => {
    setVillage(villageName);
    const vRec = currentDistrictRecord.villages.find((v) => v.villageName === villageName);
    if (vRec) {
      setGramPanchayat(vRec.gramPanchayat);
      setSelectedBlock(vRec.block);
      setSelectedHabitation(vRec.habitations[0] || '');
      setPincode(vRec.pincode || pincode);
      setIsCustomVillage(false);
    }
  };

  const handleShowAllDistrictVillages = () => {
    setSelectedBlock('ALL_BLOCKS');
    setGramPanchayat('ALL_GPS');
    setVillageSearch('');
    if (currentDistrictRecord.villages.length > 0) {
      const v = currentDistrictRecord.villages[0];
      setVillage(v.villageName);
      setSelectedHabitation(v.habitations[0] || '');
      setPincode(v.pincode);
      setIsCustomVillage(false);
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const finalVillage = selectedHabitation ? `${village} (${selectedHabitation})` : village;
    const vRec = currentDistrictRecord.villages.find((v) => v.villageName === village);
    const resolvedBlock = (selectedBlock === 'ALL_BLOCKS' || !selectedBlock)
      ? (vRec?.block || currentDistrictRecord.blocks[0] || 'Block')
      : selectedBlock;
    const resolvedGP = (gramPanchayat === 'ALL_GPS' || !gramPanchayat)
      ? (vRec?.gramPanchayat || currentDistrictRecord.sampleGPs[0] || 'Gram Panchayat')
      : gramPanchayat;

    onChange({
      state: selectedState,
      district: selectedDistrict,
      block: resolvedBlock,
      gramPanchayat: resolvedGP,
      villageOrLocality: finalVillage,
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
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#C8A96B] bg-[#3B2F2A] px-2.5 py-0.5 rounded-md">
            Step 1 of 5
          </span>
          <span className="text-xs text-[#5A6B4F] font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> LGD Official Directory Integration (All 36 States & UTs)
          </span>
        </div>
        <h2 className="text-2xl font-display font-bold text-[#3B2F2A]">
          {t('activeLocationLabel')}
        </h2>
        <p className="text-xs sm:text-sm text-[#3B2F2A]/75 leading-relaxed">
          Select your administrative hierarchy from the official Local Government Directory (LGD). Gram-Disha uses this data to map APMC Mandis, Notified ODOP products, and rural capital subsidies (up to 35%).
        </p>
      </div>

      {/* ODOP & Urbanity Highlight Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#F2E8D6] to-[#EAE0CD] border border-[#C8A96B]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-xl bg-[#3B2F2A] text-[#FAF7F2] shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-[#C8A96B]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#3B2F2A]">
                {selectedDistrict} District ODOP Product
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#174C3A] text-[#FAF7F2]">
                {currentDistrictRecord.odopCategory}
              </span>
            </div>
            <p className="text-xs font-medium text-[#174C3A] mt-0.5">
              {currentDistrictRecord.notifiedODOP}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-[#FAF7F2] text-[#3B2F2A] border border-[#C8A96B]/30">
            {currentDistrictRecord.urbanityClassification} ({currentDistrictRecord.censusRuralPercentage}% {t('ruralPopulation')})
          </span>
        </div>
      </div>

      {/* LGD Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* State */}
        <div>
          <label className="block text-xs font-bold text-[#3B2F2A] mb-1.5">
            {t('forms.stateLabel')} <span className="text-[#B45B4A]">*</span>
          </label>
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 focus:border-[#B45B4A] focus:outline-hidden text-sm text-[#3B2F2A] font-medium"
          >
            {LGD_STATES.map((st) => (
              <option key={st.stateCode} value={st.stateName}>
                {st.stateName} {st.territoryType === 'UNION_TERRITORY' ? '(UT)' : ''} [LGD: {st.stateCode}]
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="block text-xs font-bold text-[#3B2F2A] mb-1.5">
            {t('forms.districtLabel')} <span className="text-[#B45B4A]">*</span>
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 focus:border-[#B45B4A] focus:outline-hidden text-sm text-[#3B2F2A] font-medium"
          >
            {currentStateRecord.districts.map((d) => (
              <option key={d.districtCode} value={d.districtName}>
                {d.districtName} (Code: {d.districtCode}) — {d.urbanityClassification}
              </option>
            ))}
          </select>
        </div>

        {/* Block / Taluka */}
        <div>
          <label className="block text-xs font-bold text-[#3B2F2A] mb-1.5 flex items-center justify-between">
            <span>{t('forms.blockLabel')} <span className="text-[#B45B4A]">*</span></span>
            <span className="text-[10px] font-semibold text-[#174C3A] bg-[#174C3A]/10 px-2 py-0.5 rounded-full">
              {currentDistrictRecord.blocks.length} Blocks
            </span>
          </label>
          <div className="flex gap-2">
            <select
              value={selectedBlock}
              onChange={(e) => handleBlockChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 focus:border-[#B45B4A] focus:outline-hidden text-sm text-[#3B2F2A] font-medium"
            >
              <option value="ALL_BLOCKS">
                ✦ All Sub-Districts / Blocks ({currentDistrictRecord.blocks.length} Blocks)
              </option>
              {currentDistrictRecord.blocks.map((blk) => (
                <option key={blk} value={blk}>
                  {blk} Block / Taluka
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Gram Panchayat */}
        <div>
          <label className="block text-xs font-bold text-[#3B2F2A] mb-1.5 flex items-center justify-between">
            <span>{t('forms.panchayatLabel')} <span className="text-[#B45B4A]">*</span></span>
            <span className="text-[10px] font-semibold text-[#174C3A] bg-[#174C3A]/10 px-2 py-0.5 rounded-full">
              {availableGPs.length} Local Bodies
            </span>
          </label>
          <div className="space-y-1.5">
            <select
              value={gramPanchayat}
              onChange={(e) => handleGPChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 focus:border-[#B45B4A] focus:outline-hidden text-sm text-[#3B2F2A] font-medium"
            >
              <option value="ALL_GPS">
                ✦ All Gram Panchayats / Local Bodies ({availableGPs.length})
              </option>
              {availableGPs.map((gp) => (
                <option key={gp} value={gp}>
                  {gp.includes('Panchayat') || gp.includes('Body') || gp.includes('Municipality') || gp.includes('Zone') || gp.includes('Division') || gp.includes('Cantonment') || gp.includes('GP') ? gp : `${gp} Gram Panchayat`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Village / Locality Selection */}
        <div className="md:col-span-2 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <label className="block text-xs font-bold text-[#3B2F2A]">
                {t('forms.villageLabel')} <span className="text-[#B45B4A]">*</span>
              </label>
              {!isCustomVillage && (
                <span className="text-[10px] font-bold text-[#174C3A] bg-[#174C3A]/10 px-2 py-0.5 rounded-full">
                  {filteredVillages.length} of {availableVillages.length} Villages {selectedBlock === 'ALL_BLOCKS' ? `(All ${selectedDistrict})` : `(${selectedBlock})`}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {(selectedBlock !== 'ALL_BLOCKS' || gramPanchayat !== 'ALL_GPS' || villageSearch) && (
                <button
                  type="button"
                  onClick={handleShowAllDistrictVillages}
                  className="text-[11px] font-semibold text-[#B45B4A] hover:underline"
                >
                  Show All {currentDistrictRecord.villages.length} in {selectedDistrict}
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsCustomVillage(!isCustomVillage)}
                className="text-[11px] font-semibold text-[#174C3A] hover:underline"
              >
                {isCustomVillage ? 'Select from registry' : 'Type custom village'}
              </button>
            </div>
          </div>

          {!isCustomVillage && availableVillages.length > 5 && (
            <div className="relative">
              <input
                type="text"
                value={villageSearch}
                onChange={(e) => setVillageSearch(e.target.value)}
                placeholder={`🔍 Filter among ${availableVillages.length} villages by name, block, or PIN...`}
                className="w-full px-3.5 py-1.5 text-xs rounded-lg bg-white border border-[#C8A96B]/40 text-[#3B2F2A] placeholder:text-[#68655D] focus:border-[#B45B4A] focus:outline-hidden"
              />
              {villageSearch && (
                <button
                  type="button"
                  onClick={() => setVillageSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#68655D] hover:text-[#3B2F2A]"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {isCustomVillage || availableVillages.length === 0 ? (
            <input
              type="text"
              required
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder="Enter village or revenue gaon name"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 focus:border-[#B45B4A] focus:outline-hidden text-sm text-[#3B2F2A]"
            />
          ) : (
            <select
              value={village}
              onChange={(e) => handleVillageSelect(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 focus:border-[#B45B4A] focus:outline-hidden text-sm text-[#3B2F2A] font-medium"
            >
              {filteredVillages.length === 0 ? (
                <option disabled value="">No villages match "{villageSearch}"</option>
              ) : (
                filteredVillages.map((v) => (
                  <option key={`${v.villageCode || v.villageName}_${v.block}`} value={v.villageName}>
                    {v.villageName} • {v.block} Block — {v.gramPanchayat} (PIN: {v.pincode})
                  </option>
                ))
              )}
            </select>
          )}
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-xs font-bold text-[#3B2F2A] mb-1.5">
            {t('forms.pincodeLabel')}
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

      {/* Habitations / Tolas / Majras Chips */}
      {availableHabitations.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#3B2F2A] flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-[#C8A96B]" />
              Habitation / Majra / Tola / Wada / Basti / Hamlet:
            </span>
            <span className="text-[10px] text-[#3B2F2A]/60">Hyper-local Census settlement</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {availableHabitations.map((hab) => (
              <button
                key={hab}
                type="button"
                onClick={() => setSelectedHabitation(hab)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedHabitation === hab
                    ? 'bg-[#3B2F2A] text-[#FAF7F2] shadow-xs'
                    : 'bg-[#F2E8D6]/60 text-[#3B2F2A] hover:bg-[#F2E8D6] border border-[#C8A96B]/30'
                }`}
              >
                {hab}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rural vs Urban Classification */}
      <div className="p-4 rounded-2xl bg-[#F2E8D6]/50 border border-[#C8A96B]/30 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-[#3B2F2A] block">
              Area Classification & Subsidy Differential
            </span>
            <span className="text-[11px] text-[#3B2F2A]/70">
              Rural locations receive <strong>{subsidyInfo.subsidyPct}% Subsidy</strong> under PMEGP & PMFME with {subsidyInfo.ownContributionPct}% promoter equity.
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
              5 km (Immediate Shandy / Haat)
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
              10 km (APMC Mandi Cluster Hub)
            </button>
          </div>
        </div>
      </div>

      {/* LGD Verification & Power Infrastructure Diagnostics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#5A6B4F] bg-[#5A6B4F]/10 border border-[#5A6B4F]/30 p-3 rounded-xl">
          <CheckCircle2 className="w-4 h-4 text-[#5A6B4F] shrink-0" />
          <span>
            <strong>LGD Anchor:</strong> LGD-{currentStateRecord.stateCode}-{currentDistrictRecord.districtCode} ({selectedDistrict}, {selectedState}).
          </span>
        </div>

        <div className="flex items-center gap-2 text-[#3B2F2A] bg-[#FAF7F2] border border-[#C8A96B]/30 p-3 rounded-xl">
          <Zap className="w-4 h-4 text-[#C8A96B] shrink-0" />
          <span>
            <strong>Power Feeder:</strong> {currentDistrictRecord.powerTariffZone}
          </span>
        </div>
      </div>

      {/* Form CTA */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="px-6 py-3 rounded-2xl bg-[#3B2F2A] hover:bg-[#2D2420] text-sm font-bold text-[#FAF7F2] shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>{t('forms.saveProfileBtn')}</span>
          <span>→</span>
        </button>
      </div>
    </form>
  );
};
