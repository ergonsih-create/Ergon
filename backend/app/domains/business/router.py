"""
GRAM-DISHA — Business Domain Router
RESTful endpoints for enterprise entity management, matching frontend BusinessService.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_optional_current_user
from app.db.models import UserModel
from app.schemas.business import BusinessCreateRequest, BusinessUpdateRequest, BusinessResponse
from app.services.business_service import BusinessService

router = APIRouter(prefix="/businesses", tags=["Business Enterprises"])


@router.get("", response_model=List[BusinessResponse])
def get_businesses(
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_optional_current_user)
):
    """Retrieve all business profiles registered by the current user."""
    return BusinessService.list_businesses(db=db, user=current_user)


@router.post("", response_model=BusinessResponse, status_code=status.HTTP_201_CREATED)
def create_business(
    req: BusinessCreateRequest,
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_optional_current_user)
):
    """Register a new enterprise profile or upsert existing one."""
    return BusinessService.create_business(db=db, req=req, user=current_user)


@router.get("/{business_id}", response_model=BusinessResponse)
def get_business_by_id(
    business_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_optional_current_user)
):
    """Retrieve details of a specific business profile."""
    return BusinessService.get_business(db=db, business_id=business_id, user=current_user)


@router.put("/{business_id}", response_model=BusinessResponse)
def update_business(
    business_id: str,
    req: BusinessUpdateRequest,
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_optional_current_user)
):
    """Update enterprise operational attributes, project costs, or status."""
    return BusinessService.update_business(db=db, business_id=business_id, req=req, user=current_user)


@router.delete("/{business_id}")
def delete_business(
    business_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_optional_current_user)
):
    """Remove a business profile."""
    return BusinessService.delete_business(db=db, business_id=business_id, user=current_user)
