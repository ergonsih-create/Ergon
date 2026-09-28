"""
GRAM-DISHA — Versioned Government Schemes Router
Evaluates candidate subsidies against official rule definitions and catalogs.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_optional_current_user
from app.db.models import UserModel
from app.schemas.scheme import (
    SchemeEvalRequest,
    SchemeMatchItemSchema,
    SchemeCatalogItemSchema,
    SchemeApplicationCreateRequest,
    SchemeApplicationResponse
)
from app.services.scheme_service import SchemeService

router = APIRouter(prefix="/schemes", tags=["Government Schemes"])


@router.post("/match", response_model=List[SchemeMatchItemSchema])
def match_schemes(
    req: SchemeEvalRequest,
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_optional_current_user)
):
    """
    Evaluates enterprise profile and demographics against official scheme rules
    (PMEGP, MUDRA Shishu/Kishore/Tarun, PMFME, Stand-Up India, NSFDC).
    """
    return SchemeService.match_schemes(db=db, req=req, user=current_user)


@router.get("/catalog", response_model=List[SchemeCatalogItemSchema])
def get_schemes_catalog(db: Session = Depends(get_db)):
    """Lists all active central and state micro-enterprise financial schemes."""
    return SchemeService.get_catalog(db=db)


@router.post("/apply", response_model=SchemeApplicationResponse, status_code=status.HTTP_201_CREATED)
def submit_scheme_application(
    req: SchemeApplicationCreateRequest,
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_optional_current_user)
):
    """Submits an official scheme application linked to the enterprise."""
    return SchemeService.create_application(db=db, req=req, user=current_user)


@router.get("/applications", response_model=List[SchemeApplicationResponse])
def get_scheme_applications(
    business_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_optional_current_user)
):
    """Retrieves all submitted scheme applications for an enterprise or citizen."""
    return SchemeService.list_applications(db=db, business_id=business_id, user=current_user)
