/**
 * @license
 * GRAM-DISHA — Onboarding Step 2: Business & Enterprise Details
 * Team ERGON — Smart India Hackathon 2026
 */

import React, { useState } from 'react';
import { 
  Building, 
  Lightbulb, 
  Store, 
  Sun, 
  Wheat, 
  Milk, 
  Sparkles, 
  Layers, 
  Check, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { BusinessContext, BusinessStage, BusinessScale } from '../../../types';

interface BusinessStepProps {
  business: Partial<BusinessContext>;
  onChange: (updated: Partial<BusinessContext>) => void;
  onNext: () => void;
  onBack: () => void;
}

const SECTOR_OPTIONS = [
  {
    id: 'AGRO_PROCESSING',
    title: 'Agro & Food Processing',
    icon: '🌾',
    examples: 'Dal Mill, Mini Rice Mill, Oil Expeller, Spice Grinding, Flour Mill',
    defaultTitle: 'Maa Annapurna Agro & Pulse Processing Unit',
    defaultDesc: 'Processing locally harvested farm pulses, wheat, and spices for direct supply to local consumer markets and regional mandis.',
  },
  {
    id: 'DAIRY_LIVESTOCK',
    title: 'Dairy, Cattle Feed & Livestock',
    icon: '🥛',
    examples: 'Bulk Milk Chilling Center, Cattle Feed formulation, Goat Farm, Poultry',
    defaultTitle: 'Gokul Dairy & Cattle Nutrition Hub',
    defaultDesc: 'Automated milk chilling and hygienic packaging center with balanced cattle nutritional feed production for local dairy cooperatives.',
  },
  {
    id: 'RURAL_RETAIL',
    title: 'Rural Retail & Distribution',
    icon: '🏪',
    examples: 'Agri-Input Depot, Micro Cold Room, Rural Hardware & Fertilizer Store',
    defaultTitle: 'Kisan Samriddhi Agri-Input & Hardware Depot',
    defaultDesc: 'Certified quality seeds, bio-fertilizers, solar farm implements, and daily household consumable supply for surrounding 10 villages.',
  },
  {
    id: 'SOLAR_ENERGY',
    title: 'Solar & Renewable Energy',
    icon: '☀️',
    examples: 'Rooftop Solar Installation, Solar Irrigation Pump Service, Battery Bank',
    defaultTitle: 'Gram Urja Solar Solutions & Maintenance',
    defaultDesc: 'Turnkey rural solar water pump installations, rooftop solar systems for farmhouses, and localized micro-grid battery maintenance.',
  },
  {
    id: 'ARTISANAL_CRAFTS',
    title: 'Artisanal Crafts & Textiles',
    icon: '🧵',
    examples: 'Handloom Cotton Weaving, Terracotta Pottery, Bamboo Basketry',
    defaultTitle: 'Hastakala Handloom & Rural Heritage Weaving',
    defaultDesc: 'Empowering local women artisans through traditional handloom cotton weaving, natural vegetable dyes, and direct urban artisan marketplace supply.',
  },
  {
    id: 'CUSTOM_MICRO',
    title: 'Custom Rural Enterprise',
    icon: '⚙️',
    examples: 'Fabrication Workshop, Rural Logistics / E-Rickshaw Fleet, Packaging',
    defaultTitle: 'Gramin Seva Engineering & Fabrication Works',
    defaultDesc: 'Custom agricultural equipment fabrication, trolley repair, and localized light engineering services for farm machinery.',
  },
];

export const BusinessStep: React.FC<BusinessStepProps> = ({
  business,
  onChange,
  onNext,
  onBack,
}) => {
  const [category, setCategory] = useState(business.category || 'AGRO_PROCESSING');
  const [title, setTitle] = useState(
    business.title || 'Maa Annapurna Agro & Pulse Processing Unit'
  );
  const [stage, setStage] = useState<BusinessStage>(business.stage || 'EARLY_PLANNING');
  const [scale, setScale] = useState<BusinessScale>(business.scale || 'MICRO');
  const [description, setDescription] = useState(
    business.description ||
      'Processing locally harvested farm pulses, wheat, and spices for direct supply to local consumer markets and regional mandis.'
  );
  const [targetMarket, setTargetMarket] = useState(
    business.targetMarket || 'Local Village Consumers & APMC Mandi Wholesalers'
  );

  const handleSectorSelect = (sectorId: string) => {
    setCategory(sectorId);
    const chosen = SECTOR_OPTIONS.find((s) => s.id === sectorId);
    if (chosen && (!title || title.includes('Unit') || title.includes('Hub') || title.includes('Works'))) {
      setTitle(chosen.defaultTitle);
      setDescription(chosen.defaultDesc);
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    onChange({
      category,
      title,
      stage,
      scale,
      description,
      targetMarket,
      activity: category,
      businessGoal: `Establish a profitable, sustainable ${title} enterprise in the target gram panchayat.`,
    });
    onNext();
  };

  return (
    <form onSubmit={handleContinue} className="space-y-6">
      {/* Step Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#C8A96B] bg-[#3B2F2A] px-2.5 py-0.5 rounded-md">
            Step 2 of 5
          </span>
          <span className="text-xs text-[#5A6B4F] font-semibold">
            Enterprise Archetype & Value Proposition
          </span>
        </div>
        <h2 className="text-2xl font-display font-bold text-[#3B2F2A]">
          What enterprise are you planning?
        </h2>
        <p className="text-xs sm:text-sm text-[#3B2F2A]/75 leading-relaxed">
          Choose a sector archetype or enter your custom venture. Gram-Disha applies sector-specific technical benchmarks and raw material ratios.
        </p>
      </div>

      {/* Sector Archetype Cards */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-[#3B2F2A]">
          Select Enterprise Sector <span className="text-[#B45B4A]">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SECTOR_OPTIONS.map((sec) => {
            const isSelected = category === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleSectorSelect(sec.id)}
                className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#FAF7F2] border-[#3B2F2A] shadow-md ring-1 ring-[#3B2F2A]'
                    : 'bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] border-[#C8A96B]/30 hover:border-[#C8A96B]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{sec.icon}</span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#5A6B4F] text-[#FAF7F2] flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <h4 className="font-display font-bold text-sm text-[#3B2F2A] mb-1">
                    {sec.title}
                  </h4>
                  <p className="text-[11px] text-[#3B2F2A]/70 line-clamp-2">
                    {sec.examples}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Business Name & Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#3B2F2A] mb-1.5">
            Enterprise Name / Title <span className="text-[#B45B4A]">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Jai Kisan Dal Mill"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 focus:border-[#B45B4A] focus:outline-hidden text-sm text-[#3B2F2A] font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#3B2F2A] mb-1.5">
            Primary Target Market / Buyers <span className="text-[#B45B4A]">*</span>
          </label>
          <input
            type="text"
            required
            value={targetMarket}
            onChange={(e) => setTargetMarket(e.target.value)}
            placeholder="e.g. Local Gram Panchayat & APMC Wholesalers"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 focus:border-[#B45B4A] focus:outline-hidden text-sm text-[#3B2F2A]"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-[#3B2F2A] mb-1.5">
          Enterprise Scope & Core Activity Description
        </label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Briefly describe what your enterprise produces or offers..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 focus:border-[#B45B4A] focus:outline-hidden text-xs sm:text-sm text-[#3B2F2A]"
        />
      </div>

      {/* Business Stage & Scale */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#F2E8D6]/50 border border-[#C8A96B]/30">
        <div>
          <label className="block text-xs font-bold text-[#3B2F2A] mb-2">
            Current Stage
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'IDEA', label: 'Idea Concept' },
              { id: 'EARLY_PLANNING', label: 'Planning' },
              { id: 'READY_TO_LAUNCH', label: 'Ready to Launch' },
              { id: 'EXISTING_EXPANSION', label: 'Expansion' },
            ].map((stg) => (
              <button
                key={stg.id}
                type="button"
                onClick={() => setStage(stg.id as BusinessStage)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  stage === stg.id
                    ? 'bg-[#3B2F2A] text-[#FAF7F2]'
                    : 'bg-[#FAF7F2] text-[#3B2F2A] border border-[#C8A96B]/30'
                }`}
              >
                {stg.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#3B2F2A] mb-2">
            Target Scale (MSME Classification)
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'MICRO', label: 'Micro (< ₹1 Cr)' },
              { id: 'SMALL', label: 'Small (< ₹10 Cr)' },
            ].map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => setScale(sc.id as BusinessScale)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  scale === sc.id
                    ? 'bg-[#5A6B4F] text-[#FAF7F2]'
                    : 'bg-[#FAF7F2] text-[#3B2F2A] border border-[#C8A96B]/30'
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>
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
          <span>Continue to Financial Structuring</span>
          <span>→</span>
        </button>
      </div>
    </form>
  );
};
