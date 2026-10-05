/**
 * @license
 * GRAM-DISHA — DISHA AI OS Copilot Context
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DishaContextState, SupportedLanguageCode } from '../types';
import { useLanguage } from './LanguageContext';
import { getBcp47Language, getBrowserVoice, cleanTextForTTS } from '../utils/voiceUtils';

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
  sendChatMessage: (text: string, customLang?: SupportedLanguageCode) => Promise<string | undefined>;
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
  const { currentLanguage } = useLanguage();
  const [dishaState, setDishaState] = useState<DishaContextState>(() => ({
    ...defaultState,
    voiceLanguage: currentLanguage || (localStorage.getItem('gram_disha_lang') as SupportedLanguageCode) || 'en',
  }));
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isGeminiLiveOpen, setIsGeminiLiveOpen] = useState<boolean>(false);
  const [isTranscribeOpen, setIsTranscribeOpen] = useState<boolean>(false);
  const [isParticleAiOpen, setIsParticleAiOpen] = useState<boolean>(false);

  // Synchronize voiceLanguage whenever application language changes
  useEffect(() => {
    if (currentLanguage) {
      setDishaState(prev => {
        if (prev.voiceLanguage === currentLanguage) return prev;
        return {
          ...prev,
          voiceLanguage: currentLanguage,
        };
      });
    }
  }, [currentLanguage]);

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
        const rawText = `${dishaState.activeInsightSummary || ''}. ${dishaState.recommendedAction || ''}`;
        const textToSpeak = cleanTextForTTS(rawText);
        if (!textToSpeak) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        const activeLang = dishaState.voiceLanguage || currentLanguage || 'en';
        const targetBcp = getBcp47Language(activeLang);
        utterance.lang = targetBcp;

        const matchedVoice = getBrowserVoice(activeLang);
        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }

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

  const getLocalizedDishaFallback = (query: string, lang: string, moduleName: string): string => {
    const q = query.toLowerCase();
    
    // Subsidies / Schemes
    if (q.includes('subsidy') || q.includes('scheme') || q.includes('pmegp') || q.includes('अनुदान') || q.includes('योजना') || q.includes('மானியம்')) {
      if (lang === 'mr') return 'PMEGP 2025-26 नियमांनुसार ग्रामीण ओबीसी/विशेष प्रवर्गासाठी 35% भांडवली अनुदान (कमाल ₹17.5 लाख) उपलब्ध आहे. प्रवर्तकाचे स्वतःचे भांडवल केवळ 5% आवश्यक आहे. आपला प्रकल्प आर्थिकदृष्ट्या सक्षम आहे.';
      if (lang === 'hi') return 'PMEGP 2025-26 के अनुसार ग्रामीण ओबीसी/विशेष श्रेणी हेतु 35% पूंजीगत सब्सिडी (अधिकतम ₹17.5 लाख) अनुमन्य है। केवल 5% प्रवर्तक अंशदान आवश्यक है।';
      if (lang === 'ta') return 'PMEGP 2025-26 விதிகளின்படி கிராமப்புற ஓபிசி/சிறப்பு பிரிவினருக்கு 35% மூலதன மானியம் (அதிகபட்சம் ₹17.5 லட்சம்) வழங்கப்படுகிறது. தொழில்முனைவோர் பங்கு வெறும் 5% மட்டுமே.';
      if (lang === 'te') return 'PMEGP 2025-26 మార్గదర్శకాల ప్రకారం గ్రామీణ ఓబీసీ వర్గానికి 35% మూలధన సబ్సిడీ (గరిష్టంగా ₹17.5 లక్షలు) వర్తిస్తుంది. ప్రమోటర్ వాటా కేవలం 5% మాత్రమే.';
      if (lang === 'bn') return 'PMEGP 2025-26 নির্দেশিকা অনুসারে গ্রামীণ ওবিসি বিভাগের জন্য 35% মূলধন ভর্তুকি (সর্বোচ্চ ₹17.5 লাখ) উপলব্ধ। প্রবর্তকের নিজস্ব অংশ মাত্র 5% প্রয়োজন।';
      if (lang === 'gu') return 'PMEGP 2025-26 મુજબ ગ્રામીણ OBC માટે 35% મૂડી સબસિડી (મહત્તમ ₹17.5 લાખ) ઉપલબ્ધ છે. પ્રમોટરનો હિસ્સો ફક્ત 5% જરૂરી છે.';
      if (lang === 'kn') return 'PMEGP 2025-26 ಪ್ರಕಾರ ಗ್ರಾಮೀಣ ಒಬಿಸಿ ವರ್ಗಕ್ಕೆ 35% ಬಂಡವಾಳ ಸಬ್ಸಿಡಿ (ಗರಿಷ್ಠ ₹17.5 ಲಕ್ಷ) ದೊರೆಯುತ್ತದೆ. ಪ್ರವರ್ತಕರ ಪಾಲು ಕೇವಲ 5% ಸಾಕು.';
      if (lang === 'pa') return 'PMEGP 2025-26 ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਪੇਂਡੂ ਓਬੀਸੀ ਸ਼੍ਰੇਣੀ ਲਈ 35% ਪੂੰਜੀ ਸਬਸਿਡੀ (ਵੱਧ ਤੋਂ ਵੱਧ ₹17.5 ਲੱਖ) ਮਿਲਦੀ ਹੈ।';
      if (lang === 'ml') return 'PMEGP 2025-26 പ്രകാരം ഗ്രാമീണ ഒബിസി വിഭാഗത്തിന് 35% മൂലധന സബ്‌സിഡി (പരമാവധി ₹17.5 ലക്ഷം) ലഭ്യമാണ്.';
      if (lang === 'ur') return 'PMEGP 2025-26 کے تحت دیہی او بی سی زمرے کے لیے 35% کیپٹل سبسڈی (زیادہ سے زیادہ ₹17.5 لاکھ) دستیاب ہے۔';
      return 'Based on PMEGP v2.4-2025 guidelines for your rural profile, you are eligible for up to 35% capital subsidy (Max ₹17.5 Lakh on ₹50L manufacturing cost) with only 5% promoter equity required.';
    }

    // Loans / EMI / DSCR
    if (q.includes('loan') || q.includes('emi') || q.includes('dscr') || q.includes('हप्ता') || q.includes('कर्ज') || q.includes('ऋण') || q.includes('கடன்')) {
      if (lang === 'mr') return 'आर्थिक सूत्र विश्लेषण: ₹8.50 लाख प्रकल्पासाठी ₹1.50 लाख स्वतःचे भांडवल असल्यास बँक मुदत कर्ज ₹5.95 लाख होईल. 9.5% व्याजदराने 5 वर्षांसाठी (60 महिने) मासिक हप्ता ₹12,496.11 असेल. प्रथम वर्षाचा DSCR 1.58x असून बँक निकषांपेक्षा सुरक्षित आहे.';
      if (lang === 'hi') return 'वित्तीय विश्लेषण: ₹8.50 लाख परियोजना के लिए ₹5.95 लाख मियादी ऋण पर 9.5% ब्याज दर से 5 वर्षों (60 माह) के लिए मासिक ईएमआई ₹12,496.11 होगी। प्रथम वर्ष का DSCR 1.58x है जो बैंक मानक 1.35x से अधिक है।';
      if (lang === 'ta') return 'நிதி பகுப்பாய்வு: ₹8.50 லட்சம் திட்டத்திற்கு ₹5.95 லட்சம் வங்கிக் கடனுக்கு 9.5% வட்டியில் 5 ஆண்டுகளுக்கு மாத தவணை ₹12,496.11. முதல் வருட DSCR 1.58x ஆக உள்ளது.';
      if (lang === 'te') return 'ఆర్థిక లెక్కలు: ₹8.50 లక్షల ప్రాజెక్టుకు ₹5.95 లక్షల టర్మ్ లోన్‌పై 9.5% వడ్డీతో 5 సంవత్సరాలకు నెలవారీ ఈఎంఐ ₹12,496.11 అవుతుంది. మొదటి సంవత్సరం DSCR 1.58x గా ఉంది.';
      if (lang === 'bn') return 'আর্থিক হিসাব: ₹8.50 লাখ প্রকল্পের জন্য ₹5.95 লাখ ব্যাংক ঋণে 9.5% হারে 5 বছরের জন্য মাসিক কিস্তি ₹12,496.11 হবে। প্রথম বছরের DSCR 1.58x.';
      if (lang === 'gu') return 'નાણાકીય વિશ્લેષણ: ₹8.50 લાખના પ્રોજેક્ટ માટે ₹5.95 લાખની લોન પર 9.5% વ્યાજે 5 વર્ષ માટે માસિક હપ્તો ₹12,496.11 થશે. પ્રથમ વર્ષનો DSCR 1.58x છે.';
      if (lang === 'kn') return 'ಹಣಕಾಸು ವಿವರ: ₹8.50 ಲಕ್ಷ ಯೋಜನೆಗೆ ₹5.95 ಲಕ್ಷ ಬ್ಯಾಂಕ್ ಸಾಲಕ್ಕೆ 9.5% ಬಡ್ಡಿದರದಲ್ಲಿ 5 ವರ್ಷಗಳಿಗೆ ಮಾಸಿಕ ಕಂತು ₹12,496.11 ಆಗಿರುತ್ತದೆ. ಮೊದಲ ವರ್ಷದ DSCR 1.58x ಆಗಿದೆ.';
      if (lang === 'pa') return 'ਵਿੱਤੀ ਵਿਸ਼ਲੇਸ਼ਣ: ₹8.50 ਲੱਖ ਦੇ ਪ੍ਰੋਜੈਕਟ ਲਈ ₹5.95 ਲੱਖ ਦੇ ਟਰਮ ਲੋਨ ਤੇ 9.5% ਵਿਆਜ ਦਰ ਨਾਲ 5 ਸਾਲਾਂ ਲਈ ਮਹੀਨਾਵਾਰ ਕਿਸ਼ਤ ₹12,496.11 ਹੋਵੇਗੀ।';
      if (lang === 'ml') return 'സാമ്പത്തിക വിശകലനം: ₹8.50 ലക്ഷം പദ്ധതിക്ക് ₹5.95 ലക്ഷം വായ്പയ്ക്ക് 9.5% പലിശനിരക്കിൽ 5 വർഷത്തേക്ക് പ്രതിമാസ ഇഎംഐ ₹12,496.11 ആയിരിക്കും.';
      if (lang === 'ur') return 'مالیاتی حساب: ₹8.50 لاکھ کے پروجیکٹ کے لیے ₹5.95 لاکھ کے قرض پر 9.5% شرح سود پر 5 سال کے لیے ماہانہ قسط ₹12,496.11 ہوگی۔';
      return 'Financial Engineering Breakdown: For ₹5.95 Lakh Term Loan at 9.5% for 5 years (60 months), monthly EMI is ₹12,496.11. Year-1 DSCR is 1.58x, safely exceeding the commercial bank threshold of 1.35x.';
    }

    // Documents / Compliance / Audit
    if (q.includes('document') || q.includes('missing') || q.includes('audit') || q.includes('कागदपत्र') || q.includes('दस्तावेज') || q.includes('ஆவணம்')) {
      if (lang === 'mr') return 'कागदपत्रे तपासणी अहवाल: आधार आणि पॅन पडताळणी पूर्ण झाली आहे. उद्यम नोंदणी, FSSAI अन्न सुरक्षा परवाना आणि तीन-फेज वीज मंजुरी तात्काळ पूर्ण करा, जेणेकरून बँक डीपीआर मंजूर होईल.';
      if (lang === 'hi') return 'दस्तावेज़ स्थिति: आधार व पैन सत्यापित हैं। उद्यम पंजीकरण, एफएसएसएआई खाद्य लाइसेंस और थ्री-फेज बिजली स्वीकृति लंबित हैं। बैंक डीपीआर प्रस्तुत करने से पहले इन्हें पूरा करें।';
      if (lang === 'ta') return 'ஆவணங்கள் சரிபார்ப்பு: ஆதார் மற்றும் பான் சரிபார்க்கப்பட்டது. உத்யம் பதிவு, FSSAI உரிமம் மற்றும் மும்முனை மின் இணைப்பு ஆகியவை நிலுவையில் உள்ளன.';
      if (lang === 'te') return 'పత్రాల స్థితి: ఆధార్ మరియు పాన్ ధృవీకరించబడ్డాయి. ఉద్యమ్ నమోదు, ఎఫ్ఎస్ఎస్ఏఐ లైసెన్స్ మరియు త్రీ-ఫేజ్ విద్యుత్ అనుమతి వెంటనే పూర్తి చేయండి.';
      if (lang === 'bn') return 'নথিপত্র নিরীক্ষা: আধার ও প্যান যাচাই সম্পন্ন। উদ্যম নিবন্ধন, এফএসএসএআই লাইসেন্স ও বিদ্যুৎ সংযোগের কাজ দ্রুত সম্পন্ন করুন।';
      return 'Enterprise Profile Audit: Aadhaar and PAN verification complete. Pending items: Udyam Registration, FSSAI License, and Three-Phase Power Sanction. Complete these before DPR submission.';
    }

    // Market / Mandi / Prices
    if (q.includes('market') || q.includes('price') || q.includes('mandi') || q.includes('बाजार') || q.includes('मंडी') || q.includes('भाव')) {
      if (lang === 'mr') return 'स्थानिक कृषी उत्पन्न बाजार समिती (APMC) नुसार आजचा चना मोडल भाव ₹5,950/क्विंटल (किमान ₹5,650, कमाल ₹6,200) आहे. आवक 45.8 टन नोंदवली गेली आहे.';
      if (lang === 'hi') return 'स्थानीय एपीएमसी मंडी में चना का मॉडल भाव ₹5,950/क्विंटल (न्यूनतम ₹5,650, अधिकतम ₹6,200) दर्ज हुआ है। बाजार में मजबूत मांग बनी हुई है।';
      if (lang === 'ta') return 'உள்ளூர் ஒழுங்குமுறை விற்பனைக் கூடத்தில் கொண்டைக்கடலை மாதிரி விலை குவிண்டாலுக்கு ₹5,950 ஆக உள்ளது. சந்தை தேவை வலுவாக உள்ளது.';
      if (lang === 'te') return 'స్థానిక వ్యవసాయ మార్కెట్‌లో శనగ మోడల్ ధర క్వింటాలుకు ₹5,950 గా నమోదైంది. మార్కెట్ డిమాండ్ స్థిరంగా ఉంది.';
      if (lang === 'bn') return 'স্থানীয় এপিএমসি মান্ডিতে ছোলার মডেল মূল্য প্রতি কুইন্টাল ₹5,950 রেকর্ড করা হয়েছে। বাজারে চাহিদা ভালো।';
      return 'Local APMC Mandi daily arrival for Desi Chana is 45.8 Tonnes with modal price of ₹5,950/Quintal (min ₹5,650, max ₹6,200). Upward demand recorded.';
    }

    // General / Next Action
    if (lang === 'mr') return `आपल्या उद्योगाचे (${moduleName}) विश्लेषण पूर्ण झाले आहे. ग्राम-दिशा प्रणालीनुसार आपण बँक डीपीआर अहवाल डाऊनलोड करू शकता किंवा शासकीय अनुदानासाठी अर्ज करू शकता.`;
    if (lang === 'hi') return `आपके उद्यम (${moduleName}) का विश्लेषण पूर्ण हो गया है। ग्राम-दिशा प्रणाली के अनुसार आप बैंक डीपीआर तैयार कर सकते हैं या योजना सब्सिडी की जांच कर सकते हैं।`;
    if (lang === 'ta') return `உங்கள் தொழில் (${moduleName}) ஆய்வு நிறைவுற்றது. வங்கி டிபிஆர் அறிக்கை தயாரிக்கலாம் அல்லது அரசு மானியத்திற்கு விண்ணப்பிக்கலாம்.`;
    if (lang === 'te') return `మీ వ్యాపార (${moduleName}) విశ్లేషణ పూర్తయింది. బ్యాంక్ డీపీఆర్ నివేదికను రూపొందించవచ్చు లేదా సబ్సిడీ కోసం దరఖాస్తు చేసుకోవచ్చు.`;
    if (lang === 'bn') return `আপনার উদ্যোগের (${moduleName}) বিশ্লেষণ সম্পন্ন হয়েছে। আপনি ব্যাংক ডিপিআর তৈরি করতে পারেন অথবা সরকারি অনুদানের জন্য আবেদন করতে পারেন।`;
    if (lang === 'gu') return `આપના ઉદ્યોગ (${moduleName}) નું વિશ્લેષણ પૂર્ણ થયું છે. આપ બેંક ડીપીઆર બનાવી શકો છો અથવા સરકારી સબસિડી માટે અરજી કરી શકો છો.`;
    if (lang === 'kn') return `ನಿಮ್ಮ ಉದ್ಯಮದ (${moduleName}) ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ. ನೀವು ಬ್ಯಾಂಕ್ ಡಿಪಿಆರ್ ಸಿದ್ಧಪಡಿಸಬಹುದು ಅಥವಾ ಸಬ್ಸಿಡಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು.`;
    if (lang === 'pa') return `ਤੁਹਾਡੇ ਉੱਦਮ (${moduleName}) ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਪੂਰਾ ਹੋ ਗਿਆ ਹੈ। ਤੁਸੀਂ ਬੈਂਕ ਡੀਪੀਆਰ ਰਿਪੋਰਟ ਤਿਆਰ ਕਰ ਸਕਦੇ ਹੋ।`;
    if (lang === 'ml') return `നിങ്ങളുടെ സംരംഭത്തിന്റെ (${moduleName}) വിശകലനം പൂർത്തിയായി. നിങ്ങൾക്ക് ബാങ്ക് ഡിപിആർ തയ്യാറാക്കാവുന്നതാണ്.`;
    if (lang === 'ur') return `آپ کے کاروبار (${moduleName}) کا جائزہ مکمل ہو گیا۔ آپ بینک ڈی پی آر رپورٹ تیار کر سکتے ہیں۔`;
    return `I have analyzed your request for active enterprise module (${moduleName}). You can proceed to generate your bankable DPR or verify your subsidy eligibility.`;
  };

  const sendChatMessage = async (userText: string, customLang?: SupportedLanguageCode): Promise<string | undefined> => {
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

    const activeLanguage = customLang || (localStorage.getItem('gram_disha_lang') as SupportedLanguageCode) || dishaState.voiceLanguage || 'en';

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
          language: activeLanguage,
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
          return replyText;
        }
      }
    } catch (err) {
      console.warn('Backend /disha/chat call failed, using local reasoning fallback:', err);
    }

    // Localized deterministic response generator fallback based on query intent & language
    const replyText = getLocalizedDishaFallback(userText, activeLanguage, dishaState.currentModule);
    const source = 'GRAM-DISHA Localized Deterministic Knowledge Base';
    const actions = [
      { label: 'View Bank DPR', actionCode: 'NAV_REPORTS' },
      { label: 'Check Mandi Prices', actionCode: 'NAV_MARKET_INSIGHTS' }
    ];

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
    return replyText;
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
