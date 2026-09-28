"""
GRAM-DISHA — Backend AI/NLP Provider-Agnostic Interface
Technology choice remains pending approval.
This base class guarantees that any future LLM/NLP provider implements
the strict schema-governed contract without leaking vendor specifics.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from pydantic import BaseModel


class ExplanationPayload(BaseModel):
    topic: str
    user_context: Dict[str, Any]
    verified_facts: Dict[str, Any]
    language: Optional[str] = "en-IN"


class ExplanationResult(BaseModel):
    summary_text: str
    key_insights: List[str]
    action_recommendation: str
    evidence_disclaimer: str
    confidence: float


class IntentPayload(BaseModel):
    user_prompt: str
    workflow_step: str


class IntentResult(BaseModel):
    detected_intent: str
    extracted_parameters: Dict[str, Any]
    confidence: float


class BaseAIProvider(ABC):
    @abstractmethod
    async def generate_explanation(self, payload: ExplanationPayload) -> ExplanationResult:
        """Synthesize natural language explanations bound strictly to verified facts."""
        pass

    @abstractmethod
    async def extract_intent(self, payload: IntentPayload) -> IntentResult:
        """Extract structured domain intent from colloquial multilingual user prompts."""
        pass
