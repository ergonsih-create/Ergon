/**
 * @license
 * GRAM-DISHA — Internationalization (i18n) Schema Definition
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Strict Schema for Multi-Script & Multilingual Indic Enterprise Platform
 */

export interface I18nTranslationSchema {
  metadata: {
    appName: string;
    appTagline: string;
    sihBadge: string;
    initiative: string;
  };
  nav: {
    home: string;
    howItWorks: string;
    features: string;
    feasibility: string;
    financials: string;
    schemes: string;
    about: string;
    signInGoogle: string;
    getStarted: string;
    dashboardLink: string;
    switchLanguage: string;
  };
  header: {
    activeLocationLabel: string;
    selectEnterprise: string;
    allIndia: string;
    jwtSession: string;
    notifications: string;
    myProfile: string;
    logout: string;
    dishaOsTitle: string;
    searchPlaceholder: string;
  };
  welcome: {
    heroHeadline: string;
    heroSubtitle: string;
    badgeLabel: string;
    startPlanningBtn: string;
    exploreMethodologyBtn: string;
    statsEntrepreneursLabel: string;
    statsDistrictsLabel: string;
    statsSchemesLabel: string;
    statsSubsidiesLabel: string;
  };
  dashboard: {
    overviewTitle: string;
    overviewSubtitle: string;
    swotAnalysis: string;
    marketDemand: string;
    financialStructuring: string;
    governmentSchemes: string;
    documentChecklist: string;
    applicationsProgress: string;
    grievanceSupport: string;
    exportDprBtn: string;
  };
  forms: {
    fullNameLabel: string;
    emailLabel: string;
    mobileLabel: string;
    stateLabel: string;
    districtLabel: string;
    blockLabel: string;
    panchayatLabel: string;
    villageLabel: string;
    pincodeLabel: string;
    activityTypeLabel: string;
    projectCostLabel: string;
    ownContributionLabel: string;
    searchVillagePlaceholder: string;
    saveProfileBtn: string;
    cancelBtn: string;
    submitBtn: string;
  };
  badges: {
    lgdVerified: string;
    specialCategoryRural: string;
    pmegpEligible: string;
    odopNotified: string;
    highFeasibility: string;
    lowRisk: string;
    unknownStateWarning: string;
  };
  footer: {
    copyrightText: string;
    madeInIndia: string;
    teamErgon: string;
    privacyPolicy: string;
    termsConditions: string;
    grievancePortal: string;
  };
  accessibility: {
    selectLanguageAria: string;
    closeMenuAria: string;
    openMenuAria: string;
    rtlNotice: string;
    scriptName: string;
  };
}
