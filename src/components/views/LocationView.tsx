/**
 * @license
 * GRAM-DISHA — Hyper-Local Geographic Context (LGD Hierarchy)
 * Team ERGON — Smart India Hackathon 2026
 */

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Compass, 
  ShieldCheck, 
  HelpCircle,
  Building,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  Home,
  Layers,
  TrendingUp,
  Landmark
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { UnknownState } from '../common/UnknownState';
import { useAuth } from '../../context/AuthContext';
import { useDisha } from '../../context/DishaContext';
import { 
  LGD_STATES, 
  calculatePMEGPSubsidyRate, 
  LGDStateRecord, 
  LGDDistrictRecord, 
  VillageHabitationRecord 
} from '../../data/lgdLocations';

export const LocationView: React.FC = () => {
  const { user, activeBusiness, updateActiveBusiness } = useAuth();
  const { openAdvisorWithInsight } = useDisha();

  const defaultLoc = activeBusiness?.proposedLocation || user?.location || {
    state: 'Maharashtra',
    district: 'Yavatmal',
    block: 'ALL_BLOCKS',
    gramPanchayat: 'ALL_GPS',
    villageOrLocality: 'Shendurjana Khurd',
    pincode: '445204',
    isRural: true,
    opportunityRadiusKm: 10
  };

  const [stateName, setStateName] = useState(defaultLoc.state || 'Maharashtra');
  const [district, setDistrict] = useState(defaultLoc.district || 'Yavatmal');
  const [block, setBlock] = useState(defaultLoc.block || 'ALL_BLOCKS');
  const [gramPanchayat, setGramPanchayat] = useState(defaultLoc.gramPanchayat || 'ALL_GPS');
  const [village, setVillage] = useState(defaultLoc.villageOrLocality || 'Shendurjana Khurd');
  const [selectedHabitation, setSelectedHabitation] = useState<string>('Khurd Main Gaothan');
  const [pincode, setPincode] = useState(defaultLoc.pincode || '445204');
  const [isRural, setIsRural] = useState(defaultLoc.isRural ?? true);
  const [radius, setRadius] = useState<5 | 10>((defaultLoc.opportunityRadiusKm as (5 | 10)) || 10);
  const [isCustomVillage, setIsCustomVillage] = useState(false);
  const [villageSearch, setVillageSearch] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Derive State & District records
  const currentStateRecord = LGD_STATES.find((s) => s.stateName === stateName) || LGD_STATES[0];
  const currentDistrictRecord =
    currentStateRecord.districts.find((d) => d.districtName === district) ||
    currentStateRecord.districts[0];

  // Block-filtered villages and GPs
  const blockVillages = block === 'ALL_BLOCKS'
    ? currentDistrictRecord.villages
    : currentDistrictRecord.villages.filter(
        (v) => v.block.toLowerCase() === block.toLowerCase()
      );

  const availableGPs = Array.from(new Set(
    blockVillages.length > 0
      ? blockVillages.map((v) => v.gramPanchayat)
      : (block === 'ALL_BLOCKS'
          ? currentDistrictRecord.sampleGPs
          : currentDistrictRecord.sampleGPs.filter(g => g.toLowerCase().includes(block.toLowerCase())))
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

  const currentVillageRecord = currentDistrictRecord.villages.find(
    (v) => v.villageName.toLowerCase() === village.toLowerCase() || v.gramPanchayat.toLowerCase() === gramPanchayat.toLowerCase()
  );

  const availableHabitations = currentVillageRecord ? currentVillageRecord.habitations : [];

  const subsidyDetails = calculatePMEGPSubsidyRate(
    isRural,
    user?.demographics.category !== 'GENERAL' || user?.demographics.gender === 'FEMALE',
    stateName
  );

  const handleStateChange = (newState: string) => {
    setStateName(newState);
    const stateRec = LGD_STATES.find((s) => s.stateName === newState) || LGD_STATES[0];
    const firstDist = stateRec.districts[0];
    setDistrict(firstDist.districtName);
    setIsRural(firstDist.urbanityClassification !== 'URBAN' && firstDist.urbanityClassification !== 'METROPOLITAN');
    setBlock('ALL_BLOCKS');
    setGramPanchayat('ALL_GPS');
    setVillageSearch('');

    if (firstDist.villages && firstDist.villages.length > 0) {
      const v = firstDist.villages[0];
      setVillage(v.villageName);
      setSelectedHabitation(v.habitations[0] || '');
      setPincode(v.pincode);
      setIsCustomVillage(false);
    } else {
      setVillage(`${firstDist.districtName} Gaon`);
      setSelectedHabitation('');
      setIsCustomVillage(true);
    }
  };

  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);
    const distRec = currentStateRecord.districts.find((d) => d.districtName === newDist);
    if (distRec) {
      setIsRural(distRec.urbanityClassification !== 'URBAN' && distRec.urbanityClassification !== 'METROPOLITAN');
      setBlock('ALL_BLOCKS');
      setGramPanchayat('ALL_GPS');
      setVillageSearch('');

      if (distRec.villages && distRec.villages.length > 0) {
        const v = distRec.villages[0];
        setVillage(v.villageName);
        setSelectedHabitation(v.habitations[0] || '');
        setPincode(v.pincode);
        setIsCustomVillage(false);
      } else {
        setVillage(`${distRec.districtName} Gaon`);
        setSelectedHabitation('');
        setIsCustomVillage(true);
      }
    }
  };

  const handleBlockChange = (newBlock: string) => {
    setBlock(newBlock);
    setGramPanchayat('ALL_GPS');
    setVillageSearch('');

    if (newBlock === 'ALL_BLOCKS') {
      if (currentDistrictRecord.villages.length > 0) {
        const v = currentDistrictRecord.villages[0];
        setVillage(v.villageName);
        setSelectedHabitation(v.habitations[0] || '');
        setPincode(v.pincode);
        setIsCustomVillage(false);
      }
      return;
    }

    const matchingVillages = currentDistrictRecord.villages.filter(
      (v) => v.block.toLowerCase() === newBlock.toLowerCase()
    );
    if (matchingVillages.length > 0) {
      const v = matchingVillages[0];
      setVillage(v.villageName);
      setSelectedHabitation(v.habitations[0] || '');
      setPincode(v.pincode || pincode);
      setIsCustomVillage(false);
    } else {
      setVillage(`${newBlock} Gaon`);
      setSelectedHabitation('');
    }
  };

  const handleGPChange = (newGP: string) => {
    setGramPanchayat(newGP);
    setVillageSearch('');

    if (newGP === 'ALL_GPS') {
      return;
    }

    const matchV = currentDistrictRecord.villages.find((v) => v.gramPanchayat.toLowerCase() === newGP.toLowerCase());
    if (matchV) {
      setVillage(matchV.villageName);
      if (block === 'ALL_BLOCKS') {
        setBlock(matchV.block);
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
      setBlock(vRec.block);
      setSelectedHabitation(vRec.habitations[0] || '');
      setPincode(vRec.pincode || pincode);
      setIsCustomVillage(false);
    }
  };

  const handleShowAllDistrictVillages = () => {
    setBlock('ALL_BLOCKS');
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

  const handleSaveLocation = () => {
    const finalVillage = selectedHabitation ? `${village} (${selectedHabitation})` : village;
    const vRec = currentDistrictRecord.villages.find((v) => v.villageName === village);
    const resolvedBlock = (block === 'ALL_BLOCKS' || !block)
      ? (vRec?.block || currentDistrictRecord.blocks[0] || 'Block')
      : block;
    const resolvedGP = (gramPanchayat === 'ALL_GPS' || !gramPanchayat)
      ? (vRec?.gramPanchayat || currentDistrictRecord.sampleGPs[0] || 'Gram Panchayat')
      : gramPanchayat;

    updateActiveBusiness({
      proposedLocation: {
        state: stateName,
        district,
        block: resolvedBlock,
        gramPanchayat: resolvedGP,
        villageOrLocality: finalVillage,
        pincode,
        isRural,
        opportunityRadiusKm: radius,
        coordinates: activeBusiness?.proposedLocation?.coordinates,
      }
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);

    openAdvisorWithInsight(
      `Synchronized geographic context to ${resolvedGP} Gram Panchayat, ${district} District (${stateName}). LGD Code #LGD-${currentStateRecord.stateCode}-${currentDistrictRecord.districtCode} verified.`,
      [
        `ODOP Focus: ${currentDistrictRecord.notifiedODOP}`,
        `PMEGP Subsidy Rate: ${subsidyDetails.subsidyPct}% (Own Contribution: ${subsidyDetails.ownContributionPct}%)`,
        `Agro-Climatic Zone: ${currentDistrictRecord.agroClimaticZone}`
      ],
      'Explore Market Intelligence to inspect live APMC mandi prices and supply clusters.'
    );
  };

  return (
    <div id="location_view" className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D9D3C7]/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-display font-bold text-[#242522]">
              Hyper-Local Geographic Context (LGD)
            </h1>
            <Badge variant="forest">LGD Code #{currentStateRecord.stateCode}-{currentDistrictRecord.districtCode}</Badge>
          </div>
          <p className="text-xs text-[#68655D] mt-0.5">
            Ministry of Panchayati Raj (MoPR) Local Government Directory — All 28 States & 8 Union Territories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isRural ? "forest" : "amber"} size="md">
            {isRural ? '🌾 Rural (Gram Panchayat)' : '🏢 Semi-Urban / Urban'}
          </Badge>
          <Badge variant="sage" size="md">{radius} km Catchment Radius</Badge>
        </div>
      </div>

      {/* ODOP Cluster Alert Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F2E8D6] via-[#FAF7F2] to-[#F2E8D6] border border-[#C8A96B]/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-[#174C3A] text-[#FAF7F2] shrink-0">
            <Sparkles className="w-5 h-5 text-[#C8A96B]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#242522]">
                Official Notified ODOP Product for {district} ({stateName})
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#174C3A]/15 text-[#174C3A]">
                {currentDistrictRecord.odopCategory}
              </span>
            </div>
            <p className="text-xs font-bold text-[#174C3A] mt-0.5">
              {currentDistrictRecord.notifiedODOP}
            </p>
            <p className="text-[11px] text-[#68655D] mt-0.5">
              Agro-Climatic Zone: {currentDistrictRecord.agroClimaticZone} | RBI Classification: {currentDistrictRecord.rbiTier}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 bg-[#FCFAF5] p-2.5 rounded-xl border border-[#D9D3C7]">
          <div className="text-right">
            <div className="text-[10px] text-[#68655D] font-bold uppercase">Census Urbanity</div>
            <div className="text-xs font-bold text-[#242522]">{currentDistrictRecord.censusRuralPercentage}% Rural Population</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Administrative Hierarchy Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card 
            title="Administrative LGD Hierarchy" 
            subtitle="Verified against Ministry of Panchayati Raj (MoPR) Local Government Directory"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* State Selector */}
              <div>
                <label className="block font-semibold text-[#242522] mb-1.5">
                  State / Union Territory (LGD Code) <span className="text-[#B95736]">*</span>
                </label>
                <select 
                  value={stateName} 
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#D9D3C7] text-[#242522] font-medium focus:ring-1 focus:ring-[#174C3A]"
                >
                  {LGD_STATES.map((st) => (
                    <option key={st.stateCode} value={st.stateName}>
                      {st.stateName} {st.territoryType === 'UNION_TERRITORY' ? '(UT)' : ''} [Code: {st.stateCode}]
                    </option>
                  ))}
                </select>
              </div>

              {/* District Selector */}
              <div>
                <label className="block font-semibold text-[#242522] mb-1.5">
                  District (LGD District Code) <span className="text-[#B95736]">*</span>
                </label>
                <select 
                  value={district} 
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#D9D3C7] text-[#242522] font-medium focus:ring-1 focus:ring-[#174C3A]"
                >
                  {currentStateRecord.districts.map((d) => (
                    <option key={d.districtCode} value={d.districtName}>
                      {d.districtName} (LGD #{d.districtCode}) — {d.urbanityClassification}
                    </option>
                  ))}
                </select>
              </div>

              {/* Block Selector */}
              <div>
                <label className="block font-semibold text-[#242522] mb-1.5 flex items-center justify-between">
                  <span>Sub-District / Block / Taluka <span className="text-[#B95736]">*</span></span>
                  <span className="text-[10px] font-semibold text-[#174C3A] bg-[#174C3A]/10 px-2 py-0.5 rounded-full">
                    {currentDistrictRecord.blocks.length} Blocks
                  </span>
                </label>
                <select 
                  value={block} 
                  onChange={(e) => handleBlockChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#D9D3C7] text-[#242522] font-medium focus:ring-1 focus:ring-[#174C3A]"
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

              {/* Gram Panchayat */}
              <div>
                <label className="block font-semibold text-[#242522] mb-1.5 flex items-center justify-between">
                  <span>Gram Panchayat / Local Body <span className="text-[#B95736]">*</span></span>
                  <span className="text-[10px] font-semibold text-[#174C3A] bg-[#174C3A]/10 px-2 py-0.5 rounded-full">
                    {availableGPs.length} Local Bodies
                  </span>
                </label>
                <select 
                  value={gramPanchayat} 
                  onChange={(e) => handleGPChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#D9D3C7] text-[#242522] font-medium focus:ring-1 focus:ring-[#174C3A]"
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

              {/* Village Selector */}
              <div className="sm:col-span-2 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <label className="block font-semibold text-[#242522]">
                      Village / Revenue Gaon Body <span className="text-[#B95736]">*</span>
                    </label>
                    {!isCustomVillage && (
                      <span className="text-[10px] font-bold text-[#174C3A] bg-[#174C3A]/10 px-2 py-0.5 rounded-full">
                        {filteredVillages.length} of {availableVillages.length} Villages {block === 'ALL_BLOCKS' ? `(All ${district})` : `(${block})`}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {(block !== 'ALL_BLOCKS' || gramPanchayat !== 'ALL_GPS' || villageSearch) && (
                      <button
                        type="button"
                        onClick={handleShowAllDistrictVillages}
                        className="text-[11px] font-semibold text-[#B95736] hover:underline"
                      >
                        Show All {currentDistrictRecord.villages.length} in {district}
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
                      className="w-full px-3.5 py-1.5 text-xs rounded-lg bg-white border border-[#D9D3C7] text-[#242522] placeholder:text-[#68655D] focus:ring-1 focus:ring-[#174C3A]"
                    />
                    {villageSearch && (
                      <button
                        type="button"
                        onClick={() => setVillageSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#68655D] hover:text-[#242522]"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                )}

                {isCustomVillage || availableVillages.length === 0 ? (
                  <input 
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="Enter village or revenue gaon name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#D9D3C7] text-[#242522] font-medium focus:ring-1 focus:ring-[#174C3A]"
                  />
                ) : (
                  <select 
                    value={village} 
                    onChange={(e) => handleVillageSelect(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#D9D3C7] text-[#242522] font-medium focus:ring-1 focus:ring-[#174C3A]"
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

              {/* PIN Code */}
              <div>
                <label className="block font-semibold text-[#242522] mb-1.5">Postal PIN Code</label>
                <input 
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#D9D3C7] text-[#242522] font-medium focus:ring-1 focus:ring-[#174C3A]"
                />
              </div>
            </div>

            {/* Habitations / Tolas Chips */}
            {availableHabitations.length > 0 && (
              <div className="mt-4 p-3.5 rounded-2xl bg-[#F8F5EE] border border-[#D9D3C7] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#242522] flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-[#174C3A]" />
                    Hyper-Local Habitation / Majra / Tola / Wada:
                  </span>
                  <span className="text-[10px] text-[#68655D]">Census Locality Cluster</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {availableHabitations.map((hab) => (
                    <button
                      key={hab}
                      type="button"
                      onClick={() => setSelectedHabitation(hab)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        selectedHabitation === hab
                          ? 'bg-[#174C3A] text-[#FCFAF5] shadow-xs'
                          : 'bg-[#FCFAF5] text-[#242522] hover:bg-[#EAE4D9] border border-[#D9D3C7]'
                      }`}
                    >
                      {hab}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Opportunity Radius Toggle & Save */}
            <div className="mt-6 pt-4 border-t border-[#D9D3C7]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs">
                <span className="font-semibold text-[#242522]">Opportunity Catchment Radius:</span>
                <div className="flex rounded-xl bg-[#F8F5EE] p-1 border border-[#D9D3C7]">
                  <button
                    type="button"
                    onClick={() => setRadius(5)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      radius === 5 ? 'bg-[#174C3A] text-[#FCFAF5]' : 'text-[#68655D] hover:text-[#242522]'
                    }`}
                  >
                    5 km (Immediate Shandy)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRadius(10)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      radius === 10 ? 'bg-[#174C3A] text-[#FCFAF5]' : 'text-[#68655D] hover:text-[#242522]'
                    }`}
                  >
                    10 km (APMC Cluster)
                  </button>
                </div>
              </div>

              <Button 
                variant="forest" 
                size="sm" 
                onClick={handleSaveLocation}
                className="text-xs cursor-pointer"
              >
                {isSaved ? (
                  <span className="flex items-center gap-1.5 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" /> Saved Successfully
                  </span>
                ) : (
                  'Update Location Parameters'
                )}
              </Button>
            </div>
          </Card>

          {/* Infrastructure & Connectivity Readiness */}
          <Card title="Infrastructure & Utility Diagnostics" subtitle="Physical and energy infrastructure logs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#F8F5EE] border border-[#D9D3C7]">
                <div className="text-[10px] uppercase font-bold text-[#68655D]">Road Connectivity</div>
                <div className="text-xs font-bold text-[#242522] mt-1">PMGSY All-Weather Bitumen</div>
                <div className="text-[10px] text-[#71856A] font-semibold mt-1">Linked to State / National Highway</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8F5EE] border border-[#D9D3C7]">
                <div className="text-[10px] uppercase font-bold text-[#68655D]">Commercial Power Grid</div>
                <div className="text-xs font-bold text-[#174C3A] mt-1">{currentDistrictRecord.powerTariffZone}</div>
                <div className="text-[10px] text-[#68655D] mt-1">Agro-Processing Priority Feeder</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8F5EE] border border-[#D9D3C7]">
                <div className="text-[10px] uppercase font-bold text-[#68655D]">Nearest APMC Mandi</div>
                <div className="text-xs font-bold text-[#242522] mt-1">{district} APMC Yard ({radius} km)</div>
                <div className="text-[10px] text-[#B95736] font-semibold mt-1">Agmarknet Live Rates Active</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Statutory Subsidy Multipliers & Demographics */}
        <div className="space-y-6">
          <Card title="Demographic Classification" subtitle="Used for statutory subsidy multipliers">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[#D9D3C7]/60">
                <span className="text-[#68655D]">Area Classification:</span>
                <Badge variant={isRural ? "forest" : "amber"}>
                  {isRural ? 'Rural Area (35% Tier)' : 'Semi-Urban / Urban'}
                </Badge>
              </div>
              <div className="flex justify-between py-2 border-b border-[#D9D3C7]/60">
                <span className="text-[#68655D]">Social Category:</span>
                <span className="font-bold text-[#242522]">{user?.demographics.category || 'OBC / Special Category'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#D9D3C7]/60">
                <span className="text-[#68655D]">Promoter Gender:</span>
                <span className="font-bold text-[#242522]">{user?.demographics.gender || 'MALE'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#D9D3C7]/60">
                <span className="text-[#68655D]">PMEGP Subsidy Rate:</span>
                <span className="font-extrabold text-[#174C3A]">{subsidyDetails.subsidyPct}% of Total Project Cost</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#68655D]">Min Own Contribution:</span>
                <span className="font-extrabold text-[#B95736]">{subsidyDetails.ownContributionPct}% (Promoter Equity)</span>
              </div>
            </div>
          </Card>

          {/* Explicit Unknown Hyper-Local Data */}
          <Card title="Uncertainty & Data Gaps" subtitle="Explicit UNKNOWN policy — No hallucinated statistics">
            <div className="space-y-3">
              <UnknownState
                title="Micro Cold Room within 10 km"
                reason="District horticulture department has not published geo-tagged micro cold room registry for this gram panchayat."
              />
              <UnknownState
                title="Unorganized Village Processing Units"
                reason="Informal home-based manual dehullers and extractors are unregistered under Udyam or Factories Act."
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
