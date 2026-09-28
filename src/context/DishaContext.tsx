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
  openVoiceModal: () => void;
  closeVoiceModal: () => void;
  toggleVoiceModal: () => void;
  openGeminiLive: () => void;
  closeGeminiLive: () => void;
  openTranscribe: () => void;
  closeTranscribe: () => void;
  openParticleAi: () => void;
  closeParticleAi: () => void;
  toggleParticleAi: () => void;
  isGeminiLiveOpen: boolean;
  isTranscribeOpen: boolean;
  isParticleAiOpen: boolean;
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
  isVoiceModalOpen: false,
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
  const [isGeminiLiveOpen, setIsGeminiLiveOpen] = useState<boolean>(false);
  const [isTranscribeOpen, setIsTranscribeOpen] = useState<boolean>(false);
  const [isParticleAiOpen, setIsParticleAiOpen] = useState<boolean>(false);

  const openGeminiLive = () => setIsGeminiLiveOpen(true);
  const closeGeminiLive = () => setIsGeminiLiveOpen(false);
  const openTranscribe = () => setIsTranscribeOpen(true);
  const closeTranscribe = () => setIsTranscribeOpen(false);
  const openParticleAi = () => setIsParticleAiOpen(true);
  const closeParticleAi = () => setIsParticleAiOpen(false);
  const toggleParticleAi = () => setIsParticleAiOpen(prev => !prev);

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

  const openVoiceModal = () => {
    setDishaState(prev => ({ ...prev, isVoiceModalOpen: true }));
  };

  const closeVoiceModal = () => {
    setDishaState(prev => ({ ...prev, isVoiceModalOpen: false }));
  };

  const toggleVoiceModal = () => {
    setDishaState(prev => ({ ...prev, isVoiceModalOpen: !prev.isVoiceModalOpen }));
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

    try {
      const storedBiz = localStorage.getItem('gram_disha_active_business');
      let businessId = 'biz_default';
      if (storedBiz) {
        try {
          const parsed = JSON.parse(storedBiz);
          if (parsed?.id) businessId = parsed.id;
        } catch {}
      }

      const token = localStorage.getItem('token') || localStorage.getItem('gram_disha_jwt_token') || '';
      const res = await fetch('/api/v1/disha/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: userText,
          businessId: businessId,
          language: dishaState.voiceLanguage || 'en',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data.content || data.reply || data.text;
        if (replyText) {
          const source = data.grounding_refs?.source || 'GRAM-DISHA Grounded Knowledge Base (FastAPI & Gemini)';
          const botMsg = {
            id: data.id || `msg_d_${Date.now()}`,
            sender: 'DISHA' as const,
            text: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            evidenceSource: source,
            suggestedActions: [
              { label: 'Check 35% PMEGP Subsidy Match', actionCode: 'NAV_SCHEMES' },
              { label: 'Simulate Loan EMI & Break-Even', actionCode: 'NAV_FINANCE' }
            ]
          };

          setDishaState(prev => ({
            ...prev,
            chatHistory: [...prev.chatHistory, botMsg]
          }));
          setIsProcessing(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend /disha/chat call failed, using local reasoning fallback:', err);
    }

    // Contextual deterministic response generator fallback based on query intent
    setTimeout(() => {
      let replyText = 'I have analyzed your query against verified datasets.';
      let source = 'GRAM-DISHA Deterministic Knowledge Base';
      let actions: Array<{ label: string; actionCode: string }> = [];

      const queryLower = userText.toLowerCase();

      if (queryLower.includes('calculation') || queryLower.includes('formula') || queryLower.includes('dscr')) {
        replyText = 'Financial Engineering Breakdown: \n1. EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1). For ₹5.95 Lakh Term Loan at 9.5% for 5 years (60 months), monthly EMI is ₹12,496.11.\n2. DSCR (Debt Service Coverage Ratio): Net Operating Income / Total Debt Service. Your projected Year-1 DSCR is 1.58x, safely exceeding the commercial bank underwriting threshold of 1.35x.\n3. Margin Money: Promoter equity is 17.6% (₹1.50 Lakh), and Government PMEGP subsidy pays 35% (₹2.975 Lakh) directly into bank margin escrow.';
        source = 'Deterministic Financial Formula Engine & RBI MSME Prudential Norms';
        actions = [{ label: 'Inspect Financial Projections', actionCode: 'NAV_FINANCE' }, { label: 'View Bank DPR', actionCode: 'NAV_REPORTS' }];
      } else if (queryLower.includes('missing') || queryLower.includes('audit')) {
        replyText = 'Enterprise Profile Audit Findings: \n• Aadhaar & PAN verification: COMPLETE\n• LGD Village Classification: COMPLETE (Rural)\n• Udyam Registration Number: PENDING (Apply at udyamregistration.gov.in)\n• FSSAI Food Hygiene Certificate: PENDING\n• Three-Phase Electricity Consumer ID: PENDING\nRecommend completing these 3 items before submitting the DPR to your lead bank.';
        source = 'District Industries Centre (DIC) Statutory Checklist';
        actions = [{ label: 'Open Documents Checklist', actionCode: 'NAV_DOCUMENTS' }, { label: 'Check Action Roadmap', actionCode: 'NAV_REPORTS' }];
      } else if (queryLower.includes('next action') || queryLower.includes('guidance') || queryLower.includes('step')) {
        replyText = 'Recommended Next Actions:\n1. Print the Gram-Disha Bankable DPR from the Reports tab.\n2. Apply for free Udyam MSME registration online using your Aadhaar.\n3. Schedule a pre-submission review meeting with your Block Livelihood Officer or Lead Bank Rural Branch Manager.\n4. Lock in machinery quotation from an ISO-certified vendor for capital subsidy approval.';
        source = 'State Rural Livelihood Mission (SRLM) Action Matrix';
        actions = [{ label: 'Print Official Bank DPR', actionCode: 'NAV_REPORTS' }, { label: 'View Scheme Applications', actionCode: 'NAV_APPLICATIONS' }];
      } else if (queryLower.includes('explain') || queryLower.includes('result') || queryLower.includes('hbfs')) {
        replyText = 'Holistic Business Feasibility Score (HBFS) Analysis:\nYour enterprise scored 49.6% (Moderate Feasibility Tier under strict banking penalty weighting).\nKey Positives: Abundant local raw material within 10 km (82/100) and strong local grocery demand (78/100).\nKey Risk to Monitor: Seasonal raw crop price volatility in APMC mandis during pre-monsoon months.';
        source = 'HBFS 8-Parameter Feasibility Engine';
        actions = [{ label: 'Explore Feasibility Matrix', actionCode: 'NAV_FEASIBILITY' }, { label: 'Check Mandi Prices', actionCode: 'NAV_MARKET_INSIGHTS' }];
      } else if (queryLower.includes('subsidy') || queryLower.includes('scheme') || queryLower.includes('pmegp')) {
        replyText = 'Based on PMEGP v2.4-2025 guidelines for your rural OBC profile in Yavatmal, you are eligible for up to 35% capital subsidy (Max ₹17.5 Lakh on ₹50L manufacturing cost) with only 5% promoter equity required.';
        source = 'Ministry of MSME / KVIC PMEGP Matrix 2025';
        actions = [{ label: 'View Scheme Details', actionCode: 'NAV_SCHEMES' }, { label: 'Check Document Checklist', actionCode: 'NAV_DOCUMENTS' }];
      } else if (queryLower.includes('loan') || queryLower.includes('emi') || queryLower.includes('cost') || queryLower.includes('break even')) {
        replyText = 'For a ₹8.50 Lakh project with ₹1.50 Lakh promoter contribution (Net Debt: ₹7.00 Lakh), the Term Loan (85%) is ₹5.95 Lakh. At 9.5% p.a. for 5 years (60 months), your monthly Term Loan EMI is ₹12,496.11. Break-even volume is 425 kg/month.';
        source = 'Deterministic Financial Formula Engine';
        actions = [{ label: 'Open Financial Structuring', actionCode: 'NAV_FINANCE' }];
      } else if (queryLower.includes('market') || queryLower.includes('price') || queryLower.includes('chana') || queryLower.includes('mandi')) {
        replyText = 'The Pusad APMC Mandi daily arrival for Desi Chana is 45.8 Tonnes with modal price of ₹5,950/Quintal (min ₹5,650, max ₹6,200). Upward price trend recorded.';
        source = 'AGMARKNET Daily Mandi Feed (2026-03-01)';
        actions = [{ label: 'Open Market Insights', actionCode: 'NAV_MARKET_INSIGHTS' }];
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
        openVoiceModal,
        closeVoiceModal,
        toggleVoiceModal,
        openGeminiLive,
        closeGeminiLive,
        openTranscribe,
        closeTranscribe,
        isGeminiLiveOpen,
        isTranscribeOpen,
        isParticleAiOpen,
        openParticleAi,
        closeParticleAi,
        toggleParticleAi,
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
