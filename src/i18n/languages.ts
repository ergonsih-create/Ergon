/**
 * @license
 * GRAM-DISHA — 23 Indian Languages Registry
 */
import { LanguageOption } from '../types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', script: 'Latin', direction: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari', direction: 'ltr' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', script: 'Perso-Arabic', direction: 'rtl' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', script: 'Bengali', direction: 'ltr' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil', direction: 'ltr' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu', direction: 'ltr' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', script: 'Gujarati', direction: 'ltr' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', script: 'Devanagari', direction: 'ltr' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada', direction: 'ltr' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', script: 'Malayalam', direction: 'ltr' },
  { code: 'od', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', script: 'Odia', direction: 'ltr' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', script: 'Gurmukhi', direction: 'ltr' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', script: 'Bengali-Assamese', direction: 'ltr' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'كٲشُر / कॉशुर', script: 'Perso-Arabic', direction: 'rtl' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', script: 'Devanagari', direction: 'ltr' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', script: 'Ol Chiki', direction: 'ltr' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', script: 'Devanagari', direction: 'ltr' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', script: 'Devanagari', direction: 'ltr' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي / सिन्धी', script: 'Arabic/Devanagari', direction: 'rtl' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', script: 'Devanagari', direction: 'ltr' },
  { code: 'mni', name: 'Manipuri (Meitei)', nativeName: 'মৈতৈলোন্', script: 'Meetei Mayek', direction: 'ltr' },
  { code: 'brx', name: 'Bodo', nativeName: 'बड़ो', script: 'Devanagari', direction: 'ltr' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', script: 'Devanagari', direction: 'ltr' }
];

export { BCP47_LANG_MAP, getBcp47Language, getLanguageName } from '../utils/voiceUtils';
