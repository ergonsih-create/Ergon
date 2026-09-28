"""
GRAM-DISHA — Financial Structuring Router
Pure mathematical calculations for EMI, Break-even, DSCR, and cash flow.
"""

from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_optional_current_user
from app.db.models import UserModel
from app.schemas.finance import FinancialCalculationRequest, FinancialCalculationResponse
from app.services.finance_service import FinanceService

router = APIRouter(prefix="/finance", tags=["Financial Structuring"])


@router.post("/calculate", response_model=FinancialCalculationResponse)
def calculate_financials(
    req: FinancialCalculationRequest,
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_optional_current_user)
):
    """
    Computes deterministic debt structure, working capital, EMI, Break-Even, DSCR,
    and 12-month projected cash flows without generative hallucination.
    """
    return FinanceService.calculate_and_store(db=db, req=req, user=current_user)


@router.get("/{business_id}", response_model=FinancialCalculationResponse)
def get_financial_report(
    business_id: str,
    db: Session = Depends(get_db)
):
    """Retrieves the latest persisted financial structure and cash flows for an enterprise."""
    return FinanceService.get_latest_report(db=db, business_id=business_id)
