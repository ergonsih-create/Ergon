/**
 * @license
 * GRAM-DISHA — Indian Numbering, Currency & Date Localization Engine
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Complies with RBI, CAG, and Indian Standard (IS) conventions:
 * - Proper Lakhs & Crores grouping (3,2,2 digit separator pattern)
 * - Compact representations: ₹5.50 Lakh, ₹1.20 Cr, ₹45,000
 * - Indian standard date formats (DD/MM/YYYY, DD-MMM-YYYY)
 * - Script-specific digit transliteration for Indic scripts
 */

import { SupportedLanguageCode } from '../types';

// Indic script numeral mappings
const INDIC_DIGIT_MAPS: Partial<Record<SupportedLanguageCode, string[]>> = {
  hi: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
  mr: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
  ne: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
  bn: ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'],
  as: ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'],
  gu: ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'],
  pa: ['੦', '੧', '੨', '੩', '੪', '੫', '੬', '੭', '੮', '੯'],
  ta: ['௦', '௧', '௨', '௩', '௪', '௫', '௬', '௭', '௮', '௯'],
  te: ['౦', '౧', '౨', '౩', '౪', '౫', '౬', '౭', '౮', '౯'],
  kn: ['೦', '೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯'],
  ml: ['൦', '൧', '൨', '൩', '൪', '൫', '൬', '൭', '൮', '൯'],
  od: ['୦', '୧', '୨', '୩', '୪', '୫', '୬', '୭', '୮', '୯'],
  ur: ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'],
  ks: ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'],
  sd: ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'],
};

/**
 * Formats a number with Indian Lakhs and Crores grouping:
 * e.g., 1000000 -> "10,00,000"
 */
export function formatNumberIndian(val: number | string): string {
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '0';

  const isNegative = num < 0;
  const absVal = Math.abs(num);
  const parts = absVal.toFixed(2).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];

  // Last 3 digits
  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);

  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }

  // Format the remaining digits in pairs of 2
  const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  let result = formattedOther + lastThree;

  // Clean trailing zeros in decimals if any
  if (decimalPart && decimalPart !== '00') {
    result += '.' + decimalPart;
  }

  return (isNegative ? '-' : '') + result;
}

/**
 * Formats an amount in INR with standard currency symbol and compact units:
 * e.g. 500000 -> ₹5.00 Lakh
 *      15000000 -> ₹1.50 Cr
 *      25000 -> ₹25,000
 */
export function formatINR(
  amount: number | string,
  options?: {
    compact?: boolean;
    symbol?: boolean;
    lang?: SupportedLanguageCode;
  }
): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '₹0';

  const symbol = options?.symbol !== false ? '₹' : '';

  if (options?.compact) {
    const abs = Math.abs(num);
    const sign = num < 0 ? '-' : '';

    if (abs >= 10000000) {
      // Crores
      return `${sign}${symbol}${(abs / 10000000).toFixed(2)} Cr`;
    }
    if (abs >= 100000) {
      // Lakhs
      return `${sign}${symbol}${(abs / 100000).toFixed(2)} Lakh`;
    }
    if (abs >= 1000) {
      // Thousands
      return `${sign}${symbol}${(abs / 1000).toFixed(1)}k`;
    }
  }

  return `${symbol}${formatNumberIndian(num)}`;
}

/**
 * Formats a Date object or ISO timestamp in Indian standard notation
 */
export function formatDateIndian(
  dateInput: Date | string | number,
  format: 'short' | 'medium' | 'long' = 'medium'
): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '-';

  const day = String(d.getDate()).padStart(2, '0');
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const monthShort = monthNames[d.getMonth()];
  const monthNum = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  if (format === 'short') {
    return `${day}/${monthNum}/${year}`;
  }

  if (format === 'medium') {
    return `${day} ${monthShort} ${year}`;
  }

  // long format
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Converts Western Arabic digits (0-9) to native Indic script digits
 */
export function toIndicDigits(textOrNum: string | number, lang: SupportedLanguageCode): string {
  const str = String(textOrNum);
  const map = INDIC_DIGIT_MAPS[lang];
  if (!map) return str;

  return str.replace(/[0-9]/g, (digit) => map[parseInt(digit, 10)] || digit);
}
