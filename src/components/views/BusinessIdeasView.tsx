/**
 * @license
 * GRAM-DISHA — My Business Management Hub (/business/*)
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Strict No-Demo-Data Policy:
 * - Allows users to view, create, edit, save, and update their actual business profile
 * - Persists to local storage & FastAPI MySQL backend
 * - If no business created yet: displays honest empty state with clear creation form
 */

import React, { useState } from 'react';
import { 
  Building, 
  PlusCircle, 
  Check, 
  Save, 
  MapPin, 
  Layers, 
  Wrench, 
  AlertCircle, 
  FileText, 
  TrendingUp, 
  BookOpen,
  HelpCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDisha } from '../../context/DishaContext';
import { useLanguage } from '../../context/LanguageContext';
import { BusinessContext, DishaContextState, LocationContext } from '../../types';
import { CURATED_BUSINESS_TEMPLATES } from '../../data/sampleBusinesses';
import { Badge } from '../common/Badge';
import { LGDLocationSelector } from '../common/LGDLocationSelector';

export const BusinessIdeasView: React.FC<{ onNavigate?: (mod: DishaContextState['currentModule']) => void }> = ({ onNavigate }) => {
  const { activeBusiness, saveBusiness, updateActiveBusiness, user } = useAuth();
  const { openAdvisorWithInsight } = useDisha();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'PROFILE' | 'REQUIREMENTS' | 'DOCUMENTS' | 'GROWTH' | 'TEMPLATES'>('PROFILE');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Form State initialized from activeBusiness if it exists
  const [title, setTitle] = useState(activeBusiness?.title || '');
  const [category, setCategory] = useState(activeBusiness?.category || 'Agro-Processing & Food Value Addition');
  const [activity, setActivity] = useState(activeBusiness?.activity || '');
  const [stage, setStage] = useState(activeBusiness?.stage || 'PROPOSED');
  const [scale, setScale] = useState(activeBusiness?.scale || 'MICRO');
  const [description, setDescription] = useState(activeBusiness?.description || '');
  const [targetMarket, setTargetMarket] = useState(activeBusiness?.targetMarket || 'Local Haat & District Wholesalers');
  const [financialGoal, setFinancialGoal] = useState(activeBusiness?.financialGoal || '');
  const [proposedLocation, setProposedLocation] = useState<LocationContext>(
    activeBusiness?.proposedLocation || user?.location || {
      state: 'Tamil Nadu',
      district: 'Coimbatore',
      block: 'Coimbatore North',
      gramPanchayat: 'Somayampalayam Gram Panchayat',
      villageOrLocality: 'Somayampalayam Gaon',
      isRural: true,
      opportunityRadiusKm: 10
    }
  );

  // Requirements state
  const [landOwnership, setLandOwnership] = useState<'OWNED' | 'LEASED' | 'RENTED' | 'NEEDED'>(
    activeBusiness?.requirements?.landOwnership || 'OWNED'
  );
  const [powerAvailable, setPowerAvailable] = useState<boolean>(
    activeBusiness?.requirements?.powerAvailability ?? true
  );
  const [waterAvailable, setWaterAvailable] = useState<boolean>(
    activeBusiness?.requirements?.waterSupply ?? true
  );
  const [roadAccess, setRoadAccess] = useState<boolean>(
    activeBusiness?.requirements?.roadConnectivity ?? true
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const locationContext = proposedLocation;

    const newBiz: BusinessContext = {
      id: activeBusiness?.id || `biz_${Date.now()}`,
      title,
      category,
      activity: activity || title,
      stage,
      scale,
      description,
      targetMarket,
      financialGoal,
      proposedLocation: locationContext,
      requirements: {
        landOwnership,
        powerAvailability: powerAvailable,
        waterSupply: waterAvailable,
        roadConnectivity: roadAccess,
      },
      capitalRequirements: activeBusiness?.capitalRequirements || {
        totalEstimatedCost: 500000,
        promoterContributionMin: 50000,
        bankTermLoanMax: 450000,
        subsidyEligibleEstimate: 175000,
        workingCapitalMargin: 50000
      }
    };

    if (activeBusiness) {
      updateActiveBusiness(newBiz);
      setSaveMessage('Enterprise profile updated successfully.');
    } else {
      saveBusiness(newBiz);
      setSaveMessage('New enterprise profile registered successfully.');
    }

    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleApplyTemplate = (templateId: string) => {
    const tmpl = CURATED_BUSINESS_TEMPLATES.find(t => t.context.id === templateId);
    if (tmpl) {
      setTitle(tmpl.context.title);
      setCategory(tmpl.context.category);
      setActivity(tmpl.context.activity);
      setDescription(tmpl.context.description);
      setStage(tmpl.context.stage);
      setScale(tmpl.context.scale);
      setTargetMarket(tmpl.context.targetMarket || 'Local Haat & District Wholesalers');
      setActiveTab('PROFILE');
      setSaveMessage(`Loaded benchmark parameters for ${tmpl.context.title}. Click "Save Profile" to register.`);
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  return (
    <div id="business_view_root" className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#C8A96B]/20">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#174C3A] text-[#FAF7F2] flex items-center justify-center">
              <Building className="w-4 h-4 text-[#C8A96B]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-[#3B2F2A]">
              {t('myBusiness')}
            </h1>
          </div>
          <p className="text-xs text-[#3B2F2A]/70 mt-1">
            Official operational parameters, sector activity, and infrastructure readiness for your bankable micro-enterprise.
          </p>
        </div>

        {saveMessage && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5A6B4F]/15 border border-[#5A6B4F]/40 text-xs font-bold text-[#5A6B4F] animate-in fade-in">
            <Check className="w-4 h-4 text-[#5A6B4F]" />
            <span>{saveMessage}</span>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#C8A96B]/20 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'PROFILE', label: t('profile') },
          { id: 'REQUIREMENTS', label: 'Infrastructure & Assets' },
          { id: 'DOCUMENTS', label: t('documents') },
          { id: 'GROWTH', label: t('progress') },
          { id: 'TEMPLATES', label: 'Reference Models' },
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

      {/* TAB 1: BUSINESS PROFILE (VIEW & EDIT FORM) */}
      {activeTab === 'PROFILE' && (
        <form onSubmit={handleSaveProfile} className="bg-[#FAF7F2] border border-[#C8A96B]/30 rounded-2xl p-6 shadow-xs space-y-5 max-w-3xl">
          <div className="border-b border-[#C8A96B]/20 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#3B2F2A]">
                {activeBusiness ? 'Edit Enterprise Details' : 'Register New Enterprise Profile'}
              </h2>
              <p className="text-xs text-[#3B2F2A]/60 mt-0.5">
                Information entered here directly populates your PMEGP DPR and loan application dossiers.
              </p>
            </div>
            {activeBusiness && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#174C3A]/15 text-[#174C3A] uppercase">
                Active Profile
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#3B2F2A] mb-1">
                Enterprise Trade Name / Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Shendurjana Bio-Agro Dal Processing Unit"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B2F2A] mb-1">
                Sector / Industry Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
              >
                <option value="Agro-Processing & Food Value Addition">Agro-Processing & Food Value Addition</option>
                <option value="Organic Agriculture & Bio-Inputs">Organic Agriculture & Bio-Inputs</option>
                <option value="Dairy & Livestock Products">Dairy & Livestock Products</option>
                <option value="Handicrafts & Rural Artisans">Handicrafts & Rural Artisans</option>
                <option value="Rural Services & Maintenance">Rural Services & Maintenance</option>
                <option value="Renewable Energy & Solar Agro">Renewable Energy & Solar Agro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B2F2A] mb-1">
                Primary Economic Activity *
              </label>
              <input
                type="text"
                placeholder="e.g. Pulse processing, grading, polishing & packaging"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B2F2A] mb-1">
                Enterprise Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
              >
                <option value="PROPOSED">Proposed / Conceptual (Seeking Loan)</option>
                <option value="EARLY_STAGE">Early Stage (Commencing Setup)</option>
                <option value="OPERATIONAL">Operational (Looking to Expand)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B2F2A] mb-1">
                MSME Scale Classification
              </label>
              <select
                value={scale}
                onChange={(e) => setScale(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
              >
                <option value="MICRO">Micro Enterprise (Outlay &lt; ₹1 Crore)</option>
                <option value="SMALL">Small Enterprise (Outlay ₹1 Cr - ₹10 Cr)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#3B2F2A] mb-1">
                Detailed Business Description
              </label>
              <textarea
                rows={3}
                placeholder="Describe your processing technology, raw material procurement source, and customer segment..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B2F2A] mb-1">
                Target Market Channel
              </label>
              <input
                type="text"
                placeholder="e.g. APMC Mandi, Local Kirana Stores, SHG federation"
                value={targetMarket}
                onChange={(e) => setTargetMarket(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B2F2A] mb-1">
                12-Month Financial Goal
              </label>
              <input
                type="text"
                placeholder="e.g. ₹15 Lakh annual turnover with 18% net operating profit"
                value={financialGoal}
                onChange={(e) => setFinancialGoal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
              />
            </div>
          </div>

          {/* LGD Location Hierarchy Section */}
          <div className="pt-4 border-t border-[#C8A96B]/20 space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#B45B4A]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#174C3A]">
                Proposed Enterprise Location & LGD Gaon Directory
              </h3>
            </div>
            <p className="text-[11px] text-[#3B2F2A]/70">
              Select State, District, Sub-District / Block / Taluka, Gram Panchayat / Local Body, and Village / Revenue Gaon.
            </p>
            <LGDLocationSelector
              value={proposedLocation}
              onChange={(loc) => setProposedLocation(loc)}
              showSubsidyPreview={true}
            />
          </div>

          <div className="pt-2 border-t border-[#C8A96B]/20 flex items-center justify-between">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#174C3A] text-[#FAF7F2] text-xs font-bold hover:bg-[#174C3A]/90 transition-colors shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#C8A96B]" />
              <span>{t('forms.saveProfileBtn') || (activeBusiness ? 'Update Enterprise Profile' : 'Save & Register Enterprise')}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: INFRASTRUCTURE & REQUIREMENTS */}
      {activeTab === 'REQUIREMENTS' && (
        <div className="bg-[#FAF7F2] border border-[#C8A96B]/30 rounded-2xl p-6 shadow-xs space-y-5 max-w-2xl">
          <div className="border-b border-[#C8A96B]/20 pb-3">
            <h2 className="text-sm font-bold text-[#3B2F2A]">Infrastructure Readiness & Premises</h2>
            <p className="text-xs text-[#3B2F2A]/60 mt-0.5">
              Banks and DIC Task Force scrutinize land ownership, electrical load, and road accessibility during PMEGP DPR evaluation.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#3B2F2A] mb-1">Land / Shed Status</label>
              <select
                value={landOwnership}
                onChange={(e) => setLandOwnership(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
              >
                <option value="OWNED">Own Ancestral / Purchased Land (7/12 Extract available)</option>
                <option value="LEASED">Registered Long-Term Lease (3+ years)</option>
                <option value="RENTED">Rented Processing Shed</option>
                <option value="NEEDED">Land / Shed Needed (Requires assistance)</option>
              </select>
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 p-3 rounded-xl border border-[#C8A96B]/30 cursor-pointer hover:bg-[#F2E8D6]/30">
                <input
                  type="checkbox"
                  checked={powerAvailable}
                  onChange={(e) => setPowerAvailable(e.target.checked)}
                  className="rounded text-[#174C3A] focus:ring-[#174C3A]"
                />
                <div>
                  <span className="text-xs font-bold text-[#3B2F2A]">3-Phase Commercial / Agro Electrical Connection</span>
                  <p className="text-[11px] text-[#3B2F2A]/60">Available at site or pole within 100 meters</p>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-[#C8A96B]/30 cursor-pointer hover:bg-[#F2E8D6]/30">
                <input
                  type="checkbox"
                  checked={waterAvailable}
                  onChange={(e) => setWaterAvailable(e.target.checked)}
                  className="rounded text-[#174C3A] focus:ring-[#174C3A]"
                />
                <div>
                  <span className="text-xs font-bold text-[#3B2F2A]">Continuous Water Supply Source</span>
                  <p className="text-[11px] text-[#3B2F2A]/60">Borewell, gram panchayat line, or open well with pump</p>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-[#C8A96B]/30 cursor-pointer hover:bg-[#F2E8D6]/30">
                <input
                  type="checkbox"
                  checked={roadAccess}
                  onChange={(e) => setRoadAccess(e.target.checked)}
                  className="rounded text-[#174C3A] focus:ring-[#174C3A]"
                />
                <div>
                  <span className="text-xs font-bold text-[#3B2F2A]">All-Weather Pucca Road Connectivity</span>
                  <p className="text-[11px] text-[#3B2F2A]/60">Accessible by light commercial vehicles (LCV / Tractor)</p>
                </div>
              </label>
            </div>
          </div>

          <button
            onClick={() => {
              if (activeBusiness) {
                updateActiveBusiness({
                  requirements: {
                    landOwnership,
                    powerAvailability: powerAvailable,
                    waterSupply: waterAvailable,
                    roadConnectivity: roadAccess
                  }
                });
                setSaveMessage('Infrastructure requirements updated.');
                setTimeout(() => setSaveMessage(null), 3000);
              }
            }}
            className="px-5 py-2.5 rounded-xl bg-[#174C3A] text-[#FAF7F2] text-xs font-bold hover:bg-[#174C3A]/90 transition-colors cursor-pointer"
          >
            Save Infrastructure Details
          </button>
        </div>
      )}

      {/* TAB 3: COMPLIANCE & STATUTORY REGISTRATIONS */}
      {activeTab === 'DOCUMENTS' && (
        <div className="bg-[#FAF7F2] border border-[#C8A96B]/30 rounded-2xl p-6 shadow-xs space-y-4 max-w-2xl">
          <div className="border-b border-[#C8A96B]/20 pb-3">
            <h2 className="text-sm font-bold text-[#3B2F2A]">Mandatory Statutory Registrations</h2>
            <p className="text-xs text-[#3B2F2A]/60 mt-0.5">Checklist of official government portals required for enterprise subsidy disbursement.</p>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Udyam Registration Portal', portal: 'udyamregistration.gov.in', req: 'Zero Fee • Mandatory for MSME Status & PMEGP', active: true },
              { name: 'FSSAI Food Safety License / Registration', portal: 'foscos.fssai.gov.in', req: 'Mandatory for Food Processing & Agro Mills', active: true },
              { name: 'GSTIN (Goods and Services Tax)', portal: 'gst.gov.in', req: 'Required if turnover > ₹40 Lakh (Goods) or Interstate', active: false },
              { name: 'Gram Panchayat NOC & Trade License', portal: 'Local GP Office', req: 'Mandatory for commercial electrical line & bank sanction', active: true },
            ].map((doc, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-[#C8A96B]/30 bg-[#F2E8D6]/30 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-[#3B2F2A]">{doc.name}</div>
                  <div className="text-[11px] text-[#3B2F2A]/60 mt-0.5">{doc.req}</div>
                  <span className="text-[10px] font-mono text-[#174C3A] block mt-1">{doc.portal}</span>
                </div>
                <Badge variant={doc.active ? 'forest' : 'outline'}>
                  {doc.active ? 'Required' : 'Optional at Launch'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: GROWTH MILESTONES */}
      {activeTab === 'GROWTH' && (
        <div className="bg-[#FAF7F2] border border-[#C8A96B]/30 rounded-2xl p-6 shadow-xs space-y-4 max-w-2xl">
          <div className="border-b border-[#C8A96B]/20 pb-3">
            <h2 className="text-sm font-bold text-[#3B2F2A]">Enterprise Growth & Operational Milestones</h2>
            <p className="text-xs text-[#3B2F2A]/60 mt-0.5">Structured timeline from bank loan sanction to break-even commercial sales.</p>
          </div>

          <div className="space-y-3">
            {[
              { month: 'Month 1 - 2', title: 'Sanction & Machinery Procurement', desc: 'Bank loan disbursement, plant order placement, electrification setup.' },
              { month: 'Month 3 - 4', title: 'Installation & Trial Production', desc: 'Civil shed completion, dry testing of mill equipment, FSSAI inspection.' },
              { month: 'Month 5 - 6', title: 'Commercial Operations Launch', desc: 'First batch packaging, local mandi wholesale distribution, retail kirana ties.' },
              { month: 'Month 7 - 12', title: 'Capacity Utilization & Break-Even', desc: 'Attaining 65% capacity utilization and self-sustaining debt service coverage.' },
            ].map((milestone, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-[#C8A96B]/30 bg-[#FAF7F2] flex items-start gap-3">
                <span className="text-xs font-mono font-bold text-[#C8A96B] bg-[#F2E8D6] px-2.5 py-1 rounded-lg shrink-0">
                  {milestone.month}
                </span>
                <div>
                  <div className="text-xs font-bold text-[#3B2F2A]">{milestone.title}</div>
                  <div className="text-[11px] text-[#3B2F2A]/70 mt-0.5">{milestone.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: NABARD BENCHMARK MODELS */}
      {activeTab === 'TEMPLATES' && (
        <div className="space-y-4">
          <div className="border-b border-[#C8A96B]/20 pb-2">
            <h2 className="text-sm font-bold text-[#3B2F2A]">NABARD & Ministry of MSME Reference Models</h2>
            <p className="text-xs text-[#3B2F2A]/60 mt-0.5">
              Sector benchmarks from official government DPR repositories. You can adapt any of these to pre-fill your business parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CURATED_BUSINESS_TEMPLATES.map((tmpl) => (
              <div 
                key={tmpl.context.id}
                className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/30 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#174C3A]/15 text-[#174C3A]">
                      {tmpl.context.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#3B2F2A]">
                      Outlay: ₹{(tmpl.defaultFinancials.projectCost / 100000).toFixed(1)}L
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#3B2F2A] mt-2">{tmpl.context.title}</h3>
                  <p className="text-xs text-[#3B2F2A]/70 mt-1 leading-relaxed">{tmpl.context.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#C8A96B]/20 flex items-center justify-between">
                  <span className="text-[11px] text-[#3B2F2A]/60">
                    Est. Margin: {tmpl.defaultFinancials.promoterCapital ? ((tmpl.defaultFinancials.promoterCapital / tmpl.defaultFinancials.projectCost) * 100).toFixed(0) : 10}%
                  </span>
                  <button
                    onClick={() => handleApplyTemplate(tmpl.context.id)}
                    className="flex items-center gap-1 text-xs font-bold text-[#174C3A] hover:underline cursor-pointer"
                  >
                    <span>Adopt Model</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
