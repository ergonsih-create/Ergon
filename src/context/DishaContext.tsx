/**
 * @license
 * GRAM-DISHA — DISHA AI OS Copilot Context
 */

import React, { createContext, useContext, useState } from 'react';
import { DishaContextState, SupportedLanguageCode } from '../types';

interface DishaContextType {
  dishaState: DishaContextState;
  setModule: (module: DishaContextState['currentModule']) => void;
  toggleAdvisor: () => void;
  openAdvisor: () => void;
  closeAdvisor: () => void;
  openAdvisorWithInsight: (summary: string, alerts?: string[], recommendation?: string) => void;
  setVoiceLanguage: (lang: SupportedLanguageCode) => void;
  sendChatMessage: (text: string) => Promise<void>;
  isProcessing: boolean;
  isSpeaking: boolean;
  toggleSpeakCurrentInsight: () => void;
}

const defaultState: DishaContextState = {
  currentModule: 'DASHBOARD',
  activeInsightSummary: 'DISHA AI OS is actively monitoring your business decision pipeline with deterministic evidence grounding.',
  criticalAlerts: [
    'PMEGP 35% Rural Subsidy matched for your demographic criteria (OBC/Rural).',
    'Local Chana APMC mandi modal price updated at ₹5,950/Quintal.',
  ],
  recommendedAction: 'Verify your detailed Project Cost Breakdown to proceed with bankable DPR generation.',
  isAdvisorOpen: false,
  voiceLanguage: 'en',
  chatHistory: [
    {
      id: 'msg_1',
      sender: 'DISHA',
      text: 'Namaste Rajesh ji! I am DISHA, your evidence-bound rural business structuring co-pilot. I have synchronized data from LGD, AGMARKNET, and PMEGP v2.4-2025 for Pusad taluka, Yavatmal. How can I assist your enterprise plan today?',
      timestamp: '10:00 AM',
      evidenceSource: 'LGD / AGMARKNET / MoMSME PMEGP',
      suggestedActions: [
        { label: 'Review Feasibility Score (HBFS)', actionCode: 'NAV_FEASIBILITY' },
        { label: 'Check 35% PMEGP Subsidy Match', actionCode: 'NAV_SCHEMES' },
        { label: 'Simulate Loan EMI & Break-Even', actionCode: 'NAV_FINANCE' }
      ]
    }
  ]
};

const DishaContext = createContext<DishaContextType | undefined>(undefined);

export const DishaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dishaState, setDishaState] = useState<DishaContextState>(defaultState);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const setModule = (module: DishaContextState['currentModule']) => {
    setDishaState(prev => ({
      ...prev,
      currentModule: module,
    }));
  };

  const toggleAdvisor = () => {
    setDishaState(prev => ({
      ...prev,
      isAdvisorOpen: !prev.isAdvisorOpen,
    }));
  };

  const openAdvisor = () => {
    setDishaState(prev => ({ ...prev, isAdvisorOpen: true }));
  };

  const closeAdvisor = () => {
    setDishaState(prev => ({ ...prev, isAdvisorOpen: false }));
  };

  const openAdvisorWithInsight = (summary: string, alerts: string[] = [], recommendation?: string) => {
    setDishaState(prev => ({
      ...prev,
      activeInsightSummary: summary,
      criticalAlerts: alerts,
      recommendedAction: recommendation,
      isAdvisorOpen: true,
    }));
  };

  const setVoiceLanguage = (lang: SupportedLanguageCode) => {
    setDishaState(prev => ({
      ...prev,
      voiceLanguage: lang,
    }));
  };

  const toggleSpeakCurrentInsight = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const textToSpeak = `${dishaState.activeInsightSummary || ''}. ${dishaState.recommendedAction || ''}`;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      setIsSpeaking(!isSpeaking);
      setTimeout(() => setIsSpeaking(false), 4000);
    }
  };

  const sendChatMessage = async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg = {
      id: `msg_u_${Date.now()}`,
      sender: 'USER' as const,
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setDishaState(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, userMsg]
    }));

    setIsProcessing(true);

    // Contextual deterministic response generator based on query intent
    setTimeout(() => {
      let replyText = 'I have analyzed your query against verified datasets.';
      let source = 'GRAM-DISHA Deterministic Knowledge Base';
      let actions: Array<{ label: string; actionCode: string }> = [];

      const queryLower = userText.toLowerCase();

      if (queryLower.includes('subsidy') || queryLower.includes('scheme') || queryLower.includes('pmegp')) {
        replyText = 'Based on PMEGP v2.4-2025 guidelines for your rural OBC profile in Yavatmal, you are eligible for up to 35% capital subsidy (Max ₹17.5 Lakh on ₹50L manufacturing cost) with only 5% promoter equity required.';
        source = 'Ministry of MSME / KVIC PMEGP Matrix 2025';
        actions = [{ label: 'View Scheme Details', actionCode: 'NAV_SCHEMES' }, { label: 'Check Document Checklist', actionCode: 'NAV_DOCUMENTS' }];
      } else if (queryLower.includes('loan') || queryLower.includes('emi') || queryLower.includes('cost') || queryLower.includes('break even')) {
        replyText = 'For a ₹8.5 Lakh project with ₹1.25 Lakh promoter contribution, the required term loan is ₹5.43 Lakh. At 9.8% p.a. for 5 years, your monthly EMI is ₹11,489. Break-even volume is 632 kg/month.';
        source = 'Deterministic Financial Formula Engine';
        actions = [{ label: 'Open Financial Structuring', actionCode: 'NAV_FINANCE' }];
      } else if (queryLower.includes('market') || queryLower.includes('price') || queryLower.includes('chana') || queryLower.includes('mandi')) {
        replyText = 'The Pusad APMC Mandi daily arrival for Desi Chana is 45.8 Tonnes with modal price of ₹5,950/Quintal (min ₹5,650, max ₹6,200). Upward price trend recorded.';
        source = 'AGMARKNET Daily Mandi Feed (2026-03-01)';
        actions = [{ label: 'Open Market Insights', actionCode: 'NAV_MARKET_INSIGHTS' }];
      } else if (queryLower.includes('feasibility') || queryLower.includes('hbfs') || queryLower.includes('score')) {
        replyText = 'Your project achieves an HBFS Feasibility Score of 0.765 (HIGH_FEASIBILITY Tier) due to strong local raw material supply and high scheme alignment, with a minor penalty for seasonal crop fluctuations.';
        source = 'HBFS 8-Parameter Feasibility Engine';
        actions = [{ label: 'Open Feasibility Matrix', actionCode: 'NAV_FEASIBILITY' }];
      } else {
        replyText = `Understood. I have linked your request with your current active enterprise (${dishaState.currentModule}). How would you like me to guide your next milestone?`;
        actions = [
          { label: 'Explore Curated Business Models', actionCode: 'NAV_BUSINESS_IDEAS' },
          { label: 'View 12-Month Cash Flow', actionCode: 'NAV_FINANCE' }
        ];
      }

      const botMsg = {
        id: `msg_d_${Date.now()}`,
        sender: 'DISHA' as const,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        evidenceSource: source,
        suggestedActions: actions
      };

      setDishaState(prev => ({
        ...prev,
        chatHistory: [...prev.chatHistory, botMsg]
      }));

      setIsProcessing(false);
    }, 600);
  };

  return (
    <DishaContext.Provider
      value={{
        dishaState,
        setModule,
        toggleAdvisor,
        openAdvisor,
        closeAdvisor,
        openAdvisorWithInsight,
        setVoiceLanguage,
        sendChatMessage,
        isProcessing,
        isSpeaking,
        toggleSpeakCurrentInsight,
      }}
    >
      {children}
    </DishaContext.Provider>
  );
};

export const useDisha = (): DishaContextType => {
  const context = useContext(DishaContext);
  if (!context) {
    throw new Error('useDisha must be used within a DishaProvider');
  }
  return context;
};
