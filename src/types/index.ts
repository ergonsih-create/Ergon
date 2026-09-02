/**
 * @license
 * GRAM-DISHA — Smart India Hackathon 2026 (Team ERGON)
 * Comprehensive Domain Types & Master State Models
 */

// 1. Evidence & Uncertainty Policy
export type EvidenceStatus = 'VERIFIED' | 'DERIVED' | 'USER_REPORTED' | 'UNKNOWN';

export interface ProvenanceRecord {
  sourceId: string;
  sourceName: string;
  sourceType: 'OFFICIAL_GOVERNMENT' | 'REGULATORY_BOARD' | 'RESEARCH_BENCHMARK' | 'UNKNOWN';
  sourceUrl?: string;
  dataVintage: string;
  ruleVersion?: string;
  geographicScope: 'NATIONAL' | 'STATE' | 'DISTRICT' | 'BLOCK' | 'VILLAGE';
  confidenceScore: number;
  assumptions: string[];
  lastVerifiedDate: string;
}

export interface ProvenanceEnvelope<T> {
  data: T | null;
  status: EvidenceStatus;
  provenance?: ProvenanceRecord;
  unknownReason?: string;
}

// 2. Geographic Context (LGD Hierarchy)
export interface LocationContext {
  state: string;
  district: string;
  block: string;
  gramPanchayat: string;
  villageOrLocality: string;
  pincode?: string;
  isRural: boolean;
  opportunityRadiusKm: 5 | 10;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// 3. User & Auth Context
export type UserRole = 'ENTREPRENEUR' | 'FIELD_FACILITATOR' | 'ADMIN';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  location: LocationContext;
  demographics: {
    category: 'GENERAL' | 'SC' | 'ST' | 'OBC' | 'EWS' | 'MINORITY' | 'WOMEN' | 'EX_SERVICEMEN';
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    ageGroup: '18-25' | '26-35' | '36-50' | '50+';
    educationLevel: 'PRIMARY' | 'SECONDARY' | 'HIGHER_SECONDARY' | 'GRADUATE' | 'VOCATIONAL_ITI' | 'NONE';
    occupation: string;
    priorExperienceYears: number;
    annualHouseholdIncome: number;
    householdMembersCount: number;
  };
  createdAt: string;
  updatedAt: string;
}

// 4. Business Evaluation & Categorization
export type BusinessStage = 'IDEA' | 'EARLY_PLANNING' | 'READY_TO_LAUNCH' | 'EXISTING_EXPANSION';
export type BusinessScale = 'MICRO' | 'SMALL' | 'MEDIUM';

export interface BusinessContext {
  id: string;
  userId?: string;
  title: string;
  category: string;
  activity: string;
  stage: BusinessStage;
  scale: BusinessScale;
  description: string;
  yearsOperating?: number;
  currentMonthlyRevenue?: number;
  currentMonthlyExpenses?: number;
  employeesCount?: number;
  existingAssetsValue?: number;
  isExisting: boolean;
  proposedLocation: LocationContext;
  businessGoal: string;
  availableResources: string[];
  expectedCustomers: string;
  targetMarket: string;
}

// 5. HBFS Feasibility Engine Model
export interface HBFSScore {
  totalScore: number; // 0.0 to 1.0
  rankingTier: 'HIGH_FEASIBILITY' | 'MODERATE_FEASIBILITY' | 'LOW_FEASIBILITY' | 'EVIDENCE_INSUFFICIENT';
  components: {
    demandScore: number; // 0.25 weight
    accessibilityScore: number; // 0.15 weight
    infrastructureScore: number; // 0.10 weight
    socioeconomicScore: number; // 0.10 weight
    schemeSuitabilityScore: number; // 0.10 weight
    climateRiskPenalty: number; // 0.05 penalty weight
    capitalPenalty: number; // 0.15 penalty weight
    uncertaintyPenalty: number; // 0.20 penalty weight
  };
  scoreBreakdown?: {
    demand: number;
    accessibility: number;
    infrastructure: number;
    socioeconomic: number;
    schemes: number;
    climate: number;
    capitalPenalty: number;
    uncertaintyPenalty: number;
  };
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  strengths?: string[];
  weaknesses?: string[];
  opportunities?: string[];
  threats?: string[];
  viabilityOutlook: {
    shortTermViability: string;
    operatingSustainability: string;
    growthPotential: string;
    scalingConstraints: string[];
    longevityFactors: string[];
    longTermScalability?: string;
  };
  evidenceGaps: string[];
  disclaimer: string;
}

// 6. Deterministic Financial Engine Models
export interface ProjectCostBreakdown {
  fixedAssets: number;
  equipmentAndMachinery: number;
  infrastructureSetup: number;
  initialRawMaterialInventory: number;
  workingCapitalContingency: number;
  statutoryLicensingCosts: number;
  totalProjectCost: number;
}

export interface FinancialCalculationInput {
  projectCost: number;
  promoterCapital: number;
  interestRateAnnual: number;
  tenureMonths: number;
  moratoriumMonths: number;
  unitSalePrice: number;
  unitVariableCost: number;
  monthlyFixedCost: number;
  projectedMonthlyRevenue?: number;
  projectedMonthlyOperatingCost?: number;
  customBreakdown?: Partial<ProjectCostBreakdown>;
}

export interface MonthlyCashFlowRecord {
  month: number;
  cashInflows: number;
  variableExpenses: number;
  fixedExpenses: number;
  debtServiceEMI: number;
  netCashFlow: number;
  closingCashBalance: number;
}

export interface FinancialStructure {
  projectCost: ProjectCostBreakdown;
  promoterContribution: number;
  promoterContributionPercentage: number;
  requiredTermLoan: number;
  requiredWorkingCapitalLoan: number;
  interestRateAnnual: number;
  tenureMonths: number;
  moratoriumMonths: number;
  monthlyEMI: number;
  unitSellingPrice: number;
  unitVariableCost: number;
  monthlyFixedCost: number;
  contributionMarginPerUnit: number;
  contributionMarginPercentage?: number;
  breakEvenMonthlyUnits: number;
  breakEvenMonthlyRevenue: number;
  projectedAnnualROI: number;
  projectedDSCR: number;
  debtToEquityRatio?: string;
  projectedMonthlyCashFlow?: MonthlyCashFlowRecord[];
  cashFlowMonthly: Array<{
    month: number;
    grossRevenue: number;
    variableCosts: number;
    fixedCosts: number;
    netOperatingIncome: number;
    debtService: number;
    surplus: number;
    closingCash: number;
  }>;
}

// 7. Government Scheme Rule Engine Models
export type SchemeEligibilityState = 'POTENTIALLY_ELIGIBLE' | 'NOT_ELIGIBLE' | 'UNKNOWN';

export interface SchemeDocumentRequirement {
  documentId: string;
  name: string;
  category: 'IDENTITY' | 'ADDRESS' | 'BUSINESS' | 'FINANCIAL' | 'BANK' | 'SCHEME_SPECIFIC';
  mandatory: boolean;
  issuingAuthority: string;
  digitalAvailabilityUrl?: string;
  verificationMethod: string;
}

export interface SchemeMatch {
  schemeId: string;
  schemeCode: string; // e.g. "PMEGP", "MUDRA_TARUN", "NSFDC_MICRO", "PMFME", "STANDUP_INDIA", "NABARD_AMIF"
  schemeName: string;
  ministryOrAgency: string;
  ruleVersion: string;
  eligibilityState: SchemeEligibilityState;
  maxSubsidyOrAssistance: number;
  subsidyPercentage: number;
  eligibleLoanAmount: number;
  promoterContributionRequiredPercent: number;
  qualifyingCriteriaPassed: string[];
  unmetCriteria: string[];
  unknownCriteria: string[];
  requiredDocuments: SchemeDocumentRequirement[];
  prerequisiteDocuments?: string[];
  benefitSummary?: string;
  applicationRoute: 'ONLINE_PORTAL' | 'DISTRICT_INDUSTRY_CENTRE' | 'BANK_BRANCH' | 'PANCHAYAT_FACILITATOR';
  officialPortalUrl: string;
  responsibleAuthority: string;
  lastVerifiedDate: string;
}

// 8. Application & Progress Tracking
export type ApplicationStatus = 'DRAFT' | 'DOCUMENTS_READY' | 'SUBMITTED_OFFLINE' | 'PORTAL_SUBMITTED' | 'UNDER_SCRUTINY' | 'APPROVED' | 'DISBURSED' | 'REJECTED';

export interface SchemeApplication {
  id: string;
  schemeId: string;
  schemeName: string;
  schemeCode: string;
  status: ApplicationStatus;
  submissionDate?: string;
  referenceNumber?: string;
  appliedThrough: string;
  loanAmountRequested: number;
  subsidyAmountClaimed: number;
  timelineSteps: Array<{
    stepNumber: number;
    title: string;
    completed: boolean;
    date?: string;
    notes?: string;
  }>;
  documentChecklist: Array<{
    documentId: string;
    name: string;
    status: 'AVAILABLE' | 'REQUIRED' | 'VERIFYING';
  }>;
}

// 9. Operations Models
export interface InventoryItem {
  id: string;
  itemName: string;
  category: string;
  unit: string;
  currentStock: number;
  minimumThreshold: number;
  unitCostPrice: number;
  supplierInfo?: string;
  lastRestockedDate: string;
}

export interface SalesRecord {
  id: string;
  date: string;
  productName: string;
  unitsSold: number;
  unitPrice: number;
  totalRevenue: number;
  paymentMode: 'CASH' | 'UPI_QR' | 'BANK_TRANSFER' | 'CREDIT';
  customerType: 'RETAIL_LOCAL' | 'WHOLESALE_TRADER' | 'APMC_MANDI';
}

// 10. Grievance & Support
export interface GrievanceTicket {
  id: string;
  referenceCode: string;
  subject: string;
  category: 'SCHEME_DELAY' | 'BANK_REJECTION' | 'DOCUMENTATION_ISSUE' | 'DIC_OFFICE_INQUIRY' | 'PLATFORM_TECHNICAL';
  description: string;
  status: 'SUBMITTED' | 'IN_REVIEW' | 'ESCALATED_TO_NODAL_OFFICER' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  resolutionNotes?: string;
}

// 11. Notification Models
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'SCHEME_UPDATE' | 'DOCUMENT_ALERT' | 'FINANCIAL_REMINDER' | 'INVENTORY_LOW' | 'DISHA_INSIGHT';
  read: boolean;
  actionUrl?: string;
  timestamp: string;
}

// 12. 23 Official Indian Languages
export type SupportedLanguageCode = 
  | 'en' // English
  | 'hi' // Hindi
  | 'bn' // Bengali
  | 'te' // Telugu
  | 'mr' // Marathi
  | 'ta' // Tamil
  | 'gu' // Gujarati
  | 'kn' // Kannada
  | 'ml' // Malayalam
  | 'od' // Odia
  | 'pa' // Punjabi
  | 'as' // Assamese
  | 'ur' // Urdu
  | 'mai'// Maithili
  | 'sat'// Santali
  | 'ks' // Kashmiri
  | 'ne' // Nepali
  | 'kok'// Konkani
  | 'sd' // Sindhi
  | 'doi'// Dogri
  | 'mni'// Manipuri
  | 'bho'// Bhojpuri
  | 'sa';// Sanskrit

export interface LanguageOption {
  code: SupportedLanguageCode;
  name: string;
  nativeName: string;
  script: string;
}

// 13. Disha AI OS State
export interface DishaContextState {
  currentModule: 
    | 'PUBLIC'
    | 'ONBOARDING'
    | 'DASHBOARD'
    | 'BUSINESS_PROFILE'
    | 'BUSINESS_IDEAS'
    | 'LOCATION'
    | 'MARKET_INSIGHTS'
    | 'FEASIBILITY'
    | 'SWOT'
    | 'OUTLOOK'
    | 'FINANCE'
    | 'PROJECT_COST'
    | 'FINANCIAL_STRUCTURE'
    | 'LOANS_EMI'
    | 'CASH_FLOW'
    | 'WORKING_CAPITAL'
    | 'SCHEMES'
    | 'DOCUMENTS'
    | 'APPLICATIONS'
    | 'ACTION_PLAN'
    | 'PROGRESS'
    | 'INVENTORY'
    | 'SALES'
    | 'LEARNING'
    | 'SUPPORT'
    | 'SETTINGS'
    | 'ADMIN';
  activeInsightSummary?: string;
  criticalAlerts: string[];
  recommendedAction?: string;
  isAdvisorOpen: boolean;
  voiceLanguage: SupportedLanguageCode;
  chatHistory: Array<{
    id: string;
    sender: 'DISHA' | 'USER';
    text: string;
    timestamp: string;
    evidenceSource?: string;
    suggestedActions?: Array<{ label: string; actionCode: string }>;
  }>;
}

// 14. Admin Surface Models
export interface DatasetMetaRecord {
  datasetId: string;
  name: string;
  category: 'CORE_GOVERNMENT' | 'MARKET_COMMODITY' | 'FINANCIAL_RULES' | 'DEMOGRAPHICS' | 'AGRO_CLIMATIC';
  sourceAuthority: string;
  geographicLevel: 'NATIONAL' | 'STATE' | 'DISTRICT' | 'BLOCK' | 'VILLAGE';
  vintage: string;
  lastSyncTimestamp: string;
  totalRecordsCount: number;
  verificationStatus: 'VERIFIED' | 'STALE' | 'PENDING_AUDIT';
  confidenceRating: number;
}
