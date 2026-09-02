/**
 * @license
 * GRAM-DISHA — Approved Design Tokens & Visual Constants
 * Warm White Editorial Platform Theme
 */

export const THEME_COLORS = {
  // Backgrounds
  bgWarmWhite: '#F8F5EE',
  bgSoftCream: '#FCFAF5',
  
  // Primary Accents
  terracotta: '#B95736',
  deepTerracotta: '#9F452B',
  
  // Natural / Sage Tones
  sage: '#71856A',
  deepGreen: '#174C3A',
  oliveSage: '#87977A',
  naturalGreen: '#3F7658',
  
  // Corporate & Regulatory
  deepNavy: '#173B57',
  dustyBlue: '#52758A',
  
  // Accents & Warmth
  mutedGold: '#C69A45',
  ochre: '#B78332',
  deepRedTerracotta: '#A63D2D',
  
  // Neutrals & Surface Lines
  charcoal: '#242522',
  warmGray: '#68655D',
  softTaupe: '#D9D3C7',
  borderSoft: 'rgba(217, 211, 199, 0.7)',
} as const;

export const TYPOGRAPHY = {
  display: 'Cinzel, Butler, serif',
  editorial: 'Rosarivo, serif',
  body: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
} as const;

export const MODULE_DEFINITIONS = [
  { id: 'LOCATION', name: 'Hyper-Local Context', icon: 'MapPin', path: '/location' },
  { id: 'MARKET_INSIGHTS', name: 'Market Intelligence', icon: 'TrendingUp', path: '/market-insights' },
  { id: 'FEASIBILITY', name: 'Feasibility & SWOT', icon: 'Compass', path: '/feasibility' },
  { id: 'FINANCE', name: 'Financial Structuring', icon: 'Calculator', path: '/financial-structuring' },
  { id: 'SCHEMES', name: 'Government Schemes', icon: 'Landmark', path: '/schemes' },
  { id: 'ACTION_PLAN', name: 'Action & Execution', icon: 'CheckSquare', path: '/action-plan' },
  { id: 'PROGRESS', name: 'Progress Tracking', icon: 'BarChart2', path: '/progress' },
] as const;
