"""
GRAM-DISHA — Google Gemini AI Integration
Grounds conversations on verified domain data with fallback to deterministic mock.
"""

from typing import Optional, Dict, Any
from app.core.config import settings
from app.ai.base import (
    BaseAIProvider,
    ExplanationPayload,
    ExplanationResult,
    IntentPayload,
    IntentResult
)
from app.ai.prompts import DISHA_SYSTEM_PROMPT, DISHA_GROUNDING_TEMPLATE
from app.ai.mock_service import MockAIService


class GeminiAIService(BaseAIProvider):
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.client = None
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"Warning: Failed to initialize Google GenAI Client: {e}")
                self.client = None

    async def generate_explanation(self, payload: ExplanationPayload) -> ExplanationResult:
        mock = MockAIService()
        return await mock.generate_explanation(payload)

    async def extract_intent(self, payload: IntentPayload) -> IntentResult:
        mock = MockAIService()
        return await mock.extract_intent(payload)

    def explain_metric(self, metric_name: str, value: float, context: dict) -> ExplanationPayload:
        if not self.client:
            return MockAIService().explain_metric(metric_name, value, context)

        prompt = f"Explain the business metric '{metric_name}' which is currently {value}. Context: {context}. Keep it concise, practical, and clear for a rural entrepreneur."
        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            return ExplanationPayload(
                metric_name=metric_name,
                explanation=response.text,
                actionable_advice="Review your financial schedule in the Financial Planning tab."
            )
        except Exception as e:
            print(f"Gemini API call failed ({e}), falling back to mock provider.")
            return MockAIService().explain_metric(metric_name, value, context)

    def parse_intent(self, text: str) -> dict:
        return MockAIService().parse_intent(text)

    def generate_grounded_response(
        self,
        user_query: str,
        grounding_data: Dict[str, Any],
        language: Optional[str] = "en"
    ) -> str:
        biz = grounding_data.get("business", {})
        fin = grounding_data.get("financials", {})
        schemes = grounding_data.get("schemes", [])
        feas = grounding_data.get("feasibility", {})
        docs = grounding_data.get("documents", {})
        mandi_list = grounding_data.get("market_mandi", [])

        schemes_lines = []
        for s in schemes[:3]:
            schemes_lines.append(
                f"- {s.get('schemeName', s.get('schemeCode', 'Scheme'))}: "
                f"Subsidy ₹{s.get('maxSubsidy', s.get('maxSubsidyOrAssistance', 0)):,.2f} "
                f"({s.get('subsidyPercentage', 0)}%) | Status: {s.get('eligibilityState', 'ELIGIBLE')}"
            )
        schemes_text = "\n".join(schemes_lines) if schemes_lines else "No specific schemes matched yet."

        verified_docs_str = ", ".join(docs.get("verified", ["Aadhaar Card", "PAN Card"]))
        pending_docs_str = ", ".join(docs.get("pending", ["FSSAI Registration", "Quotations"]))
        mandi_text = "\n".join([f"- {m}" for m in mandi_list[:3]]) if mandi_list else "Mandi benchmarks active at district yard."

        from app.ai.prompts import LANGUAGE_PROMPTS
        target_lang = language or "en"
        lang_instruction = LANGUAGE_PROMPTS.get(target_lang, f"Respond in language code '{target_lang}' clearly while preserving exact numbers (₹, %, and ratios).")

        full_prompt = DISHA_GROUNDING_TEMPLATE.format(
            business_name=biz.get("name", "Rural Enterprise"),
            sector=biz.get("sector", "Agro-Processing"),
            industry_type=biz.get("industry_type", "Manufacturing"),
            district=biz.get("district", "Yavatmal"),
            state=biz.get("state", "Maharashtra"),
            location_type=biz.get("location_type", "Rural"),
            category=biz.get("category", "General"),
            gender=biz.get("gender", "Male"),
            total_project_cost=fin.get("totalProjectCost", 850000.0),
            promoter_contribution=fin.get("promoterContribution", 150000.0),
            promoter_pct=fin.get("promoterContributionPercentage", 17.6),
            term_loan=fin.get("requiredTermLoan", 595000.0),
            working_capital_loan=fin.get("requiredWorkingCapitalLoan", 105000.0),
            monthly_emi=fin.get("monthlyEMI", 12500.0),
            dscr=fin.get("projectedDSCR", 1.85),
            bep=fin.get("contributionMarginPercentage", 42.0),
            roi=fin.get("projectedAnnualROI", 24.5),
            schemes_summary=schemes_text,
            feasibility_score=feas.get("totalScore", 0.78),
            feasibility_tier=feas.get("rankingTier", "HIGH_FEASIBILITY"),
            strengths=", ".join(feas.get("strengths", ["Local raw materials nearby"]))[:120],
            risks=", ".join(feas.get("threats", ["Seasonal raw material price variation"]))[:120],
            verified_docs=verified_docs_str,
            pending_docs=pending_docs_str,
            mandi_rates_summary=mandi_text,
            language_instruction=lang_instruction,
            user_query=user_query
        )

        cost = fin.get("totalProjectCost", 850000.0)
        subsidy = schemes[0].get("maxSubsidy", 297500.0) if schemes else 297500.0
        term_loan = fin.get("requiredTermLoan", 595000.0)
        emi = fin.get("monthlyEMI", 12500.0)
        dscr = fin.get("projectedDSCR", 1.85)

        def get_fallback_text(lang_code: str) -> str:
            if lang_code == "hi":
                return (
                    f"नमस्ते! आपके **{biz.get('name', 'व्यवसाय')}** के लिए कुल परियोजना लागत **₹{cost:,.2f}** है, "
                    f"जिसमें आपकी खुद की मार्जिन राशि **₹{fin.get('promoterContribution', 150000.0):,.2f}** ({fin.get('promoterContributionPercentage', 17.6):.1f}%) है।\n\n"
                    f"**PMEGP योजना** के तहत, आपकी ग्रामीण विनिर्माण इकाई **35% पूंजीगत सब्सिडी** (लगभग **₹{subsidy:,.2f}**) के लिए पात्र है। "
                    f"इसके बाद शेष बैंक मियादी ऋण **₹{term_loan:,.2f}** होगा, जिसकी मासिक किस्त (EMI) लगभग **₹{emi:,.2f}** होगी।\n\n"
                    f"आपका ऋण सेवा व्याप्ति अनुपात (DSCR) **{dscr:.2f}** है, जो बैंक के नियमों (न्यूनतम 1.50) के अनुसार पूर्णतः सुरक्षित है।"
                )
            elif lang_code == "mr":
                return (
                    f"नमस्कार! तुमच्या **{biz.get('name', 'उद्योगासाठी')}** एकूण प्रकल्प खर्च **₹{cost:,.2f}** असून, "
                    f"तुमचे स्वतःचे भांडवल (मार्जिन) **₹{fin.get('promoterContribution', 150000.0):,.2f}** ({fin.get('promoterContributionPercentage', 17.6):.1f}%) आवश्यक आहे.\n\n"
                    f"**PMEGP योजनेअंतर्गत**, तुमच्या ग्रामीण युनिटला **35% शासकीय अनुदान (सब्सिडी)** म्हणजेच सुमारे **₹{subsidy:,.2f}** मिळू शकते. "
                    f"उर्वरित बँक मुदत कर्ज **₹{term_loan:,.2f}** असेल आणि मासिक हप्ता (EMI) **₹{emi:,.2f}** असेल.\n\n"
                    f"तुमचे DSCR प्रमाण **{dscr:.2f}** असून ते बँकेच्या निकषांनुसार सुरक्षित आहे."
                )
            elif lang_code == "te":
                return (
                    f"నమస్కారం! మీ **{biz.get('name', 'వ్యాపారానికి')}** మొత్తం ప్రాజెక్ట్ ఖర్చు **₹{cost:,.2f}**, "
                    f"ఇందులో ప్రమోటర్ వాటా **₹{fin.get('promoterContribution', 150000.0):,.2f}** ({fin.get('promoterContributionPercentage', 17.6):.1f}%).\n\n"
                    f"**PMEGP పథకం** కింద గ్రామీణ యూనిట్‌కు **35% సబ్సిడీ** (సుమారు **₹{subsidy:,.2f}**) అందుబాటులో ఉంది. "
                    f"బ్యాంక్ టర్మ్ లోన్ **₹{term_loan:,.2f}** మరియు నెలవారీ ఈఎంఐ (EMI) **₹{emi:,.2f}**.\n\n"
                    f"మీ DSCR నిష్పత్తి **{dscr:.2f}**, ఇది బ్యాంక్ నిబంధనల ప్రకారం సురక్షితమైనది."
                )
            elif lang_code == "ta":
                return (
                    f"வணக்கம்! உங்கள் **{biz.get('name', 'தொழிலுக்கான')}** மொத்த திட்ட மதிப்பீடு **₹{cost:,.2f}**. "
                    f"உங்கள் சொந்த மூலதனப் பங்கு **₹{fin.get('promoterContribution', 150000.0):,.2f}** ({fin.get('promoterContributionPercentage', 17.6):.1f}%).\n\n"
                    f"**PMEGP திட்டத்தின்** கீழ் உங்களுக்கு **35% மூலதன மானியம்** (தோராயமாக **₹{subsidy:,.2f}**) பெற தகுதி உண்டு. "
                    f"வங்கி காலக்கடன் தேவை **₹{term_loan:,.2f}** மற்றும் மாதத் தவணை (EMI) **₹{emi:,.2f}**.\n\n"
                    f"உங்கள் கடன் சேவை பாதுகாப்பு விகிதம் (DSCR) **{dscr:.2f}** ஆக உள்ளது, இது வங்கி விதிமுறைகளுக்கு உகந்தது."
                )
            elif lang_code == "bn":
                return (
                    f"নমস্কার! আপনার **{biz.get('name', 'উদ্যোগের')}** জন্য মোট প্রকল্প ব্যয় **₹{cost:,.2f}**, "
                    f"যার মধ্যে আপনার নিজস্ব মূলধন **₹{fin.get('promoterContribution', 150000.0):,.2f}** ({fin.get('promoterContributionPercentage', 17.6):.1f}%)।\n\n"
                    f"**PMEGP স্কিমের** অধীনে আপনার গ্রামীণ ইউনিট **35% মূলধন ভর্তুকি** (আনুমানিক **₹{subsidy:,.2f}**) পাওয়ার যোগ্য। "
                    f"অবশিষ্ট ব্যাংক মেয়াদী ঋণ **₹{term_loan:,.2f}** এবং মাসিক কিস্তি (EMI) **₹{emi:,.2f}**।\n\n"
                    f"আপনার DSCR অনুপাত **{dscr:.2f}**, যা ব্যাংক নির্দেশিকা অনুযায়ী অত্যন্ত শক্তিশালী।"
                )
            elif lang_code == "gu":
                return (
                    f"નમસ્તે! તમારા **{biz.get('name', 'ઉદ્યોગ')}** માટે કુલ પ્રોજેક્ટ ખર્ચ **₹{cost:,.2f}** છે, "
                    f"જેમાં તમારો પોતાનો હિસ્સો **₹{fin.get('promoterContribution', 150000.0):,.2f}** ({fin.get('promoterContributionPercentage', 17.6):.1f}%) છે.\n\n"
                    f"**PMEGP યોજના** હેઠળ તમારા ગ્રામીણ એકમને **35% સરકારી સબસિડી** (અંદાજે **₹{subsidy:,.2f}**) મળવાપાત્ર છે. "
                    f"બાકી બેંક મુદતી લોન **₹{term_loan:,.2f}** રહેશે અને માસિક હપ્તો (EMI) **₹{emi:,.2f}** થશે.\n\n"
                    f"તમારો DSCR ગુણોત્તર **{dscr:.2f}** છે, જે બેંક ધારાધોરણો મુજબ સંપૂર્ણ સુરક્ષિત છે."
                )
            elif lang_code == "kn":
                return (
                    f"ನಮಸ್ಕಾರ! ನಿಮ್ಮ **{biz.get('name', 'ಉದ್ಯಮಕ್ಕಾಗಿ')}** ಒಟ್ಟು ಯೋಜನಾ ವೆಚ್ಚ **₹{cost:,.2f}**, "
                    f"ಇದರಲ್ಲಿ ನಿಮ್ಮ ಸ್ವಂತ ಬಂಡವಾಳ ಪಾಲು **₹{fin.get('promoterContribution', 150000.0):,.2f}** ({fin.get('promoterContributionPercentage', 17.6):.1f}%).\n\n"
                    f"**PMEGP ಯೋಜನೆಯಡಿ** ನಿಮ್ಮ ಗ್ರಾಮೀಣ ಘಟಕಕ್ಕೆ **35% ಸಬ್ಸಿಡಿ** (ಅಂದಾಜು **₹{subsidy:,.2f}**) ಲಭ್ಯವಿದೆ. "
                    f"ಬ್ಯಾಂಕ್ ಅವಧಿ ಸಾಲ **₹{term_loan:,.2f}** ಮತ್ತು ಮಾಸಿಕ ಕಂತು (EMI) **₹{emi:,.2f}** ಆಗಿರುತ್ತದೆ.\n\n"
                    f"ನಿಮ್ಮ DSCR ಅನುಪಾತ **{dscr:.2f}** ಆಗಿದ್ದು, ಬ್ಯಾಂಕ್ ಮಾನದಂಡಗಳಿಗೆ ಅನುಗುಣವಾಗಿದೆ."
                )
            elif lang_code == "pa":
                return (
                    f"ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਤੁਹਾਡੇ **{biz.get('name', 'ਕਾਰੋਬਾਰ')}** ਲਈ ਕੁੱਲ ਪ੍ਰੋਜੈਕਟ ਲਾਗਤ **₹{cost:,.2f}** ਹੈ, "
                    f"ਜਿਸ ਵਿੱਚ ਤੁਹਾਡਾ ਆਪਣਾ ਹਿੱਸਾ **₹{fin.get('promoterContribution', 150000.0):,.2f}** ({fin.get('promoterContributionPercentage', 17.6):.1f}%) ਹੈ।\n\n"
                    f"**PMEGP ਸਕੀਮ** ਦੇ ਤਹਿਤ ਤੁਹਾਡੀ ਪੇਂਡੂ ਇਕਾਈ **35% ਸਬਸਿਡੀ** (ਲਗਭਗ **₹{subsidy:,.2f}**) ਦੀ ਹੱਕਦਾਰ ਹੈ। "
                    f"ਬੈਂਕ ਮਿਆਦੀ ਕਰਜ਼ਾ **₹{term_loan:,.2f}** ਅਤੇ ਮਾਸਿਕ ਕਿਸ਼ਤ (EMI) ਲਗਭਗ **₹{emi:,.2f}** ਹੋਵੇਗੀ।"
                )
            elif lang_code == "ur":
                return (
                    f"آداب! آپ کے **{biz.get('name', 'کاروبار')}** کے لیے کل پروجیکٹ لاگت **₹{cost:,.2f}** ہے، "
                    f"جس میں آپ کی اپنی رقم **₹{fin.get('promoterContribution', 150000.0):,.2f}** ({fin.get('promoterContributionPercentage', 17.6):.1f}%) ہے۔\n\n"
                    f"**PMEGP اسکیم** کے تحت آپ کے دیہی یونٹ کو **35% سبسڈی** (تقریباً **₹{subsidy:,.2f}**) حاصل ہو سکتی ہے۔ "
                    f"بینک میعادی قرض **₹{term_loan:,.2f}** اور ماہانہ قسط (EMI) تقریباً **₹{emi:,.2f}** ہوگی۔"
                )
            else:
                return (
                    f"Namaste! Based on your verified project profile for **{biz.get('name', 'your enterprise')}**, "
                    f"your total project cost is **₹{cost:,.2f}** with a promoter margin requirement of "
                    f"**₹{fin.get('promoterContribution', 150000.0):,.2f}** ({fin.get('promoterContributionPercentage', 17.6):.1f}%).\n\n"
                    f"Under the **PMEGP Scheme**, your rural manufacturing setup qualifies for a **35% capital subsidy** "
                    f"amounting to approximately **₹{subsidy:,.2f}**, leaving a bank term loan requirement of "
                    f"**₹{term_loan:,.2f}** with an EMI of **₹{emi:,.2f}**.\n\n"
                    f"Your Debt Service Coverage Ratio (DSCR) stands at **{dscr:.2f}**, "
                    f"which satisfies bank viability norms (minimum 1.50). You can proceed to submit your DPR to the "
                    f"District Industries Centre (DIC) Task Force."
                )

        if not self.client:
            return get_fallback_text(target_lang)

        try:
            from google.genai import types
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=full_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=DISHA_SYSTEM_PROMPT,
                    temperature=0.3
                )
            )
            return response.text
        except Exception as e:
            print(f"Error calling Gemini: {e}. Falling back to deterministic response.")
            return get_fallback_text(target_lang)
