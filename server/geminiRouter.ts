/**
 * @license
 * GRAM-DISHA — Gemini AI Intelligence Router (Transcribe, TTS & Live)
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Provides server-side Gemini API endpoints using @google/genai SDK:
 * - gemini-3.5-transcribe for audio transcription
 * - gemini-3.1-flash-tts-preview for speech synthesis
 * - gemini-3.8-flash for smart text features
 */

import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

export const geminiRouter = Router();

// Helper to get GoogleGenAI client
function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * POST /api/gemini/transcribe
 * Transcribe pre-recorded or live microphone audio using gemini-3.5-transcribe
 */
geminiRouter.post('/transcribe', async (req: Request, res: Response) => {
  try {
    const { audio, mimeType, prompt } = req.body || {};

    if (!audio) {
      return res.status(400).json({ error: 'Missing required field: audio (base64 string)' });
    }

    const ai = getGenAIClient();
    const effectiveMimeType = mimeType || 'audio/webm';
    
    // Clean base64 string if data URL prefix exists
    const cleanBase64 = typeof audio === 'string' && audio.includes('base64,') 
      ? audio.split('base64,')[1] 
      : audio;

    const audioPart = {
      inlineData: {
        mimeType: effectiveMimeType,
        data: cleanBase64,
      },
    };

    const instruction = prompt || 'Transcribe this spoken audio verbatim and accurately. Preserve speech nuances. Output only the transcribed text without conversational filler or extra commentary.';

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [audioPart, { text: instruction }] },
    });

    const transcript = response.text || '';

    return res.json({
      success: true,
      transcript: transcript.trim(),
      model: 'gemini-2.5-flash',
    });
  } catch (err: any) {
    console.error('[Gemini Router] Transcribe error:', err);
    return res.status(500).json({
      error: 'Failed to transcribe audio',
      details: err.message || String(err),
    });
  }
});

/**
 * POST /api/gemini/speech
 * Synthesize speech from text using gemini-2.5-flash
 */
geminiRouter.post('/speech', async (req: Request, res: Response) => {
  try {
    const { text, voiceName } = req.body || {};

    if (!text) {
      return res.status(400).json({ error: 'Missing required field: text' });
    }

    const ai = getGenAIClient();
    const selectedVoice = voiceName || 'Kore'; // Options: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: selectedVoice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio returned from Gemini TTS' });
    }

    return res.json({
      success: true,
      audio: base64Audio,
      mimeType: 'audio/pcm;rate=24000',
      model: 'gemini-3.1-flash-tts-preview',
    });
  } catch (err: any) {
    console.error('[Gemini Router] TTS error:', err);
    return res.status(500).json({
      error: 'Failed to generate speech',
      details: err.message || String(err),
    });
  }
});
