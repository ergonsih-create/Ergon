/**
 * @license
 * GRAM-DISHA — Multilingual Locales Registry
 * Team ERGON — Smart India Hackathon 2026
 */

import en from './en.json';
import hi from './hi.json';
import ur from './ur.json';
import bn from './bn.json';
import ta from './ta.json';
import te from './te.json';
import gu from './gu.json';
import mr from './mr.json';
import kn from './kn.json';
import ml from './ml.json';
import od from './od.json';
import pa from './pa.json';
import as from './as.json';
import ks from './ks.json';
import mai from './mai.json';
import sat from './sat.json';
import ne from './ne.json';
import kok from './kok.json';
import sd from './sd.json';
import doi from './doi.json';
import mni from './mni.json';
import brx from './brx.json';
import sa from './sa.json';
import { I18nTranslationSchema } from '../schema';

export const LOCALES: Record<string, I18nTranslationSchema> = {
  en: en as I18nTranslationSchema,
  hi: hi as I18nTranslationSchema,
  ur: ur as I18nTranslationSchema,
  bn: bn as I18nTranslationSchema,
  ta: ta as I18nTranslationSchema,
  te: te as I18nTranslationSchema,
  gu: gu as I18nTranslationSchema,
  mr: mr as I18nTranslationSchema,
  kn: kn as I18nTranslationSchema,
  ml: ml as I18nTranslationSchema,
  od: od as I18nTranslationSchema,
  pa: pa as I18nTranslationSchema,
  as: as as I18nTranslationSchema,
  ks: ks as I18nTranslationSchema,
  mai: mai as I18nTranslationSchema,
  sat: sat as I18nTranslationSchema,
  ne: ne as I18nTranslationSchema,
  kok: kok as I18nTranslationSchema,
  sd: sd as I18nTranslationSchema,
  doi: doi as I18nTranslationSchema,
  mni: mni as I18nTranslationSchema,
  brx: brx as I18nTranslationSchema,
  sa: sa as I18nTranslationSchema,
};

/**
 * Resolves a nested dot-notation translation key (e.g. 'nav.getStarted' or 'welcome.heroHeadline')
 * Falls back to English if the translation is missing in the target locale.
 */
export function getLocaleString(lang: string, keyPath: string): string {
  const targetLocale = LOCALES[lang] || LOCALES['en'];
  const defaultLocale = LOCALES['en'];

  const parts = keyPath.split('.');
  
  // Try resolving in target locale
  let cur: any = targetLocale;
  for (const part of parts) {
    if (cur && typeof cur === 'object' && part in cur) {
      cur = cur[part];
    } else {
      cur = undefined;
      break;
    }
  }

  if (typeof cur === 'string') {
    return cur;
  }

  // Fallback to English
  let def: any = defaultLocale;
  for (const part of parts) {
    if (def && typeof def === 'object' && part in def) {
      def = def[part];
    } else {
      def = undefined;
      break;
    }
  }

  if (typeof def === 'string') {
    return def;
  }

  return keyPath;
}
