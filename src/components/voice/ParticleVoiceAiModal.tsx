/**
 * @license
 * GRAM-DISHA — Particle AI Voice Assistant Modal (TTS + STT)
 * Auto-pops upon user login featuring canvas particle visualizer matching UI color palette.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  X,
  Send,
  RotateCcw,
  Globe,
  Radio,
  Sliders,
  Check,
  Bot,
  User,
  ArrowRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useDisha } from '../../context/DishaContext';
import { GeminiTranscribeService } from '../../services/ai/geminiTranscribeService';

interface ParticleVoiceAiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModeState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  alpha: number;
  angle: number;
  speed: number;
  dist: number;
}

const UI_COLORS = [
  '#C19A5B', // Warm Gold
  '#C8A96B', // Light Ochre Gold
  '#E5C07B', // Bright Gold Accent
  '#174C3A', // Deep Forest Green
  '#2EC4B6', // Emerald Teal Accent
  '#FAF7F2', // Soft Sand Cream
];

const PROMPT_SUGGESTIONS = [
  'Show 35% PMEGP subsidy details for rural OBC',
  'Calculate monthly EMI for ₹9 Lakh loan',
  'What are APMC Mandi prices for Chana in Yavatmal?',
  'Generate bankable DPR for Agro Processing',
  'What documents are needed for Udyam registration?'
];

export const ParticleVoiceAiModal: React.FC<ParticleVoiceAiModalProps> = ({ isOpen, onClose }) => {
  const { sendChatMessage, isProcessing: globalProcessing, dishaState, openAdvisor } = useDisha();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  // Speech & Audio States
  const [mode, setMode] = useState<ModeState>('IDLE');
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>(
    'Namaste! I am DISHA AI. Speak or type your enterprise query to receive evidence-backed guidance.'
  );

  const [isListening, setIsListening] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [selectedLang, setSelectedLang] = useState<string>('en-IN');
  const [audioVolume, setAudioVolume] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Web Audio & Speech Recognition Refs
  const recognitionRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Particle System Canvas Initialization
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 280);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      initParticles(width, height);
    };

    window.addEventListener('resize', handleResize);

    const initParticles = (w: number, h: number) => {
      const particleCount = 75;
      const pts: Particle[] = [];
      const centerX = w / 2;
      const centerY = h / 2;

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const dist = 40 + Math.random() * 50;
        const color = UI_COLORS[i % UI_COLORS.length];

        pts.push({
          x: centerX + Math.cos(angle) * dist,
          y: centerY + Math.sin(angle) * dist,
          baseX: centerX,
          baseY: centerY,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          radius: 2 + Math.random() * 3.5,
          baseRadius: 2 + Math.random() * 3.5,
          color,
          alpha: 0.4 + Math.random() * 0.6,
          angle,
          speed: 0.01 + Math.random() * 0.02,
          dist,
        });
      }
      particlesRef.current = pts;
    };

    initParticles(width, height);

    let step = 0;
    const render = () => {
      step++;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw subtle background ambient glow ring
      const grad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 120);
      grad.addColorStop(0, 'rgba(193, 154, 91, 0.25)');
      grad.addColorStop(0.5, 'rgba(23, 76, 58, 0.15)');
      grad.addColorStop(1, 'rgba(11, 32, 24, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 130, 0, Math.PI * 2);
      ctx.fill();

      // Render connected lines between close particles
      const pts = particlesRef.current;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 50) {
            ctx.strokeStyle = `rgba(200, 169, 107, ${0.15 * (1 - d / 50)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      // Render Particles according to active mode
      pts.forEach((p, idx) => {
        if (mode === 'IDLE') {
          p.angle += p.speed;
          const currentDist = p.dist + Math.sin(step * 0.05 + idx) * 8;
          p.x = centerX + Math.cos(p.angle) * currentDist;
          p.y = centerY + Math.sin(p.angle) * currentDist;
          p.radius = p.baseRadius + Math.sin(step * 0.1 + idx) * 0.8;
        } else if (mode === 'LISTENING') {
          // React dynamically to microphone volume input
          p.angle += p.speed * (1 + audioVolume * 0.05);
          const expandFactor = p.dist * (1 + (audioVolume / 255) * 1.8);
          p.x = centerX + Math.cos(p.angle) * expandFactor + (Math.random() - 0.5) * (audioVolume * 0.1);
          p.y = centerY + Math.sin(p.angle) * expandFactor + (Math.random() - 0.5) * (audioVolume * 0.1);
          p.radius = p.baseRadius + (audioVolume / 255) * 6;
        } else if (mode === 'THINKING') {
          // Rapid spinning golden vortex
          p.angle += p.speed * 4;
          const shrinkDist = 20 + Math.sin(step * 0.2 + idx) * 15;
          p.x = centerX + Math.cos(p.angle) * shrinkDist;
          p.y = centerY + Math.sin(p.angle) * shrinkDist;
          p.radius = p.baseRadius * 1.4;
        } else if (mode === 'SPEAKING') {
          // Radiating voice ripples
          const wave = Math.sin(step * 0.15 - idx * 0.2) * 25;
          const spreadDist = p.dist + 20 + wave;
          p.x = centerX + Math.cos(p.angle) * spreadDist;
          p.y = centerY + Math.sin(p.angle) * spreadDist;
          p.radius = p.baseRadius + Math.abs(wave) * 0.15;
        }

        // Draw individual glowing particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, mode, audioVolume]);

  // TTS Greeting on Open
  useEffect(() => {
    if (isOpen) {
      speakText('Namaste! I am DISHA, your AI co-pilot. I am ready to guide your enterprise.');
    } else {
      stopSpeech();
      stopListening();
    }
  }, [isOpen]);

  // Text To Speech Handler
  const speakText = (text: string) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[*#]/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;
    utterance.lang = selectedLang;

    utterance.onstart = () => setMode('SPEAKING');
    utterance.onend = () => setMode('IDLE');
    utterance.onerror = () => setMode('IDLE');

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Speech Recognition (STT) Start
  const startListening = async () => {
    stopSpeech();
    setTranscript('');
    setInterimTranscript('');
    setMode('LISTENING');

    // Setup Web Audio Analyser for particle microphone volume
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      analyser.fftSize = 64;
      source.connect(analyser);

      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
        setAudioVolume(avg);
        if (micStreamRef.current) requestAnimationFrame(updateVolume);
      };
      updateVolume();
    } catch (err) {
      console.warn('[ParticleVoiceAiModal] Mic audio context note:', err);
    }

    // Standard Browser SpeechRecognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = selectedLang;

      rec.onstart = () => setIsListening(true);

      rec.onresult = (e: any) => {
        let finalStr = '';
        let interimStr = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const trans = e.results[i][0].transcript;
          if (e.results[i].isFinal) {
            finalStr += trans;
          } else {
            interimStr += trans;
          }
        }
        if (finalStr) {
          setTranscript(prev => (prev ? `${prev} ${finalStr}` : finalStr));
          setInterimTranscript('');
        } else {
          setInterimTranscript(interimStr);
        }
      };

      rec.onerror = (e: any) => {
        console.error('[STT error]', e.error);
        stopListening();
      };

      rec.onend = () => {
        stopListening();
      };

      recognitionRef.current = rec;
      rec.start();
    } else {
      // Fallback to Gemini Transcribe service if SpeechRecognition is missing
      fallbackMediaRecorder();
    }
  };

  const fallbackMediaRecorder = async () => {
    try {
      const stream = micStreamRef.current || (await navigator.mediaDevices.getUserMedia({ audio: true }));
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setMode('THINKING');
        try {
          const res = await GeminiTranscribeService.transcribeAudio(audioBlob);
          if (res.transcript) {
            setTranscript(res.transcript);
            handleSubmitQuery(res.transcript);
          }
        } catch {
          setMode('IDLE');
        }
      };

      recorder.start();
      setIsListening(true);
    } catch (err) {
      console.error('Fallback recorder error:', err);
      stopListening();
    }
  };

  const stopListening = () => {
    setIsListening(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }

    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }

    setAudioVolume(0);
    setMode('IDLE');
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Submit Query to DISHA AI OS
  const handleSubmitQuery = async (queryText?: string) => {
    const textToSend = (queryText || transcript || interimTranscript).trim();
    if (!textToSend) return;

    stopSpeech();
    stopListening();
    setMode('THINKING');

    try {
      await sendChatMessage(textToSend);
      // Retrieve AI reply from context history
      const lastMsg = dishaState.chatHistory[dishaState.chatHistory.length - 1];
      const reply = lastMsg?.sender === 'DISHA' ? lastMsg.text : 'I have analyzed your input and updated your workspace metrics.';
      setAiResponse(reply);
      speakText(reply);
    } catch (err) {
      console.error('[Particle Voice AI] Error sending query:', err);
      setMode('IDLE');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 40 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative w-full ${
            isExpanded ? 'max-w-4xl h-[92vh]' : 'max-w-xl h-[85vh] sm:h-auto max-h-[90vh]'
          } bg-[#0E2C22] text-[#FAF7F2] rounded-t-3xl sm:rounded-3xl border-t sm:border border-[#C19A5B]/40 shadow-2xl overflow-hidden flex flex-col transition-all duration-300`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#C19A5B]/20 bg-[#174C3A]/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#C19A5B]/20 border border-[#C19A5B]/60 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#C19A5B] animate-pulse" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-[#FAF7F2] flex items-center gap-1.5">
                  DISHA AI OS Particle Voice
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C19A5B]/20 border border-[#C19A5B]/40 text-[#E5C07B]">
                    TTS + STT
                  </span>
                </h3>
                <p className="text-[11px] text-[#FAF7F2]/60">
                  Interactive Speech Intelligence Co-Pilot
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-xl text-[#FAF7F2]/70 hover:text-[#FAF7F2] hover:bg-[#FAF7F2]/10 transition-colors cursor-pointer"
                title={isMuted ? 'Unmute Audio Speech' : 'Mute Audio Speech'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#C19A5B]" />}
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-xl text-[#FAF7F2]/70 hover:text-[#FAF7F2] hover:bg-[#FAF7F2]/10 transition-colors cursor-pointer hidden sm:block"
                title={isExpanded ? 'Minimize View' : 'Expand View'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[#FAF7F2]/70 hover:text-[#FAF7F2] hover:bg-[#FAF7F2]/10 transition-colors cursor-pointer"
                title="Close AI Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Canvas Particle Visualizer Area */}
          <div className="relative w-full h-56 sm:h-64 bg-gradient-to-b from-[#0B2018] to-[#0E2C22] flex items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

            {/* Central Dynamic AI Status Core */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
              <button
                onClick={toggleListening}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all duration-300 cursor-pointer shadow-lg ${
                  isListening
                    ? 'bg-rose-500/20 border-rose-400 scale-110 shadow-rose-500/30'
                    : mode === 'THINKING'
                    ? 'bg-[#C19A5B]/20 border-[#C19A5B] animate-spin'
                    : mode === 'SPEAKING'
                    ? 'bg-emerald-500/20 border-emerald-400 scale-105 shadow-emerald-500/30'
                    : 'bg-[#174C3A]/60 border-[#C19A5B]/60 hover:border-[#C19A5B] hover:scale-105 shadow-[#C19A5B]/20'
                }`}
              >
                {isListening ? (
                  <Mic className="w-8 h-8 text-rose-300 animate-pulse" />
                ) : mode === 'THINKING' ? (
                  <Sparkles className="w-8 h-8 text-[#E5C07B]" />
                ) : mode === 'SPEAKING' ? (
                  <Volume2 className="w-8 h-8 text-emerald-300 animate-bounce" />
                ) : (
                  <Mic className="w-8 h-8 text-[#C19A5B]" />
                )}
              </button>

              {/* Status Badge */}
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#174C3A]/80 border border-[#C19A5B]/40 text-xs font-semibold text-[#E5C07B]">
                <Radio className={`w-3 h-3 ${isListening || mode === 'SPEAKING' ? 'animate-pulse text-emerald-400' : ''}`} />
                {mode === 'LISTENING'
                  ? 'Listening... Speak Now'
                  : mode === 'THINKING'
                  ? 'Thinking & Processing...'
                  : mode === 'SPEAKING'
                  ? 'Speaking Response...'
                  : 'Tap Mic to Speak'}
              </div>
            </div>

            {/* Language Selector Overlay */}
            <div className="absolute top-3 left-3 z-10">
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="bg-[#0B2018]/90 text-xs text-[#E5C07B] border border-[#C19A5B]/40 rounded-xl px-2.5 py-1 focus:outline-none cursor-pointer"
              >
                <option value="en-IN">English (India)</option>
                <option value="hi-IN">हिन्दी (Hindi)</option>
                <option value="mr-IN">मराठी (Marathi)</option>
                <option value="ta-IN">தமிழ் (Tamil)</option>
                <option value="te-IN">తెలుగు (Telugu)</option>
                <option value="bn-IN">বাংলা (Bengali)</option>
                <option value="gu-IN">ગુજરાતી (Gujarati)</option>
              </select>
            </div>
          </div>

          {/* Transcript & Response Content Box */}
          <div className="flex-1 p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[260px] bg-[#0B2018]/60">
            {/* User Spoken Input Stream */}
            {(transcript || interimTranscript || isListening) && (
              <div className="flex items-start gap-2.5 bg-[#174C3A]/30 p-3 rounded-2xl border border-[#C19A5B]/20">
                <div className="w-6 h-6 rounded-full bg-[#FAF7F2]/10 border border-[#FAF7F2]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-[#FAF7F2]" />
                </div>
                <div className="flex-1 text-xs text-[#FAF7F2]">
                  <p className="font-semibold text-[11px] text-[#C19A5B] mb-0.5">Your Voice Input (STT):</p>
                  <p className="leading-relaxed">
                    {transcript || interimTranscript || (
                      <span className="italic opacity-60">Listening to your voice...</span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* AI Response Output */}
            <div className="flex items-start gap-2.5 bg-[#174C3A]/50 p-3.5 rounded-2xl border border-[#C19A5B]/30">
              <div className="w-6 h-6 rounded-full bg-[#C19A5B]/20 border border-[#C19A5B]/60 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-[#C19A5B]" />
              </div>
              <div className="flex-1 text-xs text-[#FAF7F2]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[11px] text-[#E5C07B]">DISHA AI Response (TTS):</span>
                  <button
                    onClick={() => speakText(aiResponse)}
                    className="text-[10px] text-[#C19A5B] hover:text-[#E5C07B] flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Replay Voice
                  </button>
                </div>
                <p className="leading-relaxed whitespace-pre-line">{aiResponse}</p>
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div>
              <p className="text-[10px] font-semibold text-[#FAF7F2]/60 uppercase tracking-wider mb-2">
                Suggested Prompts
              </p>
              <div className="flex flex-wrap gap-1.5">
                {PROMPT_SUGGESTIONS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTranscript(prompt);
                      handleSubmitQuery(prompt);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-[#174C3A]/40 border border-[#C19A5B]/30 text-[#FAF7F2]/90 hover:bg-[#C19A5B]/20 hover:border-[#C19A5B] hover:text-[#E5C07B] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{prompt}</span>
                    <ArrowRight className="w-3 h-3 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Input Bar */}
          <div className="p-3 sm:p-4 bg-[#174C3A]/60 border-t border-[#C19A5B]/20 flex items-center gap-2">
            <button
              onClick={toggleListening}
              className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                  : 'bg-[#C19A5B]/20 text-[#E5C07B] border-[#C19A5B]/40 hover:bg-[#C19A5B]/30'
              }`}
              title={isListening ? 'Stop Recording' : 'Start Voice Input'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitQuery()}
              placeholder="Speak using microphone or type query..."
              className="flex-1 bg-[#0B2018] text-xs text-[#FAF7F2] placeholder-[#FAF7F2]/40 border border-[#C19A5B]/30 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#C19A5B]"
            />

            <button
              onClick={() => handleSubmitQuery()}
              disabled={!transcript.trim() && !interimTranscript.trim()}
              className="p-2.5 rounded-xl bg-[#C19A5B] text-[#0B2018] font-bold hover:bg-[#E5C07B] disabled:opacity-40 disabled:hover:bg-[#C19A5B] transition-colors cursor-pointer flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
