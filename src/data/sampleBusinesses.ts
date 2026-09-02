/**
 * @license
 * GRAM-DISHA — Curated Rural Enterprise Profiles & Templates
 */

import { BusinessContext, FinancialCalculationInput } from '../types';

export interface BusinessTemplate {
  context: BusinessContext;
  defaultFinancials: FinancialCalculationInput;
  rawMaterials: string[];
  equipmentRequired: string[];
  keyRisks: string[];
  targetCustomers: string[];
}

export const CURATED_BUSINESS_TEMPLATES: BusinessTemplate[] = [
  {
    context: {
      id: 'TEMPLATE_DAL_MILL',
      title: 'Automated Mini Dal Mill & Pulse Processing Unit',
      category: 'Agro-Processing & Value Addition',
      activity: 'Mini Dal Mill (Gram, Pigeon Pea & Moong)',
      stage: 'READY_TO_LAUNCH',
      scale: 'MICRO',
      description: 'Dehulling, splitting, grading, polishing, and hygienic retail packaging of locally harvested pulses (Chana, Tur, Moong) directly at the village level for sale to local retail grocers and weekly haats.',
      isExisting: false,
      proposedLocation: {
        state: 'Maharashtra',
        district: 'Yavatmal',
        block: 'Pusad',
        gramPanchayat: 'Shendurjana',
        villageOrLocality: 'Shendurjana Khurd',
        pincode: '445204',
        isRural: true,
        opportunityRadiusKm: 10,
      },
      businessGoal: 'Create local value addition for farm gate pulses and achieve ₹2.4 Lakh monthly turnover with positive cash flow.',
      availableResources: ['3-phase 15HP electricity connection available on site', '2000 sq ft RCC shed ready for lease'],
      expectedCustomers: 'Local retail grocery stores, weekly village haats, rural institutional hostels, APMC wholesalers.',
      targetMarket: 'Pusad taluka and 18 surrounding gram panchayats within 15 km radius.'
    },
    defaultFinancials: {
      projectCost: 850000,
      promoterCapital: 125000,
      interestRateAnnual: 9.8,
      tenureMonths: 60,
      moratoriumMonths: 6,
      unitSalePrice: 110, // per kg finished dal
      unitVariableCost: 72, // per kg raw pulses + power + packaging
      monthlyFixedCost: 24000, // rent, operator, basic maintenance
      projectedMonthlyRevenue: 275000,
      projectedMonthlyOperatingCost: 198000,
      customBreakdown: {
        fixedAssets: 120000,
        equipmentAndMachinery: 450000, // Dehuller, emery roller, grader, destoner, sealer
        infrastructureSetup: 110000,
        initialRawMaterialInventory: 100000,
        workingCapitalContingency: 50000,
        statutoryLicensingCosts: 20000, // FSSAI, Udyam, Trade license
        totalProjectCost: 850000
      }
    },
    rawMaterials: ['Raw Chickpea (Chana)', 'Raw Pigeon Pea (Arhar/Tur)', 'Food-grade HDPE packaging pouches', 'Corrugated outer master cartons'],
    equipmentRequired: ['Emery Roller Dehulling Machine (5 HP)', 'Specific Gravity Destoner & Separator', 'Multi-deck Vibratory Cleaner/Grader', 'Semi-automatic Continuous Band Heat Sealer', 'Digital Platform Weighing Scale (300 kg)'],
    keyRisks: ['Seasonal price spikes in raw pulse arrivals during pre-monsoon', 'High initial competition from established urban mill brands'],
    targetCustomers: ['140+ Kirana grocery retailers in Pusad taluka', 'Tribal residential ashram schools & mid-day meal kitchens', 'Weekly shandy / mandi direct retail stalls']
  },
  {
    context: {
      id: 'TEMPLATE_COLD_OIL',
      title: 'Traditional Wooden Cold Pressed Oil (Kachi Ghani) Extraction',
      category: 'Agro-Processing & Value Addition',
      activity: 'Cold Pressed Mustard & Groundnut Oil Unit',
      stage: 'READY_TO_LAUNCH',
      scale: 'MICRO',
      description: 'Chemical-free, low-temperature wooden rotary cold extraction of edible oils from mustard seeds, groundnut, and sesame, yielding virgin cold-pressed oil and high-protein oil cake for cattle feed.',
      isExisting: false,
      proposedLocation: {
        state: 'Uttar Pradesh',
        district: 'Hardoi',
        block: 'Sandi',
        gramPanchayat: 'Behhta Chhauni',
        villageOrLocality: 'Behhta Buzurg',
        pincode: '241403',
        isRural: true,
        opportunityRadiusKm: 10,
      },
      businessGoal: 'Supply pure, unadulterated edible oil directly to health-conscious rural and semi-urban households with zero chemical refining.',
      availableResources: ['Family-owned roadside commercial shed (1200 sq ft)', 'Direct sourcing tie-ups with 22 local mustard farmers'],
      expectedCustomers: 'Health-conscious households, local sweetshops, dairy cattle owners (for mustard oil cake by-product).',
      targetMarket: 'Hardoi district semi-urban markets and rural consumer clusters.'
    },
    defaultFinancials: {
      projectCost: 650000,
      promoterCapital: 95000,
      interestRateAnnual: 9.5,
      tenureMonths: 60,
      moratoriumMonths: 4,
      unitSalePrice: 240, // per liter premium oil
      unitVariableCost: 155, // seeds + bottles + filtration
      monthlyFixedCost: 18500,
      projectedMonthlyRevenue: 216000,
      projectedMonthlyOperatingCost: 152000,
      customBreakdown: {
        fixedAssets: 80000,
        equipmentAndMachinery: 360000, // 2 Wooden Cold Press Ghani machines (Vagai wood) + filter press
        infrastructureSetup: 90000,
        initialRawMaterialInventory: 75000,
        workingCapitalContingency: 30000,
        statutoryLicensingCosts: 15000,
        totalProjectCost: 650000
      }
    },
    rawMaterials: ['Certified Mustard Seeds (Black/Yellow)', 'Groundnut kernels', 'Food-grade 1L and 5L PET bottles / Tin containers', 'Printed tamper-proof labels'],
    equipmentRequired: ['Vagai Wooden Ghani Rotary Machine (3 HP) - 2 units', 'Plate & Frame Edible Oil Filtration Press', 'Stainless Steel Storage Tanks (500L x 2)', 'Volumetric Liquid Bottle Filling Machine'],
    keyRisks: ['Fluctuation in seed oil content depending on moisture levels', 'Consumer price resistance compared to cheap refined palm oil'],
    targetCustomers: ['Retail consumers seeking pure cold-pressed oil', 'Local dairy farmers purchasing mustard de-oiled cake', 'Ayurvedic practitioners & massage centers']
  },
  {
    context: {
      id: 'TEMPLATE_SPICE_UNIT',
      title: 'Micro Spice Grinding, Blending & Stand-up Pouch Packaging',
      category: 'Agro-Processing & Value Addition',
      activity: 'Pure Spices & Masala Blend Unit (Turmeric, Chilli, Coriander)',
      stage: 'READY_TO_LAUNCH',
      scale: 'MICRO',
      description: 'Low-heat pin-mill pulverization of whole dry spices into premium aromatic powders (Turmeric, Red Chilli, Coriander, Garam Masala) packaged in moisture-barrier stand-up pouches.',
      isExisting: false,
      proposedLocation: {
        state: 'Rajasthan',
        district: 'Nagaur',
        block: 'Merta',
        gramPanchayat: 'Ren',
        villageOrLocality: 'Ren Mandi Road',
        pincode: '341510',
        isRural: true,
        opportunityRadiusKm: 10,
      },
      businessGoal: 'Establish a regional trusted rural spice brand free from synthetic colorants and fillers.',
      availableResources: ['Proximity to Merta APMC spice terminal (3 km)', '3 trained female packaging operators'],
      expectedCustomers: 'Village grocery stores, catering contractors, dhabas, local residential households.',
      targetMarket: 'Nagaur and Ajmer district border trading hubs.'
    },
    defaultFinancials: {
      projectCost: 520000,
      promoterCapital: 75000,
      interestRateAnnual: 10.0,
      tenureMonths: 48,
      moratoriumMonths: 3,
      unitSalePrice: 85, // per 250g pouch (approx ₹340/kg)
      unitVariableCost: 52, // per 250g raw spice + foil pouch
      monthlyFixedCost: 16000,
      projectedMonthlyRevenue: 170000,
      projectedMonthlyOperatingCost: 118000,
      customBreakdown: {
        fixedAssets: 60000,
        equipmentAndMachinery: 280000, // SS Pulverizer pin mill, ribbon blender, pouch sealer
        infrastructureSetup: 70000,
        initialRawMaterialInventory: 70000,
        workingCapitalContingency: 25000,
        statutoryLicensingCosts: 15000,
        totalProjectCost: 520000
      }
    },
    rawMaterials: ['Whole dry Turmeric fingers (Salem/Nizamabad)', 'Dry Red Chilli whole', 'Dry Coriander seeds', 'Nitrogen-flushed multi-layer barrier stand-up zipper pouches'],
    equipmentRequired: ['Stainless Steel Pin Mill Pulverizer with water cooling jacket (5 HP)', 'Ribbon Blender for homogeneous masala mixes (50 kg batch)', 'Nitrogen Flushing Continuous Band Sealer', 'Digital Analytical Moisture Meter'],
    keyRisks: ['Pungency and dust emission handling requires exhaust scrubbers', 'Moisture ingress during humid monsoon months'],
    targetCustomers: ['Rural Dhabas and highway eateries', 'Village Kirana network', 'Self-Help Group (SHG) weekly sales exhibitions']
  },
  {
    context: {
      id: 'TEMPLATE_VERMICOMPOST',
      title: 'Commercial Vermicompost & Organic Bio-Fertilizer Production',
      category: 'Organic Agriculture & Bio-Inputs',
      activity: 'Enriched Vermicompost, Bio-Pesticide & Vermiwash Unit',
      stage: 'READY_TO_LAUNCH',
      scale: 'MICRO',
      description: 'Converting bovine cow dung, farm bio-waste, and crop residues into nutrient-rich vermicast using Eisenia fetida earthworm colonies with liquid vermiwash collection for organic farmers.',
      isExisting: false,
      proposedLocation: {
        state: 'Madhya Pradesh',
        district: 'Sehore',
        block: 'Ichhawar',
        gramPanchayat: 'Brijisnagar',
        villageOrLocality: 'Brijisnagar',
        pincode: '466115',
        isRural: true,
        opportunityRadiusKm: 10,
      },
      businessGoal: 'Provide affordable, certified organic soil conditioners to local soybean and wheat farmers transitioning to organic practices.',
      availableResources: ['0.5 acre ancestral farmland with borewell water supply', 'Contract with 3 local dairy farms for cow dung supply'],
      expectedCustomers: 'Organic soybean/wheat growers, horticulture nurseries, district agriculture department.',
      targetMarket: 'Sehore, Bhopal, and Hoshangabad farm belts.'
    },
    defaultFinancials: {
      projectCost: 380000,
      promoterCapital: 45000,
      interestRateAnnual: 9.0,
      tenureMonths: 48,
      moratoriumMonths: 4,
      unitSalePrice: 350, // per 40 kg HDPE bag (₹8.75/kg)
      unitVariableCost: 170, // dung + earthworms + bags + bio-inoculants
      monthlyFixedCost: 12000,
      projectedMonthlyRevenue: 122500,
      projectedMonthlyOperatingCost: 71500,
      customBreakdown: {
        fixedAssets: 80000, // 10 HDPE Vermibeds with shade-net shed structure
        equipmentAndMachinery: 140000, // Rotary sieving drum, shredder, vermiwash extractor
        infrastructureSetup: 70000, // Water piping, sprinkler system, vermi-culture colony
        initialRawMaterialInventory: 50000,
        workingCapitalContingency: 25000,
        statutoryLicensingCosts: 15000,
        totalProjectCost: 380000
      }
    },
    rawMaterials: ['Semi-decomposed cow dung', 'Paddy straw & legume crop stubble', 'Eisenia Fetida Australian Red Earthworm breeders', 'Printed UV-stabilized 40 kg woven HDPE sacks'],
    equipmentRequired: ['100% Virgin HDPE Vermi-Beds (12x4x2 ft) with aeration windows - 20 sets', 'Motorized Rotary Trommel Sieve (2 HP)', 'Tricycle Cart for internal raw dung transport', 'Micro-sprinkler misting irrigation system'],
    keyRisks: ['Excessive summer temperatures (>42°C) can harm earthworm colonies without proper shade management', 'Bird predation'],
    targetCustomers: ['Horticulture polyhouse cultivators', 'Commercial vegetable growers', 'Urban landscape and rooftop gardening stores in Bhopal']
  }
];
