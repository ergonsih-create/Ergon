/**
 * @license
 * GRAM-DISHA — Gemini 3.5 Audio Transcribe Modal
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Audio transcription surface powered by gemini-3.5-transcribe
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Square, 
  Upload, 
  FileAudio, 
  Copy, 
  Check, 
  Sparkles, 
  X, 
  RefreshCw, 
  Send, 
  Zap,
  Volume2
} from 'lucide-react';
import { GeminiTranscribeService } from '../../services/ai/geminiTranscribeService';

interface GeminiTranscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTranscript?: (transcript: string) => void;
  onSendToChat?: (transcript: string) => void;
}

export const GeminiTranscribeModal: React.FC<GeminiTranscribeModalProps> = ({
  isOpen,
  onClose,
  onApplyTranscript,
  onSendToChat,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stopRecordingCleanup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  useEffect(() => {
    if (!isOpen) {
      stopRecordingCleanup();
      setTranscript('');
      setError('');
      setRecordingSeconds(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startRecording = async () => {
    setError('');
    setTranscript('');
    audioChunksRef.current = [];
    setRecordingSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleProcessAudioBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('[GeminiTranscribeModal] Mic error:', err);
      setError('Failed to access microphone. Please ensure microphone permissions are granted.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const handleProcessAudioBlob = async (blob: Blob) => {
    setIsProcessing(true);
    setError('');

    const res = await GeminiTranscribeService.transcribeAudioBlob(blob);
    setIsProcessing(false);

    if (res.success) {
      setTranscript(res.transcript);
    } else {
      setError(res.error || 'Failed to transcribe audio.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      setError('Please select a valid audio file (.wav, .mp3, .m4a, .webm, .ogg)');
      return;
    }

    setTranscript('');
    setError('');
    await handleProcessAudioBlob(file);
  };

  const handleCopy = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] border border-[#D9D3C7] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-[#174C3A] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C19A5B]/20 border border-[#C19A5B]/40 flex items-center justify-center text-[#C19A5B]">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-lg text-[#F7F5F0]">Audio Transcription</h2>
                <span className="text-[10px] bg-[#C19A5B] text-[#174C3A] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  gemini-3.5-transcribe
                </span>
              </div>
              <p className="text-xs text-[#E8E4DC]/80">Transcribe speech audio directly into text</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#E8E4DC] hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Controls: Microphone Recording or File Upload */}
          <div className="bg-white border border-[#D9D3C7] rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 shadow-sm text-center">
            
            {/* Mic Pulse Button */}
            <div className="relative">
              {isRecording && (
                <div className="absolute -inset-3 rounded-full bg-red-500/20 animate-ping" />
              )}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  isRecording
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-[#174C3A] text-white hover:bg-[#174C3A]/90'
                } disabled:opacity-50`}
              >
                {isRecording ? <Square className="w-8 h-8 fill-current" /> : <Mic className="w-8 h-8" />}
              </button>
            </div>

            <div>
              <p className="text-sm font-semibold text-[#174C3A]">
                {isRecording
                  ? `Recording in progress (${recordingSeconds}s)...`
                  : isProcessing
                  ? 'Transcribing with gemini-3.5-transcribe...'
                  : 'Click microphone to record audio'}
              </p>
              <p className="text-xs text-[#174C3A]/60 mt-1">
                {isRecording ? 'Click again to stop & transcribe' : 'Or upload an existing audio file below'}
              </p>
            </div>

            {/* File Upload Option */}
            <div className="pt-2 border-t border-[#D9D3C7] w-full flex justify-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isRecording || isProcessing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border border-[#D9D3C7] bg-[#FAF8F5] text-[#174C3A] hover:bg-[#174C3A]/5 transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-[#174C3A]" />
                Upload Audio File (.mp3, .wav, .m4a)
              </button>
            </div>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex items-center justify-center gap-3 p-4 bg-[#174C3A]/5 rounded-2xl border border-[#174C3A]/20">
              <RefreshCw className="w-5 h-5 text-[#174C3A] animate-spin" />
              <span className="text-xs font-semibold text-[#174C3A]">
                Analyzing audio waveform with model gemini-3.5-transcribe...
              </span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Transcription Output */}
          {transcript && (
            <div className="bg-white border border-[#D9D3C7] rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#D9D3C7] pb-2">
                <span className="text-xs font-bold text-[#174C3A] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C19A5B]" />
                  Transcribed Result
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-[#174C3A] hover:text-[#C19A5B] font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <p className="text-sm text-[#2C3531] bg-[#FAF8F5] p-3 rounded-xl border border-[#D9D3C7]/60 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {transcript}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                {onSendToChat && (
                  <button
                    onClick={() => {
                      onSendToChat(transcript);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#174C3A] text-white text-xs font-medium hover:bg-[#174C3A]/90 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send to DISHA Assistant
                  </button>
                )}

                {onApplyTranscript && (
                  <button
                    onClick={() => {
                      onApplyTranscript(transcript);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C19A5B] text-[#174C3A] text-xs font-bold hover:bg-[#C19A5B]/90 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Use Text
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
