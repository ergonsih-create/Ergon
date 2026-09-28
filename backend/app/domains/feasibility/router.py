"""
GRAM-DISHA — Feasibility & HBFS Scoring Router
Formula: HBFS = 0.25*D + 0.15*A + 0.10*I + 0.10*S + 0.10*Sc - 0.05*C - 0.15*Cap - 0.20*U
"""

from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_optional_current_user
from app.db.models import UserModel
from app.schemas.feasibility import FeasibilityRequest, FeasibilityResponse
from app.services.feasibility_service import FeasibilityService

router = APIRouter(prefix="/feasibility", tags=["Feasibility & SWOT"])


@router.post("/score", response_model=FeasibilityResponse)
@router.post("/assess", response_model=FeasibilityResponse)
def score_feasibility(
    req: FeasibilityRequest,
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_optional_current_user)
):
    """
    Computes deterministic HBFS viability score, SWOT synthesis, and operational outlook
    based on verified local indicators.
    """
    return FeasibilityService.calculate_and_store(db=db, req=req, user=current_user)


@router.get("/{business_id}", response_model=FeasibilityResponse)
def get_feasibility_report(
    business_id: str,
    db: Session = Depends(get_db)
):
    """Retrieves the latest persisted feasibility assessment for an enterprise."""
    return FeasibilityService.get_latest_report(db=db, business_id=business_id)
