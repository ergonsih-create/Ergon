/**
 * @license
 * GRAM-DISHA — Landing Page Structured Content Model
 * Team ERGON — Smart India Hackathon
 * Clean structured content decoupled from presentation components.
 */

export interface NavItem {
  label: string;
  href: string;
  sectionId?: string;
}

export interface InsightCardData {
  title: string;
  status: string;
  detail: string;
  badgeType: 'olive' | 'gold' | 'terracotta' | 'neutral';
  source?: string;
}

export interface FlowStep {
  stepNumber: string;
  title: string;
  category: string;
  description: string;
  actionSummary: string;
  keyOutputs: string[];
}

export interface CapabilityItem {
  id: number;
  title: string;
  category: 'MARKET' | 'FINANCE' | 'SCHEMES' | 'OPERATIONS' | 'INTELLIGENCE';
  description: string;
  isAiOs?: boolean;
}

export interface UserCohort {
  title: string;
  persona: string;
  situation: string;
  benefit: string;
  tag: string;
}

export const LANDING_DATA = {
  brand: {
    name: 'Gram-Disha',
    tagline: 'Intelligent Business Guidance for Rural & Semi-Urban India',
    team: 'ERGON',
    subtitle: 'Evidence-Informed Decision Support & Deterministic Financial Structuring',
  },

  navigation: {
    links: [
      { label: 'How It Works', href: '#how-it-works', sectionId: 'how-it-works' },
      { label: 'Features', href: '#features', sectionId: 'features' },
      { label: 'Disha AI OS', href: '#disha-os', sectionId: 'disha-os' },
      { label: 'Feasibility & Finance', href: '#feasibility', sectionId: 'feasibility' },
      { label: 'Schemes', href: '#schemes', sectionId: 'schemes' },
      { label: 'About', href: '#about', sectionId: 'about' },
    ],
    primaryCta: 'Get Started',
    secondaryCta: 'Sign in with Google',
  },

  hero: {
    eyebrow: 'AI-powered business guidance for rural India',
    headline: 'Build the right business.\nWith the right direction.',
    description:
      'Gram-Disha combines hyper-local market signals, deterministic financial structuring, and versioned government scheme matching into one continuous, evidence-informed journey for rural and semi-urban entrepreneurs.',
    primaryCta: 'Start Your Business Journey',
    secondaryCta: 'Explore How It Works',
    demoBadge: 'Live Demonstration Concept',
    dishaGreeting: 'Good morning. I’ve mapped your business context.',
    dishaContext: 'Semi-Urban Agro Processing Unit (Mini Dal Mill) • Yavatmal, Maharashtra',
    insightCards: [
      {
        title: 'Local Raw Material Demand',
        status: 'Promising',
        detail: 'High local pulse cultivation within 10 km APMC radius.',
        badgeType: 'olive',
        source: 'AGMARKNET Daily Feed',
      },
      {
        title: 'Capital Requirement',
        status: '₹8.50 Lakh (Moderate)',
        detail: 'Machinery ₹4.5L, Setup ₹1.8L, Initial Working Capital ₹2.2L.',
        badgeType: 'gold',
        source: 'Deterministic Norms',
      },
      {
        title: 'Potential Schemes',
        status: '2 to Review',
        detail: 'PMEGP (35% Rural Subsidy) and PMFME ODOP grant match criteria.',
        badgeType: 'olive',
        source: 'KVIC / MoFPI Ruleset',
      },
      {
        title: 'Recommended Next Step',
        status: 'Feasibility Analysis',
        detail: 'HBFS score indicates strong bankability; review unit economics.',
        badgeType: 'terracotta',
        source: 'Disha Orchestration',
      },
    ] as InsightCardData[],
  },

  dishaIntro: {
    badge: 'Meet Disha',
    headline: 'Meet Disha — the intelligence layer behind your business journey.',
    subhead:
      'Disha is a calm, intelligent orchestration layer that guides entrepreneurs through ambiguity without replacing hard evidence or mathematical calculations.',
    pillars: [
      {
        phase: '01. Context',
        title: 'What matters in your region',
        description: 'Understands your local geography, available resources, background, and specific operational constraints.',
      },
      {
        phase: '02. Analysis',
        title: 'What information is missing',
        description: 'Explicitly identifies data gaps and uncertainty instead of making up answers when local signals are absent.',
      },
      {
        phase: '03. Evidence',
        title: 'What the data indicates',
        description: 'Cross-references verified mandi rates, demographic consumption, and official government benchmarks.',
      },
      {
        phase: '04. Decision Support',
        title: 'What options actually fit',
        description: 'Evaluates viable business models and provides transparent mathematical break-even and debt-service indicators.',
      },
      {
        phase: '05. Action',
        title: 'What specific steps to take next',
        description: 'Generates structured step-by-step guidance for bank applications, statutory registrations, and launch planning.',
      },
    ],
  },

  problem: {
    eyebrow: 'The Fragmented Reality',
    headline: 'Starting a rural business currently requires navigating six disjointed silos.',
    description:
      'Entrepreneurs across rural and semi-urban India face severe information friction. Insights are scattered across physical offices, complex government portals, and informal advice without unified guidance.',
    cards: [
      {
        question: '“Is there enough local demand?”',
        issue: 'Market Blindspots',
        description: 'Entrepreneurs launch without knowing local consumption volume, competitor density, or mandi price fluctuations.',
        icon: 'HelpCircle',
      },
      {
        question: '“What will it really cost?”',
        issue: 'Hidden Capital Traps',
        description: 'Crucial initial working capital, civil works, 3-phase power, and statutory fees are frequently omitted from planning.',
        icon: 'Coins',
      },
      {
        question: '“How should I finance it?”',
        issue: 'Credit Misalignment',
        description: 'Borrowing from high-interest informal lenders due to lack of bankable unit economics and DSCR clarity.',
        icon: 'Wallet',
      },
      {
        question: '“Which schemes should I check?”',
        issue: 'Scheme Confusion',
        description: 'Navigating dozens of central and state schemes with overlapping guidelines and unclear eligibility clauses.',
        icon: 'Landmark',
      },
      {
        question: '“What documents do I need?”',
        issue: 'Documentation Delays',
        description: 'Repeated trips to District Industries Centres (DIC) and bank branches for missing certificates and affidavits.',
        icon: 'FileQuestion',
      },
      {
        question: '“What should I do next?”',
        issue: 'Execution Paralysis',
        description: 'Lacking a phased, structured roadmap that links market validation to bank application and daily operations.',
        icon: 'Compass',
      },
    ],
  },

  solution: {
    eyebrow: 'The Gram-Disha Breakthrough',
    headline: 'Transforming isolated hurdles into One Connected Business Journey.',
    description:
      'Gram-Disha unifies market intelligence, mathematical feasibility, credit modeling, and regulatory compliance into a single coherent system.',
    fragmentedPoints: ['Vague Idea', 'Unverified Market', 'Unstructured Loan', 'Overlooked Schemes', 'Missing Documents', 'Failed Submission'],
    connectedPoints: ['Context & Validation', '5-10 km Market Signals', 'Deterministic Cash Flow', 'Versioned Scheme Match', 'Automated Dossier', 'Tracked Execution'],
  },

  howItWorks: {
    eyebrow: 'Six Structured Milestones',
    headline: 'How Gram-Disha turns an ambition into a viable enterprise.',
    description:
      'A phased workflow that guides you systematically from personal context to commercial launch, backed by deterministic calculation logic at every stage.',
    steps: [
      {
        stepNumber: '01',
        title: 'Understand You',
        category: 'FOUNDATION',
        description: 'Map personal entrepreneur profile, demographic background, investment capacity, land/shed availability, and operational experience.',
        actionSummary: 'Captures baseline parameters for targeted scheme quotas and equity sizing.',
        keyOutputs: ['Demographic quota validation', 'Own capital baseline', 'Resource profile'],
      },
      {
        stepNumber: '02',
        title: 'Understand Your Local Market',
        category: 'INTELLIGENCE',
        description: 'Analyze hyper-local demand signals within a 5–10 km opportunity radius using verified mandi records, population density, and trade flows.',
        actionSummary: 'Identifies supply surpluses, retail demand density, and processing opportunities.',
        keyOutputs: ['5-10 km radius mapping', 'Raw material availability index', 'Local retail demand density'],
      },
      {
        stepNumber: '03',
        title: 'Evaluate the Business',
        category: 'FEASIBILITY',
        description: 'Calculate the comprehensive Hyper-local Business Feasibility Score (HBFS) balancing demand, infrastructure, access, and risk penalties.',
        actionSummary: 'Calculates an audit-trailed feasibility score with explicit uncertainty deductions.',
        keyOutputs: ['HBFS Score (0.00 to 1.00)', '4-Quadrant SWOT Matrix', '3-Horizon Viability Outlook'],
      },
      {
        stepNumber: '04',
        title: 'Structure the Finances',
        category: 'FINANCE',
        description: 'Generate pure deterministic project cost breakdowns, working capital cycles, monthly EMI schedules, and debt-service ratios.',
        actionSummary: 'Produces formula-bound bankable unit economics without hallucinated AI numbers.',
        keyOutputs: ['Project Cost (Fixed + WC)', 'Monthly EMI & Break-even', '12-Month Projected Cash Flow'],
      },
      {
        stepNumber: '05',
        title: 'Find Relevant Schemes',
        category: 'SCHEMES',
        description: 'Deterministic rule evaluation against official government guidelines (PMEGP, PMFME, MUDRA, Stand-Up India, NABARD).',
        actionSummary: 'Categorizes schemes into Potentially Eligible, Not Eligible, or Unknown states.',
        keyOutputs: ['Capital subsidy calculation', 'Prescribed document checklist', 'Nodal authority routing'],
      },
      {
        stepNumber: '06',
        title: 'Move to Action',
        category: 'EXECUTION',
        description: 'Generate a chronological launch roadmap, document readiness vault, application dossier, and operational inventory guidelines.',
        actionSummary: 'Equips the entrepreneur for bank meetings, DIC submissions, and store launch.',
        keyOutputs: ['Bankable Project Dossier', 'Document Verification Checklist', 'Weekly Execution Milestones'],
      },
    ] as FlowStep[],
  },

  marketIntelligence: {
    eyebrow: 'Hyper-Local Opportunity Field',
    headline: 'Business decisions should start with your local reality.',
    description:
      'National averages do not reflect rural micro-markets. Gram-Disha analyzes the 5–10 km economic radius around your specific gram panchayat, evaluating raw material flows, mandi pricing, and consumer demand.',
    features: [
      {
        title: '5–10 km Analytical Radius',
        desc: 'Focuses on the practical daily commuting, freight logistics, and haulage radius of rural micro-enterprises.',
      },
      {
        title: 'Verified Mandi Price Benchmarks',
        desc: 'Modal daily procurement rates from registered APMC mandis to compute realistic raw material costs.',
      },
      {
        title: 'Infrastructure & Power Verification',
        desc: 'Accounts for 3-phase feeder availability, road paving, and nearest railway siding distance.',
      },
      {
        title: 'Explicit Provenance & Vintages',
        desc: 'Every indicator displays source authority, data vintage, and geographic level so assumptions remain transparent.',
      },
    ],
    sampleSignals: [
      { label: 'Desi Chana Procurement Rate', value: '₹5,820 / Qtl', source: 'AGMARKNET • Pusad APMC', confidence: '0.98' },
      { label: 'Weekly Haat Absorption Rate', value: '3.4 Tonnes / Wk', source: 'Local Gram Panchayat Census', confidence: '0.91' },
      { label: 'Commercial 3-Phase Reliability', value: '18.4 Hrs / Day', source: 'DISCOM Feeder Bulletin', confidence: '0.95' },
      { label: 'Logistics Friction Factor', value: 'Low (PMGSY Bitumen)', source: 'NRIDA Connectivity Index', confidence: '0.94' },
    ],
  },

  feasibility: {
    eyebrow: 'Mathematical Decision Support',
    headline: 'Transparent feasibility scoring with explicit risk and uncertainty penalties.',
    description:
      'The HBFS engine uses a published 8-parameter equation. It rewards local demand and infrastructure while mathematically deducting points for climate risk, capital deficits, and unverified data.',
    equation: 'HBFS = 0.25·D + 0.15·A + 0.10·I + 0.10·S + 0.10·Sc − 0.05·C − 0.15·Cap − 0.20·U',
    components: [
      { name: 'Demand Index (D)', weight: '+25%', role: 'Positive Driver', desc: 'Local consumption density and market absorption capacity.' },
      { name: 'Accessibility (A)', weight: '+15%', role: 'Positive Driver', desc: 'All-weather road connectivity and transport availability.' },
      { name: 'Infrastructure (I)', weight: '+10%', role: 'Positive Driver', desc: 'Power reliability, water table, and storage facilities.' },
      { name: 'Socioeconomic (S)', weight: '+10%', role: 'Positive Driver', desc: 'Purchasing power and household expenditure patterns.' },
      { name: 'Scheme Suitability (Sc)', weight: '+10%', role: 'Positive Driver', desc: 'Availability of matching capital subsidies and grants.' },
      { name: 'Climate Vulnerability (C)', weight: '-5%', role: 'Penalty', desc: 'Monsoon dependency, flood history, or drought susceptibility.' },
      { name: 'Capital Deficit (Cap)', weight: '-15%', role: 'Penalty', desc: 'Gap between required promoter margin and available capital.' },
      { name: 'Uncertainty Ratio (U)', weight: '-20%', role: 'Penalty', desc: 'Deduction for missing or unverified local survey indicators.' },
    ],
    disclaimer: 'HBFS is an evidence-backed decision-support score based on official benchmarks. It represents planning confidence, not a commercial guarantee.',
  },

  financialStructuring: {
    eyebrow: 'Deterministic Financial Engine',
    headline: 'Bankable unit economics calculated by pure mathematics.',
    description:
      'Financial projections must be deterministic, transparent, and auditable by bank loan officers. Gram-Disha calculates exact EMIs, working capital cycles, and debt-service coverage ratios through pure mathematical formulas.',
    cards: [
      { title: 'Itemized Project Cost', value: '₹8,50,000', detail: 'Plant & Machinery, Civil Works, Working Capital Contingency' },
      { title: 'Promoter Contribution', value: '₹1,25,000 (14.7%)', detail: 'Compliant with PMEGP Special Category margin norm (5-10%)' },
      { title: 'Term Loan Required', value: '₹6,16,250', detail: '85% of net requirement at 9.25% p.a. over 60-month tenure' },
      { title: 'Estimated Monthly EMI', value: '₹12,870 / mo', detail: 'Calculated via standard annuity formula with 6-month moratorium' },
      { title: 'Monthly Break-Even', value: '3,450 Units (42% cap)', detail: 'Fixed Costs ÷ Unit Contribution Margin (₹100 sale - ₹60 cost)' },
      { title: 'Projected DSCR', value: '1.82x (Bankable)', detail: 'Net Operating Income ÷ Annual Debt Service (Benchmark > 1.5x)' },
    ],
    note: 'All financial figures are generated via deterministic banking algorithms and are presented for planning and credit evaluation purposes.',
  },

  schemeMatcher: {
    eyebrow: 'Versioned Scheme Evaluation',
    headline: 'Deterministic eligibility matching against official source registers.',
    description:
      'We evaluate candidate schemes strictly against verified gazette rules. Gram-Disha never promises guaranteed grants, providing exact qualification criteria and document requirements.',
    states: [
      { state: 'POTENTIALLY ELIGIBLE', desc: 'All mandatory profile criteria (category, location, project scale) pass current guidelines.', color: 'olive' },
      { state: 'NOT ELIGIBLE', desc: 'One or more statutory criteria (e.g. minimum education, ceiling limit) are not met.', color: 'terracotta' },
      { state: 'UNKNOWN', desc: 'Critical required inputs (e.g. EDP certification) have not yet been provided by the user.', color: 'gold' },
    ],
    sampleSchemes: [
      {
        code: 'PMEGP',
        name: 'Prime Minister’s Employment Generation Programme',
        subsidy: '35% Margin Money Grant (Rural Special)',
        maxLoan: '₹50 Lakh (Manufacturing)',
        authority: 'KVIC / District Industries Centre (DIC)',
        status: 'POTENTIALLY ELIGIBLE',
      },
      {
        code: 'PMFME',
        name: 'PM Formalisation of Micro Food Processing Enterprises',
        subsidy: '35% Credit-Linked Grant (Up to ₹10 Lakh)',
        maxLoan: '₹30 Lakh (Food Processing)',
        authority: 'Ministry of Food Processing Industries (MoFPI)',
        status: 'POTENTIALLY ELIGIBLE',
      },
      {
        code: 'MUDRA Tarun',
        name: 'Pradhan Mantri MUDRA Yojana (PMMY)',
        subsidy: 'Collateral-Free Institutional Refinance',
        maxLoan: '₹10 Lakh - ₹20 Lakh',
        authority: 'SIDBI / Commercial Banks',
        status: 'POTENTIALLY ELIGIBLE',
      },
      {
        code: 'Stand-Up India',
        name: 'Stand-Up India Scheme for Women & SC/ST',
        subsidy: 'Composite Term Loan (15% Margin)',
        maxLoan: '₹10 Lakh - ₹1 Crore',
        authority: 'Department of Financial Services (DFS)',
        status: 'POTENTIALLY ELIGIBLE',
      },
    ],
  },

  dishaOS: {
    eyebrow: 'Disha AI Orchestration Layer',
    headline: 'Disha acts as your business copilot across every operational module.',
    description:
      'Disha is not an isolated chat popup. It sits behind the entire platform, observing data changes, highlighting regulatory risks, clarifying financial equations, and suggesting immediate practical next steps.',
    workflows: [
      {
        location: 'Executive Dashboard',
        trigger: 'Profile updated with rural female entrepreneur status',
        dishaAction: 'Notices eligibility for 35% PMEGP subsidy tier and prompts review.',
      },
      {
        location: 'Market Insights',
        trigger: 'Local raw pulse production exceeds block consumption',
        dishaAction: 'Highlights value-addition opportunity in mini dal milling.',
      },
      {
        location: 'Financial Structuring',
        trigger: 'Working capital margin set below 60 days',
        dishaAction: 'Explains agricultural inventory seasonality and recommends increasing cash reserve.',
      },
      {
        location: 'Scheme Matcher',
        trigger: 'Selects PMFME One District One Product (ODOP) route',
        dishaAction: 'Validates district ODOP notified list and generates required FSSAI Form-A checklist.',
      },
      {
        location: 'Bank Dossier',
        trigger: 'Preparing loan application for branch manager',
        dishaAction: 'Compiles deterministic DSCR audit trail and project summary ready for print.',
      },
    ],
  },

  businessJourney: {
    eyebrow: 'Signature Workflow',
    headline: 'The Complete 10-Stage Rural Entrepreneur Journey',
    description:
      'From initial curiosity to sustainable commercial expansion, Gram-Disha guides every milestone with clarity and evidence.',
    stages: [
      { step: '01', name: 'Understand', desc: 'Profile context, resources & local geography' },
      { step: '02', name: 'Discover', desc: 'Identify 5-10 km viable rural business ideas' },
      { step: '03', name: 'Evaluate', desc: 'Calculate HBFS feasibility & local demand index' },
      { step: '04', name: 'Validate', desc: 'Verify mandi prices, road access & power feeder' },
      { step: '05', name: 'Finance', desc: 'Structure project cost, equity & deterministic EMI' },
      { step: '06', name: 'Match', desc: 'Filter central & state government scheme subsidies' },
      { step: '07', name: 'Apply', desc: 'Assemble bank-ready documents & portal forms' },
      { step: '08', name: 'Track', desc: 'Monitor scrutiny, DIC approvals & loan sanction' },
      { step: '09', name: 'Operate', desc: 'Manage inventory thresholds & sales records' },
      { step: '10', name: 'Grow', desc: 'Plan regional market expansion & FSSAI upgrades' },
    ],
  },

  whoItHelps: {
    eyebrow: 'Designed for Real Rural Realities',
    headline: 'Built specifically for rural and semi-urban entrepreneurs.',
    description:
      'Gram-Disha addresses the unique challenges of local commerce, agricultural value chains, and micro-enterprise scaling across India.',
    cohorts: [
      {
        title: 'Aspiring First-Time Entrepreneurs',
        persona: 'Rural youth & graduates exploring micro-industry',
        situation: 'Have ambition and basic education but lack business planning, financial literacy, and bank connections.',
        benefit: 'Step-by-step guidance from idea evaluation to bank-ready project proposals.',
        tag: 'New Ventures',
      },
      {
        title: 'Existing Micro-Business Owners',
        persona: 'Kirana owners, flour millers & artisanal producers',
        situation: 'Operating informal enterprises without structured cash-flow forecasting or formal credit access.',
        benefit: 'Assistance in formalizing operations, obtaining Udyam/FSSAI, and accessing MUDRA loans.',
        tag: 'Formalization',
      },
      {
        title: 'Women & Self-Help Group (SHG) Leaders',
        persona: 'SHG Federations & Mahila Gruhudyog collectives',
        situation: 'Seeking collective value-addition for agro-produce with maximum capital subsidy benefit.',
        benefit: 'Specialized mapping for 35% PMEGP / PMFME grants and Stand-Up India financing.',
        tag: 'Women Enterprises',
      },
      {
        title: 'Agro-Processing & Value Adders',
        persona: 'Farmers transitioning into post-harvest processing',
        situation: 'Raw commodity price vulnerability during harvest season with underutilized farm produce.',
        benefit: 'Mandi price arbitrage modeling and mini-processing plant unit economics.',
        tag: 'Agro-Business',
      },
      {
        title: 'Semi-Urban Service Providers',
        persona: 'Custom hiring centers, repair & logistics units',
        situation: 'Need clarity on equipment leasing costs, local catchment demand, and operational break-even.',
        benefit: 'Accurate working capital projections and equipment loan feasibility scoring.',
        tag: 'Rural Services',
      },
      {
        title: 'Expanding Micro-Enterprises',
        persona: 'Established units expanding to adjoining blocks',
        situation: 'Evaluating secondary mandi catchments, additional machinery debt, and hiring needs.',
        benefit: 'Multi-block opportunity mapping and CGTMSE collateral-free guarantee modeling.',
        tag: 'Scale & Growth',
      },
    ] as UserCohort[],
  },

  trustEvidence: {
    eyebrow: 'Truth-First Architecture',
    headline: 'Every important decision must know what it is based on.',
    description:
      'Gram-Disha is founded on strict evidence-first principles. We never present fabricated data, and we explicitly say “UNKNOWN” when information is missing.',
    provenanceChain: [
      { step: '1. Official Source', desc: 'Direct citation of published government registers (LGD, AGMARKNET, KVIC, MoFPI, RBI).' },
      { step: '2. Raw Data Ingestion', desc: 'Structured data extraction preserving official data vintages and geographical levels.' },
      { step: '3. Deterministic Validation', desc: 'Rule-based verification ensuring calculations conform strictly to statutory limits.' },
      { step: '4. Mathematical Analysis', desc: 'Auditable formulas for HBFS feasibility, EMIs, and debt service ratios.' },
      { step: '5. Transparent Explanation', desc: 'Clear natural-language articulation of assumptions and confidence ratings.' },
    ],
    unknownPrinciple: {
      badge: 'The UNKNOWN Principle',
      title: 'We state “UNKNOWN” rather than hallucinating answers.',
      body: 'If local soil suitability, specific mandi spot prices, or applicant training certificates are unrecorded, Gram-Disha explicitly labels them as UNKNOWN and penalizes the feasibility score accordingly, directing the user to verify the fact locally.',
    },
  },

  capabilities: {
    eyebrow: 'Comprehensive Platform Scope',
    headline: '15 Government-Requested Capabilities + 3 Intelligence Layers',
    description:
      'A complete end-to-end ecosystem engineered to address every facet of rural enterprise establishment and compliance.',
    items: [
      { id: 1, title: 'Hyper-Local Market Insights', category: 'MARKET', description: '5–10 km radius supply, demand, and mandi modal price analysis.' },
      { id: 2, title: 'Business Idea Evaluation', category: 'MARKET', description: 'Viability screening for agricultural, manufacturing, and service ventures.' },
      { id: 3, title: 'Feasibility Analysis (HBFS)', category: 'MARKET', description: 'Deterministic 8-parameter scoring with explicit uncertainty deductions.' },
      { id: 4, title: 'Project Cost Estimation', category: 'FINANCE', description: 'Itemized fixed asset, equipment, and licensing expenditure modeling.' },
      { id: 5, title: 'Financial Structuring', category: 'FINANCE', description: 'Annuity-based term loan sizing and promoter equity optimization.' },
      { id: 6, title: 'Cash Flow Projections', category: 'FINANCE', description: '12-month operational surplus and liquidity forecasting.' },
      { id: 7, title: 'Working Capital Planning', category: 'FINANCE', description: 'Operating cycle analysis for agricultural harvest seasonality.' },
      { id: 8, title: 'Scheme Matcher', category: 'SCHEMES', description: 'Versioned central and state government credit-linked grant discovery.' },
      { id: 9, title: 'Eligibility Checker', category: 'SCHEMES', description: 'Rule-based validation of age, caste category, location, and education.' },
      { id: 10, title: 'Document Guidance', category: 'SCHEMES', description: 'Structured checklists for Aadhaar, Udyam, FSSAI, and bank statements.' },
      { id: 11, title: 'Application Assistant', category: 'SCHEMES', description: 'Step-by-step guidance for KVIC, PMFME, and Jansamarth portal filings.' },
      { id: 12, title: 'Progress Tracking', category: 'OPERATIONS', description: 'Milestone tracker for scrutiny, branch verification, and disbursement.' },
      { id: 13, title: 'Inventory & Sales Planner', category: 'OPERATIONS', description: 'Minimum stock thresholds and daily sales ledger for micro-units.' },
      { id: 14, title: 'Training & Resources', category: 'OPERATIONS', description: 'RSETI EDP course directory and skill development modules.' },
      { id: 15, title: 'Grievance Redressal', category: 'OPERATIONS', description: 'Direct issue logging and escalation pathways to DIC nodal officers.' },
      { id: 16, title: 'Disha AI OS Copilot', category: 'INTELLIGENCE', description: 'Unified intelligent orchestration across all modules.', isAiOs: true },
      { id: 17, title: 'Section Automation', category: 'INTELLIGENCE', description: 'Automatic data propagation between market, finance, and scheme forms.', isAiOs: true },
      { id: 18, title: '23 Indian Languages NLP', category: 'INTELLIGENCE', description: 'Architected for seamless multilingual voice and text accessibility.', isAiOs: true },
    ] as CapabilityItem[],
  },

  finalCta: {
    eyebrow: 'Start With Confidence',
    headline: 'Your business journey starts with a clearer direction.',
    subhead:
      'Join thousands of rural and semi-urban entrepreneurs structuring bankable, evidence-backed enterprises with Gram-Disha.',
    primaryCta: 'Start with Gram-Disha',
    secondaryCta: 'Explore How It Works',
    guaranteeNote: 'Free open platform for rural entrepreneurs • Developed by Team ERGON',
  },

  footer: {
    about:
      'Gram-Disha is an intelligent, evidence-informed business guidance and deterministic financial structuring platform developed by Team ERGON for rural and semi-urban entrepreneurs across India.',
    disclaimer:
      'Gram-Disha provides decision-support tools, deterministic financial calculations, and government scheme eligibility evaluations based on registered public guidelines. It does not provide commercial financial advice or guaranteed loan sanctions.',
    sections: [
      {
        title: 'Platform',
        links: [
          { label: 'How It Works', href: '#how-it-works' },
          { label: 'Market Intelligence', href: '#market-intelligence' },
          { label: 'Feasibility Engine (HBFS)', href: '#feasibility' },
          { label: 'Financial Structuring', href: '#finance' },
          { label: 'Government Schemes', href: '#schemes' },
        ],
      },
      {
        title: 'Intelligence & OS',
        links: [
          { label: 'Meet Disha AI OS', href: '#disha-os' },
          { label: 'The UNKNOWN Principle', href: '#trust-evidence' },
          { label: '18 Core Capabilities', href: '#capabilities' },
          { label: 'Business Journey Workflow', href: '#journey' },
        ],
      },
      {
        title: 'Resources & Trust',
        links: [
          { label: 'LGD Directory Standard', href: '#trust-evidence' },
          { label: 'AGMARKNET Mandi Integration', href: '#market-intelligence' },
          { label: 'KVIC / PMEGP Guidelines', href: '#schemes' },
          { label: 'PMFME ODOP Register', href: '#schemes' },
        ],
      },
      {
        title: 'Team & Legal',
        links: [
          { label: 'About Team ERGON', href: '#about' },
          { label: 'Smart India Hackathon 2026', href: '#about' },
          { label: 'Privacy Policy', href: '#privacy' },
          { label: 'Terms of Service', href: '#terms' },
          { label: 'Accessibility Statement', href: '#accessibility' },
        ],
      },
    ],
    copyright: '© 2026 Gram-Disha by Team ERGON. All rights reserved.',
  },
};
