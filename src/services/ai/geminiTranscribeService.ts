/**
 * @license
 * GRAM-DISHA — Gemini 3.5 Transcribe Service
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Provides client-side helpers to record audio from microphone or upload files,
 * and call the server-side gemini-3.5-transcribe endpoint.
 */

export interface TranscribeResponse {
  success: boolean;
  transcript: string;
  model: string;
  error?: string;
}

export class GeminiTranscribeService {
  /**
   * Transcribe a recorded Audio Blob using server-side gemini-3.5-transcribe
   */
  static async transcribeAudioBlob(blob: Blob, customPrompt?: string): Promise<TranscribeResponse> {
    try {
      const base64Audio = await this.blobToBase64(blob);
      const mimeType = blob.type || 'audio/webm';

      const response = await fetch('/api/gemini/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio: base64Audio,
          mimeType,
          prompt: customPrompt,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || errData.details || `Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      console.error('[GeminiTranscribeService] Error transcribing audio:', err);
      return {
        success: false,
        transcript: '',
        model: 'gemini-3.5-transcribe',
        error: err.message || 'Failed to transcribe audio stream',
      };
    }
  }

  /**
   * Helper to convert Blob to Base64 string
   */
  private static blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (result && result.includes(',')) {
          resolve(result.split(',')[1]);
        } else {
          resolve(result);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(blob);
    });
  }
}
