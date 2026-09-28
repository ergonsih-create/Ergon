/**
 * @license
 * GRAM-DISHA — OpenAI Whisper Speech Intelligence Domain Types
 * Team ERGON — Smart India Hackathon 2026
 */

export type WhisperVoiceState =
  | 'IDLE'
  | 'READY'
  | 'LISTENING'
  | 'RECORDING'
  | 'PROCESSING'
  | 'TRANSCRIBING'
  | 'UNDERSTOOD'
  | 'ACTION_READY';

export type WhisperErrorState =
  | 'MICROPHONE_DENIED'
  | 'NO_AUDIO'
  | 'AUDIO_TOO_SHORT'
  | 'AUDIO_TOO_LONG'
  | 'NETWORK_ERROR'
  | 'TRANSCRIPTION_ERROR'
  | 'LANGUAGE_UNKNOWN'
  | 'UNSUPPORTED_LANGUAGE'
  | 'SERVER_ERROR'
  | 'OPENAI_KEY_MISSING'
  | null;

export interface WhisperWord {
  word: string;
  start: number;
  end: number;
}

export interface WhisperSegment {
  id: number;
  seek?: number;
  start: number;
  end: number;
  text: string;
  tokens?: number[];
  temperature?: number;
  avg_logprob?: number;
  compression_ratio?: number;
  no_speech_prob?: number;
}

export interface WhisperTranscriptionResult {
  text: string;
  language: string; // ISO 639-1 code, e.g., 'hi', 'ta', 'en'
  languageName?: string;
  languageScript?: string;
  direction?: 'ltr' | 'rtl';
  languageDetectionMethod: 'whisper_auto_detected' | 'user_selected_context' | 'unknown';
  languageConfidence: number; // 0.0 to 1.0 (derived from logprob or probability signals)
  languageProbabilities?: Record<string, number>;
  duration: number; // in seconds
  segments: WhisperSegment[];
  words: WhisperWord[];
  noSpeechProb?: number;
  avgLogprob?: number;
  compressionRatio?: number;
  isHallucinationRisk?: boolean;
  englishTranslation?: string;
}

export interface WhisperConfig {
  hasApiKey: boolean;
  model: string;
  apiBaseUrl: string;
  supportedLanguages: Array<{
    code: string;
    name: string;
    nativeName: string;
    script: string;
    direction: 'ltr' | 'rtl';
    whisperCode: string;
  }>;
  supportedFormats: string[];
  maxDurationSeconds: number;
  minDurationSeconds: number;
}

export type DishaIntentType =
  | 'NAVIGATE'
  | 'PROJECT_COST_ESTIMATION'
  | 'SCHEME_ELIGIBILITY'
  | 'LOAN_EMI_CALCULATION'
  | 'MARKET_PRICE_INQUIRY'
  | 'FEASIBILITY_EXPLANATION'
  | 'FORM_ASSISTANCE'
  | 'DOCUMENT_CHECKLIST'
  | 'CONFIRMATION_REQUIRED_ACTION'
  | 'EXPLAIN_DECISION'
  | 'UNKNOWN';

export interface DishaVoiceIntentResult {
  intent: DishaIntentType;
  confidence: number; // 0.0 to 1.0
  originalTranscript: string;
  language: string;
  entities: {
    businessActivity?: string;
    locationDistrict?: string;
    locationState?: string;
    fundingAmount?: number;
    schemeName?: string;
    commodityName?: string;
    targetRoute?: string;
    tenureYears?: number;
    interestRate?: number;
    [key: string]: any;
  };
  explanation: string;
  evidenceSource?: string;
  suggestedActions: Array<{
    label: string;
    actionCode: string;
    route?: string;
    params?: Record<string, any>;
  }>;
  requiresConfirmation: boolean;
  confirmationPrompt?: string;
  isUncertain: boolean;
}

export interface AudioVisualizerData {
  rms: number;
  peak: number;
  frequencies: Uint8Array;
}
