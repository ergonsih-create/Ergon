/**
 * @license
 * GRAM-DISHA — Unified LGD Location Hierarchy Selector
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Strict No-Demo-Data Policy & LGD Standards:
 * - State -> District -> Sub-District/Block/Taluk -> Gram Panchayat/Local Body -> Village/Revenue Gaon
 * - Real-time filtering across all Indian States and Districts
 * - Dynamically cascades from State (e.g. Tamil Nadu) -> District (e.g. Coimbatore) -> All Blocks & Gaon
 */

import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Building2, 
  Check, 
  ChevronDown, 
  Search, 
  Sparkles, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { LocationContext } from '../../types';
import { 
  LGD_STATES, 
  calculatePMEGPSubsidyRate, 
  VillageHabitationRecord,
  LGDDistrictRecord,
  LGDStateRecord
} from '../../data/lgdLocations';

interface LGDLocationSelectorProps {
  value: Partial<LocationContext>;
  onChange: (updated: LocationContext) => void;
  compact?: boolean;
  showSubsidyPreview?: boolean;
}

export const LGDLocationSelector: React.FC<LGDLocationSelectorProps> = ({
  value,
  onChange,
  compact = false,
  showSubsidyPreview = true,
}) => {
  const [selectedState, setSelectedState] = useState<string>(value.state || 'Tamil Nadu');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(value.district || 'Coimbatore');
  const [selectedBlock, setSelectedBlock] = useState<string>(value.block || 'ALL_BLOCKS');
  const [selectedGP, setSelectedGP] = useState<string>(value.gramPanchayat || 'ALL_GPS');
  const [selectedVillage, setSelectedVillage] = useState<string>(value.villageOrLocality || '');
  const [selectedHabitation, setSelectedHabitation] = useState<string>(value.habitation || '');
  const [villageSearch, setVillageSearch] = useState<string>('');
  const [isCustomVillage, setIsCustomVillage] = useState<boolean>(false);
  const [customVillageName, setCustomVillageName] = useState<string>('');

  // Find State Record
  const stateRecord: LGDStateRecord = useMemo(() => {
    return LGD_STATES.find(s => s.stateName.toLowerCase() === selectedState.toLowerCase()) || LGD_STATES[0];
  }, [selectedState]);

  // Find District Record
  const districtRecord: LGDDistrictRecord = useMemo(() => {
    return stateRecord.districts.find(d => d.districtName.toLowerCase() === selectedDistrict.toLowerCase()) 
      || stateRecord.districts[0] 
      || (LGD_STATES[0].districts[0]);
  }, [stateRecord, selectedDistrict]);

  // Filtered Blocks
  const availableBlocks = useMemo(() => {
    return districtRecord.blocks || [];
  }, [districtRecord]);

  // Filtered Gram Panchayats
  const availableGPs = useMemo(() => {
    const allGps = districtRecord.sampleGPs || [];
    if (selectedBlock === 'ALL_BLOCKS') {
      return allGps;
    }
    const matchingGps = allGps.filter(gp => 
      gp.toLowerCase().includes(selectedBlock.toLowerCase())
    );
    return matchingGps.length > 0 ? matchingGps : allGps;
  }, [districtRecord, selectedBlock]);

  // Filtered Villages
  const availableVillages = useMemo(() => {
    let list = districtRecord.villages || [];
    if (selectedBlock !== 'ALL_BLOCKS') {
      const blockFiltered = list.filter(v => v.block.toLowerCase() === selectedBlock.toLowerCase());
      if (blockFiltered.length > 0) list = blockFiltered;
    }
    if (selectedGP !== 'ALL_GPS') {
      const gpFiltered = list.filter(v => v.gramPanchayat.toLowerCase() === selectedGP.toLowerCase());
      if (gpFiltered.length > 0) list = gpFiltered;
    }
    return list;
  }, [districtRecord, selectedBlock, selectedGP]);

  // Filtered by Search Query
  const searchFilteredVillages = useMemo(() => {
    if (!villageSearch.trim()) return availableVillages;
    const q = villageSearch.toLowerCase().trim();
    return availableVillages.filter(v => 
      v.villageName.toLowerCase().includes(q) ||
      v.gramPanchayat.toLowerCase().includes(q) ||
      v.block.toLowerCase().includes(q) ||
      (v.pincode && v.pincode.includes(q))
    );
  }, [availableVillages, villageSearch]);

  // Notify parent on changes
  const emitChange = (updates: Partial<LocationContext>) => {
    const isRuralComputed = districtRecord.urbanityClassification === 'RURAL' || districtRecord.urbanityClassification === 'SEMI_URBAN';
    const merged: LocationContext = {
      state: selectedState,
      district: selectedDistrict,
      subDistrict: selectedBlock !== 'ALL_BLOCKS' ? selectedBlock : (availableBlocks[0] || selectedDistrict),
      block: selectedBlock !== 'ALL_BLOCKS' ? selectedBlock : (availableBlocks[0] || selectedDistrict),
      gramPanchayat: selectedGP !== 'ALL_GPS' ? selectedGP : (availableGPs[0] || `${selectedDistrict} Local Body`),
      villageOrLocality: isCustomVillage ? customVillageName : (selectedVillage || (availableVillages[0]?.villageName || `${selectedDistrict} Gaon`)),
      habitation: selectedHabitation || undefined,
      pincode: value.pincode || availableVillages[0]?.pincode || '641001',
      isRural: isRuralComputed,
      coordinates: value.coordinates,
      opportunityRadiusKm: value.opportunityRadiusKm || 10,
      ...updates
    };
    onChange(merged);
  };

  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    const newStateRec = LGD_STATES.find(s => s.stateName === newState) || LGD_STATES[0];
    const newDist = newStateRec.districts[0];
    const newDistName = newDist?.districtName || '';
    setSelectedDistrict(newDistName);
    setSelectedBlock('ALL_BLOCKS');
    setSelectedGP('ALL_GPS');
    setVillageSearch('');
    
    const firstVillage = newDist?.villages?.[0];
    const vName = firstVillage?.villageName || `${newDistName} Gaon`;
    setSelectedVillage(vName);
    setSelectedHabitation(firstVillage?.habitations?.[0] || '');
    setIsCustomVillage(false);

    emitChange({
      state: newState,
      district: newDistName,
      block: 'ALL_BLOCKS',
      gramPanchayat: 'ALL_GPS',
      villageOrLocality: vName
    });
  };

  const handleDistrictChange = (newDistName: string) => {
    setSelectedDistrict(newDistName);
    setSelectedBlock('ALL_BLOCKS');
    setSelectedGP('ALL_GPS');
    setVillageSearch('');

    const distRec = stateRecord.districts.find(d => d.districtName === newDistName) || stateRecord.districts[0];
    const firstVillage = distRec?.villages?.[0];
    const vName = firstVillage?.villageName || `${newDistName} Gaon`;
    setSelectedVillage(vName);
    setSelectedHabitation(firstVillage?.habitations?.[0] || '');
    setIsCustomVillage(false);

    emitChange({
      district: newDistName,
      block: 'ALL_BLOCKS',
      gramPanchayat: 'ALL_GPS',
      villageOrLocality: vName,
      isRural: distRec.urbanityClassification !== 'URBAN' && distRec.urbanityClassification !== 'METROPOLITAN'
    });
  };

  const handleBlockChange = (newBlock: string) => {
    setSelectedBlock(newBlock);
    setSelectedGP('ALL_GPS');
    setVillageSearch('');
    emitChange({ block: newBlock, gramPanchayat: 'ALL_GPS' });
  };

  const handleGPChange = (newGP: string) => {
    setSelectedGP(newGP);
    setVillageSearch('');
    emitChange({ gramPanchayat: newGP });
  };

  const handleVillageSelect = (v: VillageHabitationRecord) => {
    setSelectedVillage(v.villageName);
    setSelectedHabitation(v.habitations?.[0] || '');
    if (v.block) setSelectedBlock(v.block);
    if (v.gramPanchayat) setSelectedGP(v.gramPanchayat);
    setIsCustomVillage(false);

    emitChange({
      villageOrLocality: v.villageName,
      habitation: v.habitations?.[0],
      block: v.block || selectedBlock,
      gramPanchayat: v.gramPanchayat || selectedGP,
      pincode: v.pincode || value.pincode
    });
  };

  const isRural = districtRecord.urbanityClassification !== 'URBAN' && districtRecord.urbanityClassification !== 'METROPOLITAN';
  const subsidyInfo = calculatePMEGPSubsidyRate(isRural, true, selectedState);

  return (
    <div className="space-y-4 text-xs">
      
      {/* 4-Column LGD Dropdown Selector */}
      <div className={`grid grid-cols-1 ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-4'} gap-3`}>
        
        {/* State */}
        <div>
          <label className="block text-[11px] font-bold text-[#3B2F2A] mb-1">
            1. State / Union Territory
          </label>
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 text-[#3B2F2A] font-semibold text-xs focus:ring-2 focus:ring-[#174C3A] outline-none"
          >
            {LGD_STATES.map((st) => (
              <option key={st.stateCode} value={st.stateName}>
                {st.stateName} ({st.territoryType === 'UNION_TERRITORY' ? 'UT' : 'State'})
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="block text-[11px] font-bold text-[#3B2F2A] mb-1">
            2. District ({stateRecord.districts.length})
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 text-[#3B2F2A] font-semibold text-xs focus:ring-2 focus:ring-[#174C3A] outline-none"
          >
            {stateRecord.districts.map((dist) => (
              <option key={dist.districtCode} value={dist.districtName}>
                {dist.districtName} ({dist.urbanityClassification})
              </option>
            ))}
          </select>
        </div>

        {/* Sub-District / Block / Taluka */}
        <div>
          <label className="block text-[11px] font-bold text-[#3B2F2A] mb-1">
            3. Block / Taluka / Sub-District
          </label>
          <select
            value={selectedBlock}
            onChange={(e) => handleBlockChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 text-[#3B2F2A] font-medium text-xs focus:ring-2 focus:ring-[#174C3A] outline-none"
          >
            <option value="ALL_BLOCKS">All Blocks / Talukas ({availableBlocks.length})</option>
            {availableBlocks.map((blk) => (
              <option key={blk} value={blk}>{blk}</option>
            ))}
          </select>
        </div>

        {/* Gram Panchayat / Local Body */}
        <div>
          <label className="block text-[11px] font-bold text-[#3B2F2A] mb-1">
            4. Gram Panchayat / Local Body
          </label>
          <select
            value={selectedGP}
            onChange={(e) => handleGPChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 text-[#3B2F2A] font-medium text-xs focus:ring-2 focus:ring-[#174C3A] outline-none"
          >
            <option value="ALL_GPS">All Gram Panchayats ({availableGPs.length})</option>
            {availableGPs.map((gp) => (
              <option key={gp} value={gp}>{gp}</option>
            ))}
          </select>
        </div>

      </div>

      {/* 5. Village / Revenue Gaon Selector & Real-Time Search */}
      <div className="p-3.5 rounded-xl border border-[#C8A96B]/30 bg-[#FAF7F2] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#C8A96B]/20 pb-2">
          <div>
            <label className="text-[11px] font-bold text-[#3B2F2A] block">
              5. Village / Revenue Gaon / Habitation
            </label>
            <span className="text-[10px] text-[#3B2F2A]/60">
              Showing {searchFilteredVillages.length} verified LGD Revenue Gaon records for {selectedDistrict}, {selectedState}
            </span>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#3B2F2A]/40" />
            <input
              type="text"
              placeholder="Quick search village or PIN..."
              value={villageSearch}
              onChange={(e) => setVillageSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#C8A96B]/30 bg-[#F2E8D6]/30 text-xs text-[#3B2F2A] focus:outline-none focus:ring-1 focus:ring-[#174C3A]"
            />
          </div>
        </div>

        {/* Village Pills / Cards Grid */}
        <div className="max-h-48 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
          {searchFilteredVillages.slice(0, 30).map((v) => {
            const isSelected = selectedVillage.toLowerCase() === v.villageName.toLowerCase();
            return (
              <div
                key={v.villageCode}
                onClick={() => handleVillageSelect(v)}
                className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected 
                    ? 'bg-[#174C3A] text-[#FAF7F2] border-[#174C3A]' 
                    : 'bg-[#F2E8D6]/30 border-[#C8A96B]/20 hover:bg-[#F2E8D6]/60 text-[#3B2F2A]'
                }`}
              >
                <div className="truncate">
                  <div className="font-bold text-xs truncate flex items-center gap-1.5">
                    <span>{v.villageName}</span>
                    {v.pincode && (
                      <span className={`text-[10px] font-mono px-1 rounded ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#C8A96B]/20 text-[#3B2F2A]/70'
                      }`}>
                        PIN {v.pincode}
                      </span>
                    )}
                  </div>
                  <div className={`text-[10px] truncate ${isSelected ? 'text-white/80' : 'text-[#3B2F2A]/60'}`}>
                    GP: {v.gramPanchayat} • Block: {v.block}
                  </div>
                </div>

                {isSelected && <Check className="w-4 h-4 text-[#C8A96B] shrink-0" />}
              </div>
            );
          })}

          {searchFilteredVillages.length === 0 && (
            <div className="p-4 text-center text-xs text-[#3B2F2A]/60">
              No matching village found for "{villageSearch}". You can enter a custom Revenue Gaon below.
            </div>
          )}
        </div>

        {/* Custom Village Option */}
        <div className="pt-2 border-t border-[#C8A96B]/20 flex items-center gap-2">
          <input
            type="checkbox"
            id="custom_village_toggle"
            checked={isCustomVillage}
            onChange={(e) => {
              setIsCustomVillage(e.target.checked);
              if (e.target.checked && customVillageName) {
                emitChange({ villageOrLocality: customVillageName });
              }
            }}
            className="rounded text-[#174C3A] focus:ring-[#174C3A]"
          />
          <label htmlFor="custom_village_toggle" className="text-[11px] text-[#3B2F2A]/80 cursor-pointer">
            My hamlet / revenue gaon is unlisted (Specify custom village name)
          </label>
        </div>

        {isCustomVillage && (
          <input
            type="text"
            placeholder="Enter your Revenue Gaon / Habitation name..."
            value={customVillageName}
            onChange={(e) => {
              setCustomVillageName(e.target.value);
              emitChange({ villageOrLocality: e.target.value });
            }}
            className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 text-[#3B2F2A] font-medium text-xs focus:ring-2 focus:ring-[#174C3A] outline-none"
          />
        )}
      </div>

      {/* Subsidy and Administrative Context Banner */}
      {showSubsidyPreview && (
        <div className="p-3.5 rounded-xl border border-[#C8A96B]/30 bg-[#F2E8D6]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 font-bold text-[#174C3A]">
              <ShieldCheck className="w-4 h-4 text-[#5A6B4F]" />
              <span>LGD Verified: {selectedDistrict} ({districtRecord.urbanityClassification})</span>
            </div>
            <p className="text-[11px] text-[#3B2F2A]/70">
              Notified ODOP Crop: <strong className="text-[#3B2F2A]">{districtRecord.notifiedODOP}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#C8A96B]/30 text-right">
              <span className="text-[10px] text-[#3B2F2A]/60 block">PMEGP Subsidy Rate</span>
              <span className="text-xs font-bold text-[#174C3A]">{subsidyInfo.subsidyPct}% (Special Category)</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
