"""
GRAM-DISHA — Disha AI Advisory Domain Router
Endpoints for conversational bilingual guidance, metric explanations, and chat history.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_optional_current_user
from app.db.models import UserModel
from app.schemas.disha import ChatMessageRequest, ChatMessageResponse
from app.services.disha_service import DishaService

router = APIRouter(prefix="/disha", tags=["Disha AI Advisory"])


@router.post("/chat", response_model=ChatMessageResponse)
def chat_with_disha(
    req: ChatMessageRequest,
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_optional_current_user)
):
    """
    Sends a query to Disha AI. Prompts are strictly grounded with verified enterprise financials,
    feasibility indicators, and official scheme rules.
    """
    return DishaService.chat(db=db, req=req, user=current_user)


@router.get("/history/{business_id}", response_model=List[ChatMessageResponse])
def get_disha_history(
    business_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_optional_current_user)
):
    """Retrieves previous advisory conversation history for an enterprise."""
    return DishaService.get_history(db=db, business_id=business_id, user=current_user)


@router.get("/history", response_model=List[ChatMessageResponse])
def get_user_disha_history(
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_optional_current_user)
):
    """Retrieves conversation history for the currently authenticated user."""
    return DishaService.get_history(db=db, user=current_user)
