"""
GRAM-DISHA — OpenAI Whisper Speech Recognition Service
Smart India Hackathon 2026 (Team ERGON)

Integrates official OpenAI Whisper API for server-side speech recognition,
multilingual language detection, word/segment timestamp extraction,
and hallucination/silence checks.
"""

import os
import math
from typing import Dict, Any, Optional
import httpx
from fastapi import HTTPException, UploadFile
from app.domains.whisper.schemas import (
    WhisperTranscriptionResponse,
    WhisperSegmentModel,
    WhisperWordModel,
    WhisperConfigResponse,
)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
WHISPER_MODEL = os.getenv("WHISPER_MODEL", "whisper-1")
WHISPER_API_BASE_URL = os.getenv("WHISPER_API_BASE_URL", "https://api.openai.com/v1")

INDIC_LANG_MAP = {
    "en": {"name": "English", "script": "Latin", "dir": "ltr"},
    "hi": {"name": "Hindi", "script": "Devanagari", "dir": "ltr"},
    "ur": {"name": "Urdu", "script": "Nastaliq / Perso-Arabic", "dir": "rtl"},
    "bn": {"name": "Bengali", "script": "Bengali", "dir": "ltr"},
    "ta": {"name": "Tamil", "script": "Tamil", "dir": "ltr"},
    "te": {"name": "Telugu", "script": "Telugu", "dir": "ltr"},
    "mr": {"name": "Marathi", "script": "Devanagari", "dir": "ltr"},
    "gu": {"name": "Gujarati", "script": "Gujarati", "dir": "ltr"},
    "kn": {"name": "Kannada", "script": "Kannada", "dir": "ltr"},
    "ml": {"name": "Malayalam", "script": "Malayalam", "dir": "ltr"},
    "pa": {"name": "Punjabi", "script": "Gurmukhi", "dir": "ltr"},
    "od": {"name": "Odia", "script": "Odia", "dir": "ltr"},
    "as": {"name": "Assamese", "script": "Bengali-Assamese", "dir": "ltr"},
    "sa": {"name": "Sanskrit", "script": "Devanagari", "dir": "ltr"},
    "ne": {"name": "Nepali", "script": "Devanagari", "dir": "ltr"},
    "sd": {"name": "Sindhi", "script": "Sindhi-Arabic", "dir": "rtl"},
    "ks": {"name": "Kashmiri", "script": "Nastaliq / Perso-Arabic", "dir": "rtl"},
    "kok": {"name": "Konkani", "script": "Devanagari", "dir": "ltr"},
    "mai": {"name": "Maithili", "script": "Devanagari", "dir": "ltr"},
    "doi": {"name": "Dogri", "script": "Devanagari", "dir": "ltr"},
    "mni": {"name": "Manipuri", "script": "Meitei Mayek", "dir": "ltr"},
    "brx": {"name": "Bodo", "script": "Devanagari", "dir": "ltr"},
    "sat": {"name": "Santali", "script": "Ol Chiki", "dir": "ltr"},
}


class WhisperService:
    @classmethod
    def get_config(cls) -> WhisperConfigResponse:
        return WhisperConfigResponse(
            has_api_key=bool(OPENAI_API_KEY and OPENAI_API_KEY.strip()),
            model=WHISPER_MODEL,
            api_base_url=WHISPER_API_BASE_URL,
            supported_languages_count=len(INDIC_LANG_MAP),
            supported_formats=["audio/webm", "audio/wav", "audio/mp3", "audio/m4a", "audio/ogg"],
            max_duration_seconds=120,
            min_duration_seconds=0.6,
        )

    @classmethod
    async def transcribe(
        cls,
        file: UploadFile,
        language: Optional[str] = None,
        task: str = "transcribe",
        prompt: Optional[str] = None,
        temperature: float = 0.0,
    ) -> WhisperTranscriptionResponse:
        content = await file.read()
        if len(content) == 0:
            raise HTTPException(
                status_code=400,
                detail={"error_code": "NO_AUDIO", "message": "Uploaded audio file is empty."},
            )

        api_key = os.getenv("OPENAI_API_KEY", OPENAI_API_KEY)
        if not api_key or not api_key.strip():
            raise HTTPException(
                status_code=400,
                detail={
                    "error_code": "OPENAI_KEY_MISSING",
                    "message": "OPENAI_API_KEY is not configured on the server.",
                },
            )

        base_url = os.getenv("WHISPER_API_BASE_URL", WHISPER_API_BASE_URL)
        model = os.getenv("WHISPER_MODEL", WHISPER_MODEL)
        url = f"{base_url}/audio/translations" if task == "translate" else f"{base_url}/audio/transcriptions"
        headers = {"Authorization": f"Bearer {api_key}"}

        # Build multipart payload
        files = {
            "file": (file.filename or "audio.webm", content, file.content_type or "audio/webm")
        }
        data: Dict[str, Any] = {
            "model": model,
            "response_format": "verbose_json",
            "temperature": str(temperature),
        }
        if language and language != "auto" and task != "translate":
            data["language"] = language
        if prompt:
            data["prompt"] = prompt

        try:
            async with httpx.AsyncClient(timeout=35.0) as client:
                response = await client.post(url, headers=headers, data=data, files=files)
        except httpx.TimeoutException:
            raise HTTPException(
                status_code=504,
                detail={
                    "error_code": "API_TIMEOUT",
                    "message": "Whisper request timed out after 35 seconds.",
                },
            )

        if response.status_code != 200:
            err_code = "TRANSCRIPTION_ERROR"
            msg = response.text
            try:
                parsed = response.json()
                if "error" in parsed and isinstance(parsed["error"], dict):
                    msg = parsed["error"].get("message", msg)
                    if parsed["error"].get("code") == "credit_balance_exhausted" or parsed["error"].get("type") == "insufficient_quota":
                        err_code = "QUOTA_EXCEEDED"
                    elif response.status_code == 401:
                        err_code = "AUTHENTICATION_FAILED"
                    elif response.status_code == 400:
                        err_code = "INVALID_AUDIO"
            except Exception:
                pass

            raise HTTPException(
                status_code=response.status_code,
                detail={
                    "error_code": err_code,
                    "message": msg,
                },
            )

        res_data = response.json()
        text = (res_data.get("text") or "").strip()
        segments_raw = res_data.get("segments", [])
        words_raw = res_data.get("words", [])

        # Quality and silence analysis
        avg_no_speech = 0.0
        avg_logprob = 0.0
        if segments_raw:
            avg_no_speech = sum(s.get("no_speech_prob", 0.0) for s in segments_raw) / len(segments_raw)
            avg_logprob = sum(s.get("avg_logprob", 0.0) for s in segments_raw) / len(segments_raw)

        if not text or (avg_no_speech > 0.75 and len(text) < 5):
            raise HTTPException(
                status_code=400,
                detail={
                    "error_code": "NO_SPEECH_DETECTED",
                    "message": "I couldn't hear anything clearly. Please try again.",
                },
            )

        detected_lang = (res_data.get("language") or language or "unknown").lower()
        meta = INDIC_LANG_MAP.get(detected_lang, {"name": detected_lang.capitalize(), "script": "Unknown", "dir": "ltr"})

        confidence = math.exp(avg_logprob) if avg_logprob != 0.0 else 0.92
        confidence = max(0.1, min(0.99, confidence))

        is_hallucination = (res_data.get("compression_ratio", 1.0) > 2.4) or (avg_logprob < -1.2)

        return WhisperTranscriptionResponse(
            text=text,
            language=detected_lang,
            language_name=meta["name"],
            language_script=meta["script"],
            direction=meta["dir"],
            language_detection_method="user_selected_context" if language and language != "auto" else "whisper_auto_detected",
            language_confidence=round(confidence, 3),
            duration=res_data.get("duration", 0.0),
            segments=[
                WhisperSegmentModel(
                    id=s.get("id", i),
                    start=s.get("start", 0.0),
                    end=s.get("end", 0.0),
                    text=s.get("text", ""),
                    avg_logprob=s.get("avg_logprob"),
                    no_speech_prob=s.get("no_speech_prob"),
                    compression_ratio=s.get("compression_ratio"),
                )
                for i, s in enumerate(segments_raw)
            ],
            words=[
                WhisperWordModel(
                    word=w.get("word", ""),
                    start=w.get("start", 0.0),
                    end=w.get("end", 0.0),
                )
                for w in words_raw
            ],
            no_speech_prob=round(avg_no_speech, 3),
            avg_logprob=round(avg_logprob, 3),
            is_hallucination_risk=is_hallucination,
            english_translation=text if task == "translate" else None,
        )
