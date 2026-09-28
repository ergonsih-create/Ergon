/**
 * @license
 * GRAM-DISHA — Client Gemini Live API Service (gemini-3.1-flash-live-preview)
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Manages WebSocket connection to /live, captures microphone PCM audio at 16kHz,
 * streams to server, and queues & plays back 24kHz PCM response audio from Gemini.
 */

export interface LiveTranscriptTurn {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: number;
}

export interface GeminiLiveCallbacks {
  onStatusChange?: (status: 'disconnected' | 'connecting' | 'connected' | 'listening' | 'speaking' | 'error') => void;
  onTranscript?: (turn: LiveTranscriptTurn) => void;
  onError?: (error: string) => void;
  onAudioLevel?: (level: number) => void;
}

export class GeminiLiveService {
  private ws: WebSocket | null = null;
  private inputAudioCtx: AudioContext | null = null;
  private outputAudioCtx: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private audioSource: MediaStreamAudioSourceNode | null = null;

  private isConnected = false;
  private isMuted = false;
  private nextStartTime = 0;
  private playingSources: AudioBufferSourceNode[] = [];
  private callbacks: GeminiLiveCallbacks = {};

  constructor(callbacks: GeminiLiveCallbacks) {
    this.callbacks = callbacks;
  }

  /**
   * Connect to Gemini Live API via /live WebSocket endpoint
   */
  public async connect(): Promise<void> {
    if (this.isConnected) return;

    this.callbacks.onStatusChange?.('connecting');

    try {
      // 1. Establish WebSocket connection to /live
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = async () => {
        console.log('[GeminiLiveService] WebSocket connected');
        this.isConnected = true;
        this.callbacks.onStatusChange?.('connected');

        // 2. Setup Audio Contexts
        await this.setupAudioContexts();
        // 3. Start Recording Mic Audio
        await this.startMicRecording();
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.error) {
            console.error('[GeminiLiveService] Server error:', msg.error);
            this.callbacks.onError?.(msg.error);
            this.callbacks.onStatusChange?.('error');
            return;
          }

          if (msg.interrupted) {
            console.log('[GeminiLiveService] Model turn interrupted by user');
            this.stopPlayback();
          }

          // Output Audio Chunk Playback (24kHz PCM)
          if (msg.audio) {
            this.callbacks.onStatusChange?.('speaking');
            this.playAudioChunk(msg.audio);
          }

          // Transcriptions
          if (msg.outputTranscription || msg.text) {
            const text = msg.outputTranscription || msg.text;
            this.callbacks.onTranscript?.({
              id: `gemini-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              sender: 'gemini',
              text,
              timestamp: Date.now(),
            });
          }

          if (msg.inputTranscription) {
            this.callbacks.onTranscript?.({
              id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              sender: 'user',
              text: msg.inputTranscription,
              timestamp: Date.now(),
            });
          }
        } catch (err) {
          console.error('[GeminiLiveService] Error handling ws message:', err);
        }
      };

      this.ws.onerror = (err) => {
        console.error('[GeminiLiveService] WebSocket error:', err);
        this.callbacks.onError?.('Live API WebSocket connection error. Please verify connection and GEMINI_API_KEY configuration.');
        this.callbacks.onStatusChange?.('error');
      };

      this.ws.onclose = () => {
        console.log('[GeminiLiveService] WebSocket closed');
        this.disconnect();
      };
    } catch (err: any) {
      console.error('[GeminiLiveService] Connect error:', err);
      this.callbacks.onError?.(err.message || 'Failed to connect');
      this.callbacks.onStatusChange?.('error');
    }
  }

  /**
   * Set up Web Audio Contexts for mic input (16kHz) and speaker output (24kHz)
   */
  private async setupAudioContexts(): Promise<void> {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    
    // Output context at 24kHz for Gemini Live model response
    this.outputAudioCtx = new AudioCtx({ sampleRate: 24000 });
    if (this.outputAudioCtx.state === 'suspended') {
      await this.outputAudioCtx.resume();
    }
    this.nextStartTime = this.outputAudioCtx.currentTime;

    // Input context at 16kHz for microphone capture
    this.inputAudioCtx = new AudioCtx({ sampleRate: 16000 });
    if (this.inputAudioCtx.state === 'suspended') {
      await this.inputAudioCtx.resume();
    }
  }

  /**
   * Start microphone capture at 16kHz and send PCM over WebSocket
   */
  private async startMicRecording(): Promise<void> {
    if (!this.inputAudioCtx) return;

    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1,
        sampleRate: 16000,
      },
    });

    this.audioSource = this.inputAudioCtx.createMediaStreamSource(this.mediaStream);
    // Buffer size 4096 gives ~256ms audio frames at 16kHz
    this.scriptProcessor = this.inputAudioCtx.createScriptProcessor(4096, 1, 1);

    this.scriptProcessor.onaudioprocess = (e) => {
      if (!this.isConnected || this.isMuted || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
        return;
      }

      const inputData = e.inputBuffer.getChannelData(0);
      
      // Calculate audio visualizer energy
      let sum = 0;
      for (let i = 0; i < inputData.length; i++) {
        sum += inputData[i] * inputData[i];
      }
      const rms = Math.sqrt(sum / inputData.length);
      this.callbacks.onAudioLevel?.(Math.min(1, rms * 5));

      if (rms > 0.02) {
        this.callbacks.onStatusChange?.('listening');
      }

      // Convert float32 array to 16-bit PCM integer byte array
      const pcmBuffer = this.floatTo16BitPCM(inputData);
      const base64PCM = this.arrayBufferToBase64(pcmBuffer);

      // Stream to WebSocket
      this.ws.send(
        JSON.stringify({
          audio: base64PCM,
          mimeType: 'audio/pcm;rate=16000',
        })
      );
    };

    this.audioSource.connect(this.scriptProcessor);
    this.scriptProcessor.connect(this.inputAudioCtx.destination);
  }

  /**
   * Play base64 24kHz 16-bit PCM chunk received from Gemini Live
   */
  private playAudioChunk(base64PCM: string): void {
    if (!this.outputAudioCtx) return;

    try {
      const pcmBuffer = this.base64ToArrayBuffer(base64PCM);
      const dataView = new DataView(pcmBuffer);
      const float32Data = this.pcmToFloat32(dataView);

      const buffer = this.outputAudioCtx.createBuffer(1, float32Data.length, 24000);
      buffer.copyToChannel(float32Data, 0);

      const source = this.outputAudioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(this.outputAudioCtx.destination);

      const currentTime = this.outputAudioCtx.currentTime;
      if (this.nextStartTime < currentTime) {
        this.nextStartTime = currentTime;
      }

      source.start(this.nextStartTime);
      this.nextStartTime += buffer.duration;

      this.playingSources.push(source);
      source.onended = () => {
        const idx = this.playingSources.indexOf(source);
        if (idx !== -1) {
          this.playingSources.splice(idx, 1);
        }
        if (this.playingSources.length === 0) {
          this.callbacks.onStatusChange?.('connected');
        }
      };
    } catch (err) {
      console.error('[GeminiLiveService] Error playing audio chunk:', err);
    }
  }

  /**
   * Send text prompt over Live WebSocket session
   */
  public sendText(text: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ text }));
      this.callbacks.onTranscript?.({
        id: `user-${Date.now()}`,
        sender: 'user',
        text,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Toggle microphone mute state
   */
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  /**
   * Stop audio playback immediately when interrupted
   */
  public stopPlayback(): void {
    for (const source of this.playingSources) {
      try {
        source.stop();
      } catch {}
    }
    this.playingSources = [];
    if (this.outputAudioCtx) {
      this.nextStartTime = this.outputAudioCtx.currentTime;
    }
  }

  /**
   * Cleanly disconnect WebSocket and audio contexts
   */
  public disconnect(): void {
    this.isConnected = false;
    this.stopPlayback();

    if (this.scriptProcessor) {
      this.scriptProcessor.disconnect();
      this.scriptProcessor = null;
    }

    if (this.audioSource) {
      this.audioSource.disconnect();
      this.audioSource = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }

    if (this.inputAudioCtx) {
      this.inputAudioCtx.close();
      this.inputAudioCtx = null;
    }

    if (this.outputAudioCtx) {
      this.outputAudioCtx.close();
      this.outputAudioCtx = null;
    }

    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
        this.ws.close();
      }
      this.ws = null;
    }

    this.callbacks.onStatusChange?.('disconnected');
  }

  // --- Utility conversion functions ---

  private floatTo16BitPCM(input: Float32Array): ArrayBuffer {
    const output = new DataView(new ArrayBuffer(input.length * 2));
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return output.buffer;
  }

  private pcmToFloat32(dataView: DataView): Float32Array {
    const float32 = new Float32Array(dataView.byteLength / 2);
    for (let i = 0; i < float32.length; i++) {
      const int16 = dataView.getInt16(i * 2, true);
      float32[i] = int16 / (int16 < 0 ? 32768 : 32767);
    }
    return float32;
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}
