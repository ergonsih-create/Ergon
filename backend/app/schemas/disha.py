"""
GRAM-DISHA — Disha AI Advisory Schemas (Pydantic v2)
Contracts for conversational chat, grounding metadata, and message history.
"""

from typing import Optional, Dict, Any, List
from datetime import datetime
from app.schemas.common import CamelModel


class ChatMessageRequest(CamelModel):
    message: str
    business_id: Optional[str] = None
    conversation_id: Optional[str] = None
    language: Optional[str] = "en"


class ChatMessageResponse(CamelModel):
    id: str
    conversation_id: Optional[str] = None
    role: str
    content: str
    grounding_refs: Optional[Dict[str, Any]] = None
    created_at: Optional[str] = None
