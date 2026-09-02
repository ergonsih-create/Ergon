/**
 * @license
 * GRAM-DISHA — DISHA AI OS Interactive Copilot Drawer
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  AlertCircle, 
  ArrowRight, 
  Volume2, 
  VolumeX,
  ShieldCheck, 
  Send,
  HelpCircle,
  Clock,
  Compass,
  Landmark,
  Calculator,
  Building
} from 'lucide-react';
import { useDisha } from '../../context/DishaContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { DishaContextState } from '../../types';

export const DishaAdvisorDrawer: React.FC<{ onNavigate?: (mod: DishaContextState['currentModule']) => void }> = ({ onNavigate }) => {
  const { 
    dishaState, 
    closeAdvisor, 
    sendChatMessage, 
    isProcessing, 
    isSpeaking, 
    toggleSpeakCurrentInsight 
  } = useDisha();
  const { availableLanguages, setLanguage, currentLanguage } = useLanguage();

  const [queryInput, setQueryInput] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dishaState.isAdvisorOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [dishaState.chatHistory, dishaState.isAdvisorOpen]);

  if (!dishaState.isAdvisorOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim() || isProcessing) return;
    const text = queryInput.trim();
    setQueryInput('');
    await sendChatMessage(text);
  };

  const handleActionClick = (actionCode: string) => {
    if (!onNavigate) return;
    if (actionCode === 'NAV_FEASIBILITY') onNavigate('FEASIBILITY');
    else if (actionCode === 'NAV_SCHEMES') onNavigate('SCHEMES');
    else if (actionCode === 'NAV_FINANCE') onNavigate('FINANCE');
    else if (actionCode === 'NAV_MARKET_INSIGHTS') onNavigate('MARKET_INSIGHTS');
    else if (actionCode === 'NAV_DOCUMENTS') onNavigate('DOCUMENTS');
    else if (actionCode === 'NAV_BUSINESS_IDEAS') onNavigate('BUSINESS_IDEAS');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FCFAF5] border-l border-[#D9D3C7] shadow-2xl flex flex-col h-full z-50">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#D9D3C7] bg-[#F8F5EE] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#174C3A] text-[#FCFAF5] flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-[#C69A45]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-bold text-sm text-[#174C3A]">DISHA AI OS Copilot</h3>
                <Badge variant="forest" size="sm">SIH 2026</Badge>
              </div>
              <p className="text-[11px] text-[#68655D]">Evidence-Bound Rural Enterprise Copilot</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio Speech Toggle */}
            <button
              onClick={toggleSpeakCurrentInsight}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                isSpeaking 
                  ? 'bg-[#174C3A] text-[#FCFAF5] border-[#174C3A]' 
                  : 'bg-[#FCFAF5] text-[#68655D] border-[#D9D3C7] hover:text-[#242522]'
              }`}
              title="Voice advisory in Indian Language"
            >
              {isSpeaking ? <Volume2 className="w-4 h-4 text-[#C69A45] animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={closeAdvisor}
              className="p-1.5 rounded-lg text-[#68655D] hover:text-[#242522] hover:bg-[#D9D3C7]/40"
              aria-label="Close Advisor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Active Context Bar */}
        <div className="px-4 py-2 bg-[#174C3A]/5 border-b border-[#174C3A]/10 flex items-center justify-between text-xs text-[#174C3A]">
          <span className="font-medium">Module: <strong>{dishaState.currentModule}</strong></span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#174C3A]">
            <ShieldCheck className="w-3.5 h-3.5" /> Zero Hallucination Mode
          </span>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Critical Alerts Banner */}
          {dishaState.criticalAlerts.length > 0 && (
            <div className="p-3 rounded-2xl bg-[#B95736]/10 border border-[#B95736]/20 text-[#9F452B] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Real-Time Decision Feed:
              </div>
              {dishaState.criticalAlerts.map((alert, i) => (
                <p key={i} className="text-xs leading-relaxed">• {alert}</p>
              ))}
            </div>
          )}

          {/* Chat Messages */}
          {dishaState.chatHistory.map((msg) => {
            const isUser = msg.sender === 'USER';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#174C3A] text-[#FCFAF5] rounded-br-xs'
                      : 'bg-[#FCFAF5] border border-[#D9D3C7] text-[#242522] shadow-xs rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Evidence Provenance Stamp */}
                  {msg.evidenceSource && (
                    <div className="mt-2 pt-2 border-t border-[#D9D3C7]/40 text-[10px] text-[#68655D] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#174C3A]" />
                      <span>Source: {msg.evidenceSource}</span>
                    </div>
                  )}

                  {/* Interactive Quick Action Buttons */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-[#D9D3C7]/40 flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleActionClick(act.actionCode)}
                          className="text-[11px] font-semibold bg-[#174C3A]/10 hover:bg-[#174C3A] text-[#174C3A] hover:text-[#FCFAF5] px-2.5 py-1 rounded-lg border border-[#174C3A]/30 transition-colors flex items-center gap-1"
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-[#68655D] mt-1 px-1">
                  {isUser ? 'You' : 'DISHA AI OS'} • {msg.timestamp}
                </span>
              </div>
            );
          })}

          {isProcessing && (
            <div className="flex items-center gap-2 text-xs text-[#68655D] p-2 bg-[#F8F5EE] rounded-xl border border-[#D9D3C7]/60 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-[#C69A45]" />
              <span>Querying verified LGD & AGMARKNET databases...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="p-2.5 bg-[#FCFAF5] border-t border-[#D9D3C7]/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {[
            'What is my PMEGP subsidy?',
            'What is my monthly loan EMI?',
            'Check mandi pulse prices',
            'Explain HBFS feasibility'
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => sendChatMessage(chip)}
              className="text-[11px] font-medium bg-[#F8F5EE] hover:bg-[#EFEAE1] text-[#242522] border border-[#D9D3C7] px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 bg-[#F8F5EE] border-t border-[#D9D3C7] flex items-center gap-2">
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Ask DISHA about subsidies, break-even, or mandi rates..."
            className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-[#FCFAF5] border border-[#D9D3C7] text-[#242522] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
          />
          <Button type="submit" size="sm" variant="forest" disabled={!queryInput.trim() || isProcessing}>
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>

      </div>
    </div>
  );
};
