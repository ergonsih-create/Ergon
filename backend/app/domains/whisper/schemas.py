"""
GRAM-DISHA — OpenAI Whisper Speech Intelligence Schemas (Pydantic v2)
Smart India Hackathon 2026 (Team ERGON)
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class WhisperWordModel(BaseModel):
    word: str
    start: float
    end: float


class WhisperSegmentModel(BaseModel):
    id: int
    start: float
    end: float
    text: str
    avg_logprob: Optional[float] = None
    no_speech_prob: Optional[float] = None
    compression_ratio: Optional[float] = None


class WhisperTranscriptionResponse(BaseModel):
    text: str
    language: str
    language_name: str
    language_script: str
    direction: str = "ltr"
    language_detection_method: str = "whisper_auto_detected"
    language_confidence: float
    duration: float
    segments: List[WhisperSegmentModel] = []
    words: List[WhisperWordModel] = []
    no_speech_prob: Optional[float] = None
    avg_logprob: Optional[float] = None
    is_hallucination_risk: bool = False
    english_translation: Optional[str] = None


class WhisperConfigResponse(BaseModel):
    has_api_key: bool
    model: str
    api_base_url: str
    supported_languages_count: int
    supported_formats: List[str]
    max_duration_seconds: int = 120
    min_duration_seconds: float = 0.6


class DishaVoiceIntentRequest(BaseModel):
    transcript: str
    language: Optional[str] = "en"
    current_module: Optional[str] = "DASHBOARD"
    district: Optional[str] = None
    business_activity: Optional[str] = None
    demographics: Optional[Dict[str, Any]] = None


class DishaVoiceIntentResponse(BaseModel):
    intent: str
    confidence: float
    original_transcript: str
    language: str
    entities: Dict[str, Any] = {}
    explanation: str
    evidence_source: str
    suggested_actions: List[Dict[str, Any]] = []
    requires_confirmation: bool = False
    confirmation_prompt: Optional[str] = None
    is_uncertain: bool = False
