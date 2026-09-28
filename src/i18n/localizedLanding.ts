/**
 * @license
 * GRAM-DISHA — Comprehensive 23-Language Landing Page Content Provider
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Supports: English (en) + 22 Eighth Schedule Indian Languages:
 * as, bn, brx, doi, gu, hi, kn, ks, kok, mai, ml, mni, mr, ne, od, pa, sa, sat, sd, ta, te, ur
 */

import { SupportedLanguageCode } from '../types';
import { LANDING_DATA as BASE_DATA } from '../pages/Landing/data/landingContent';

type LandingDataType = typeof BASE_DATA;

// Core localized section packs
interface LocalizedPack {
  brandTagline: string;
  brandSubtitle: string;
  nav: {
    howItWorks: string;
    features: string;
    dishaOs: string;
    feasibility: string;
    schemes: string;
    about: string;
    primaryCta: string;
    secondaryCta: string;
  };
  hero: {
    eyebrow: string;
    headlinePart1: string;
    headlinePart2: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    demoBadge: string;
    dishaGreeting: string;
    dishaContext: string;
    insights: {
      rawMaterial: { title: string; status: string; detail: string; source: string };
      capital: { title: string; status: string; detail: string; source: string };
      schemes: { title: string; status: string; detail: string; source: string };
      nextStep: { title: string; status: string; detail: string; source: string };
    };
  };
  dishaIntro: {
    badge: string;
    headline: string;
    subhead: string;
    pillars: Array<{ phase: string; title: string; description: string }>;
  };
  problem: {
    eyebrow: string;
    headline: string;
    description: string;
    cards: Array<{ question: string; issue: string; description: string }>;
  };
  solution: {
    eyebrow: string;
    headline: string;
    description: string;
    fragmented: string[];
    connected: string[];
  };
  howItWorks: {
    eyebrow: string;
    headline: string;
    description: string;
    steps: Array<{ stepNumber: string; title: string; category: string; description: string; actionSummary: string; keyOutputs: string[] }>;
  };
  marketIntelligence: {
    eyebrow: string;
    headline: string;
    description: string;
    features: Array<{ title: string; desc: string }>;
    signals: Array<{ label: string; value: string; source: string; confidence: string }>;
  };
  feasibility: {
    eyebrow: string;
    headline: string;
    description: string;
    equation: string;
    disclaimer: string;
  };
  financialStructuring: {
    eyebrow: string;
    headline: string;
    description: string;
    cards: Array<{ title: string; value: string; detail: string }>;
    note: string;
  };
  schemeMatcher: {
    eyebrow: string;
    headline: string;
    description: string;
    statusLabels: { eligible: string; notEligible: string; unknown: string };
  };
  dishaOS: {
    eyebrow: string;
    headline: string;
    description: string;
    workflowTitles: Array<{ location: string; trigger: string; dishaAction: string }>;
  };
  businessJourney: {
    eyebrow: string;
    headline: string;
    description: string;
    stages: Array<{ step: string; name: string; desc: string }>;
  };
  whoItHelps: {
    eyebrow: string;
    headline: string;
    description: string;
    cohorts: Array<{ title: string; persona: string; situation: string; benefit: string; tag: string }>;
  };
  trustEvidence: {
    eyebrow: string;
    headline: string;
    description: string;
    steps: Array<{ step: string; desc: string }>;
    unknownBadge: string;
    unknownTitle: string;
    unknownBody: string;
  };
  capabilities: {
    eyebrow: string;
    headline: string;
    description: string;
  };
  finalCta: {
    eyebrow: string;
    headline: string;
    subhead: string;
    primaryCta: string;
    secondaryCta: string;
    guaranteeNote: string;
  };
  footer: {
    about: string;
    disclaimer: string;
    copyright: string;
    platformTitle: string;
    osTitle: string;
    resourcesTitle: string;
    legalTitle: string;
  };
}

export const LOCALIZED_PACKS: Partial<Record<SupportedLanguageCode, LocalizedPack>> = {
  hi: {
    brandTagline: 'ग्रामीण एवं अर्ध-शहरी भारत हेतु बौद्धिक व्यावसायिक मार्गदर्शन',
    brandSubtitle: 'तथ्य-आधारित निर्णय समर्थन एवं निश्चित वित्तीय संरचना प्रणाली',
    nav: {
      howItWorks: 'कार्यप्रणाली',
      features: 'विशेषताएं',
      dishaOs: 'दिशा एआई ओएस',
      feasibility: 'व्यवहार्यता व वित्त',
      schemes: 'सरकारी योजनाएं',
      about: 'हमारे बारे में',
      primaryCta: 'प्रारंभ करें',
      secondaryCta: 'साइन-इन',
    },
    hero: {
      eyebrow: 'ग्रामीण भारत हेतु एआई-संवर्धित व्यावसायिक दिशा-निर्देश',
      headlinePart1: 'सही दिशा के साथ, ',
      headlinePart2: 'सही व्यवसाय का निर्माण।',
      description: 'ग्राम-दिशा स्थानीय बाजार संकेतों, वित्तीय गणितीय मॉडलिंग और सरकारी योजनाओं के नियम-आधारित मिलान को एक साथ जोड़कर ग्रामीण उद्यमियों को सशक्त बनाती है।',
      primaryCta: 'व्यावसायिक यात्रा शुरू करें',
      secondaryCta: 'कार्यप्रणाली देखें',
      demoBadge: 'लाइव प्रदर्शन संकल्पना',
      dishaGreeting: 'नमस्ते। मैंने आपके स्थानीय व्यावसायिक संदर्भ का विश्लेषण किया है।',
      dishaContext: 'अर्ध-शहरी कृषि प्रसंस्करण इकाई (मिनी दाल मिल) • यवतमाल, महाराष्ट्र',
      insights: {
        rawMaterial: { title: 'कच्चे माल की उपलब्धता', status: 'अनुकूल', detail: '10 किमी एपीएमसी मंडी दायरे में उच्च दलहन उत्पादन।', source: 'AGMARKNET दैनिक रिकॉर्ड' },
        capital: { title: 'पूंजी आवश्यकता', status: '₹8.50 लाख (मध्यम)', detail: 'मशीनरी ₹4.5L, निर्माण ₹1.8L, कार्यशील पूंजी ₹2.2L।', source: 'बैंक मानक' },
        schemes: { title: 'संभावित योजनाएं', status: '2 उपयुक्त', detail: 'PMEGP (35% ग्रामीण सब्सिडी) व PMFME ODOP अनुदान मिलान।', source: 'KVIC / MoFPI नियमावली' },
        nextStep: { title: 'अनुशंसित अगला कदम', status: 'व्यवहार्यता विश्लेषण', detail: 'HBFS स्कोर बैंक-स्वीकार्य स्तर पर है; इकाई अर्थशास्त्र जांचें।', source: 'दिशा इंजन' }
      }
    },
    dishaIntro: {
      badge: 'दिशा से मिलिए',
      headline: 'दिशा — आपके व्यावसायिक सफर के पीछे की बुद्धिमत्ता प्रणाली।',
      subhead: 'दिशा एक शांत, विचारशील समन्वय प्रणाली है जो अस्पष्टता को दूर करती है, बिना किसी काल्पनिक या मनगढ़ंत उत्तर के।',
      pillars: [
        { phase: '01. संदर्भ', title: 'आपके क्षेत्र में क्या महत्वपूर्ण है', description: 'आपकी स्थानीय भौगोलिक स्थिति, उपलब्ध संसाधन एवं व्यावहारिक सीमाओं को समझती है।' },
        { phase: '02. विश्लेषण', title: 'कौन सा डेटा अनुपलब्ध है', description: 'अनुमान लगाने के बजाय डेटा अंतराल को स्पष्ट रूप से चिन्हित करती है।' },
        { phase: '03. साक्ष्य', title: 'आंकड़े क्या कहते हैं', description: 'सत्यापित मंडी दरों, जनसांख्यिकीय उपभोग और आधिकारिक सरकारी मानकों की तुलना करती है।' },
        { phase: '04. निर्णय', title: 'कौन सा मॉडल अनुकूल है', description: 'व्यावहारिक ब्रेक-इवन और ऋण-भुगतान क्षमता का पारदर्शी गणितीय मूल्यांकन करती है।' },
        { phase: '05. कार्रवाई', title: 'आगे क्या कदम उठाने हैं', description: 'बैंक आवेदन, वैधानिक पंजीकरण और शुभारंभ के लिए चरणबद्ध मार्गदर्शन बनाती है।' }
      ]
    },
    problem: {
      eyebrow: 'विखंडित वर्तमान व्यवस्था',
      headline: 'ग्रामीण व्यवसाय शुरू करने में छह अलग-अलग बाधाओं का सामना करना पड़ता है।',
      description: 'उद्यमी बिखरी हुई सूचनाओं, जटिल सरकारी पोर्टलों और अनौपचारिक सलाह के कारण अनिश्चितता में फंस जाते हैं।',
      cards: [
        { question: '“क्या स्थानीय मांग पर्याप्त है?”', issue: 'बाजार की अस्पष्टता', description: 'खपत की मात्रा या मंडी कीमतों के उतार-चढ़ाव जाने बिना इकाई शुरू करना।' },
        { question: '“वास्तव में कुल लागत कितनी होगी?”', issue: 'छिपी पूंजीगत लागत', description: 'कार्यशील पूंजी, 3-फेज बिजली कनेक्शन और वैधानिक शुल्क की अनदेखी।' },
        { question: '“वित्तपोषण कैसे प्राप्त करें?”', issue: 'ऋण में बाधाएं', description: 'स्पष्ट डीएससीआर और बैंक योग्य वित्तीय आंकड़ों के अभाव में उच्च ब्याज पर ऋण लेना।' },
        { question: '“कौन सी योजना मेरे लिए सही है?”', issue: 'योजनाओं का भ्रम', description: 'दर्जनों योजनाओं के जटिल दिशा-निर्देशों में पात्रता समझना कठिन होना।' },
        { question: '“किन दस्तावेजों की आवश्यकता है?”', issue: 'दस्तावेजी विलंब', description: 'उद्योग केंद्र (DIC) और बैंक शाखाओं के बार-बार चक्कर लगाना।' },
        { question: '“आगे क्या कदम उठाना है?”', issue: 'क्रियान्वयन में ठहराव', description: 'बाजार सत्यापन से लेकर बैंक ऋण तक संरचित रोडमैप की कमी।' }
      ]
    },
    solution: {
      eyebrow: 'ग्राम-दिशा समाधान',
      headline: 'अलग-थलग रुकावटों को एक एकीकृत व्यावसायिक यात्रा में बदलना।',
      description: 'ग्राम-दिशा बाजार विश्लेषण, गणितीय व्यवहार्यता, वित्तीय मॉडलिंग और नियमों को एक प्रणाली में लाती है।',
      fragmented: ['अस्पष्ट विचार', 'अपुष्ट बाजार', 'असंरचित ऋण', 'अनदेखी योजनाएं', 'अधूरे दस्तावेज', 'अस्वीकृत आवेदन'],
      connected: ['संदर्भ व सत्यापन', '5-10 किमी बाजार संकेत', 'निश्चित नकदी प्रवाह', 'योजना मिलान', 'स्वचालित डॉसियर', 'सफल क्रियान्वयन']
    },
    howItWorks: {
      eyebrow: 'छह संरचित चरण',
      headline: 'ग्राम-दिशा किस प्रकार आपकी महत्वाकांक्षा को सफल उद्यम में बदलती है।',
      description: 'व्यक्तिगत पृष्ठभूमि से लेकर वाणिज्यिक शुभारंभ तक एक प्रमाणित एवं गणितीय कार्यप्रणाली।',
      steps: [
        { stepNumber: '01', title: 'आपको समझना', category: 'बुनियाद', description: 'उद्यमी प्रोफाइल, अनुभव, भूमि/शेड और पूंजी क्षमता का मानचित्रण।', actionSummary: 'लक्षित कोटा और पूंजी संरचना हेतु बुनियादी मानक दर्ज करता है।', keyOutputs: ['जनसांख्यिकीय कोटा', 'स्वयं की पूंजी', 'संसाधन प्रोफाइल'] },
        { stepNumber: '02', title: 'स्थानीय बाजार विश्लेषण', category: 'बाजार संकेत', description: '5-10 किमी के दायरे में मंडी रिकॉर्ड, आबादी और मांग का विश्लेषण।', actionSummary: 'आपूर्ति आधिक्य और स्थानीय मूल्य संवर्धन के अवसर पहचानता है।', keyOutputs: ['5-10 किमी त्रिज्या', 'कच्चा माल सूचकांक', 'खुदरा मांग घनत्व'] },
        { stepNumber: '03', title: 'व्यवहार्यता का मूल्यांकन', category: 'व्यवहार्यता', description: 'मांग, अवसंरचना और जोखिमों को तौलते हुए 8-पैरामीटर HBFS स्कोर की गणना।', actionSummary: 'स्पष्ट अनिश्चितता कटौती के साथ ऑडिट-सत्यापित स्कोर बनाता है।', keyOutputs: ['HBFS स्कोर (0.00-1.00)', 'SWOT विश्लेषण', 'व्यवहार्यता दृष्टिकोण'] },
        { stepNumber: '04', title: 'वित्तीय संरचना', category: 'वित्त', description: 'परियोजना लागत, कार्यशील पूंजी, मासिक ईएमआई और ऋण-सेवा अनुपात की गणना।', actionSummary: 'बिना किसी काल्पनिक आंकड़े के बैंक-मानक फॉर्मूला-बद्ध वित्तीय पत्रक।', keyOutputs: ['परियोजना लागत', 'मासिक ईएमआई व ब्रेक-इवन', '12-माह नकदी प्रवाह'] },
        { stepNumber: '05', title: 'योजनाओं की खोज', category: 'योजनाएं', description: 'PMEGP, PMFME, MUDRA, स्टैंड-अप इंडिया के आधिकारिक नियमों से मिलान।', actionSummary: 'पात्र, अपात्र अथवा अधूरी जानकारी वाली योजनाओं का सटीक वर्गीकरण।', keyOutputs: ['पूंजीगत सब्सिडी गणना', 'दस्तावेज़ चेकलिस्ट', 'नोडल प्राधिकरण रूटिंग'] },
        { stepNumber: '06', title: 'कार्रवाई व क्रियान्वयन', category: 'क्रियान्वयन', description: 'शुभारंभ रोडमैप, दस्तावेज वॉल्ट और बैंक-योग्य आवेदन डॉसियर तैयार करना।', actionSummary: 'बैंक शाखा बैठक और सरकारी मंजूरी के लिए उद्यमी को तैयार करता है।', keyOutputs: ['बैंक डॉसियर', 'सत्यापन चेकलिस्ट', 'साप्ताहिक मील के पत्थर'] }
      ]
    },
    marketIntelligence: {
      eyebrow: 'अति-स्थानीय अवसर क्षेत्र',
      headline: 'व्यावसायिक निर्णय आपकी स्थानीय ज़मीनी हकीकत से शुरू होने चाहिए।',
      description: 'राष्ट्रीय औसत ग्रामीण सूक्ष्म-बाजारों को नहीं दर्शाते। ग्राम-दिशा आपकी ग्राम पंचायत के 5-10 किमी दायरे का विश्लेषण करती है।',
      features: [
        { title: '5-10 किमी विश्लेषणात्मक दायरा', desc: 'दैनिक आवागमन और माल ढुलाई के व्यावहारिक दायरे पर केंद्रित।' },
        { title: 'सत्यापित मंडी मूल्य मानक', desc: 'सटीक लागत हेतु पंजीकृत एपीएमसी मंडियों से दैनिक मॉडल दरें।' },
        { title: 'बिजली व अवसंरचना सत्यापन', desc: '3-फेज फीडर उपलब्धता, पक्की सड़क और निकटतम रेलवे स्टेशन दूरी।' },
        { title: 'पारदर्शी डेटा स्रोत व विंटेज', desc: 'प्रत्येक सूचक का स्रोत विभाग और तिथि स्पष्ट रूप से प्रदर्शित।' }
      ],
      signals: [
        { label: 'चना खरीद मॉडल दर', value: '₹5,820 / क्विंटल', source: 'AGMARKNET • पुसद एपीएमसी', confidence: '0.98' },
        { label: 'साप्ताहिक हाट उपभोग', value: '3.4 टन / सप्ताह', source: 'ग्राम पंचायत जनगणना', confidence: '0.91' },
        { label: '3-फेज वाणिज्यिक बिजली', value: '18.4 घंटे / दिन', source: 'डिस्कॉम फीडर बुलेटिन', confidence: '0.95' },
        { label: 'सड़क परिवहन सुगमता', value: 'उत्कृष्ट (PMGSY डामर)', source: 'NRIDA कनेक्टिविटी', confidence: '0.94' }
      ]
    },
    feasibility: {
      eyebrow: 'गणितीय निर्णय समर्थन',
      headline: 'स्पष्ट जोखिम और अनिश्चितता कटौती के साथ पारदर्शी व्यवहार्यता स्कोर।',
      description: 'HBFS इंजन 8-पैरामीटर समीकरण का उपयोग करता है। यह स्थानीय मांग और बुनियादी ढांचे को पुरस्कृत करता है और अनिश्चित डेटा के लिए अंक काटता है।',
      equation: 'HBFS = 0.25·D + 0.15·A + 0.10·I + 0.10·S + 0.10·Sc − 0.05·C − 0.15·Cap − 0.20·U',
      disclaimer: 'HBFS आधिकारिक मानकों पर आधारित साक्ष्य-सम्मत निर्णय समर्थन स्कोर है। यह योजना का आत्मविश्वास दर्शाता है, वाणिज्यिक गारंटी नहीं।'
    },
    financialStructuring: {
      eyebrow: 'निश्चित वित्तीय इंजन',
      headline: 'शुद्ध गणित से गणना किया गया बैंक-योग्य इकाई अर्थशास्त्र।',
      description: 'वित्तीय अनुमान पारदर्शी और बैंक ऋण अधिकारियों द्वारा ऑडिट योग्य होने चाहिए। ग्राम-दिशा सटीक ईएमआई और ब्रेक-इवन की गणना करती है।',
      cards: [
        { title: 'परियोजना कुल लागत', value: '₹8,50,000', detail: 'संयंत्र व मशीनरी, शेड निर्माण, कार्यशील पूंजी' },
        { title: 'प्रमोटर अंशदान (मार्जिन)', value: '₹1,25,000 (14.7%)', detail: 'PMEGP विशेष श्रेणी मानक (5-10%) के पूर्णतः अनुरूप' },
        { title: 'आवश्यक मियादी ऋण', value: '₹6,16,250', detail: '9.25% ब्याज दर पर 60 माह की अवधि हेतु' },
        { title: 'अनुमानित मासिक ईएमआई', value: '₹12,870 / माह', detail: 'मानक वार्षिकी सूत्र द्वारा 6 माह अधिस्थगन सहित' },
        { title: 'मासिक ब्रेक-इवन बिंदु', value: '3,450 इकाइयां (42% क्षमता)', detail: 'स्थिर लागत ÷ प्रति इकाई अंशदान मार्जिन' },
        { title: 'अनुमानित डीएससीआर (DSCR)', value: '1.82x (बैंक-योग्य)', detail: 'शुद्ध परिचालन आय ÷ वार्षिक ऋण सेवा (मानक > 1.5x)' }
      ],
      note: 'सभी वित्तीय आंकड़े बैंकिंग एल्गोरिदम द्वारा उत्पन्न किए गए हैं और केवल योजना व मूल्यांकन हेतु प्रस्तुत हैं।'
    },
    schemeMatcher: {
      eyebrow: 'सत्यापित योजना मूल्यांकन',
      headline: 'आधिकारिक राजपत्र रजिस्टरों से नियम-आधारित पात्रता मिलान।',
      description: 'हम योजनाओं का मूल्यांकन सीधे सरकारी नियमों के आधार पर करते हैं। ग्राम-दिशा कभी झूठे वादे नहीं करती, सटीक योग्यता व दस्तावेज बताती है।',
      statusLabels: { eligible: 'संभावित रूप से पात्र', notEligible: 'अपात्र', unknown: 'अधूरी जानकारी' }
    },
    dishaOS: {
      eyebrow: 'दिशा एआई समन्वय प्रणाली',
      headline: 'दिशा प्रत्येक मॉड्यूल में आपकी व्यावसायिक सह-पायलट के रूप में कार्य करती है।',
      description: 'दिशा कोई साधारण चैटबॉट नहीं है। यह पूरी प्रणाली के पीछे रहकर विनियामक जोखिमों को उजागर करती है और व्यावहारिक कदम सुझाती है।',
      workflowTitles: [
        { location: 'डैशबोर्ड', trigger: 'ग्रामीण महिला उद्यमी प्रोफाइल अद्यतन', dishaAction: 'PMEGP के 35% सब्सिडी स्तर की पात्रता पहचानती है।' },
        { location: 'बाजार अंतर्दृष्टि', trigger: 'स्थानीय दलहन उत्पादन खपत से अधिक होना', dishaAction: 'मिनी दाल मिलिंग में मूल्य संवर्धन के अवसर सुझाती है।' },
        { location: 'वित्तीय संरचना', trigger: 'कार्यशील पूंजी मार्जिन 60 दिन से कम होना', dishaAction: 'मौसमी कृषि चक्र समझाते हुए नकदी रिज़र्व बढ़ाने की सलाह देती है।' },
        { location: 'योजना मिलान', trigger: 'PMFME एक जिला एक उत्पाद (ODOP) चयन', dishaAction: 'अधिसूचित सूची जांचती है और आवश्यक FSSAI चेकलिस्ट बनाती है।' },
        { location: 'बैंक डॉसियर', trigger: 'शाखा प्रबंधक हेतु ऋण फाइल तैयार करना', dishaAction: 'डीएससीआर ऑडिट ट्रेल और प्रिंट-योग्य सारांश संकलित करती है।' }
      ]
    },
    businessJourney: {
      eyebrow: 'प्रमाणित कार्यप्रवाह',
      headline: 'ग्रामीण उद्यमी का संपूर्ण 10-चरणीय सफर',
      description: 'आरंभिक विचार से लेकर सफल विस्तार तक, ग्राम-दिशा प्रत्येक मील के पत्थर पर मार्गदर्शन करती है।',
      stages: [
        { step: '01', name: 'समझें', desc: 'व्यक्तिगत संदर्भ, संसाधन व स्थानीय भूगोल का मानचित्रण' },
        { step: '02', name: 'खोजें', desc: '5-10 किमी दायरे में व्यावहारिक ग्रामीण व्यापारिक विचार' },
        { step: '03', name: 'मूल्यांकन', desc: 'HBFS व्यवहार्यता स्कोर व स्थानीय मांग सूचकांक' },
        { step: '04', name: 'सत्यापन', desc: 'मंडी भाव, सड़क मार्ग व विद्युत फीडर की जांच' },
        { step: '05', name: 'वित्तपोषण', desc: 'परियोजना लागत, स्वयं की पूंजी व निश्चित ईएमआई' },
        { step: '06', name: 'योजना मिलान', desc: 'केंद्रीय व राज्य स्तरीय सरकारी सब्सिडी की छंटनी' },
        { step: '07', name: 'आवेदन', desc: 'बैंक-योग्य दस्तावेज व सरकारी पोर्टल फॉर्म' },
        { step: '08', name: 'निगरानी', desc: 'उद्योग केंद्र (DIC) व बैंक स्वीकृति की स्थिति' },
        { step: '09', name: 'संचालन', desc: 'स्टॉक नियंत्रण व दैनिक बिक्री बहीखाता' },
        { step: '10', name: 'विस्तार', desc: 'क्षेत्रीय बाजार विस्तार व FSSAI प्रमाणन' }
      ]
    },
    whoItHelps: {
      eyebrow: 'ग्रामीण वास्तविकताओं के लिए निर्मित',
      headline: 'विशेष रूप से ग्रामीण एवं अर्ध-शहरी उद्यमियों के लिए तैयार।',
      description: 'ग्राम-दिशा स्थानीय व्यापार, कृषि मूल्य श्रृंखला और सूक्ष्म-उद्यमों की अनूठी चुनौतियों का समाधान करती है।',
      cohorts: [
        { title: 'प्रथम-बार के आकांक्षी उद्यमी', persona: 'ग्रामीण युवा एवं स्नातक', situation: 'उत्साह है परंतु औपचारिक योजना, वित्तीय ज्ञान व बैंक संपर्क का अभाव।', benefit: 'विचार मूल्यांकन से लेकर बैंक प्रस्ताव तैयार करने तक कदम-दर-कदम मार्गदर्शन।', tag: 'नए उद्यम' },
        { title: 'मौजूदा सूक्ष्म-व्यापारी', persona: 'किराना संचालक, आटा चक्की मालिक', situation: 'बिना संरचित नकदी प्रवाह पूर्वानुमान के अनौपचारिक रूप से कार्यरत।', benefit: 'उद्यम व FSSAI पंजीकरण तथा मुद्रा ऋण प्राप्त करने में पूर्ण सहायता।', tag: 'औपचारिकता' },
        { title: 'महिला एवं स्वयं सहायता समूह (SHG)', persona: 'महिला गृह उद्योग व संघ', situation: 'कृषि उपज के सामूहिक मूल्य संवर्धन एवं अधिकतम सरकारी सब्सिडी की चाह।', benefit: 'PMEGP/PMFME की 35% ग्रांट व स्टैंड-अप इंडिया का विशेष मिलान।', tag: 'महिला उद्यम' },
        { title: 'कृषि प्रसंस्करण एवं मूल्य संवर्धक', persona: 'कटाई उपरांत प्रसंस्करण में आने वाले किसान', situation: 'फसल कटाई के समय कीमतों में गिरावट एवं कच्ची उपज का कम दाम।', benefit: 'मंडी मूल्य अंतर का विश्लेषण और मिनी प्रसंस्करण संयंत्र का अर्थशास्त्र।', tag: 'कृषि-व्यवसाय' },
        { title: 'अर्ध-शहरी सेवा प्रदाता', persona: 'कस्टम हायरिंग सेंटर, मरम्मत व लॉजिस्टिक्स', situation: 'उपकरण लीज लागत और स्थानीय मांग के ब्रेक-इवन की स्पष्टता की आवश्यकता।', benefit: 'सटीक कार्यशील पूंजी अनुमान और मशीनरी ऋण व्यवहार्यता स्कोर।', tag: 'ग्रामीण सेवाएं' },
        { title: 'विस्तारशील सूक्ष्म-इकाइयां', persona: 'पड़ोसी ब्लॉकों में विस्तार करने वाले उद्यमी', situation: 'द्वितीयक मंडियों, अतिरिक्त मशीनरी ऋण व कर्मचारियों की आवश्यकता का आकलन।', benefit: 'मल्टी-ब्लॉक अवसर मानचित्रण और CGTMSE संपार्श्विक-मुक्त गारंटी।', tag: 'विस्तार व वृद्धि' }
      ]
    },
    trustEvidence: {
      eyebrow: 'तथ्य-प्रथम संरचना',
      headline: 'प्रत्येक महत्वपूर्ण निर्णय का आधार स्पष्ट होना अनिवार्य है।',
      description: 'ग्राम-दिशा साक्ष्य-सम्मत सिद्धांतों पर आधारित है। हम कभी मनगढ़ंत आंकड़े नहीं दिखाते और डेटा न होने पर स्पष्ट रूप से “UNKNOWN” लिखते हैं।',
      steps: [
        { step: '1. आधिकारिक स्रोत', desc: 'प्रकाशित सरकारी रजिस्टरों (LGD, AGMARKNET, KVIC, RBI) का सीधा संदर्भ।' },
        { step: '2. डेटा अंतर्ग्रहण', desc: 'सरकारी तिथि और भौगोलिक स्तर को सुरक्षित रखते हुए डेटा संकलन।' },
        { step: '3. नियम सत्यापन', desc: 'वैधानिक सीमाओं के अनुरूप नियमों का कठोर सत्यापन।' },
        { step: '4. गणितीय विश्लेषण', desc: 'HBFS व्यवहार्यता, ईएमआई और ऋण सेवा हेतु ऑडिट-योग्य सूत्र।' },
        { step: '5. पारदर्शी व्याख्या', desc: 'मान्यताओं और आत्मविश्वास रेटिंग की सरल भाषा में स्पष्ट व्याख्या।' }
      ],
      unknownBadge: 'UNKNOWN सिद्धांत',
      unknownTitle: 'हम अनुमान लगाने के बजाय “UNKNOWN” लिखते हैं।',
      unknownBody: 'यदि स्थानीय मृदा उपयुक्तता या विशिष्ट मंडी मूल्य दर्ज नहीं हैं, तो ग्राम-दिशा उन्हें UNKNOWN चिन्हित कर व्यवहार्यता स्कोर से अंक काटती है और स्थानीय सत्यापन की सलाह देती है।'
    },
    capabilities: {
      eyebrow: 'व्यापक मंच क्षमताएं',
      headline: '15 सरकारी-अनुरोधित क्षमताएं + 3 बौद्धिक स्तर',
      description: 'ग्रामीण उद्यम स्थापना और अनुपालन के प्रत्येक पहलू को संबोधित करने के लिए तैयार संपूर्ण पारिस्थितिकी तंत्र।'
    },
    finalCta: {
      eyebrow: 'विश्वास के साथ शुरुआत करें',
      headline: 'आपकी व्यावसायिक यात्रा एक स्पष्ट दिशा के साथ शुरू होती है।',
      subhead: 'ग्राम-दिशा के साथ बैंक-स्वीकार्य और साक्ष्य-आधारित उद्यम स्थापित करने वाले हजारों उद्यमियों से जुड़ें।',
      primaryCta: 'ग्राम-दिशा के साथ शुरू करें',
      secondaryCta: 'कार्यप्रणाली समझें',
      guaranteeNote: 'ग्रामीण उद्यमियों हेतु निःशुल्क खुला मंच • साक्ष्य-आधारित डिज़ाइन'
    },
    footer: {
      about: 'ग्राम-दिशा भारत भर के ग्रामीण व अर्ध-शहरी उद्यमियों के लिए विकसित बौद्धिक व्यावसायिक मार्गदर्शन व वित्तीय संरचना मंच है।',
      disclaimer: 'ग्राम-दिशा निर्णय समर्थन उपकरण, वित्तीय गणनाएं व योजना पात्रता मूल्यांकन प्रदान करता है। यह वाणिज्यिक वित्तीय सलाह अथवा ऋण स्वीकृति की गारंटी नहीं देता।',
      copyright: '© 2026 ग्राम-दिशा। सर्वाधिकार सुरक्षित।',
      platformTitle: 'मंच',
      osTitle: 'बुद्धिमत्ता व ओएस',
      resourcesTitle: 'संसाधन व विश्वसनीयता',
      legalTitle: 'टीम व वैधानिक'
    }
  },

  ur: {
    brandTagline: 'دیہی اور نیم شہری بھارت کے لیے ذہین کاروباری رہنمائی',
    brandSubtitle: 'حقائق پر مبنی فیصلہ سازی اور قطعی مالیاتی ڈھانچہ',
    nav: {
      howItWorks: 'طریقہ کار',
      features: 'خصوصیات',
      dishaOs: 'دشا اے آئی او ایس',
      feasibility: 'امکانات اور مالیات',
      schemes: 'سرکاری اسکیمیں',
      about: 'ہمارے متعلق',
      primaryCta: 'شروع کریں',
      secondaryCta: 'سائن ان',
    },
    hero: {
      eyebrow: 'دیہی بھارت کے لیے اے آئی بااختیار کاروباری رہنمائی',
      headlinePart1: 'صحیح سمت کے ساتھ، ',
      headlinePart2: 'صحیح کاروبار کی شروعات۔',
      description: 'گرام دشا مقامی منڈی کے اشاروں، حتمی مالیاتی حسابات اور سرکاری اسکیموں کے مستند قوانین کو دیہی تاجروں کے لیے ایک ہم آہنگ سفر میں یکجا کرتی ہے۔',
      primaryCta: 'کاروباری سفر شروع کریں',
      secondaryCta: 'طریقہ کار جانیے',
      demoBadge: 'براہ راست ڈیمو تصور',
      dishaGreeting: 'السلام علیکم۔ میں نے آپ کے کاروباری ماحول کا تفصیلی جائزہ لیا ہے۔',
      dishaContext: 'نیم شہری ایگرو پروسیسنگ یونٹ (منی دال مل) • یوتمال، مہاراشٹر',
      insights: {
        rawMaterial: { title: 'خام مال کی دستیابی', status: 'بہترین', detail: '10 کلومیٹر اے پی ایم سی منڈی کے دائرے میں دالوں کی بھرپور پیداوار۔', source: 'AGMARKNET روزانہ فیڈ' },
        capital: { title: 'سرمایہ کی ضرورت', status: '₹8.50 لاکھ (معتدل)', detail: 'مشینری ₹4.5 لاکھ، تعمیر ₹1.8 لاکھ، ورکنگ کیپیٹل ₹2.2 لاکھ۔', source: 'بینکنگ ضوابط' },
        schemes: { title: 'موزوں اسکیمیں', status: '2 اسکیمیں دستیاب', detail: 'PMEGP (35% دیہی سبسڈی) اور PMFME گرانٹ کی شرائط پوری ہیں۔', source: 'KVIC / MoFPI قواعد' },
        nextStep: { title: 'اگلا تجویز کردہ قدم', status: 'امکانی جائزہ', detail: 'HBFS اسکور بینک کی منظوری کے لیے موزوں ہے۔ یونٹ کا تجزیہ کریں۔', source: 'دشا انجن' }
      }
    },
    dishaIntro: {
      badge: 'دشا سے ملیے',
      headline: 'دشا — آپ کے کاروباری سفر کی ذہین رہنمائی۔',
      subhead: 'دشا ایک پرسکون، ذہین آرکیسٹریشن لیئر ہے جو بغیر کسی تخمینہ یا غلط بیانی کے سخت شواہد کی بنیاد پر رہنمائی کرتی ہے۔',
      pillars: [
        { phase: '01. سیاق و سباق', title: 'آپ کے خطے کی ضرورت', description: 'آپ کے مقامی وسائل، جغرافیہ اور عملی رکاوٹوں کو سمجھتی ہے۔' },
        { phase: '02. تجزیہ', title: 'کون سی معلومات غائب ہیں', description: 'اندازہ لگانے کے بجائے نامکمل ڈیٹا کی واضح نشان دہی کرتی ہے۔' },
        { phase: '03. شواہد', title: 'اعداد و شمار کیا کہتے ہیں', description: 'تصدیق شدہ منڈی ریٹس اور سرکاری معیارات کا تقابل کرتی ہے۔' },
        { phase: '04. فیصلہ سازی', title: 'کون سا ماڈل بہترین ہے', description: 'کاروبار کی نفع بخشی اور قرض ادائیگی کی شفاف ریاضیاتی جانچ۔' },
        { phase: '05. عملی قدم', title: 'آگے کیا کرنا ہے', description: 'بینک درخواست اور رجسٹریشن کے لیے مرحلہ وار رہنمائی تیار کرتی ہے۔' }
      ]
    },
    problem: {
      eyebrow: 'موجودہ بکھری ہوئی صورتحال',
      headline: 'دیہی کاروبار شروع کرنے میں چھ الگ الگ رکاوٹوں کا سامنا کرنا پڑتا ہے۔',
      description: 'تاجروں کو سرکاری دفاتر، پیچیدہ پورٹلز اور غیر رسمی مشوروں کی وجہ سے شدید معلومات کی کمی کا سامنا ہے۔',
      cards: [
        { question: '“کیا مقامی طلب کافی ہے؟”', issue: 'مارکیٹ کی بے خبری', description: 'صارفین کی تعداد اور منڈی قیمتوں کی معلومات کے بغیر یونٹ لگانا۔' },
        { question: '“اصل لاگت کتنی ہوگی؟”', issue: 'پوشیدہ اخراجات', description: 'ابتدائی ورکنگ کیپیٹل اور تھری فیز بجلی کے اخراجات کا نظر انداز ہونا۔' },
        { question: '“مالی معاونت کیسے حاصل کریں؟”', issue: 'قرض کی دشواری', description: 'بینک کے معیارات کے بغیر مہنگے سود پر غیر رسمی قرض لینا۔' },
        { question: '“کون سی اسکیم میرے لیے ہے؟”', issue: 'اسکیموں میں الجھن', description: 'درجنوں سرکاری اسکیموں کی اہلیت کو سمجھنے میں دقت۔' },
        { question: '“کون سے کاغذات درکار ہیں؟”', issue: 'دستاویزات میں تاخیر', description: 'صنعتی مراکز (DIC) اور بینکوں کے بار بار چکر لگانا۔' },
        { question: '“اب آگے کیا کرنا ہے؟”', issue: 'عمل درآمد میں رکاوٹ', description: 'منڈی کی تصدیق سے لے کر بینک قرض تک ایک واضح روڈ میپ کا نہ ہونا۔' }
      ]
    },
    solution: {
      eyebrow: 'گرام دشا کا حل',
      headline: 'بکھری ہوئی رکاوٹوں کو ایک ہموار کاروباری سفر میں تبدیل کرنا۔',
      description: 'گرام دشا مارکیٹ انٹیلیجنس، فنانشل ماڈلنگ اور ریگولیٹری قواعد کو ایک پلیٹ فارم پر لاتی ہے۔',
      fragmented: ['غیر واضح خیال', 'غیر تصدیق شدہ منڈی', 'غیر منظم قرض', 'نظر انداز اسکیمیں', 'نامکمل دستاویزات', 'مسترد درخواست'],
      connected: ['تصدیق و سیاق', '5-10 کلومیٹر مارکیٹ ڈیٹا', 'حتمی کیش فلو', 'اسکیم میچنگ', 'خودکار ڈوزیئر', 'کامیاب آغاز']
    },
    howItWorks: {
      eyebrow: 'چھ منظم مراحل',
      headline: 'گرام دشا آپ کی خواہش کو ایک پائیدار کاروبار میں کیسے بدلتی ہے۔',
      description: 'ذاتی پروفائل سے لے کر تجارتی افتتاح تک، ریاضیاتی اور ثبوت پر مبنی طریقہ کار۔',
      steps: [
        { stepNumber: '01', title: 'آپ کو سمجھنا', category: 'بنیاد', description: 'ذاتی پروفائل، سرمایہ، زمین اور تجربے کا جائزہ۔', actionSummary: 'کوٹہ اور سرمائے کے بنیادی معیارات ریکارڈ کرتا ہے۔', keyOutputs: ['ڈیموگرافک کوٹہ', 'ذاتی سرمایہ', 'وسائل کی پروفائل'] },
        { stepNumber: '02', title: 'مقامی منڈی کا جائزہ', category: 'انٹیلیجنس', description: '5 تا 10 کلومیٹر کے دائرے میں منڈی ریکارڈ اور طلب کا تجزیہ۔', actionSummary: 'خام مال کی دستیابی اور نفع بخش مواقع کی شناخت۔', keyOutputs: ['5-10 کلومیٹر دائرہ', 'خام مال انڈیکس', 'مقامی طلب کا تناسب'] },
        { stepNumber: '03', title: 'کاروبار کا جائزہ', category: 'امکانات', description: 'طلب، انفراسٹرکچر اور خطرات کی بنیاد پر 8 پیرامیٹرز پر مبنی HBFS اسکور۔', actionSummary: 'شفاف کٹوتیوں کے ساتھ قابلِ آڈٹ امکانی اسکور بناتا ہے۔', keyOutputs: ['HBFS اسکور (0.00 تا 1.00)', 'SWOT تجزیہ', 'پائیداری کا تخمینہ'] },
        { stepNumber: '04', title: 'مالیاتی ڈھانچہ', category: 'فنانس', description: 'پروجیکٹ لاگت، ورکنگ کیپیٹل، ماہانہ قسط اور قرض ادائیگی کا تناسب۔', actionSummary: 'بینک کے فارمولوں پر مبنی قابلِ قبول مالیاتی تخمینہ۔', keyOutputs: ['پروجیکٹ لاگت', 'ماہانہ EMI و بریک ایون', '12 ماہ کا کیش فلو'] },
        { stepNumber: '05', title: 'اسکیموں کی تلاش', category: 'اسکیمیں', description: 'PMEGP, PMFME, MUDRA کے سرکاری قواعد سے تصدیق شدہ موازنہ۔', actionSummary: 'اہل، نااہل یا نامکمل معلومات کا درست زمرہ بناتا ہے۔', keyOutputs: ['سبسڈی کا حساب', 'دستاویزات کی لسٹ', 'مجاز ادارے کا انتخاب'] },
        { stepNumber: '06', title: 'عملی قدم اٹھائیں', category: 'نفاذ', description: 'کاروبار کے آغاز کا روڈ میپ اور بینک میں جمع کرانے کے لیے تیار فائل۔', actionSummary: 'بینک اور سرکاری منظوری کے لیے تاجر کو تیار کرتا ہے۔', keyOutputs: ['بینک ڈوزیئر', 'دستاویزاتی چیک لسٹ', 'ہفتہ وار سنگ میل'] }
      ]
    },
    marketIntelligence: {
      eyebrow: 'مقامی کاروباری میدان',
      headline: 'کاروباری فیصلے آپ کی زمینی حقیقت سے شروع ہونے چاہئیں۔',
      description: 'قومی اوسط دیہی منڈیوں کی عکاسی نہیں کرتی۔ گرام دشا آپ کی گرام پنچایت کے 5-10 کلومیٹر کے دائرے کا جائزہ لیتی ہے۔',
      features: [
        { title: '5-10 کلومیٹر کا تجزیاتی دائرہ', desc: 'دیہی علاقوں میں روزانہ مال برداری اور رسائی پر مرکوز۔' },
        { title: 'منڈی کے تصدیق شدہ نرخ', desc: 'حقیقی لاگت معلوم کرنے کے لیے منظور شدہ APMC منڈیوں کے روزانہ ریٹس۔' },
        { title: 'بجلی اور انفراسٹرکچر کی جانچ', desc: 'تھری فیز کمرشل بجلی، سڑک کی حالت اور قریبی ریلوے کی دوری۔' },
        { title: 'شفاف سرکاری ڈیٹا سورس', desc: 'ہر اشاریے کا سرکاری ماخذ اور تاریخ واضح طور پر موجود ہے۔' }
      ],
      signals: [
        { label: 'دیسی چنے کا ریٹ', value: '₹5,820 / کوئنٹل', source: 'AGMARKNET • پُسد APMC', confidence: '0.98' },
        { label: 'ہفتہ وار منڈی کھپت', value: '3.4 ٹن / ہفتہ', source: 'مقامی پنچایت مردم شماری', confidence: '0.91' },
        { label: 'کمرشل تھری فیز بجلی', value: '18.4 گھنٹے / روزانہ', source: 'ڈسکام فیڈر بلیٹن', confidence: '0.95' },
        { label: 'سڑک کنکٹیویٹی فیکٹر', value: 'بہترین (PMGSY سڑک)', source: 'NRIDA انڈیکس', confidence: '0.94' }
      ]
    },
    feasibility: {
      eyebrow: 'ریاضیاتی فیصلہ سازی',
      headline: 'خطرات اور غیر یقینی صورتحال کی کٹوتی کے ساتھ شفاف امکانی اسکور۔',
      description: 'HBFS انجن 8 پیرامیٹرز کی بنیاد پر حساب لگاتا ہے۔ یہ مقامی طلب کی بنیاد پر پوائنٹس دیتا ہے اور غائب ڈیٹا کے پوائنٹس کاٹتا ہے۔',
      equation: 'HBFS = 0.25·D + 0.15·A + 0.10·I + 0.10·S + 0.10·Sc − 0.05·C − 0.15·Cap − 0.20·U',
      disclaimer: 'HBFS سرکاری ڈیٹا کی بنیاد پر فیصلے میں مدد کا اسکور ہے۔ یہ منصوبہ بندی کا اعتما د ہے، تجارتی گارنٹی نہیں۔'
    },
    financialStructuring: {
      eyebrow: 'حتمی مالیاتی نظام',
      headline: 'خالص ریاضی کے ذریعے تیار کردہ بینک کے معیار کا مالیاتی خاکہ۔',
      description: 'مالیاتی اعداد و شمار شفاف اور بینک کے لیے قابلِ آڈٹ ہونے چاہئیں۔ گرام دشا درست EMI اور بریک ایون کا حساب لگاتی ہے۔',
      cards: [
        { title: 'پروجیکٹ کی مجموعی لاگت', value: '₹8,50,000', detail: 'مشینری، شیڈ تعمیر اور ابتدائی ورکنگ کیپیٹل' },
        { title: 'تاجر کا ذاتی حصہ (مارجن)', value: '₹1,25,000 (14.7%)', detail: 'PMEGP اسپیشل کیٹیگری کے 5-10% معیار کے عین مطابق' },
        { title: 'مطلوبہ بینک لون', value: '₹6,16,250', detail: '9.25% سالانہ شرح سود پر 60 ماہ کے لیے' },
        { title: 'تخمینہ ماہانہ قسط (EMI)', value: '₹12,870 / ماہ', detail: 'معیاری اینیوٹی فارمولے سے 6 ماہ کی رعایت کے ساتھ' },
        { title: 'ماہانہ بریک ایون پوائنٹ', value: '3,450 یونٹس (42% صلاحیت)', detail: 'مستقل اخراجات تقسیم فی یونٹ نفع' },
        { title: 'تخمینہ ڈی ایس سی آر (DSCR)', value: '1.82x (بینک کے لیے موزوں)', detail: 'خالص سالانہ آمدن تقسیم سالانہ قرض ادائیگی' }
      ],
      note: 'تمام مالیاتی اعداد و شمار بینکنگ الگورتھم سے تیار کیے گئے ہیں اور منصوبہ بندی کے مقصد کے لیے ہیں۔'
    },
    schemeMatcher: {
      eyebrow: 'مستند اسکیموں کا جائزہ',
      headline: 'سرکاری گزٹ کے قواعد سے اہلیت کا قطعی موازنہ۔',
      description: 'ہم اسکیموں کا جائزہ سرکاری قواعد کی بنیاد پر کرتے ہیں۔ گرام دشا کبھی غلط دعوے نہیں کرتی بلکہ درکار کاغذات بتاتی ہے۔',
      statusLabels: { eligible: 'ممکنہ طور پر اہل', notEligible: 'نااہل', unknown: 'نامکمل معلومات' }
    },
    dishaOS: {
      eyebrow: 'دشا اے آئی کوپائلٹ',
      headline: 'دشا پلیٹ فارم کے ہر ماڈیول میں آپ کی معاون کے طور پر کام کرتی ہے۔',
      description: 'دشا کوئی عام چیٹ بوٹ نہیں بلکہ مکمل نظام کے پس منظر میں ریگولیٹری خطرات پر نظر رکھتی ہے اور مفید اقدامات تجویز کرتی ہے۔',
      workflowTitles: [
        { location: 'ڈیش بورڈ', trigger: 'دیہی خاتون تاجر کی پروفائل اپڈیٹ', dishaAction: 'PMEGP کے تحت 35% سبسڈی کی اہلیت بتاتی ہے۔' },
        { location: 'مارکیٹ انٹیلیجنس', trigger: 'دالوں کی پیداوار کا مقامی کھپت سے زیادہ ہونا', dishaAction: 'منی دال مل لگا کر نفع کمانے کا مشورہ دیتی ہے۔' },
        { location: 'مالیاتی ڈھانچہ', trigger: 'ورکنگ کیپیٹل 60 دن سے کم مقرر ہونا', dishaAction: 'زرعی سیزن کی وجہ سے کیش ریزرو بڑھانے کی تجویز دیتی ہے۔' },
        { location: 'اسکیم میچر', trigger: 'PMFME ون ڈسٹرکٹ ون پروڈکٹ کا انتخاب', dishaAction: 'منظور شدہ لسٹ چیک کر کے درکار FSSAI دستاویزات بتاتی ہے۔' },
        { location: 'بینک ڈوزیئر', trigger: 'بینک مینیجر کے لیے فائل تیار کرنا', dishaAction: 'مکمل مالیاتی سمری اور پرنٹ کے لیے تیار ڈوزیئر بناتی ہے۔' }
      ]
    },
    businessJourney: {
      eyebrow: 'دستخطی ورک فلو',
      headline: 'دیہی تاجر کا 10 مرحلوں پر مشتمل مکمل سفر',
      description: 'ابتدائی سوچ سے لے کر تجارتی وسعت تک، گرام دشا ہر موڑ پر شواہد کی بنیاد پر رہنمائی کرتی ہے۔',
      stages: [
        { step: '01', name: 'سمجھیں', desc: 'ذاتی پس منظر، وسائل اور مقامی جغرافیہ' },
        { step: '02', name: 'دریافت', desc: '5-10 کلومیٹر کے دائرے میں منافع بخش دیہی کاروبار' },
        { step: '03', name: 'جانچیں', desc: 'HBFS فزیبلٹی اسکور اور مقامی طلب' },
        { step: '04', name: 'تصدیق', desc: 'منڈی ریٹس، سڑک اور بجلی کے فیڈر کی جانچ' },
        { step: '05', name: 'مالیات', desc: 'پروجیکٹ لاگت، ذاتی سرمایہ اور ماہانہ قسط' },
        { step: '06', name: 'اسکیمیں', desc: 'مرکزی اور ریاستی سرکاری سبسڈی کا انتخاب' },
        { step: '07', name: 'درخواست', desc: 'بینک کی فائل اور پورٹل کے فارم تیار کرنا' },
        { step: '08', name: 'ٹریکنگ', desc: 'صنعتی مرکز (DIC) اور بینک کی منظوری کا جائزہ' },
        { step: '09', name: 'انتظام', desc: 'سامان کا اسٹاک اور یومیہ فروخت کا رجسٹر' },
        { step: '10', name: 'ترقی', desc: 'علاقائی منڈی میں وسعت اور سرٹیفیکیشن' }
      ]
    },
    whoItHelps: {
      eyebrow: 'دیہی حقیقت کے عین مطابق',
      headline: 'خاص طور پر دیہی اور نیم شہری تاجروں کے لیے تیار کردہ۔',
      description: 'گرام دشا مقامی تجارت، زرعی ویلیو چین اور چھوٹے کاروباروں کی مخصوص رکاوٹوں کا حل پیش کرتی ہے۔',
      cohorts: [
        { title: 'نئے خواہشمند کاروباری افراد', persona: 'دیہی نوجوان اور فارغ التحصیل طلباء', situation: 'جذبہ موجود ہے لیکن بزنس پلان اور بینک رابطوں کی کمی ہے۔', benefit: 'کاروباری خاکے سے لے کر بینک کے لیے تیار فائل تک مرحلہ وار رہنمائی۔', tag: 'نئے کاروبار' },
        { title: 'موجودہ چھوٹے دکاندار', persona: 'کریانہ مالکان اور آٹا چکی والے', situation: 'بغیر کیش فلو تخمینے اور بینک قرض کے کاروبار چلا رہے ہیں۔', benefit: 'ادیم اور FSSAI رجسٹریشن کے ساتھ مدرا لون حاصل کرنے میں معاونت۔', tag: 'قواعد کے مطابق' },
        { title: 'خواتین اور سیلف ہیلپ گروپس', persona: 'خواتین کے کاروباری گروپس اور سوسائٹیاں', situation: 'زرعی پیداوار میں ویلیو ایڈیشن اور زیادہ سے زیادہ سبسڈی کی تلاش۔', benefit: 'PMEGP/PMFME کی 35% گرانٹ اور اسٹینڈ اپ انڈیا کی رہنمائی۔', tag: 'خواتین کے کاروبار' },
        { title: 'زرعی پروسیسنگ والے کسان', persona: 'فصل کی پروسیسنگ میں قدم رکھنے والے کسان', situation: 'فصل کے وقت قیمتوں میں کمی اور سستے داموں مال بکنے کی مجبوری۔', benefit: 'منڈی قیمتوں کے فرق سے نفع کمانا اور منی پروسیسنگ یونٹ لگانا۔', tag: 'زرعی کاروبار' },
        { title: 'نیم شہری سروس فراہم کنندگان', persona: 'زرعی آلات کے مراکز اور مرمتی ورکشاپس', situation: 'مشینری کے کرایہ اور منافع کی حد کے بارے میں وضاحت کی ضرورت۔', benefit: 'ورکنگ کیپیٹل کا درست حساب اور مشینری لون کے لیے فزیبلٹی رپورٹ۔', tag: 'دیہی سروسز' },
        { title: 'ترقی کی راہ پر گامزن چھوٹے یونٹس', persona: 'قریبی بلاکس میں کاروبار بڑھانے والے مالکان', situation: 'دوسری منڈیوں، اضافی مشینری اور عملے کی ضرورت کا جائزہ۔', benefit: 'نئی منڈیوں کا نقشہ اور بغیر ضمانت کے کریڈٹ گارنٹی لون۔', tag: 'وسعت اور ترقی' }
      ]
    },
    trustEvidence: {
      eyebrow: 'حقائق اولین ترجیح',
      headline: 'ہر اہم فیصلے کی بنیاد معلوم ہونا ضروری ہے۔',
      description: 'گرام دشا شواہد کی بنیاد پر کام کرتی ہے۔ ہم کبھی غلط یا من گھڑت ڈیٹا نہیں دکھاتے اور معلومات نہ ہونے پر واضح طور پر “UNKNOWN” کہتے ہیں۔',
      steps: [
        { step: '1. سرکاری ذرائع', desc: 'شائع شدہ سرکاری ریکارڈز (LGD, AGMARKNET, KVIC, RBI) کا براہِ راست حوالہ۔' },
        { step: '2. ڈیٹا کا اندراج', desc: 'سرکاری تاریخ اور جغرافیائی سطح کو برقرار رکھتے ہوئے اعداد و شمار کا اندراج۔' },
        { step: '3. قوانین کی تصدیق', desc: 'قواعد کی بنیاد پر اس بات کی جانچ کہ حسابات قانون کے مطابق ہیں۔' },
        { step: '4. ریاضیاتی تجزیہ', desc: 'HBFS فزیبلٹی، EMI اور قرض کی ادائیگی کے لیے قابلِ جانچ فارمولے۔' },
        { step: '5. شفاف وضاحت', desc: 'آسان الفاظ میں تمام شرائط اور اعتماد کی شرح کی وضاحت۔' }
      ],
      unknownBadge: 'UNKNOWN کا اصول',
      unknownTitle: 'ہم اندازہ لگانے کے بجائے “UNKNOWN” کہتے ہیں۔',
      unknownBody: 'اگر مقامی مٹی کی کیفیت یا منڈی کی قیمتیں درج نہیں ہیں، تو گرام دشا انہیں UNKNOWN قرار دے کر اسکور میں کٹوتی کرتی ہے اور مقامی طور پر جانچنے کی ہدایت دیتی ہے۔'
    },
    capabilities: {
      eyebrow: 'پلیٹ فارم کی جامع صلاحیتیں',
      headline: 'حکومت کی مطلوبہ 15 صلاحیتیں + 3 انٹیلیجنس لیئرز',
      description: 'دیہی کاروبار کے قیام اور قانونی لوازمات کو پورا کرنے کے لیے ایک مکمل اور مربوط نظام۔'
    },
    finalCta: {
      eyebrow: 'پورے اعتماد سے آغاز کریں',
      headline: 'آپ کے کاروبار کا سفر ایک واضح سمت سے شروع ہوتا ہے۔',
      subhead: 'گرام دشا کے ذریعے بینک کے لیے تیار اور بااعتماد کاروبار شروع کرنے والے ہزاروں دیہی تاجروں میں شامل ہوں۔',
      primaryCta: 'گرام دشا کے ساتھ شروع کریں',
      secondaryCta: 'طریقہ کار سمجھیے',
      guaranteeNote: 'دیہی تاجروں کے لیے مفت کھلا پلیٹ فارم'
    },
    footer: {
      about: 'گرام دشا ایک ذہین، شواہد پر مبنی کاروباری رہنمائی اور مالیاتی ڈھانچہ پلیٹ فارم ہے جسے بھارت کے دیہی تاجروں کے لیے تیار کیا گیا ہے۔',
      disclaimer: 'گرام دشا فیصلہ سازی کے ٹولز، مالیاتی حسابات اور سرکاری اسکیموں کے جائزے پیش کرتی ہے۔ یہ کوئی تجارتی فنانشل مشورہ یا قرض کی گارنٹی نہیں دیتی۔',
      copyright: '© 2026 گرام دشا ۔ جملہ حقوق محفوظ ہیں۔',
      platformTitle: 'پلیٹ فارم',
      osTitle: 'انٹیلیجنس اور او ایس',
      resourcesTitle: 'وسائل اور شفافیت',
      legalTitle: 'ٹیم اور قانونی'
    }
  }
};

/**
 * Returns a fully localized version of LANDING_DATA for the selected language.
 * If a localized pack is defined, it deep-merges the translations onto the base dataset.
 */
export function getLocalizedLandingData(lang: SupportedLanguageCode): LandingDataType {
  const pack = LOCALIZED_PACKS[lang];
  if (!pack) {
    // For languages that haven't customized every paragraph, generate contextual Indic/RTL translations
    return getFallbackLocalizedData(lang);
  }

  // Deep clone and replace with localized pack
  const res: LandingDataType = JSON.parse(JSON.stringify(BASE_DATA));

  // Brand
  res.brand.tagline = pack.brandTagline;
  res.brand.subtitle = pack.brandSubtitle;

  // Nav
  res.navigation.links = [
    { label: pack.nav.howItWorks, href: '#how-it-works', sectionId: 'how-it-works' },
    { label: pack.nav.features, href: '#features', sectionId: 'features' },
    { label: pack.nav.dishaOs, href: '#disha-os', sectionId: 'disha-os' },
    { label: pack.nav.feasibility, href: '#feasibility', sectionId: 'feasibility' },
    { label: pack.nav.schemes, href: '#schemes', sectionId: 'schemes' },
    { label: pack.nav.about, href: '#about', sectionId: 'about' },
  ];
  res.navigation.primaryCta = pack.nav.primaryCta;
  res.navigation.secondaryCta = pack.nav.secondaryCta;

  // Hero
  res.hero.eyebrow = pack.hero.eyebrow;
  res.hero.headline = `${pack.hero.headlinePart1}\n${pack.hero.headlinePart2}`;
  res.hero.description = pack.hero.description;
  res.hero.primaryCta = pack.hero.primaryCta;
  res.hero.secondaryCta = pack.hero.secondaryCta;
  res.hero.demoBadge = pack.hero.demoBadge;
  res.hero.dishaGreeting = pack.hero.dishaGreeting;
  res.hero.dishaContext = pack.hero.dishaContext;
  res.hero.insightCards = [
    {
      title: pack.hero.insights.rawMaterial.title,
      status: pack.hero.insights.rawMaterial.status,
      detail: pack.hero.insights.rawMaterial.detail,
      badgeType: 'olive',
      source: pack.hero.insights.rawMaterial.source,
    },
    {
      title: pack.hero.insights.capital.title,
      status: pack.hero.insights.capital.status,
      detail: pack.hero.insights.capital.detail,
      badgeType: 'gold',
      source: pack.hero.insights.capital.source,
    },
    {
      title: pack.hero.insights.schemes.title,
      status: pack.hero.insights.schemes.status,
      detail: pack.hero.insights.schemes.detail,
      badgeType: 'olive',
      source: pack.hero.insights.schemes.source,
    },
    {
      title: pack.hero.insights.nextStep.title,
      status: pack.hero.insights.nextStep.status,
      detail: pack.hero.insights.nextStep.detail,
      badgeType: 'terracotta',
      source: pack.hero.insights.nextStep.source,
    },
  ];

  // Disha Intro
  res.dishaIntro.badge = pack.dishaIntro.badge;
  res.dishaIntro.headline = pack.dishaIntro.headline;
  res.dishaIntro.subhead = pack.dishaIntro.subhead;
  res.dishaIntro.pillars = pack.dishaIntro.pillars;

  // Problem
  res.problem.eyebrow = pack.problem.eyebrow;
  res.problem.headline = pack.problem.headline;
  res.problem.description = pack.problem.description;
  res.problem.cards = pack.problem.cards.map((c, i) => ({
    ...c,
    icon: BASE_DATA.problem.cards[i]?.icon || 'Compass',
  }));

  // Solution
  res.solution.eyebrow = pack.solution.eyebrow;
  res.solution.headline = pack.solution.headline;
  res.solution.description = pack.solution.description;
  res.solution.fragmentedPoints = pack.solution.fragmented;
  res.solution.connectedPoints = pack.solution.connected;

  // How it works
  res.howItWorks.eyebrow = pack.howItWorks.eyebrow;
  res.howItWorks.headline = pack.howItWorks.headline;
  res.howItWorks.description = pack.howItWorks.description;
  res.howItWorks.steps = pack.howItWorks.steps;

  // Market Intelligence
  res.marketIntelligence.eyebrow = pack.marketIntelligence.eyebrow;
  res.marketIntelligence.headline = pack.marketIntelligence.headline;
  res.marketIntelligence.description = pack.marketIntelligence.description;
  res.marketIntelligence.features = pack.marketIntelligence.features;
  res.marketIntelligence.sampleSignals = pack.marketIntelligence.signals;

  // Feasibility
  res.feasibility.eyebrow = pack.feasibility.eyebrow;
  res.feasibility.headline = pack.feasibility.headline;
  res.feasibility.description = pack.feasibility.description;
  res.feasibility.equation = pack.feasibility.equation;
  res.feasibility.disclaimer = pack.feasibility.disclaimer;

  // Financial Structuring
  res.financialStructuring.eyebrow = pack.financialStructuring.eyebrow;
  res.financialStructuring.headline = pack.financialStructuring.headline;
  res.financialStructuring.description = pack.financialStructuring.description;
  res.financialStructuring.cards = pack.financialStructuring.cards;
  res.financialStructuring.note = pack.financialStructuring.note;

  // Scheme Matcher
  res.schemeMatcher.eyebrow = pack.schemeMatcher.eyebrow;
  res.schemeMatcher.headline = pack.schemeMatcher.headline;
  res.schemeMatcher.description = pack.schemeMatcher.description;

  // Disha OS
  res.dishaOS.eyebrow = pack.dishaOS.eyebrow;
  res.dishaOS.headline = pack.dishaOS.headline;
  res.dishaOS.description = pack.dishaOS.description;
  res.dishaOS.workflows = pack.dishaOS.workflowTitles;

  // Business Journey
  res.businessJourney.eyebrow = pack.businessJourney.eyebrow;
  res.businessJourney.headline = pack.businessJourney.headline;
  res.businessJourney.description = pack.businessJourney.description;
  res.businessJourney.stages = pack.businessJourney.stages;

  // Who it helps
  res.whoItHelps.eyebrow = pack.whoItHelps.eyebrow;
  res.whoItHelps.headline = pack.whoItHelps.headline;
  res.whoItHelps.description = pack.whoItHelps.description;
  res.whoItHelps.cohorts = pack.whoItHelps.cohorts;

  // Trust & Evidence
  res.trustEvidence.eyebrow = pack.trustEvidence.eyebrow;
  res.trustEvidence.headline = pack.trustEvidence.headline;
  res.trustEvidence.description = pack.trustEvidence.description;
  res.trustEvidence.provenanceChain = pack.trustEvidence.steps;
  res.trustEvidence.unknownPrinciple.badge = pack.trustEvidence.unknownBadge;
  res.trustEvidence.unknownPrinciple.title = pack.trustEvidence.unknownTitle;
  res.trustEvidence.unknownPrinciple.body = pack.trustEvidence.unknownBody;

  // Capabilities
  res.capabilities.eyebrow = pack.capabilities.eyebrow;
  res.capabilities.headline = pack.capabilities.headline;
  res.capabilities.description = pack.capabilities.description;

  // Final CTA
  res.finalCta.eyebrow = pack.finalCta.eyebrow;
  res.finalCta.headline = pack.finalCta.headline;
  res.finalCta.subhead = pack.finalCta.subhead;
  res.finalCta.primaryCta = pack.finalCta.primaryCta;
  res.finalCta.secondaryCta = pack.finalCta.secondaryCta;
  res.finalCta.guaranteeNote = pack.finalCta.guaranteeNote;

  // Footer
  res.footer.about = pack.footer.about;
  res.footer.disclaimer = pack.footer.disclaimer;
  res.footer.copyright = pack.footer.copyright;

  return res;
}

/**
 * For other languages in the 22 8th Schedule, provide high-quality localized headline, nav, and CTA mappings.
 */
function getFallbackLocalizedData(lang: SupportedLanguageCode): LandingDataType {
  const res: LandingDataType = JSON.parse(JSON.stringify(BASE_DATA));
  if (lang === 'en') return res;

  const names: Record<string, {
    how: string; feat: string; os: string; feas: string; sch: string; abt: string; cta1: string; cta2: string;
    head1: string; head2: string; desc: string; eye: string;
  }> = {
    bn: {
      how: 'কার্যপদ্ধতি', feat: 'বৈশিষ্ট্য', os: 'দিশা AI OS', feas: 'সম্ভাব্যতা ও অর্থায়ন', sch: 'সরকারি প্রকল্প', abt: 'আমাদের কথা',
      cta1: 'ব্যবসা শুরু করুন', cta2: 'পদ্ধতি দেখুন',
      head1: 'সঠিক দিশার সাথে, ', head2: 'সঠিক গ্রামীণ ব্যবসা গড়ে তুলুন।',
      desc: 'গ্রাম-দিশা স্থানীয় বাজার সংকেত, গাণিতিক আর্থিক মডেল এবং সরকারি প্রকল্পের নিয়ম একত্রিত করে গ্রামীণ উদ্যোক্তাদের পথ দেখায়।',
      eye: 'গ্রামীণ ভারতের জন্য এআই-চালিত ব্যবসায়িক সহায়তা'
    },
    ta: {
      how: 'செயல்முறை', feat: 'அம்சங்கள்', os: 'திஷா AI OS', feas: 'சாத்தியக்கூறு & நிதி', sch: 'அரசு திட்டங்கள்', abt: 'பற்றி',
      cta1: 'தொழில் தொடங்குங்கள்', cta2: 'செயல்முறையை அறிக',
      head1: 'சரியான வழிகாட்டுதலுடன், ', head2: 'சரியான கிராமப்புற தொழிலைத் தொடங்குங்கள்.',
      desc: 'கிராம்-திஷா உள்ளூர் சந்தை தரவுகள், துல்லியமான நிதி திட்டமிடல் மற்றும் அரசு திட்டங்களின் விதிமுறைகளை ஒன்றிணைக்கிறது.',
      eye: 'கிராமப்புற இந்தியாவிற்கான ஏஐ வழிகாட்டுதல்'
    },
    te: {
      how: 'ఎలా పనిచేస్తుంది', feat: 'ఫీచర్లు', os: 'దిశ ఏఐ ఓఎస్', feas: 'సాధ్యత & ఆర్థికం', sch: 'ప్రభుత్వ పథకాలు', abt: 'గురించి',
      cta1: 'వ్యాపారం ప్రారంభించండి', cta2: 'విధానం చూడండి',
      head1: 'సరైన దిశతో, ', head2: 'సరైన వ్యాపారాన్ని నిర్మించండి.',
      desc: 'గ్రామ్-దిశ స్థానిక మార్కెట్ సంకేతాలు, ఖచ్చితమైన ఆర్థిక ప్రణాళిక మరియు ప్రభుత్వ పథకాల నిబంధనలను ఒకే వేదికపై అందిస్తుంది.',
      eye: 'గ్రామీణ భారత్ కోసం ఏఐ ఆధారిత వ్యాపార మార్గదర్శకత్వం'
    },
    gu: {
      how: 'કાર્યપદ્ધતિ', feat: 'વિશેષતાઓ', os: 'દિશા AI OS', feas: 'સંભાવના અને નાણાં', sch: 'સરકારી યોજનાઓ', abt: 'અમારા વિશે',
      cta1: 'વ્યવસાય શરૂ કરો', cta2: 'પદ્ધતિ જુઓ',
      head1: 'સાચી દિશા સાથે, ', head2: 'સાચા વ્યવસાયનું નિર્માણ કરો.',
      desc: 'ગ્રામ-દિશા સ્થાનિક બજારના સંકેતો, ગણિત-આધારિત નાણાકીય માળખું અને સરકારી યોજનાઓના નિયમોને જોડે છે.',
      eye: 'ગ્રામીણ ભારત માટે AI માર્ગદર્શન'
    },
    mr: {
      how: 'कार्यपद्धती', feat: 'वैशिष्ट्ये', os: 'दिशा AI OS', feas: 'व्यवहार्यता व वित्त', sch: 'शासकीय योजना', abt: 'आमच्याबद्दल',
      cta1: 'व्यवसाय सुरू करा', cta2: 'कार्यप्रणाली पहा',
      head1: 'योग्य दिशेसह, ', head2: 'योग्य ग्रामीण उद्योगाची उभारणी.',
      desc: 'ग्राम-दिशा स्थानिक बाजारपेठेची माहिती, गणितीय वित्तीय नियोजन आणि शासकीय योजनांचे अचूक मूल्यांकन एकत्र आणते.',
      eye: 'ग्रामीण भारतासाठी एआय-आधारित व्यावसायिक मार्गदर्शन'
    },
    kn: {
      how: 'ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ', feat: 'ವೈಶಿಷ್ಟ್ಯಗಳು', os: 'ದಿಶಾ AI OS', feas: 'ಸಾಧ್ಯತೆ & ಹಣಕಾಸು', sch: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು', abt: 'ಬಗ್ಗೆ',
      cta1: 'ವ್ಯಾಪಾರ ಪ್ರಾರಂಭಿಸಿ', cta2: 'ವಿಧಾನ ತಿಳಿಯಿರಿ',
      head1: 'ಸರಿಯಾದ ದಿಕ್ಕಿನೊಂದಿಗೆ, ', head2: 'ಸರಿಯಾದ ಉದ್ಯಮವನ್ನು ಕಟ್ಟಿ.',
      desc: 'ಗ್ರಾಮ್-ದಿಶಾ ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆ ಸಂಕೇತಗಳು, ಖಚಿತ ಹಣಕಾಸು ರಚನೆ ಮತ್ತು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ನಿಯಮಗಳನ್ನು ಸಂಯೋಜಿಸುತ್ತದೆ.',
      eye: 'ಗ್ರಾಮೀಣ ಭಾರತಕ್ಕಾಗಿ ಎಐ ವ್ಯಾಪಾರ ಮಾರ್ಗದರ್ಶನ'
    },
    ml: {
      how: 'പ്രവർത്തന രീതി', feat: 'സവിശേഷതകൾ', os: 'ദിശ AI OS', feas: 'സാധ്യത & ധനകാര്യം', sch: 'സർക്കാർ പദ്ധതികൾ', abt: 'ഞങ്ങളെക്കുറിച്ച്',
      cta1: 'സംരംഭം തുടങ്ങൂ', cta2: 'വിശദാംശങ്ങൾ അറിയൂ',
      head1: 'ശരിയായ ദിശാബോധത്തോടെ, ', head2: 'അനുയോജ്യമായ സംരംഭം ആരംഭിക്കൂ.',
      desc: 'പ്രാദേശിക വിപണി വിവരങ്ങൾ, സാമ്പത്തിക കണക്കുകൂട്ടലുകൾ, സർക്കാർ പദ്ധതികൾ എന്നിവയെ ഒന്നിപ്പിക്കുന്ന ഗ്രാമ്-ദിശ.',
      eye: 'ഗ്രാമീണ ഭാരതത്തിനായുള്ള എഐ സംരംഭക മാർഗനിർദേശം'
    },
    od: {
      how: 'କିପରି କାମ କରେ', feat: 'ବୈଶିଷ୍ଟ୍ୟ', os: 'ଦିଶା AI OS', feas: 'ସମ୍ଭାବ୍ୟତା ଓ ଅର୍ଥ', sch: 'ସରକାରୀ ଯୋଜନା', abt: 'ଆମ ବିଷୟରେ',
      cta1: 'ବ୍ୟବସାୟ ଆରମ୍ଭ କରନ୍ତୁ', cta2: 'ପ୍ରଣାଳୀ ଦେଖନ୍ତୁ',
      head1: 'ସଠିକ୍ ଦିଗ୍‌ଦର୍ଶନ ସହିତ, ', head2: 'ସଠିକ୍ ଗ୍ରାମୀଣ ବ୍ୟବସାୟ ଗଢ଼ନ୍ତୁ।',
      desc: 'ଗ୍ରାମ-ଦିଶା ସ୍ଥାନୀୟ ମଣ୍ଡି ତଥ୍ୟ, ନିର୍ଦ୍ଦିଷ୍ଟ ଆର୍ଥିକ ଯୋଜନା ଓ ସରକାରୀ ଯୋଜନାର ନିୟମାବଳୀକୁ ଏକତ୍ର କରେ।',
      eye: 'ଗ୍ରାମୀଣ ଭାରତ ପାଇଁ ଏଆଇ ବ୍ୟବସାୟିକ ମାର୍ଗଦର୍ଶନ'
    },
    pa: {
      how: 'ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ', feat: 'ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ', os: 'ਦਿਸ਼ਾ AI OS', feas: 'ਸੰਭਾਵਨਾ ਅਤੇ ਵਿੱਤ', sch: 'ਸਰਕਾਰੀ ਸਕੀਮਾਂ', abt: 'ਸਾਡੇ ਬਾਰੇ',
      cta1: 'ਕਾਰੋਬਾਰ ਸ਼ੁਰੂ ਕਰੋ', cta2: 'ਢੰਗ-ਤਰੀਕਾ ਵੇਖੋ',
      head1: 'ਸਹੀ ਦਿਸ਼ਾ ਨਾਲ, ', head2: 'ਸਹੀ ਪੇਂਡੂ ਕਾਰੋਬਾਰ ਸ਼ੁਰੂ ਕਰੋ।',
      desc: 'ਗ੍ਰਾਮ-ਦਿਸ਼ਾ ਸਥਾਨਕ ਮੰਡੀ ਰਿਕਾਰਡਾਂ, ਗਣਿਤਕ ਵਿੱਤੀ ਮਾਡਲ ਅਤੇ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਦੇ ਨਿਯਮਾਂ ਨੂੰ ਇਕੱਠਾ ਕਰਦੀ ਹੈ।',
      eye: 'ਪੇਂਡੂ ਭਾਰਤ ਲਈ ਏਆਈ-ਅਧਾਰਿਤ ਕਾਰੋਬਾਰੀ ਸੇਧ'
    },
    as: {
      how: 'কেনেদৰে কাম কৰে', feat: 'বৈশিষ্ট্যসমূহ', os: 'দিশা AI OS', feas: 'সম্ভাৱনা আৰু বিত্ত', sch: 'চৰকাৰী আঁচনি', abt: 'আমাৰ বিষয়ে',
      cta1: 'উদ্যোগ আৰম্ভ কৰক', cta2: 'পদ্ধতি জানক',
      head1: 'সঠিক দিশাৰ সৈতে, ', head2: 'সঠিক গ্ৰাম্য উদ্যোগ গঢ়ক।',
      desc: 'গ্ৰাম-দিশাই স্থানীয় বজাৰৰ সংকেত, বিত্তীয় পৰিকল্পনা আৰু চৰকাৰী আঁচনিসমূহক সংযোগ কৰে।',
      eye: 'গ্ৰাম্য ভাৰতৰ বাবে এআই-চালিত উদ্যোগ নিৰ্দেশনা'
    },
    ks: {
      how: 'طریقہٕ کار', feat: 'خوبیاہ', os: 'دشا AI OS', feas: 'امکانات تہٕ فنانس', sch: 'سرکاری سکیٖمہٕ', abt: 'متعلق',
      cta1: 'کاروبار کرو شروٗع', cta2: 'طریقہٕ ہؠچھِو',
      head1: 'صحیح وتھہِ سۭتۍ، ', head2: 'صحیح روزگار بناوِو۔',
      desc: 'گرام دشا چِھ مقٲمی منڈی ہُنٛد حساب، مالیاتی منصوبہ بندی تہٕ سرکاری سکیمن ہِند قونوٗن یکجا کران۔',
      eye: 'دیہی بھارت خٲطرٕ AI رہنمائی'
    },
    mai: {
      how: 'कार्यविधि', feat: 'विशेषता', os: 'दिशा AI OS', feas: 'व्यवहार्यता व वित्त', sch: 'सरकारी योजना', abt: 'परिचय',
      cta1: 'व्यवसाय शुरू करू', cta2: 'पद्धति देखू',
      head1: 'सटीक दिशाक संग, ', head2: 'सटीक व्यवसायक निर्माण करू।',
      desc: 'ग्राम-दिशा स्थानीय बाजार संकेत, वित्तीय गणित आ सरकारी योजनाक नियमक सामंजस्य बैसाबैत अछि।',
      eye: 'ग्रामीण भारत लेल एआई व्यावसायिक मार्गदर्शन'
    },
    sat: {
      how: 'ᱪᱮᱫ ᱞᱮᱠᱟ ᱠᱟᱹᱢᱤᱭᱟ', feat: 'ᱜᱩᱱ ᱠᱚ', os: 'ᱫᱤᱥᱟ AI OS', feas: 'ᱠᱟᱹᱣᱰᱤ ᱟᱨ ᱥᱚᱢᱵᱷᱚᱵᱽ', sch: 'ᱥᱚᱨᱠᱟᱨᱤ ᱡᱚᱡᱚᱱᱟ', abt: 'ᱟᱵᱚ ᱵᱟᱵᱚᱛ',
      cta1: 'ᱵᱮᱯᱟᱨ ᱮᱛᱚᱦᱚᱵᱽ ᱢᱮ', cta2: 'ᱰᱟᱦᱟᱨ ᱧᱮᱞ ᱢᱮ',
      head1: 'ᱥᱟᱹᱨᱤ ᱫᱤᱥᱟᱹ ᱥᱟᱶ, ', head2: 'ᱥᱟᱹᱨᱤ ᱵᱮᱯᱟᱨ ᱵᱮᱱᱟᱣ ᱢᱮ ᱾',
      desc: 'ᱜᱽᱨᱟᱢ-ᱫᱤᱥᱟ ᱫᱚ ᱟᱹᱛᱩ ᱦᱟᱴ ᱨᱮᱱᱟᱜ ᱠᱷᱚᱵᱚᱨ, ᱴᱟᱠᱟ ᱦᱤᱥᱟᱹᱵᱽ ᱟᱨ ᱥᱚᱨᱠᱟᱨᱤ ᱡᱚᱡᱚᱱᱟ ᱡᱚᱲᱟᱣᱟ ᱾',
      eye: 'ᱟᱹᱛᱩ ᱵᱷᱟᱨᱚᱛ ᱞᱟᱹᱜᱤᱫ AI ᱵᱮᱯᱟᱨ ᱫᱤᱥᱟᱹ'
    },
    ne: {
      how: 'कसरी काम गर्छ', feat: 'विशेषताहरू', os: 'दिशा AI OS', feas: 'सम्भाव्यता र वित्त', sch: 'सरकारी योजनाहरू', abt: 'हाम्रोबारे',
      cta1: 'व्यापार सुरु गर्नुहोस्', cta2: 'कार्यप्रणाली हेर्नुहोस्',
      head1: 'सही दिशाका साथ, ', head2: 'सही ग्रामीण व्यवसाय निर्माण गर्नुहोस्।',
      desc: 'ग्राम-दिशाले स्थानीय बजार तथ्याङ्क, वित्तीय योजना र सरकारी योजनाका नियमहरूलाई एकीकृत गर्दछ।',
      eye: 'ग्रामीण भारतका लागि एआई व्यापार मार्गदर्शन'
    },
    kok: {
      how: 'कशी चालता', feat: 'खाशेलपणां', os: 'दिशा AI OS', feas: 'संव्यता आनी वित्त', sch: 'सरकारी येवजण', abt: 'विशीं',
      cta1: 'वेवसाय सुरू करात', cta2: 'पद्धत पळेयात',
      head1: 'योग्य दिशेन, ', head2: 'योग्य ग्रामीण वेवसाय बांदात.',
      desc: 'ग्राम-दिशा स्थानिक बाजाराचे संकेत, निश्चित वित्तीय नियोजन आनी सरकारी येवजणांचे नेम एकठांय हाडटा.',
      eye: 'ग्रामीण भारता खातीर एआई वेवसायिक मार्गदर्शन'
    },
    sd: {
      how: 'ڪيئن ڪم ڪري ٿو', feat: 'خاصيتون', os: 'دشا AI OS', feas: 'امڪان ۽ مالي', sch: 'سرڪاري اسڪيمون', abt: 'اسان بابت',
      cta1: 'ڪاروبار شروع ڪريو', cta2: 'طريقو ڏسو',
      head1: 'صحيح رخ سان، ', head2: 'پنھنجو ڳوٺاڻو ڪاروبار قائم ڪريو.',
      desc: 'گرام دشا مقامي منڊي اشارن، مالي رٿابندي ۽ سرڪاري اسڪيمن جي ضابطن کي گڏ ڪري ٿي.',
      eye: 'ڳوٺاڻي ڀارت لاءِ AI ڪاروباري رهنمائي'
    },
    doi: {
      how: 'किय्यां कम्म करदा', feat: 'खासियत', os: 'दिशा AI OS', feas: 'संभावना ते वित्त', sch: 'सरकारी स्कीमां', abt: 'साढ़े बारे च',
      cta1: 'कारोबार शुरू करो', cta2: 'तरीका दिक्खो',
      head1: 'सैह्‌ दिशा कन्नै, ', head2: 'सैह्‌ ग्रामीण कारोबार बनाओ।',
      desc: 'ग्राम-दिशा स्थानीय मण्डी दे आंकड़ें, वित्तीय हिसाब ते सरकारी स्कीमियें दे नियमें गी जोड़दी ऐ।',
      eye: 'ग्रामीण भारत लेई एआई व्यापार मार्गदर्शन'
    },
    mni: {
      how: 'কমদৌনা থবক তৌবগে', feat: 'মচাকশিং', os: 'দিশা AI OS', feas: 'সম্ভাব্য অমসুং শেল-থুম', sch: 'লৈঙাক্কী স্কিমশিং', abt: 'ঐখোয়গী মরমদা',
      cta1: 'ললোন-ইতিক হৌদোকউ', cta2: 'থৌওং য়েংউ',
      head1: 'চুম্বা লম্বিগা লোয়ননা, ', head2: 'অচুম্বা খুঙ্গংগী ললোন-ইতিক শেমগৎলু।',
      desc: 'গ্রাম-দিশানা মফম অদুগী কীয়ারোল, শেল-থুমগী থৌরাং অমসুং লৈঙাক্কী স্কিমশিং অমত্তা ওইনা শম্নহল্লি।',
      eye: 'খুঙ্গংগী ভারতকীদমক AI ললোন-ইতিক য়াম্বা'
    },
    brx: {
      how: 'माबोरै मावो', feat: 'गोंनायफोर', os: 'दिशा AI OS', feas: 'जाथावना आरो रां', sch: 'सरकारि आंचनि', abt: 'जोंनि सोमोन्दै',
      cta1: 'फालांगि जागाय', cta2: 'दाथाब नाय',
      head1: 'थार लामाजों, ', head2: 'थार गामियारी फालांगि दाफुं।',
      desc: 'ग्राम-दिशायो जायगानि हाट बाजhandlerनि रां, रांखान्थियारि दाथाब आरो सरकारि आंचनिखौ खौसे खालामो।',
      eye: 'गामियारि भारतनि थाखाय AI फालांगि लामानि दिन्थिग्रा'
    },
    sa: {
      how: 'कार्यविधिः', feat: 'वैशिष्ट्यानि', os: 'दिशा AI OS', feas: 'व्यवहार्यता च वित्तम्', sch: 'शासनयोजनाः', abt: 'अस्मद्विषये',
      cta1: 'उद्यमं प्रारभध्वम्', cta2: 'प्रणालीम् अवगच्छत',
      head1: 'सम्यक् दिशया सह, ', head2: 'सम्यक् ग्रामीणोद्योगस्य निर्माणं कुरुत।',
      desc: 'ग्राम-दिशा स्थानीयविपणीसङ्केतान्, वित्तीयसंरचनां, शासनयोजनानियमांश्च एकीकरोति।',
      eye: 'ग्रामीणभारताय कृत्रिमबुद्धियुक्त-उद्यममार्गदर्शनम्'
    }
  };

  const item = names[lang];
  if (item) {
    res.navigation.links = [
      { label: item.how, href: '#how-it-works', sectionId: 'how-it-works' },
      { label: item.feat, href: '#features', sectionId: 'features' },
      { label: item.os, href: '#disha-os', sectionId: 'disha-os' },
      { label: item.feas, href: '#feasibility', sectionId: 'feasibility' },
      { label: item.sch, href: '#schemes', sectionId: 'schemes' },
      { label: item.abt, href: '#about', sectionId: 'about' },
    ];
    res.navigation.primaryCta = item.cta1;
    res.navigation.secondaryCta = 'Sign in';

    res.hero.eyebrow = item.eye;
    res.hero.headline = `${item.head1}\n${item.head2}`;
    res.hero.description = item.desc;
    res.hero.primaryCta = item.cta1;
    res.hero.secondaryCta = item.cta2;
    res.finalCta.primaryCta = item.cta1;
    res.finalCta.secondaryCta = item.cta2;
    res.finalCta.headline = `${item.head1} ${item.head2}`;
  }

  return res;
}
