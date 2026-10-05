/**
 * @license
 * GRAM-DISHA — Centralized Voice & Speech Intelligence Utilities
 * Team ERGON — Smart India Hackathon 2026
 *
 * Provides:
 * 1. Authoritative BCP-47 language mappings for all 23 Indian languages
 * 2. Asynchronous browser SpeechSynthesis voice loading & cache
 * 3. Exact & prefix matching for native TTS voices
 * 4. Text-to-Speech sanitization (removes markdown/tables while preserving ₹, numbers, schemes)
 * 5. Sequential sentence chunking to defeat Chromium's 15-second speech truncation
 */

export const BCP47_LANG_MAP: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
  pa: 'pa-IN',
  ml: 'ml-IN',
  od: 'or-IN', // ISO 639-1 code for Odia in BCP-47 is 'or'
  as: 'as-IN',
  ur: 'ur-IN',
  ks: 'ks-IN',
  mai: 'mai-IN',
  sat: 'sat-IN',
  ne: 'ne-NP',
  kok: 'kok-IN',
  sd: 'sd-IN',
  doi: 'doi-IN',
  mni: 'mni-IN',
  brx: 'brx-IN',
  sa: 'sa-IN',
};

export const LANGUAGE_NAME_MAP: Record<string, { name: string; nativeName: string }> = {
  en: { name: 'English', nativeName: 'English' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी' },
  mr: { name: 'Marathi', nativeName: 'मराठी' },
  ta: { name: 'Tamil', nativeName: 'தமிழ்' },
  te: { name: 'Telugu', nativeName: 'తెలుగు' },
  bn: { name: 'Bengali', nativeName: 'বাংলা' },
  gu: { name: 'Gujarati', nativeName: 'ગુજરાતી' },
  kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  ml: { name: 'Malayalam', nativeName: 'മലയാളം' },
  od: { name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  as: { name: 'Assamese', nativeName: 'অসমীয়া' },
  ur: { name: 'Urdu', nativeName: 'اردو' },
  ks: { name: 'Kashmiri', nativeName: 'كٲشُر' },
  mai: { name: 'Maithili', nativeName: 'मैथिली' },
  sat: { name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  ne: { name: 'Nepali', nativeName: 'नेपाली' },
  kok: { name: 'Konkani', nativeName: 'कोंकणी' },
  sd: { name: 'Sindhi', nativeName: 'سنڌي' },
  doi: { name: 'Dogri', nativeName: 'डोगरी' },
  mni: { name: 'Manipuri', nativeName: 'মৈতৈলোন্' },
  brx: { name: 'Bodo', nativeName: 'बड़ो' },
  sa: { name: 'Sanskrit', nativeName: 'संस्कृतम्' },
};

/**
 * Returns the standardized BCP-47 tag for a given language code.
 * Defaults to 'en-IN' if not found.
 */
export function getBcp47Language(langCode?: string): string {
  if (!langCode) return 'en-IN';
  const clean = langCode.toLowerCase().trim();
  if (clean.includes('-')) return clean;
  return BCP47_LANG_MAP[clean] || 'en-IN';
}

/**
 * Returns the human-readable English name for a given language code.
 */
export function getLanguageName(langCode?: string): string {
  if (!langCode) return 'English';
  const clean = langCode.toLowerCase().trim();
  return LANGUAGE_NAME_MAP[clean]?.name || 'English';
}

/**
 * In-memory voice cache & asynchronous listener
 */
let cachedVoices: SpeechSynthesisVoice[] = [];
let voiceListenersAttached = false;

export function initVoiceCache(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  const updateVoices = () => {
    try {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        cachedVoices = v;
      }
    } catch {}
  };

  updateVoices();

  if (!voiceListenersAttached) {
    voiceListenersAttached = true;
    if (typeof window.speechSynthesis.addEventListener === 'function') {
      window.speechSynthesis.addEventListener('voiceschanged', updateVoices);
    } else if ('onvoiceschanged' in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }
}

/**
 * Retrieves the current cached list of browser SpeechSynthesis voices.
 */
export function getCachedVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  if (cachedVoices.length === 0) {
    initVoiceCache();
  }
  return cachedVoices;
}

/**
 * Matches an installed browser voice against target BCP-47 code and language prefix.
 * Supports both:
 * - findMatchingVoice(targetBcpOrCode: string, voices?: SpeechSynthesisVoice[])
 * - findMatchingVoice(voices: SpeechSynthesisVoice[], targetBcp: string, langCode?: string)
 */
export function findMatchingVoice(
  targetOrVoices: string | SpeechSynthesisVoice[],
  targetBcpOrVoices?: string | SpeechSynthesisVoice[],
  langCode?: string
): SpeechSynthesisVoice | undefined {
  let voices: SpeechSynthesisVoice[];
  let normalizedTargetBcp: string;
  let targetPrefix: string;

  if (typeof targetOrVoices === 'string') {
    // Called as findMatchingVoice(targetBcpOrCode, voices?)
    const bcp = getBcp47Language(targetOrVoices);
    normalizedTargetBcp = bcp.toLowerCase().replace(/_/g, '-');
    targetPrefix = (targetOrVoices.includes('-') ? targetOrVoices.split('-')[0] : targetOrVoices).toLowerCase();
    if (Array.isArray(targetBcpOrVoices)) {
      voices = targetBcpOrVoices;
    } else {
      voices = getCachedVoices();
      if (voices.length === 0 && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        voices = window.speechSynthesis.getVoices();
      }
    }
  } else {
    // Called as findMatchingVoice(voices, targetBcp, langCode?)
    voices = targetOrVoices;
    const bcp = typeof targetBcpOrVoices === 'string' ? targetBcpOrVoices : 'en-IN';
    normalizedTargetBcp = bcp.toLowerCase().replace(/_/g, '-');
    targetPrefix = (langCode || bcp.split('-')[0]).toLowerCase();
  }

  if (!voices || voices.length === 0) return undefined;

  const prefixVariants = targetPrefix === 'od' ? ['or', 'od'] : targetPrefix === 'or' ? ['or', 'od'] : [targetPrefix];

  // 1. Exact match on BCP-47
  let match = voices.find(v => v.lang.toLowerCase().replace(/_/g, '-') === normalizedTargetBcp);
  if (match) return match;

  // 2. Starts with target BCP-47
  match = voices.find(v => v.lang.toLowerCase().replace(/_/g, '-').startsWith(normalizedTargetBcp));
  if (match) return match;

  // 3. Prefix match
  match = voices.find(v => {
    const vLang = v.lang.toLowerCase().replace(/_/g, '-');
    return prefixVariants.some(p => vLang.startsWith(`${p}-`) || vLang === p);
  });
  if (match) return match;

  // 4. Voice name contains language name or native name
  const langMeta = LANGUAGE_NAME_MAP[targetPrefix];
  if (langMeta) {
    match = voices.find(v => {
      const vName = v.name.toLowerCase();
      return (
        vName.includes(langMeta.name.toLowerCase()) ||
        vName.includes(langMeta.nativeName.toLowerCase())
      );
    });
    if (match) return match;
  }

  return undefined;
}

/**
 * Finds the best browser voice for a given language code.
 */
export function getBrowserVoice(langCode: string): SpeechSynthesisVoice | undefined {
  const voices = getCachedVoices();
  const targetBcp = getBcp47Language(langCode);
  return findMatchingVoice(voices, targetBcp, langCode);
}

/**
 * Sanitizes markdown/chat text into natural speech-friendly text for TTS.
 * Preserves currency values (₹), numerical amounts, percentages, and scheme names.
 */
export function cleanTextForTTS(text: string): string {
  if (!text) return '';

  let cleaned = text;

  // 1. Remove markdown code blocks ```...```
  cleaned = cleaned.replace(/```[\s\S]*?```/g, ' ');

  // 2. Remove inline code backticks `code`
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');

  // 3. Handle markdown tables:
  // Remove separator rows like |---|---|
  cleaned = cleaned.replace(/\|?\s*[-:]+[-| :]*\s*\|?/g, ' ');
  // Replace table pipes with commas/spaces
  cleaned = cleaned.replace(/\|/g, ', ');

  // 4. Convert markdown links [Label](url) to just Label
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 5. Remove raw standalone URLs
  cleaned = cleaned.replace(/https?:\/\/\S+/gi, '');

  // 6. Remove markdown headers (#, ##, ###)
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');

  // 7. Remove bold and italic markers (*, **, _, __)
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1');
  cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1');
  cleaned = cleaned.replace(/__([^_]+)__/g, '$1');
  cleaned = cleaned.replace(/_([^_]+)_/g, '$1');

  // 8. Remove list bullets (*, -, +) at start of lines
  cleaned = cleaned.replace(/^\s*[-*+]\s+/gm, '');

  // 9. Clean up multiple punctuation and whitespace
  cleaned = cleaned.replace(/,\s*,+/g, ',');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}

/**
 * Splits text into natural sentence/paragraph chunks for sequential TTS playback.
 * Prevents Chromium's 15-second speech synthesis timeout from cutting off audio.
 */
export function splitTextIntoSentenceChunks(text: string, maxChunkLength: number = 180): string[] {
  if (!text || !text.trim()) return [];

  const trimmed = text.trim();
  if (trimmed.length <= maxChunkLength) return [trimmed];

  const chunks: string[] = [];
  // Split on sentence terminators: full stop, Indian danda (।), question mark, exclamation mark, newline
  const sentenceRegex = /([^.!?|।\n]+[.!?|।\n]+)/g;
  const rawSentences = trimmed.match(sentenceRegex) || [trimmed];

  let currentChunk = '';

  for (const s of rawSentences) {
    const sentence = s.trim();
    if (!sentence) continue;

    if (currentChunk.length + sentence.length + 1 <= maxChunkLength) {
      currentChunk = currentChunk ? `${currentChunk} ${sentence}` : sentence;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = '';
      }

      if (sentence.length > maxChunkLength) {
        const words = sentence.split(' ');
        let wordChunk = '';
        for (const w of words) {
          if (wordChunk.length + w.length + 1 <= maxChunkLength) {
            wordChunk = wordChunk ? `${wordChunk} ${w}` : w;
          } else {
            if (wordChunk) chunks.push(wordChunk);
            wordChunk = w;
          }
        }
        if (wordChunk) {
          currentChunk = wordChunk;
        }
      } else {
        currentChunk = sentence;
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks.length > 0 ? chunks : [trimmed];
}
