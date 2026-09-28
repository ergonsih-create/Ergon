/**
 * @license
 * GRAM-DISHA — OpenAI Whisper Speech Intelligence Client Service
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Handles real microphone capture, Web Audio API amplitude analysis,
 * audio encoding, network transmission to backend Whisper endpoints,
 * silence detection, timestamp alignment, and TTS playback.
 */

import { 
  WhisperConfig, 
  WhisperTranscriptionResult, 
  WhisperErrorState, 
  DishaVoiceIntentResult, 
  AudioVisualizerData 
} from '../../types/whisper';
import { buildWhisperContextPrompt, VocabularyContext } from './vocabulary';

export interface TranscribeRequestOptions {
  language?: string; // Optional preferred ISO code
  task?: 'transcribe' | 'translate';
  promptContext?: VocabularyContext;
  temperature?: number;
}

export class WhisperClientService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private animFrameId: number | null = null;
  private audioChunks: Blob[] = [];
  private recordingStartTime: number = 0;
  private maxRmsRecorded: number = 0;
  private totalRmsSamples: number = 0;
  private sumRms: number = 0;

  /**
   * Fetches server-side Whisper status and configuration.
   */
  public static async fetchConfig(): Promise<WhisperConfig> {
    try {
      const response = await fetch('/api/whisper/config');
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      return await response.json();
    } catch (err: any) {
      // Fallback default config
      return {
        hasApiKey: false,
        model: 'whisper-1',
        apiBaseUrl: 'https://api.openai.com/v1',
        supportedLanguages: [],
        supportedFormats: ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/m4a', 'audio/ogg'],
        maxDurationSeconds: 120,
        minDurationSeconds: 0.6
      };
    }
  }

  /**
   * Starts capturing real microphone audio with real-time Web Audio API amplitude monitoring.
   */
  public async startRecording(
    onAmplitude?: (data: AudioVisualizerData) => void
  ): Promise<void> {
    this.audioChunks = [];
    this.maxRmsRecorded = 0;
    this.totalRmsSamples = 0;
    this.sumRms = 0;

    // Check browser mediaDevices support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('MICROPHONE_DENIED');
    }

    try {
      this.audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1
        }
      });
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        throw new Error('MICROPHONE_DENIED');
      }
      throw new Error('MICROPHONE_DENIED');
    }

    // Set up Web Audio API for real audio analysis (RMS & Frequencies)
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(this.audioStream);
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 256;
      this.analyserNode.smoothingTimeConstant = 0.8;
      source.connect(this.analyserNode);

      if (onAmplitude) {
        const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
        const timeData = new Float32Array(this.analyserNode.fftSize);

        const updateLoop = () => {
          if (!this.analyserNode) return;
          this.analyserNode.getByteFrequencyData(dataArray);
          this.analyserNode.getFloatTimeDomainData(timeData);

          // Compute RMS amplitude
          let sumSquares = 0;
          for (let i = 0; i < timeData.length; i++) {
            sumSquares += timeData[i] * timeData[i];
          }
          const rms = Math.sqrt(sumSquares / timeData.length);
          const normalizedRms = Math.min(1, rms * 4); // Boost for UI visualizer
          
          this.sumRms += rms;
          this.totalRmsSamples++;
          if (rms > this.maxRmsRecorded) {
            this.maxRmsRecorded = rms;
          }

          onAmplitude({
            rms: normalizedRms,
            peak: rms,
            frequencies: dataArray
          });

          this.animFrameId = requestAnimationFrame(updateLoop);
        };
        this.animFrameId = requestAnimationFrame(updateLoop);
      }
    } catch (e) {
      console.warn('Web Audio API analyzer not available', e);
    }

    // Determine supported mimeType
    let mimeType = 'audio/webm;codecs=opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      if (MediaRecorder.isTypeSupported('audio/webm')) mimeType = 'audio/webm';
      else if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
      else if (MediaRecorder.isTypeSupported('audio/ogg')) mimeType = 'audio/ogg';
      else mimeType = ''; // Let browser choose default
    }

    const options = mimeType ? { mimeType } : undefined;
    this.mediaRecorder = new MediaRecorder(this.audioStream, options);

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        this.audioChunks.push(e.data);
      }
    };

    this.recordingStartTime = Date.now();
    this.mediaRecorder.start(250); // Emit chunk every 250ms
  }

  /**
   * Stops recording and returns the recorded audio Blob and duration.
   */
  public async stopRecording(): Promise<{ blob: Blob; duration: number; isSilent: boolean }> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        return reject(new Error('NO_AUDIO'));
      }

      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }

      this.mediaRecorder.onstop = () => {
        const duration = (Date.now() - this.recordingStartTime) / 1000;
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });

        // Clean up tracks
        if (this.audioStream) {
          this.audioStream.getTracks().forEach((track) => track.stop());
          this.audioStream = null;
        }
        if (this.audioContext && this.audioContext.state !== 'closed') {
          this.audioContext.close().catch(() => {});
          this.audioContext = null;
        }

        // Silence check: If max RMS is extremely low (< 0.008), audio is likely completely silent or inaudible
        const avgRms = this.totalRmsSamples > 0 ? this.sumRms / this.totalRmsSamples : 0;
        const isSilent = this.maxRmsRecorded < 0.008 && avgRms < 0.004;

        resolve({
          blob: audioBlob,
          duration,
          isSilent
        });
      };

      try {
        this.mediaRecorder.stop();
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Cancels any in-progress recording and clears resources.
   */
  public cancelRecording(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch {}
    }
    if (this.audioStream) {
      this.audioStream.getTracks().forEach((t) => t.stop());
      this.audioStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
    this.audioChunks = [];
  }

  /**
   * Uploads real audio blob to backend Whisper transcribe endpoint.
   */
  public static async transcribe(
    audioBlob: Blob,
    options: TranscribeRequestOptions = {}
  ): Promise<WhisperTranscriptionResult> {
    const formData = new FormData();
    const extension = audioBlob.type.includes('mp4') ? 'mp4' : audioBlob.type.includes('ogg') ? 'ogg' : 'webm';
    formData.append('file', audioBlob, `voice_recording.${extension}`);

    if (options.language && options.language !== 'auto') {
      formData.append('language', options.language);
    }
    if (options.task) {
      formData.append('task', options.task);
    }
    if (options.temperature !== undefined) {
      formData.append('temperature', String(options.temperature));
    }

    // Build rich domain contextual prompt from Gram-Disha verified vocabulary
    if (options.promptContext) {
      const prompt = buildWhisperContextPrompt(options.promptContext);
      formData.append('prompt', prompt);
    }

    const response = await fetch('/api/whisper/transcribe', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      const err: any = new Error(result.message || result.error_code || 'TRANSCRIPTION_ERROR');
      err.code = result.error_code || 'TRANSCRIPTION_ERROR';
      throw err;
    }

    return result;
  }

  /**
   * Requests English translation of non-English speech via Whisper.
   */
  public static async translateToEnglish(
    audioBlob: Blob,
    options: TranscribeRequestOptions = {}
  ): Promise<WhisperTranscriptionResult> {
    return this.transcribe(audioBlob, { ...options, task: 'translate' });
  }

  /**
   * Interprets transcript using Disha NLP engine to extract intent, entities, and route recommendations.
   */
  public static async extractIntent(
    transcript: string,
    context: {
      language?: string;
      currentModule?: string;
      district?: string;
      businessActivity?: string;
      demographics?: any;
    }
  ): Promise<DishaVoiceIntentResult> {
    const response = await fetch('/api/whisper/intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transcript,
        language: context.language || 'en',
        current_module: context.currentModule || 'DASHBOARD',
        district: context.district,
        business_activity: context.businessActivity,
        demographics: context.demographics
      })
    });

    if (!response.ok) {
      throw new Error('Intent extraction failed');
    }

    return await response.json();
  }
}
