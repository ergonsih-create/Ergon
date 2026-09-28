"""
GRAM-DISHA — OpenAI Whisper Speech Intelligence Router
Smart India Hackathon 2026 (Team ERGON)
"""

import re
from typing import Optional
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from app.domains.whisper.schemas import (
    WhisperConfigResponse,
    WhisperTranscriptionResponse,
    DishaVoiceIntentRequest,
    DishaVoiceIntentResponse,
)
from app.domains.whisper.service import WhisperService

router = APIRouter(prefix="/whisper", tags=["Speech Recognition (Whisper)"])


@router.get("/config", response_model=WhisperConfigResponse)
def get_whisper_config():
    return WhisperService.get_config()


@router.post("/transcribe", response_model=WhisperTranscriptionResponse)
async def transcribe_audio(
    file: UploadFile = File(...),
    language: Optional[str] = Form(None),
    task: str = Form("transcribe"),
    prompt: Optional[str] = Form(None),
    temperature: float = Form(0.0),
):
    return await WhisperService.transcribe(
        file=file,
        language=language,
        task=task,
        prompt=prompt,
        temperature=temperature,
    )


@router.post("/translate", response_model=WhisperTranscriptionResponse)
async def translate_audio(
    file: UploadFile = File(...),
    prompt: Optional[str] = Form(None),
    temperature: float = Form(0.0),
):
    return await WhisperService.transcribe(
        file=file,
        language=None,
        task="translate",
        prompt=prompt,
        temperature=temperature,
    )


@router.post("/intent", response_model=DishaVoiceIntentResponse)
def extract_voice_intent(req: DishaVoiceIntentRequest):
    query = req.transcript.lower()
    intent = "UNKNOWN"
    confidence = 0.5
    entities = {
        "locationDistrict": req.district or "Yavatmal",
        "businessActivity": req.business_activity or "Mini Dal Mill",
    }
    explanation = ""
    evidence_source = "GRAM-DISHA Deterministic Core"
    suggested_actions = []
    requires_confirmation = False
    confirmation_prompt = None

    if any(k in query for k in ["submit", "delete", "apply now", "सबमिट", "अर्ज करा", "जमा करा", "दाखल करा"]):
        intent = "CONFIRMATION_REQUIRED_ACTION"
        confidence = 0.95
        requires_confirmation = True
        confirmation_prompt = "You requested an action that commits changes or submits an application. Do you wish to proceed?"
        explanation = "Explicit confirmation required before committing action."
        suggested_actions.append({"label": "Confirm & Proceed", "actionCode": "CONFIRM_SUBMIT"})
    elif any(k in query for k in ["scheme", "योजना", "योजने", "திட்டம்", "pmegp", "पीएमईजीपी", "subsidy", "अनुदान", "सब्सिडी", "सबसिडी", "పథకం", "ಸ್ಕೀಮ್", "స్కీమ్", "পরিকল্পনা"]):
        intent = "SCHEME_ELIGIBILITY"
        confidence = 0.94
        entities["schemeName"] = "PMEGP"
        explanation = "Checking central and state subsidy eligibility under PMEGP v2.4-2025 guidelines."
        evidence_source = "Ministry of MSME / KVIC 2025"
        suggested_actions.append({"label": "View Matched Subsidies", "actionCode": "NAV_SCHEMES", "route": "SCHEMES"})
    elif any(k in query for k in ["finance", "emi", "loan", "ईएमआई", "वित्त", "कर्ज", "ऋण", "ब्याज", "दर", "कडन"]):
        intent = "LOAN_EMI_CALCULATION"
        confidence = 0.92
        explanation = "Opening financial debt amortization and EMI schedule calculation."
        evidence_source = "RBI Benchmark Lending Matrix"
        suggested_actions.append({"label": "Open Financial Structuring", "actionCode": "NAV_FINANCE", "route": "FINANCE"})
    elif any(k in query for k in ["market", "mandi", "bhav", "price", "मंडी", "बाजार", "भाव", "दर"]):
        intent = "MARKET_PRICE_INQUIRY"
        confidence = 0.93
        entities["commodityName"] = "Desi Chana"
        explanation = f"Retrieving modal prices from Pusad APMC Mandi for {entities['locationDistrict']}."
        evidence_source = "AGMARKNET Daily Modal Records"
        suggested_actions.append({"label": "View Mandi Analytics", "actionCode": "NAV_MARKET_INSIGHTS", "route": "MARKET_INSIGHTS"})
    elif any(k in query for k in ["feasibility", "hbfs", "score", "व्यवहार्यता", "क्षमता"]):
        intent = "FEASIBILITY_EXPLANATION"
        confidence = 0.93
        explanation = "Inspecting 8-vector HBFS feasibility score based on localized supply chains."
        evidence_source = "HBFS Feasibility Engine"
        suggested_actions.append({"label": "Open Feasibility Matrix", "actionCode": "NAV_FEASIBILITY", "route": "FEASIBILITY"})
    elif any(k in query for k in ["cost", "capital", "investment", "lakh", "लाख", "भांडवल", "खर्च"]):
        intent = "PROJECT_COST_ESTIMATION"
        confidence = 0.90
        match = re.search(r"(\d+(?:\.\d+)?)\s*(?:lakh|lac|लाख)", query)
        if match:
            entities["fundingAmount"] = float(match.group(1)) * 100000
        explanation = f"Calculating capital expenditure requirement for {entities['businessActivity']}."
        evidence_source = "MoMSME Model Project Profiles"
        suggested_actions.append({"label": "Simulate Project Cost", "actionCode": "NAV_FINANCE", "route": "FINANCE"})
    else:
        intent = "UNKNOWN"
        confidence = 0.4
        explanation = f'I heard: "{req.transcript}". Would you like to refine the transcript or select an action?'
        suggested_actions.extend([
            {"label": "Explore Business Models", "actionCode": "NAV_BUSINESS_IDEAS", "route": "BUSINESS_IDEAS"},
            {"label": "Check Scheme Subsidies", "actionCode": "NAV_SCHEMES", "route": "SCHEMES"},
            {"label": "Calculate Loan EMI", "actionCode": "NAV_FINANCE", "route": "FINANCE"},
        ])

    return DishaVoiceIntentResponse(
        intent=intent,
        confidence=confidence,
        original_transcript=req.transcript,
        language=req.language or "en",
        entities=entities,
        explanation=explanation,
        evidence_source=evidence_source,
        suggested_actions=suggested_actions,
        requires_confirmation=requires_confirmation,
        confirmation_prompt=confirmation_prompt,
        is_uncertain=(intent == "UNKNOWN" or confidence < 0.6),
    )
