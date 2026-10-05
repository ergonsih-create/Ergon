/**
 * @license
 * GRAM-DISHA — Multilingual Voice Speech Intelligence Surface (OpenAI Whisper)
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Complete Voice UI incorporating Whisper real audio capture, language identification,
 * word/segment timestamps, editable transcript, translation toggle, Disha NLP intent
 * routing, and TTS playback controls.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Square, 
  Sparkles, 
  X, 
  Volume2, 
  VolumeX, 
  Languages, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  ShieldCheck, 
  Edit3, 
  Globe, 
  Play, 
  Pause, 
  Compass, 
  Keyboard, 
  Send,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { 
  WhisperVoiceState, 
  WhisperErrorState, 
  WhisperTranscriptionResult, 
  DishaVoiceIntentResult, 
  AudioVisualizerData,
  WhisperConfig,
  WhisperWord
} from '../../types/whisper';
import { WhisperClientService } from '../../services/ai/whisperService';
import { AudioWaveformVisualizer } from './AudioWaveformVisualizer';
import { useLanguage } from '../../context/LanguageContext';
import { useDisha } from '../../context/DishaContext';
import { useAuth } from '../../context/AuthContext';
import { DishaContextState } from '../../types';
import { getBcp47Language, cleanTextForTTS, findMatchingVoice } from '../../utils/voiceUtils';

interface DishaVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (module: DishaContextState['currentModule']) => void;
  onApplyFieldValue?: (field: string, value: any) => void;
}

export const DishaVoiceModal: React.FC<DishaVoiceModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onApplyFieldValue
}) => {
  const { currentLanguage, availableLanguages, t } = useLanguage();
  const { dishaState, sendChatMessage } = useDisha();
  const { user } = useAuth();

  // Service instance
  const whisperServiceRef = useRef<WhisperClientService>(new WhisperClientService());

  // Component States
  const [voiceState, setVoiceState] = useState<WhisperVoiceState>('IDLE');
  const [errorState, setErrorState] = useState<WhisperErrorState>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [serverConfig, setServerConfig] = useState<WhisperConfig | null>(null);

  // Audio & Recording State
  const [visualizerData, setVisualizerData] = useState<AudioVisualizerData | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const timerRef = useRef<any>(null);

  // Preferred Language Setting (Default is current UI language)
  const [selectedLanguage, setSelectedLanguage] = useState<string>(currentLanguage || 'en');

  // Transcription & Intent Output
  const [transcriptionResult, setTranscriptionResult] = useState<WhisperTranscriptionResult | null>(null);
  const [editableTranscript, setEditableTranscript] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedWordTimestamp, setSelectedWordTimestamp] = useState<WhisperWord | null>(null);
  const [isShowingTranslation, setIsShowingTranslation] = useState<boolean>(false);
  const [intentResult, setIntentResult] = useState<DishaVoiceIntentResult | null>(null);
  const [isIntentLoading, setIsIntentLoading] = useState<boolean>(false);
  const [confirmedAction, setConfirmedAction] = useState<boolean>(false);

  // TTS Readout State
  const [isPlayingTTS, setIsPlayingTTS] = useState<boolean>(false);
  const [ttsSpeed, setTtsSpeed] = useState<number>(1.0);

  // Fetch initial configuration on mount
  useEffect(() => {
    WhisperClientService.fetchConfig().then(cfg => {
      setServerConfig(cfg);
    });
  }, []);

  // Sync default language with current app language when opened
  useEffect(() => {
    if (isOpen) {
      setVoiceState('READY');
      setErrorState(null);
      setErrorMessage('');
      setRecordingSeconds(0);
      setVisualizerData(null);
      setTranscriptionResult(null);
      setEditableTranscript('');
      setIntentResult(null);
      setIsShowingTranslation(false);
      setSelectedWordTimestamp(null);
      setConfirmedAction(false);
      setSelectedLanguage(currentLanguage || 'en');
    } else {
      handleCancel();
    }
  }, [isOpen, currentLanguage]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      whisperServiceRef.current.cancelRecording();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Keyboard controls: Space to start/stop, Esc to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, voiceState]);

  // Handle Starting Recording
  const handleStartRecording = async () => {
    try {
      setErrorState(null);
      setErrorMessage('');
      setRecordingSeconds(0);
      setTranscriptionResult(null);
      setEditableTranscript('');
      setIntentResult(null);
      setConfirmedAction(false);
      setVoiceState('LISTENING');

      // Start elapsed timer
      if (timerRef.current) clearInterval(timerRef.current);
      const startMs = Date.now();
      timerRef.current = setInterval(() => {
        const secs = Math.floor((Date.now() - startMs) / 1000);
        setRecordingSeconds(secs);
        if (secs >= 60) {
          // Auto-stop at 60 seconds limit
          handleStopRecording();
        }
      }, 250);

      await whisperServiceRef.current.startRecording((amplitudeData) => {
        setVisualizerData(amplitudeData);
      });

      setVoiceState('RECORDING');
    } catch (err: any) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (err.message === 'MICROPHONE_DENIED') {
        setErrorState('MICROPHONE_DENIED');
        setErrorMessage('Microphone permission was denied. Please allow microphone access in your browser or use typed input.');
      } else {
        setErrorState('SERVER_ERROR');
        setErrorMessage(err.message || 'Failed to initialize audio recording.');
      }
      setVoiceState('IDLE');
    }
  };

  // Handle Stopping Recording & Starting Whisper Processing
  const handleStopRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setVoiceState('PROCESSING');

    try {
      const { blob, duration, isSilent } = await whisperServiceRef.current.stopRecording();
      setRecordedBlob(blob);

      // Duration verification
      if (duration < 0.6) {
        setErrorState('AUDIO_TOO_SHORT');
        setErrorMessage('Voice recording was too brief. Please speak for at least 1 second.');
        setVoiceState('IDLE');
        return;
      }

      // Client-side silence check
      if (isSilent) {
        setErrorState('NO_AUDIO');
        setErrorMessage("I couldn't hear anything clearly. Please try again or speak closer to your microphone.");
        setVoiceState('IDLE');
        return;
      }

      setVoiceState('TRANSCRIBING');

      // Construct verified prompt context based on active user and module
      const promptContext = {
        module: dishaState.currentModule,
        district: user?.location.district,
        state: user?.location.state,
        businessActivity: 'Rice Mill / Rural Enterprise',
        preferredLanguage: selectedLanguage !== 'auto' ? selectedLanguage : currentLanguage
      };

      // Call server-side OpenAI Whisper endpoint with real audio blob
      const whisperResult = await WhisperClientService.transcribe(blob, {
        language: selectedLanguage !== 'auto' ? selectedLanguage : undefined,
        promptContext
      });

      setTranscriptionResult(whisperResult);
      setEditableTranscript(whisperResult.text);
      setVoiceState('UNDERSTOOD');

      // Automatically trigger Disha NLP Intent & Entity extraction
      runDishaIntentExtraction(whisperResult.text, whisperResult.language);

    } catch (err: any) {
      console.error('Whisper transcription error:', err);
      const code = err.code || err.message;
      if (code === 'OPENAI_KEY_MISSING') {
        setErrorState('OPENAI_KEY_MISSING');
        setErrorMessage('OpenAI Whisper API key is not configured on the server. Please add your OPENAI_API_KEY in the environment settings to process live speech recognition.');
      } else if (code === 'NO_AUDIO' || code === 'NO_SPEECH_DETECTED') {
        setErrorState('NO_AUDIO');
        setErrorMessage("I couldn't hear anything clearly. Please speak clearly into your microphone.");
      } else if (code === 'MICROPHONE_DENIED') {
        setErrorState('MICROPHONE_DENIED');
        setErrorMessage('Microphone access is disabled in browser permissions.');
      } else if (code === 'QUOTA_EXCEEDED') {
        setErrorState('SERVER_ERROR');
        setErrorMessage(err.message || 'OpenAI API quota exceeded: The API credit balance for this key is exhausted.');
      } else if (code === 'API_TIMEOUT') {
        setErrorState('SERVER_ERROR');
        setErrorMessage('Speech recognition request timed out after 35 seconds. Please try a shorter voice recording.');
      } else {
        setErrorState('TRANSCRIPTION_ERROR');
        setErrorMessage(err.message || 'Speech recognition processing failed. Please retry.');
      }
      setVoiceState('IDLE');
    }
  };

  // Run Disha NLP Intent extraction
  const runDishaIntentExtraction = async (text: string, lang: string) => {
    if (!text.trim()) return;
    setIsIntentLoading(true);
    try {
      const intent = await WhisperClientService.extractIntent(text, {
        language: lang,
        currentModule: dishaState.currentModule,
        district: user?.location.district,
        demographics: user?.demographics
      });
      setIntentResult(intent);
      setVoiceState('ACTION_READY');
    } catch (e) {
      console.warn('Intent extraction failed:', e);
    } finally {
      setIsIntentLoading(false);
    }
  };

  // Handle User Editing the Transcript
  const handleSaveEditedTranscript = () => {
    setIsEditing(false);
    if (transcriptionResult && editableTranscript.trim()) {
      setTranscriptionResult({
        ...transcriptionResult,
        text: editableTranscript
      });
      runDishaIntentExtraction(editableTranscript, transcriptionResult.language);
    }
  };

  // Handle Requesting Whisper English Translation
  const handleToggleTranslation = async () => {
    if (!recordedBlob) return;
    if (isShowingTranslation) {
      setIsShowingTranslation(false);
      return;
    }

    if (transcriptionResult?.englishTranslation) {
      setIsShowingTranslation(true);
      return;
    }

    // Request translation from Whisper
    try {
      setIsIntentLoading(true);
      const translated = await WhisperClientService.translateToEnglish(recordedBlob);
      if (transcriptionResult) {
        setTranscriptionResult({
          ...transcriptionResult,
          englishTranslation: translated.text
        });
      }
      setIsShowingTranslation(true);
    } catch (err) {
      console.warn('Translation failed:', err);
    } finally {
      setIsIntentLoading(false);
    }
  };

  // Handle Executing Suggested Action / Navigation
  const handleExecuteAction = (actionCode: string, route?: string) => {
    if (actionCode === 'CONFIRM_SUBMIT') {
      setConfirmedAction(true);
      return;
    }

    if (route && onNavigate) {
      onNavigate(route as any);
      onClose();
    } else if (actionCode === 'NAV_SCHEMES' && onNavigate) {
      onNavigate('SCHEMES');
      onClose();
    } else if (actionCode === 'NAV_FINANCE' && onNavigate) {
      onNavigate('FINANCE');
      onClose();
    } else if (actionCode === 'NAV_FEASIBILITY' && onNavigate) {
      onNavigate('FEASIBILITY');
      onClose();
    } else if (actionCode === 'NAV_MARKET_INSIGHTS' && onNavigate) {
      onNavigate('MARKET_INSIGHTS');
      onClose();
    } else if (actionCode === 'NAV_BUSINESS_IDEAS' && onNavigate) {
      onNavigate('BUSINESS_IDEAS');
      onClose();
    }
  };

  // Send Transcript to DISHA Copilot Chat
  const handleSendToDishaChat = async () => {
    const textToSend = editableTranscript || transcriptionResult?.text;
    if (textToSend) {
      await sendChatMessage(textToSend);
      onClose();
    }
  };

  // Cancel & Reset
  const handleCancel = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    whisperServiceRef.current.cancelRecording();
    setVoiceState('READY');
    setVisualizerData(null);
    setRecordingSeconds(0);
    setErrorState(null);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingTTS(false);
    }
  };

  // Text-To-Speech Playback of Disha's Answer
  const handleToggleTTS = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingTTS) {
      window.speechSynthesis.cancel();
      setIsPlayingTTS(false);
      return;
    }

    const textToSpeak = intentResult?.explanation || editableTranscript || '';
    if (!textToSpeak) return;

    window.speechSynthesis.cancel();
    const cleanText = cleanTextForTTS(textToSpeak);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = ttsSpeed;
    
    // Choose voice matching detected language or active site language
    const langCode = transcriptionResult?.language || (selectedLanguage !== 'auto' ? selectedLanguage : currentLanguage);
    const bcp47 = getBcp47Language(langCode);
    const matchedVoice = findMatchingVoice(bcp47);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
    utterance.lang = bcp47;

    utterance.onend = () => setIsPlayingTTS(false);
    utterance.onerror = () => setIsPlayingTTS(false);

    setIsPlayingTTS(true);
    window.speechSynthesis.speak(utterance);
  };

  if (!isOpen) return null;

  const isRTL = transcriptionResult?.direction === 'rtl';

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="whisper-voice-title"
    >
      <div className="w-full max-w-xl bg-[#FAF7F2] rounded-3xl border border-[#C8A96B]/50 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-[#F2E8D6]/80 border-b border-[#C8A96B]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#174C3A] text-[#FAF7F2] flex items-center justify-center shadow-xs">
              <Mic className="w-5 h-5 text-[#C8A96B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="whisper-voice-title" className="font-display font-bold text-sm text-[#174C3A]">
                  DISHA Multilingual Speech Intelligence
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#174C3A]/10 text-[#174C3A] font-semibold border border-[#174C3A]/25">
                  OpenAI Whisper
                </span>
              </div>
              <p className="text-[11px] text-[#3B2F2A]/70">
                23 Languages • Real-time Timestamps • Zero Fabrication
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Preferred Language Context Selector */}
            <div className="relative flex items-center">
              <Languages className="w-3.5 h-3.5 text-[#3B2F2A]/60 absolute left-2 pointer-events-none" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                disabled={voiceState === 'LISTENING' || voiceState === 'RECORDING'}
                className="text-[11px] pl-7 pr-2.5 py-1 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/50 text-[#3B2F2A] font-medium focus:outline-none focus:ring-1 focus:ring-[#174C3A] cursor-pointer disabled:opacity-50"
                title="Select preferred language or Auto-detect"
              >
                <option value="auto">Auto-Detect Language</option>
                {availableLanguages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#3B2F2A]/60 hover:text-[#3B2F2A] hover:bg-[#C8A96B]/20 transition-colors"
              aria-label="Close voice modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">

          {/* Active Status & Real Waveform Visualizer */}
          <div className="p-5 rounded-2xl bg-[#F8F5EE] border border-[#C8A96B]/30 flex flex-col items-center justify-center text-center relative overflow-hidden">
            
            {/* Real Audio Waveform Canvas */}
            <div className="w-full flex items-center justify-center my-2">
              <AudioWaveformVisualizer
                data={visualizerData}
                isRecording={voiceState === 'RECORDING' || voiceState === 'LISTENING'}
                color="#174C3A"
                width={360}
                height={56}
              />
            </div>

            {/* Live Timer & Status text */}
            <div className="flex items-center gap-2 mt-1">
              {(voiceState === 'LISTENING' || voiceState === 'RECORDING') && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#B45B4A] animate-ping" />
              )}
              <span className="text-xs font-semibold text-[#174C3A]">
                {voiceState === 'IDLE' && 'Press microphone to begin speaking'}
                {voiceState === 'READY' && 'Ready for voice input'}
                {voiceState === 'LISTENING' && 'Listening for speech...'}
                {voiceState === 'RECORDING' && `Recording speech (${recordingSeconds}s / 60s max)`}
                {voiceState === 'PROCESSING' && 'Encoding audio stream...'}
                {voiceState === 'TRANSCRIBING' && 'Whisper multilingual speech recognition in progress...'}
                {voiceState === 'UNDERSTOOD' && 'Transcription verified'}
                {voiceState === 'ACTION_READY' && 'Intent recognized & deterministic actions ready'}
              </span>
            </div>

            {/* Recording Action Buttons */}
            <div className="mt-4 flex items-center gap-3">
              {(voiceState === 'IDLE' || voiceState === 'READY' || voiceState === 'UNDERSTOOD' || voiceState === 'ACTION_READY') && (
                <button
                  onClick={handleStartRecording}
                  className="px-5 py-2.5 rounded-2xl bg-[#174C3A] hover:bg-[#123d2e] text-[#FAF7F2] font-semibold text-xs flex items-center gap-2 shadow-md transition-all duration-150 hover:scale-102 active:scale-98 cursor-pointer"
                >
                  <Mic className="w-4 h-4 text-[#C8A96B]" />
                  <span>{transcriptionResult ? (t('retry') || 'Record Again') : 'Start Speaking'}</span>
                </button>
              )}

              {(voiceState === 'LISTENING' || voiceState === 'RECORDING') && (
                <button
                  onClick={handleStopRecording}
                  className="px-5 py-2.5 rounded-2xl bg-[#B45B4A] hover:bg-[#9c4b3c] text-[#FAF7F2] font-semibold text-xs flex items-center gap-2 shadow-md animate-pulse cursor-pointer"
                >
                  <Square className="w-4 h-4" />
                  <span>Stop & Transcribe</span>
                </button>
              )}

              {(voiceState === 'LISTENING' || voiceState === 'RECORDING') && (
                <button
                  onClick={handleCancel}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-[#3B2F2A]/70 hover:bg-[#C8A96B]/20 transition-colors"
                >
                  {t('forms.cancelBtn') || 'Cancel'}
                </button>
              )}
            </div>

            {/* Context Notice */}
            <div className="mt-3 text-[10px] text-[#3B2F2A]/60 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#5A6B4F]" />
              <span>Injected verified vocabulary: <strong>{dishaState.currentModule}</strong> • {user?.location.district || 'Yavatmal'}</span>
            </div>
          </div>

          {/* Error Recovery Banner */}
          {errorState && (
            <div className="p-3.5 rounded-2xl bg-[#B45B4A]/10 border border-[#B45B4A]/30 text-[#B45B4A] space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold">
                    {errorState === 'OPENAI_KEY_MISSING' && 'OpenAI API Key Missing on Server'}
                    {errorState === 'MICROPHONE_DENIED' && 'Microphone Access Disabled'}
                    {errorState === 'NO_AUDIO' && 'No Speech Detected'}
                    {errorState === 'AUDIO_TOO_SHORT' && 'Audio Too Brief'}
                    {errorState === 'TRANSCRIPTION_ERROR' && 'Whisper Processing Error'}
                    {errorState === 'SERVER_ERROR' && 'Service Error'}
                  </p>
                  <p className="mt-0.5 leading-relaxed text-[#3B2F2A]/90">{errorMessage}</p>
                </div>
              </div>

              {/* Recovery Guidance CTAs */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleStartRecording}
                  className="text-[11px] font-semibold bg-[#B45B4A] text-[#FAF7F2] px-3 py-1.5 rounded-xl hover:bg-[#9c4b3c] transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    dishaState.isAdvisorOpen || (window as any).toggleAdvisor?.();
                  }}
                  className="text-[11px] font-medium bg-[#FAF7F2] text-[#3B2F2A] border border-[#C8A96B]/50 px-3 py-1.5 rounded-xl hover:bg-[#F2E8D6] transition-colors flex items-center gap-1"
                >
                  <Keyboard className="w-3 h-3" />
                  <span>Type Instead</span>
                </button>
              </div>
            </div>
          )}

          {/* Transcription Results Surface */}
          {transcriptionResult && (
            <div className="space-y-3">
              
              {/* Language Detection & Metadata Bar */}
              <div className="p-2.5 rounded-xl bg-[#F2E8D6]/60 border border-[#C8A96B]/30 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-[#174C3A]" />
                  <span className="font-semibold text-[#174C3A]">
                    Detected Language: <strong>{transcriptionResult.languageName}</strong> ({transcriptionResult.language})
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#174C3A]/10 text-[#174C3A] font-mono">
                    {transcriptionResult.languageScript}
                  </span>
                  {transcriptionResult.direction === 'rtl' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#B45B4A]/15 text-[#B45B4A] font-semibold">
                      RTL
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-[11px] text-[#3B2F2A]/70">
                  <span>Confidence: <strong>{Math.round(transcriptionResult.languageConfidence * 100)}%</strong></span>
                  <span>Duration: <strong>{transcriptionResult.duration.toFixed(1)}s</strong></span>
                </div>
              </div>

              {/* Transcript Display & Editable Surface */}
              <div className="p-4 rounded-2xl bg-[#FCFAF5] border border-[#C8A96B]/40 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#3B2F2A]/70 uppercase tracking-wider flex items-center gap-1">
                    <Edit3 className="w-3 h-3 text-[#174C3A]" />
                    <span>Verified Whisper Transcript</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Translation Toggle */}
                    <button
                      onClick={handleToggleTranslation}
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                        isShowingTranslation 
                          ? 'bg-[#174C3A] text-[#FAF7F2] border-[#174C3A]' 
                          : 'bg-[#FAF7F2] text-[#174C3A] border-[#C8A96B]/50 hover:bg-[#F2E8D6]'
                      }`}
                    >
                      <Languages className="w-3 h-3" />
                      <span>{isShowingTranslation ? 'Show Original' : 'Translate to English'}</span>
                    </button>

                    {/* Edit Transcript Toggle */}
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-[11px] font-medium text-[#174C3A] hover:underline px-2 py-1"
                      >
                        Edit
                      </button>
                    ) : (
                      <button
                        onClick={handleSaveEditedTranscript}
                        className="text-[11px] font-semibold bg-[#174C3A] text-[#FAF7F2] px-2.5 py-1 rounded-lg"
                      >
                        Save
                      </button>
                    )}
                  </div>
                </div>

                {/* Text View / Edit Area */}
                {!isEditing ? (
                  <div 
                    dir={isRTL && !isShowingTranslation ? 'rtl' : 'ltr'} 
                    className="p-3 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/25 text-sm text-[#3B2F2A] font-medium leading-relaxed"
                  >
                    {isShowingTranslation 
                      ? (transcriptionResult.englishTranslation || 'Translating into English...')
                      : editableTranscript}
                  </div>
                ) : (
                  <textarea
                    value={editableTranscript}
                    onChange={(e) => setEditableTranscript(e.target.value)}
                    rows={3}
                    className="w-full p-3 text-xs rounded-xl bg-[#FAF7F2] border border-[#174C3A] text-[#3B2F2A] focus:outline-none"
                    placeholder="Refine transcript before DISHA processing..."
                  />
                )}

                {/* Word-Level Timestamps Interactive Chips */}
                {transcriptionResult.words && transcriptionResult.words.length > 0 && !isShowingTranslation && (
                  <div className="pt-2 border-t border-[#C8A96B]/20">
                    <div className="text-[10px] font-bold text-[#3B2F2A]/60 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Interactive Word Timestamps (Alignments)</span>
                      {selectedWordTimestamp && (
                        <span className="text-[10px] text-[#174C3A] font-mono">
                          Selected: &quot;{selectedWordTimestamp.word}&quot; [{selectedWordTimestamp.start.toFixed(2)}s - {selectedWordTimestamp.end.toFixed(2)}s]
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto scrollbar-thin">
                      {transcriptionResult.words.map((w, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedWordTimestamp(w)}
                          className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                            selectedWordTimestamp === w 
                              ? 'bg-[#174C3A] text-[#FAF7F2] border-[#174C3A]' 
                              : 'bg-[#FAF7F2] hover:bg-[#F2E8D6] text-[#3B2F2A] border-[#C8A96B]/30'
                          }`}
                          title={`Timestamp: ${w.start.toFixed(2)}s - ${w.end.toFixed(2)}s`}
                        >
                          {w.word}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Disha NLP Intent & Entity Interpretation Panel */}
              {isIntentLoading ? (
                <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#C8A96B]/30 flex items-center justify-center gap-2 text-xs text-[#174C3A] animate-pulse">
                  <Sparkles className="w-4 h-4 text-[#C8A96B]" />
                  <span>Extracting enterprise intent and deterministic parameters...</span>
                </div>
              ) : intentResult && (
                <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#C8A96B]/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#174C3A]" />
                      <span className="text-xs font-bold text-[#174C3A]">DISHA Intent Interpretation</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#174C3A]/10 text-[#174C3A] font-mono">
                        {intentResult.intent}
                      </span>
                    </div>

                    <div className="text-[10px] text-[#5A6B4F] font-semibold">
                      Confidence: {Math.round(intentResult.confidence * 100)}%
                    </div>
                  </div>

                  {/* Intent Explanation */}
                  <p className="text-xs text-[#3B2F2A] leading-relaxed">
                    {intentResult.explanation}
                  </p>

                  {/* High Stakes Confirmation Gate */}
                  {intentResult.requiresConfirmation && !confirmedAction && (
                    <div className="p-3 rounded-xl bg-[#B45B4A]/10 border border-[#B45B4A]/30 text-xs text-[#B45B4A] space-y-2">
                      <p className="font-semibold">{intentResult.confirmationPrompt || 'This action requires your explicit confirmation.'}</p>
                      <button
                        onClick={() => handleExecuteAction('CONFIRM_SUBMIT')}
                        className="px-3 py-1.5 rounded-lg bg-[#B45B4A] text-[#FAF7F2] font-semibold hover:bg-[#9c4b3c] transition-colors"
                      >
                        Confirm Action
                      </button>
                    </div>
                  )}

                  {confirmedAction && (
                    <div className="p-2.5 rounded-xl bg-[#5A6B4F]/15 border border-[#5A6B4F]/30 text-xs text-[#5A6B4F] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Action confirmed and validated.</span>
                    </div>
                  )}

                  {/* Extracted Entities */}
                  {Object.keys(intentResult.entities).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {Object.entries(intentResult.entities).map(([key, val]) => (
                        <div key={key} className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#C8A96B]/30 text-[#3B2F2A]">
                          <span className="text-[#3B2F2A]/60">{key}:</span> <strong>{String(val)}</strong>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggested Quick Actions */}
                  {intentResult.suggestedActions.length > 0 && (
                    <div className="pt-2 border-t border-[#C8A96B]/25 flex flex-wrap gap-2">
                      {intentResult.suggestedActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleExecuteAction(action.actionCode, action.route)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#174C3A] hover:bg-[#123d2e] text-[#FAF7F2] flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <span>{action.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TTS Readout Controls */}
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleTTS}
                    className={`p-2 rounded-xl border flex items-center gap-1.5 transition-colors ${
                      isPlayingTTS 
                        ? 'bg-[#174C3A] text-[#FAF7F2] border-[#174C3A]' 
                        : 'bg-[#F2E8D6] text-[#174C3A] border-[#C8A96B]/40 hover:bg-[#F2E8D6]/80'
                    }`}
                    title="Play back audio readout"
                  >
                    {isPlayingTTS ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span className="font-semibold">{isPlayingTTS ? 'Pause Readout' : 'Listen to Response'}</span>
                  </button>

                  <select
                    value={ttsSpeed}
                    onChange={(e) => setTtsSpeed(parseFloat(e.target.value))}
                    className="text-[11px] px-2 py-1 rounded-lg bg-[#FAF7F2] border border-[#C8A96B]/40 text-[#3B2F2A]"
                    title="Speech Speed"
                  >
                    <option value={0.75}>0.75x</option>
                    <option value={1.0}>1.0x Normal</option>
                    <option value={1.25}>1.25x</option>
                  </select>
                </div>

                <button
                  onClick={handleSendToDishaChat}
                  className="px-3.5 py-1.5 rounded-xl bg-[#5A6B4F] hover:bg-[#4a5841] text-[#FAF7F2] font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>Send to DISHA Copilot</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Footer Bar */}
        <div className="px-5 py-3 bg-[#F2E8D6]/60 border-t border-[#C8A96B]/30 flex items-center justify-between text-[11px] text-[#3B2F2A]/70">
          <span>Speech Recognition: <strong>OpenAI Whisper</strong></span>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">Press <strong>Esc</strong> to exit</span>
            <button
              onClick={onClose}
              className="px-3 py-1 rounded-lg bg-[#FAF7F2] border border-[#C8A96B]/40 text-[#3B2F2A] hover:bg-[#F2E8D6] font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
