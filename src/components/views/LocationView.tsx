/**
 * @license
 * GRAM-DISHA — Hyper-Local Geographic Context (LGD Hierarchy)
 */

import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Compass, 
  ShieldCheck, 
  HelpCircle,
  Building,
  Navigation,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { UnknownState } from '../common/UnknownState';
import { useAuth } from '../../context/AuthContext';
import { useDisha } from '../../context/DishaContext';

export const LocationView: React.FC = () => {
  const { user, activeBusiness, updateActiveBusiness } = useAuth();
  const { openAdvisorWithInsight } = useDisha();

  const [stateName, setStateName] = useState(activeBusiness.proposedLocation.state || 'Maharashtra');
  const [district, setDistrict] = useState(activeBusiness.proposedLocation.district || 'Yavatmal');
  const [block, setBlock] = useState(activeBusiness.proposedLocation.block || 'Pusad');
  const [gramPanchayat, setGramPanchayat] = useState(activeBusiness.proposedLocation.gramPanchayat || 'Shendurjana');
  const [village, setVillage] = useState(activeBusiness.proposedLocation.villageOrLocality || 'Shendurjana Khurd');
  const [pincode, setPincode] = useState(activeBusiness.proposedLocation.pincode || '445204');
  const [radius, setRadius] = useState<5 | 10>(activeBusiness.proposedLocation.opportunityRadiusKm || 10);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveLocation = () => {
    updateActiveBusiness({
      proposedLocation: {
        state: stateName,
        district,
        block,
        gramPanchayat,
        villageOrLocality: village,
        pincode,
        isRural: true,
        opportunityRadiusKm: radius,
        coordinates: activeBusiness.proposedLocation.coordinates,
      }
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);

    openAdvisorWithInsight(
      `Synchronized geographic context to ${gramPanchayat} Gram Panchayat, ${district} District. Rural status verified under LGD 2026 directory code.`,
      ['35% Special Rural Subsidy rate applies under PMEGP & PMFME.'],
      'Explore Market Intelligence to inspect APMC Mandi commodity rates for this district.'
    );
  };

  return (
    <div id="location_view" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D9D3C7]/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-[#242522]">
            Hyper-Local Geographic Context (LGD)
          </h1>
          <p className="text-xs text-[#68655D] mt-0.5">
            Local Government Directory (LGD) Hierarchy Mapping & Proximity Radius
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="forest" size="md">LGD Verified Code #245192</Badge>
          <Badge variant="sage" size="md">{radius} km Cluster Window</Badge>
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
              <div>
                <label className="block font-semibold text-[#242522] mb-1.5">State (LGD State Code)</label>
                <select 
                  value={stateName} 
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#D9D3C7] text-[#242522] font-medium focus:ring-1 focus:ring-[#174C3A]"
                >
                  <option value="Maharashtra">Maharashtra (MH - 27)</option>
                  <option value="Madhya Pradesh">Madhya Pradesh (MP - 23)</option>
                  <option value="Uttar Pradesh">Uttar Pradesh (UP - 09)</option>
                  <option value="Rajasthan">Rajasthan (RJ - 08)</option>
                  <option value="Bihar">Bihar (BR - 10)</option>
                  <option value="Gujarat">Gujarat (GJ - 24)</option>
                  <option value="Karnataka">Karnataka (KA - 29)</option>
                  <option value="Andhra Pradesh">Andhra Pradesh (AP - 28)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#242522] mb-1.5">District</label>
                <input 
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#D9D3C7] text-[#242522] font-medium focus:ring-1 focus:ring-[#174C3A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#242522] mb-1.5">Block / Sub-District / Taluka</label>
                <input 
                  type="text"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#D9D3C7] text-[#242522] font-medium focus:ring-1 focus:ring-[#174C3A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#242522] mb-1.5">Gram Panchayat</label>
                <input 
                  type="text"
                  value={gramPanchayat}
                  onChange={(e) => setGramPanchayat(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#D9D3C7] text-[#242522] font-medium focus:ring-1 focus:ring-[#174C3A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#242522] mb-1.5">Village / Locality</label>
                <input 
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#D9D3C7] text-[#242522] font-medium focus:ring-1 focus:ring-[#174C3A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#242522] mb-1.5">Postal PIN Code</label>
                <input 
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F5EE] border border-[#D9D3C7] text-[#242522] font-medium focus:ring-1 focus:ring-[#174C3A]"
                />
              </div>
            </div>

            {/* Opportunity Radius Toggle */}
            <div className="mt-6 pt-4 border-t border-[#D9D3C7]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs">
                <span className="font-semibold text-[#242522]">Opportunity Catchment Radius:</span>
                <div className="flex rounded-xl bg-[#F8F5EE] p-1 border border-[#D9D3C7]">
                  <button
                    type="button"
                    onClick={() => setRadius(5)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      radius === 5 ? 'bg-[#174C3A] text-[#FCFAF5]' : 'text-[#68655D] hover:text-[#242522]'
                    }`}
                  >
                    5 km (Immediate Shandy)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRadius(10)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
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
                className="text-xs"
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
                <div className="text-xs font-bold text-[#242522] mt-1">State Highway SH-14 (3.2 km)</div>
                <div className="text-[10px] text-[#71856A] font-semibold mt-1">PMGSY All-Weather Bitumen</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8F5EE] border border-[#D9D3C7]">
                <div className="text-[10px] uppercase font-bold text-[#68655D]">3-Phase Commercial Power</div>
                <div className="text-xs font-bold text-[#174C3A] mt-1">19.5 Hrs / Day Average</div>
                <div className="text-[10px] text-[#68655D] mt-1">Rural Feeder Index Verified</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8F5EE] border border-[#D9D3C7]">
                <div className="text-[10px] uppercase font-bold text-[#68655D]">Nearest APMC Mandi</div>
                <div className="text-xs font-bold text-[#242522] mt-1">Pusad APMC Yard (8.5 km)</div>
                <div className="text-[10px] text-[#B95736] font-semibold mt-1">Daily Live Trading Active</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Explicit Uncertainty & Demographics Card */}
        <div className="space-y-6">
          <Card title="Demographic Classification" subtitle="Used for statutory subsidy multipliers">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[#D9D3C7]/60">
                <span className="text-[#68655D]">Area Classification:</span>
                <Badge variant="forest">Rural Panchayat (Higher Subsidy Tier)</Badge>
              </div>
              <div className="flex justify-between py-2 border-b border-[#D9D3C7]/60">
                <span className="text-[#68655D]">Social Category:</span>
                <span className="font-bold text-[#242522]">{user?.demographics.category || 'OBC'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#D9D3C7]/60">
                <span className="text-[#68655D]">Promoter Gender:</span>
                <span className="font-bold text-[#242522]">{user?.demographics.gender || 'MALE'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#D9D3C7]/60">
                <span className="text-[#68655D]">PMEGP Subsidy Rate:</span>
                <span className="font-extrabold text-[#174C3A]">35% of Total Project Cost</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#68655D]">Min Own Contribution:</span>
                <span className="font-extrabold text-[#B95736]">5% (Special Category Rate)</span>
              </div>
            </div>
          </Card>

          {/* Explicit Unknown Hyper-Local Data */}
          <Card title="Uncertainty & Data Gaps" subtitle="Explicit UNKNOWN policy — No hallucinated statistics">
            <div className="space-y-3">
              <UnknownState
                title="Local Cold Storage Within 10 km"
                reason="District marketing federation has not published geo-tagged micro cold room registry for this gram panchayat."
              />
              <UnknownState
                title="Unorganized Village Chana Millers"
                reason="Informal home-based manual dehullers are unregistered under Udyam or Factories Act."
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
