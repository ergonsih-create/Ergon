/**
 * @license
 * GRAM-DISHA — Gemini 3.1 Live API Voice Conversation Modal
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Interactive real-time voice conversation surface using gemini-3.1-flash-live-preview
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  X, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Send, 
  RefreshCw, 
  Radio, 
  Square,
  Globe,
  Bot,
  User,
  Zap,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { GeminiLiveService, LiveTranscriptTurn } from '../../services/ai/geminiLiveService';

interface GeminiLiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToChat?: (text: string) => void;
}

export const GeminiLiveVoiceModal: React.FC<GeminiLiveVoiceModalProps> = ({
  isOpen,
  onClose,
  onSendToChat,
}) => {
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'listening' | 'speaking' | 'error'>('disconnected');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [transcripts, setTranscripts] = useState<LiveTranscriptTurn[]>([]);
  const [textInput, setTextInput] = useState<string>('');
  const [audioLevel, setAudioLevel] = useState<number>(0);

  const liveServiceRef = useRef<GeminiLiveService | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll transcript to bottom
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  // Connect when modal opens, disconnect when closes
  useEffect(() => {
    if (!isOpen) {
      if (liveServiceRef.current) {
        liveServiceRef.current.disconnect();
        liveServiceRef.current = null;
      }
      setStatus('disconnected');
      setTranscripts([]);
      return;
    }

    const liveService = new GeminiLiveService({
      onStatusChange: (newStatus) => {
        setStatus(newStatus);
      },
      onTranscript: (turn) => {
        setTranscripts((prev) => {
          // Check if updating existing turn or appending
          const existingIdx = prev.findIndex((t) => t.id === turn.id);
          if (existingIdx !== -1) {
            const updated = [...prev];
            updated[existingIdx] = {
              ...updated[existingIdx],
              text: updated[existingIdx].text + ' ' + turn.text,
            };
            return updated;
          }
          return [...prev, turn];
        });
      },
      onError: (err) => {
        setErrorMessage(err);
      },
      onAudioLevel: (level) => {
        setAudioLevel(level);
      },
    });

    liveServiceRef.current = liveService;
    liveService.connect();

    return () => {
      liveService.disconnect();
      liveServiceRef.current = null;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleMute = () => {
    if (liveServiceRef.current) {
      const muted = liveServiceRef.current.toggleMute();
      setIsMuted(muted);
    }
  };

  const handleInterrupt = () => {
    if (liveServiceRef.current) {
      liveServiceRef.current.stopPlayback();
      setStatus('connected');
    }
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || !liveServiceRef.current) return;
    liveServiceRef.current.sendText(textInput.trim());
    setTextInput('');
  };

  const handleQuickPrompt = (promptText: string) => {
    if (liveServiceRef.current) {
      liveServiceRef.current.sendText(promptText);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] border border-[#D9D3C7] rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#174C3A] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C19A5B]/20 border border-[#C19A5B]/40 flex items-center justify-center text-[#C19A5B]">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-lg text-[#F7F5F0]">DISHA Voice Live</h2>
                <span className="text-[10px] bg-[#C19A5B] text-[#174C3A] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live API
                </span>
              </div>
              <p className="text-xs text-[#E8E4DC]/80">Real-time voice conversation powered by gemini-3.1-flash-live-preview</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#E8E4DC] hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Close voice live modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Orb & Status Visualizer */}
        <div className="p-8 bg-gradient-to-b from-[#174C3A]/5 to-transparent flex flex-col items-center justify-center border-b border-[#D9D3C7]">
          
          {/* Pulsing Voice Sphere */}
          <div className="relative flex items-center justify-center my-4">
            {/* Outer Ripple Rings */}
            {status === 'speaking' && (
              <>
                <div className="absolute w-36 h-36 rounded-full bg-[#174C3A]/20 animate-ping duration-1000" />
                <div className="absolute w-48 h-48 rounded-full bg-[#C19A5B]/15 animate-pulse duration-700" />
              </>
            )}
            {status === 'listening' && (
              <div 
                className="absolute rounded-full bg-[#174C3A]/20 transition-all duration-75"
                style={{
                  width: `${100 + audioLevel * 60}px`,
                  height: `${100 + audioLevel * 60}px`,
                }}
              />
            )}

            {/* Core Orb */}
            <div 
              className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl border-4 ${
                status === 'speaking'
                  ? 'bg-gradient-to-tr from-[#174C3A] via-[#2D6A4F] to-[#C19A5B] border-[#C19A5B] scale-105 shadow-[#174C3A]/40'
                  : status === 'listening'
                  ? 'bg-gradient-to-tr from-[#174C3A] to-[#2D6A4F] border-[#174C3A] scale-100'
                  : status === 'connecting'
                  ? 'bg-[#174C3A]/20 border-[#174C3A]/40 animate-pulse'
                  : status === 'error'
                  ? 'bg-red-500/10 border-red-500 text-red-600'
                  : 'bg-[#174C3A]/10 border-[#174C3A]/30'
              }`}
            >
              {status === 'connecting' ? (
                <RefreshCw className="w-10 h-10 text-[#174C3A] animate-spin" />
              ) : status === 'speaking' ? (
                <Radio className="w-12 h-12 text-[#F7F5F0] animate-pulse" />
              ) : status === 'listening' ? (
                <Mic className="w-12 h-12 text-[#F7F5F0]" />
              ) : status === 'error' ? (
                <X className="w-12 h-12 text-red-500" />
              ) : (
                <Bot className="w-12 h-12 text-[#174C3A]" />
              )}
            </div>
          </div>

          {/* Status Label */}
          <div className="flex items-center gap-2 mt-2">
            <span 
              className={`w-2.5 h-2.5 rounded-full ${
                status === 'speaking'
                  ? 'bg-[#C19A5B] animate-ping'
                  : status === 'listening'
                  ? 'bg-emerald-500 animate-pulse'
                  : status === 'connected'
                  ? 'bg-emerald-500'
                  : status === 'connecting'
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-red-500'
              }`}
            />
            <span className="text-sm font-semibold text-[#174C3A] uppercase tracking-wider">
              {status === 'connecting' && 'Establishing Live WebSocket...'}
              {status === 'connected' && 'Live Ready — Start speaking anytime'}
              {status === 'listening' && 'Listening to your microphone...'}
              {status === 'speaking' && 'DISHA Gemini Live speaking...'}
              {status === 'error' && 'Connection error'}
              {status === 'disconnected' && 'Disconnected'}
            </span>
          </div>

          {errorMessage && (
            <p className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-lg">
              {errorMessage}
            </p>
          )}

          {/* Audio Controls Toolbar */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleToggleMute}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                isMuted
                  ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                  : 'bg-white text-[#174C3A] border-[#D9D3C7] hover:bg-[#174C3A]/5 shadow-sm'
              }`}
            >
              {isMuted ? <MicOff className="w-4 h-4 text-red-600" /> : <Mic className="w-4 h-4 text-[#174C3A]" />}
              {isMuted ? 'Mic Muted' : 'Mute Mic'}
            </button>

            {status === 'speaking' && (
              <button
                onClick={handleInterrupt}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-amber-500 text-white hover:bg-amber-600 shadow-sm transition-all"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                Interrupt Speech
              </button>
            )}
          </div>
        </div>

        {/* Live Conversation Transcript */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[220px]">
          {transcripts.length === 0 ? (
            <div className="text-center py-8 text-[#174C3A]/60 space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto opacity-40 text-[#174C3A]" />
              <p className="text-sm font-medium">Your live conversation turns will appear here in real-time.</p>
              <p className="text-xs text-[#174C3A]/50">Try asking about PMEGP subsidy, loan DPR calculation, or market strategy!</p>
            </div>
          ) : (
            transcripts.map((turn) => (
              <div
                key={turn.id}
                className={`flex items-start gap-2.5 ${
                  turn.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {turn.sender === 'gemini' && (
                  <div className="w-7 h-7 rounded-xl bg-[#174C3A] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-[#C19A5B]" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    turn.sender === 'user'
                      ? 'bg-[#174C3A] text-white rounded-tr-none'
                      : 'bg-white text-[#2C3531] border border-[#D9D3C7] rounded-tl-none'
                  }`}
                >
                  <p>{turn.text}</p>
                  
                  {onSendToChat && turn.sender === 'gemini' && (
                    <button
                      onClick={() => onSendToChat(turn.text)}
                      className="mt-1.5 text-[10px] text-[#C19A5B] font-semibold hover:underline flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3" />
                      Send to DISHA Assistant
                    </button>
                  )}
                </div>

                {turn.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-[#C19A5B] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={transcriptEndRef} />
        </div>

        {/* Quick Conversation Suggestions */}
        <div className="px-4 py-2 bg-[#174C3A]/5 border-t border-[#D9D3C7] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-[#174C3A]/70 uppercase tracking-wider shrink-0">Prompts:</span>
          {[
            'Explain PMEGP Scheme eligibility',
            'How to write a bankable DPR?',
            'Best rural enterprise ideas under 5 Lakhs',
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPrompt(prompt)}
              className="text-xs bg-white text-[#174C3A] hover:bg-[#174C3A] hover:text-white border border-[#D9D3C7] px-3 py-1 rounded-full whitespace-nowrap transition-all shadow-xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Text Input Fallback Bar */}
        <form onSubmit={handleSendText} className="p-3 bg-white border-t border-[#D9D3C7] flex items-center gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type a message to Gemini Live..."
            className="flex-1 bg-[#FAF8F5] border border-[#D9D3C7] rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#174C3A]/30 text-[#174C3A]"
          />
          <button
            type="submit"
            disabled={!textInput.trim()}
            className="bg-[#174C3A] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#174C3A]/90 disabled:opacity-40 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            Send
          </button>
        </form>

      </div>
    </div>
  );
};
