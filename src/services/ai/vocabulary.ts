/**
 * @license
 * GRAM-DISHA — Verified Controlled Vocabulary for OpenAI Whisper Contextual Prompting
 * Smart India Hackathon 2026 (Team ERGON)
 * 
 * Provides verified domain-specific terminology to steer Whisper recognition
 * for Indian districts, rural enterprises, government schemes, and finance terms.
 */

export interface VocabularyContext {
  module?: string;
  businessActivity?: string;
  district?: string;
  state?: string;
  category?: string;
  preferredLanguage?: string;
}

// 1. Enterprise Categories & Products
export const VERIFIED_ENTERPRISES = [
  'Rice Mill', 'Mini Rice Mill', 'Paddy Processing', 'Parboiling Unit', 'Rice Bran Oil',
  'Dal Mill', 'Pulse Processing', 'Desi Chana', 'Tur Dal', 'Moong Dal', 'Urad Dal',
  'Flour Mill', 'Chakki Atta', 'Maida Milling', 'Besan Processing',
  'Oil Expeller', 'Mustard Oil Mill', 'Groundnut Oil Unit', 'Soybean Crushing',
  'Cold Storage', 'Solar Cold Room', 'Ripening Chamber', 'Multi-Commodity Cold Chain',
  'Dairy Processing', 'Milk Chilling Center', 'Paneer Manufacturing', 'Ghee Processing',
  'Spices Grinding', 'Turmeric Processing', 'Chilli Powder Unit', 'Coriander Processing',
  'Jaggery Unit', 'Organic Gur Processing', 'Sugarcane Crushing',
  'Bakery Unit', 'Rusk Manufacturing', 'Biscuit Production',
  'Cattle Feed Unit', 'Poultry Feed Formulation', 'Bio-fertilizer Unit', 'Vermicompost',
  'Banana Fiber Extraction', 'Jute Bag Manufacturing', 'Coir Pith Processing',
  'Cotton Ginning', 'Cottonseed Oil Cake', 'Handloom Weaving', 'Khadi Garment Unit'
];

// 2. Central & State Schemes
export const VERIFIED_SCHEMES = [
  'PMEGP', 'Prime Minister Employment Generation Programme', 'KVIC', 'KVIB',
  'PMFME', 'PM Formalisation of Micro Food Processing Enterprises Scheme',
  'Mudra Yojana', 'Shishu Loan', 'Kishore Loan', 'Tarun Loan',
  'Stand-Up India', 'CGTMSE', 'Credit Guarantee Trust for Micro and Small Enterprises',
  'Agriculture Infrastructure Fund', 'AIF', 'NABARD', 'SIDBI',
  'National Rural Livelihood Mission', 'DAY-NRLM', 'SHG Bank Linkage',
  'CMEGP', 'Chief Minister Employment Generation Programme',
  'Venture Capital Assistance', 'SFAC', 'Mission for Integrated Development of Horticulture'
];

// 3. Financial & Banking Terminology
export const VERIFIED_FINANCIAL_TERMS = [
  'Detailed Project Report', 'DPR', 'Bankable DPR', 'Project Cost',
  'Term Loan', 'Working Capital', 'Cash Credit', 'Term Deposit',
  'Promoter Equity', 'Promoter Contribution', 'Margin Money',
  'Capital Subsidy', 'Back-ended Subsidy', 'Interest Subvention',
  'Monthly EMI', 'Debt Service Coverage Ratio', 'DSCR', 'Break-even Point',
  'Internal Rate of Return', 'IRR', 'Moratorium Period', 'Collateral Free',
  'Primary Security', 'Hypothecation of Assets', 'Machinery Quotation'
];

// 4. Indian Administrative & Agrarian Terms
export const VERIFIED_ADMIN_AGRI_TERMS = [
  'Gram Panchayat', 'Taluka', 'Tehsil', 'Block Development Office',
  'District Industries Centre', 'DIC', 'Lead Bank Officer',
  'APMC Mandi', 'Modal Price', 'MSP', 'Minimum Support Price', 'Arrival Volume',
  'Local Government Directory', 'LGD Code', 'Khasra', 'Khatauni', '7/12 Extract',
  'Yavatmal', 'Pusad', 'Umarkhed', 'Digras', 'Mahagaon', 'Darwha',
  'Vidarbha', 'Marathwada', 'Western Maharashtra', 'Khandesh'
];

/**
 * Builds an optimal, concise contextual prompt string for Whisper API (capped at 224 tokens).
 */
export function buildWhisperContextPrompt(ctx: VocabularyContext): string {
  const parts: string[] = [];

  parts.push('Gram-Disha rural enterprise intelligence.');

  // Add geographic context if provided
  if (ctx.district && ctx.district !== 'UNKNOWN') {
    parts.push(`Location: ${ctx.district}${ctx.state ? ', ' + ctx.state : ''}.`);
  }

  // Add enterprise context
  if (ctx.businessActivity && ctx.businessActivity !== 'UNKNOWN') {
    parts.push(`Enterprise: ${ctx.businessActivity}.`);
  }

  // Add module-specific vocabulary
  if (ctx.module === 'FINANCE') {
    parts.push('Terms: DPR, project cost, term loan, promoter equity, subsidy, EMI, DSCR, break-even, working capital.');
  } else if (ctx.module === 'SCHEMES') {
    parts.push('Schemes: PMEGP, PMFME, Mudra, KVIC, Stand-Up India, CGTMSE, NABARD, DIC subsidy.');
  } else if (ctx.module === 'MARKET_INSIGHTS') {
    parts.push('Mandi: APMC modal price, quintal, arrival volume, MSP, Desi Chana, Tur, Paddy, Mustard.');
  } else if (ctx.module === 'FEASIBILITY') {
    parts.push('Feasibility: HBFS score, raw material proximity, backward linkage, supply chain viability.');
  } else {
    // Balanced general context
    parts.push('Key terms: PMEGP subsidy, project cost, APMC mandi, DPR, Gram Panchayat, KVIC, term loan.');
  }

  return parts.join(' ');
}
