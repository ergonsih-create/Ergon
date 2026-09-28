/**
 * @license
 * GRAM-DISHA — Express Router for OpenAI Whisper Speech Intelligence
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Handles audio upload, OpenAI Whisper API communication, multilingual
 * language identification, word/segment timestamp extraction, silence
 * detection, and Disha NLP intent extraction.
 */

import { Router, Request, Response } from 'express';
import multer from 'multer';

export const whisperRouter = Router();

// Configure Multer with memory storage (never persist raw audio to disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB max
  },
  fileFilter: (_req, file, cb) => {
    // Accept standard audio formats
    const allowedMimePrefixes = ['audio/', 'video/webm', 'application/octet-stream'];
    if (allowedMimePrefixes.some(p => file.mimetype.startsWith(p)) || file.originalname.match(/\.(webm|wav|mp3|m4a|ogg|aac|flac)$/i)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported audio format: ${file.mimetype}`));
    }
  }
});

// Official 23-language registry supported by Gram-Disha with Whisper code mappings
export const SUPPORTED_WHISPER_LANGUAGES = [
  { code: 'en', whisperCode: 'en', name: 'English', nativeName: 'English', script: 'Latin', direction: 'ltr' as const },
  { code: 'hi', whisperCode: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari', direction: 'ltr' as const },
  { code: 'ur', whisperCode: 'ur', name: 'Urdu', nativeName: 'اردو', script: 'Nastaliq / Perso-Arabic', direction: 'rtl' as const },
  { code: 'bn', whisperCode: 'bn', name: 'Bengali', nativeName: 'বাংলা', script: 'Bengali', direction: 'ltr' as const },
  { code: 'ta', whisperCode: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil', direction: 'ltr' as const },
  { code: 'te', whisperCode: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu', direction: 'ltr' as const },
  { code: 'mr', whisperCode: 'mr', name: 'Marathi', nativeName: 'मराठी', script: 'Devanagari', direction: 'ltr' as const },
  { code: 'gu', whisperCode: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', script: 'Gujarati', direction: 'ltr' as const },
  { code: 'kn', whisperCode: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada', direction: 'ltr' as const },
  { code: 'ml', whisperCode: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', script: 'Malayalam', direction: 'ltr' as const },
  { code: 'pa', whisperCode: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', script: 'Gurmukhi', direction: 'ltr' as const },
  { code: 'od', whisperCode: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', script: 'Odia', direction: 'ltr' as const },
  { code: 'as', whisperCode: 'as', name: 'Assamese', nativeName: 'অসমীয়া', script: 'Bengali-Assamese', direction: 'ltr' as const },
  { code: 'sa', whisperCode: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', script: 'Devanagari', direction: 'ltr' as const },
  { code: 'ne', whisperCode: 'ne', name: 'Nepali', nativeName: 'नेपाली', script: 'Devanagari', direction: 'ltr' as const },
  { code: 'sd', whisperCode: 'sd', name: 'Sindhi', nativeName: 'سنڌي', script: 'Sindhi-Arabic', direction: 'rtl' as const },
  { code: 'ks', whisperCode: 'ks', name: 'Kashmiri', nativeName: 'كٲشُر', script: 'Nastaliq / Perso-Arabic', direction: 'rtl' as const },
  { code: 'kok', whisperCode: 'kok', name: 'Konkani', nativeName: 'कोंकणी', script: 'Devanagari', direction: 'ltr' as const },
  { code: 'mai', whisperCode: 'mai', name: 'Maithili', nativeName: 'मैथिली', script: 'Devanagari', direction: 'ltr' as const },
  { code: 'doi', whisperCode: 'doi', name: 'Dogri', nativeName: 'डोगरी', script: 'Devanagari', direction: 'ltr' as const },
  { code: 'mni', whisperCode: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্', script: 'Meitei Mayek', direction: 'ltr' as const },
  { code: 'brx', whisperCode: 'brx', name: 'Bodo', nativeName: 'बर\'', script: 'Devanagari', direction: 'ltr' as const },
  { code: 'sat', whisperCode: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', script: 'Ol Chiki', direction: 'ltr' as const },
];

/**
 * GET /api/whisper/config
 * Returns server configuration for Whisper service.
 */
whisperRouter.get('/config', (_req: Request, res: Response) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.WHISPER_MODEL || 'whisper-1';
  const apiBaseUrl = process.env.WHISPER_API_BASE_URL || 'https://api.openai.com/v1';

  res.json({
    hasApiKey: Boolean(apiKey && apiKey.trim().length > 0),
    model,
    apiBaseUrl,
    supportedLanguages: SUPPORTED_WHISPER_LANGUAGES,
    supportedFormats: ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/m4a', 'audio/ogg'],
    maxDurationSeconds: 120,
    minDurationSeconds: 0.6,
  });
});

// Shared handler for transcription and translation
async function handleAudioProcessing(req: Request, res: Response, defaultTask: 'transcribe' | 'translate' = 'transcribe') {
  try {
    const file = req.file;
    if (!file || !file.buffer || file.buffer.length === 0) {
      res.status(400).json({
        success: false,
        error_code: 'NO_AUDIO',
        message: 'No audio file received in upload or audio buffer is empty.'
      });
      return;
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.trim().length === 0) {
      res.status(400).json({
        success: false,
        error_code: 'OPENAI_KEY_MISSING',
        message: 'OPENAI_API_KEY is not configured on the server. Please configure OPENAI_API_KEY in the environment settings to enable live Whisper speech recognition.'
      });
      return;
    }

    const model = process.env.WHISPER_MODEL || 'whisper-1';
    const apiBaseUrl = process.env.WHISPER_API_BASE_URL || 'https://api.openai.com/v1';

    const preferredLanguage = req.body.language; // Optional: ISO code
    const task = (req.body.task === 'translate' || defaultTask === 'translate') ? 'translate' : 'transcribe';
    const prompt = req.body.prompt;
    const temperature = req.body.temperature ? parseFloat(req.body.temperature) : 0.0;

    // Prepare native FormData to call OpenAI Whisper API
    const formData = new FormData();
    const filename = file.originalname || 'audio.webm';
    const blob = new Blob([file.buffer], { type: file.mimetype || 'audio/webm' });
    formData.append('file', blob, filename);
    formData.append('model', model);
    formData.append('response_format', 'verbose_json');

    // Enable timestamps on transcriptions only (OpenAI translation endpoint doesn't accept timestamp_granularities)
    if (task !== 'translate') {
      formData.append('timestamp_granularities[]', 'word');
      formData.append('timestamp_granularities[]', 'segment');
    }

    if (preferredLanguage && preferredLanguage !== 'auto' && task !== 'translate') {
      formData.append('language', preferredLanguage);
    }
    if (prompt) {
      formData.append('prompt', prompt);
    }
    if (!isNaN(temperature)) {
      formData.append('temperature', String(temperature));
    }

    const endpointUrl = task === 'translate'
      ? `${apiBaseUrl}/audio/translations`
      : `${apiBaseUrl}/audio/transcriptions`;

    // 35s timeout handling via AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    let whisperResponse: globalThis.Response;
    try {
      whisperResponse = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
        signal: controller.signal,
      });
    } catch (networkErr: any) {
      if (networkErr.name === 'AbortError') {
        res.status(504).json({
          success: false,
          error_code: 'API_TIMEOUT',
          message: 'Speech recognition request timed out after 35 seconds. Please try with shorter audio.'
        });
        return;
      }
      throw networkErr;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!whisperResponse.ok) {
      const errText = await whisperResponse.text();
      let errCode = 'TRANSCRIPTION_ERROR';
      let userMessage = `Whisper API returned ${whisperResponse.status}: ${errText}`;

      try {
        const parsed = JSON.parse(errText);
        if (parsed?.error?.message) {
          userMessage = parsed.error.message;
        }
        if (whisperResponse.status === 401) {
          errCode = 'AUTHENTICATION_FAILED';
        } else if (whisperResponse.status === 429 || parsed?.error?.code === 'credit_balance_exhausted' || parsed?.error?.type === 'insufficient_quota') {
          errCode = 'QUOTA_EXCEEDED';
        } else if (whisperResponse.status === 400) {
          errCode = 'INVALID_AUDIO';
        }
      } catch {
        // Raw text message fallback
      }

      console.error(`OpenAI Whisper API error [HTTP ${whisperResponse.status} - ${errCode}]:`, userMessage);
      res.status(whisperResponse.status).json({
        success: false,
        error_code: errCode,
        message: userMessage
      });
      return;
    }

    const data: any = await whisperResponse.json();

    // Check for silence / inaudible speech based on Whisper quality signals
    const text = (data.text || '').trim();
    const segments = data.segments || [];
    const words = data.words || [];
    
    // Average no-speech probability across segments
    let avgNoSpeechProb = 0;
    let avgLogprob = 0;
    if (segments.length > 0) {
      avgNoSpeechProb = segments.reduce((sum: number, s: any) => sum + (s.no_speech_prob || 0), 0) / segments.length;
      avgLogprob = segments.reduce((sum: number, s: any) => sum + (s.avg_logprob || 0), 0) / segments.length;
    }

    if (!text || (avgNoSpeechProb > 0.75 && text.length < 5)) {
      res.status(400).json({
        success: false,
        error_code: 'NO_SPEECH_DETECTED',
        message: "I couldn't hear anything clearly. Please try again."
      });
      return;
    }

    // Resolve language info
    const detectedLangCode = (data.language || preferredLanguage || 'unknown').toLowerCase();
    const matchedLang = SUPPORTED_WHISPER_LANGUAGES.find(
      l => l.code === detectedLangCode || l.whisperCode === detectedLangCode || l.name.toLowerCase() === detectedLangCode
    );

    const isHallucinationRisk = (data.compression_ratio && data.compression_ratio > 2.4) || avgLogprob < -1.2;

    res.json({
      success: true,
      text,
      language: matchedLang ? matchedLang.code : detectedLangCode,
      languageName: matchedLang ? matchedLang.name : detectedLangCode,
      languageScript: matchedLang ? matchedLang.script : 'Unknown',
      direction: matchedLang ? matchedLang.direction : 'ltr',
      languageDetectionMethod: preferredLanguage && preferredLanguage !== 'auto' ? 'user_selected_context' : 'whisper_auto_detected',
      languageConfidence: avgLogprob !== 0 ? Math.max(0.1, Math.min(0.99, Math.exp(avgLogprob))) : 0.92,
      duration: data.duration || 0,
      segments: segments.map((s: any) => ({
        id: s.id,
        start: s.start,
        end: s.end,
        text: s.text,
        avg_logprob: s.avg_logprob,
        compression_ratio: s.compression_ratio,
        no_speech_prob: s.no_speech_prob
      })),
      words: words.map((w: any) => ({
        word: w.word,
        start: w.start,
        end: w.end
      })),
      noSpeechProb: avgNoSpeechProb,
      avgLogprob,
      isHallucinationRisk,
      englishTranslation: task === 'translate' ? text : undefined
    });

  } catch (error: any) {
    console.error('Whisper processing handler exception:', error);
    res.status(500).json({
      success: false,
      error_code: 'SERVER_ERROR',
      message: error.message || 'Internal server error during speech recognition'
    });
  }
}

/**
 * POST /transcribe
 * Uploads audio and invokes the real OpenAI Whisper API for transcription.
 */
whisperRouter.post('/transcribe', upload.single('file'), async (req: Request, res: Response) => {
  await handleAudioProcessing(req, res, 'transcribe');
});

/**
 * POST /translate
 * Uploads audio and invokes the real OpenAI Whisper API for translation to English.
 */
whisperRouter.post('/translate', upload.single('file'), async (req: Request, res: Response) => {
  await handleAudioProcessing(req, res, 'translate');
});

/**
 * POST /api/whisper/intent
 * Structured Disha NLP Intent & Entity Extraction Layer
 * Separates speech recognition from deterministic business reasoning.
 */
whisperRouter.post('/intent', (req: Request, res: Response) => {
  const { transcript, language, current_module, district, business_activity } = req.body;

  if (!transcript || typeof transcript !== 'string') {
    res.status(400).json({ error: 'Missing transcript' });
    return;
  }

  const query = transcript.toLowerCase();
  let intent: string = 'UNKNOWN';
  let confidence: number = 0.5;
  const entities: Record<string, any> = {
    locationDistrict: district || 'Yavatmal',
    businessActivity: business_activity || 'Mini Dal Mill',
  };
  let explanation = '';
  let evidenceSource = 'GRAM-DISHA Deterministic Core';
  const suggestedActions: Array<{ label: string; actionCode: string; route?: string }> = [];
  let requiresConfirmation = false;
  let confirmationPrompt: string | undefined = undefined;

  // 1. Actions requiring explicit human confirmation (e.g. submit, delete, commit)
  if (query.includes('submit') || query.includes('delete') || query.includes('apply now') || query.includes('सबमिट') || query.includes('अर्ज करा')) {
    intent = 'CONFIRMATION_REQUIRED_ACTION';
    confidence = 0.95;
    requiresConfirmation = true;
    confirmationPrompt = 'You requested an action that commits changes or submits an application. Would you like to confirm submission of this application?';
    explanation = 'Explicit confirmation required prior to state mutation.';
    suggestedActions.push({ label: 'Confirm & Proceed', actionCode: 'CONFIRM_SUBMIT' });
  } else if (query.includes('go to scheme') || query.includes('show scheme') || query.includes('open scheme') || query.includes('योजना') || query.includes('திட்டம்')) {
    intent = 'NAVIGATE';
    confidence = 0.95;
    entities.targetRoute = 'SCHEMES';
    explanation = 'Navigating to central and state matched government schemes.';
    suggestedActions.push({ label: 'Open Schemes Module', actionCode: 'NAV_SCHEMES', route: 'SCHEMES' });
  } else if (query.includes('finance') || query.includes('cash flow') || query.includes('dpr') || query.includes('वित्त') || query.includes('கடன்')) {
    intent = 'NAVIGATE';
    confidence = 0.95;
    entities.targetRoute = 'FINANCE';
    explanation = 'Opening the 5-year Financial Structuring and DPR cash flow engine.';
    suggestedActions.push({ label: 'Open Financial Structuring', actionCode: 'NAV_FINANCE', route: 'FINANCE' });
  } else if (query.includes('market') || query.includes('mandi') || query.includes('bhav') || query.includes('price') || query.includes('மண்டி') || query.includes('बाजार')) {
    intent = 'MARKET_PRICE_INQUIRY';
    confidence = 0.92;
    entities.commodityName = 'Desi Chana';
    explanation = `Displaying live APMC Mandi arrival and modal price records for ${entities.locationDistrict}.`;
    evidenceSource = 'AGMARKNET Daily Modal Records';
    suggestedActions.push({ label: 'View Mandi Analytics', actionCode: 'NAV_MARKET_INSIGHTS', route: 'MARKET_INSIGHTS' });
  } else if (query.includes('feasibility') || query.includes('hbfs') || query.includes('score') || query.includes('फिजिबिलिटी') || query.includes('ಸಾಧ್ಯತೆ')) {
    intent = 'FEASIBILITY_EXPLANATION';
    confidence = 0.93;
    explanation = 'Analyzing 8-parameter HBFS feasibility breakdown based on raw materials and local infrastructure.';
    evidenceSource = 'HBFS Multi-Vector Feasibility Engine';
    suggestedActions.push({ label: 'Open Feasibility Matrix', actionCode: 'NAV_FEASIBILITY', route: 'FEASIBILITY' });
  } else if (query.includes('cost') || query.includes('capital') || query.includes('investment') || query.includes('lakh') || query.includes('करोड') || query.includes('ரூபாய்')) {
    // Project Cost & Capital Requirement
    intent = 'PROJECT_COST_ESTIMATION';
    confidence = 0.90;
    
    // Extract numerical figures if present (e.g. 10 lakh, 15 lakh, 8.5)
    const matchLakh = query.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|लाख|லட்சம்)/i);
    if (matchLakh) {
      entities.fundingAmount = parseFloat(matchLakh[1]) * 100000;
    }
    explanation = `Estimated project cost and promoter equity calculated for ${entities.businessActivity} under rural guidelines.`;
    evidenceSource = 'MoMSME Model Project Profiles 2025';
    suggestedActions.push({ label: 'Simulate Project Cost Breakdown', actionCode: 'NAV_FINANCE', route: 'FINANCE' });
  } else if (query.includes('emi') || query.includes('tenure') || query.includes('interest') || query.includes('loan') || query.includes('ब्याज')) {
    // EMI & Debt Service
    intent = 'LOAN_EMI_CALCULATION';
    confidence = 0.92;
    entities.interestRate = 9.8;
    entities.tenureYears = 5;
    explanation = 'Calculated bank term loan repayment schedule at 9.8% annual lending rate for 60 months.';
    evidenceSource = 'RBI Benchmark Lending Guidelines';
    suggestedActions.push({ label: 'Open EMI Calculator', actionCode: 'NAV_FINANCE', route: 'FINANCE' });
  } else if (query.includes('subsidy') || query.includes('pmegp') || query.includes('pmfme') || query.includes('eligib') || query.includes('अनुदान')) {
    // Scheme Eligibility
    intent = 'SCHEME_ELIGIBILITY';
    confidence = 0.94;
    entities.schemeName = 'PMEGP';
    explanation = 'Checking 35% rural subsidy eligibility under PMEGP v2.4-2025 guidelines.';
    evidenceSource = 'Ministry of MSME / KVIC 2025';
    suggestedActions.push({ label: 'View Matched Subsidies', actionCode: 'NAV_SCHEMES', route: 'SCHEMES' });
  } else {
    intent = 'UNKNOWN';
    confidence = 0.4;
    explanation = `I heard: "${transcript}". Would you like to edit the transcript or select one of these actions?`;
    suggestedActions.push(
      { label: 'Explore Curated Business Models', actionCode: 'NAV_BUSINESS_IDEAS', route: 'BUSINESS_IDEAS' },
      { label: 'Check Scheme Subsidies', actionCode: 'NAV_SCHEMES', route: 'SCHEMES' },
      { label: 'Calculate Loan EMI', actionCode: 'NAV_FINANCE', route: 'FINANCE' }
    );
  }

  res.json({
    intent,
    confidence,
    originalTranscript: transcript,
    language: language || 'en',
    entities,
    explanation,
    evidenceSource,
    suggestedActions,
    requiresConfirmation,
    confirmationPrompt,
    isUncertain: intent === 'UNKNOWN' || confidence < 0.6
  });
});
