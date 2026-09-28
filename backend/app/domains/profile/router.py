"""
GRAM-DISHA — User Profile & Enterprise Settings Router
Manages user demographic criteria, location, Udyam registration, and enterprise configurations.
"""

from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_optional_current_user
from app.db.models import UserModel, BusinessModel
from app.schemas.common import CamelModel

router = APIRouter(prefix="/profile", tags=["User Profile & Enterprise Settings"])


class UserProfileUpdate(CamelModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None
    category: Optional[str] = None
    gender: Optional[str] = None
    age_group: Optional[str] = None
    education_level: Optional[str] = None
    annual_income: Optional[float] = None
    state: Optional[str] = None
    district: Optional[str] = None
    block: Optional[str] = None
    gram_panchayat: Optional[str] = None
    village: Optional[str] = None
    is_rural: Optional[bool] = None
    udyam_number: Optional[str] = None
    bank_ifsc: Optional[str] = None
    preferred_language: Optional[str] = None


class EnterpriseProfileUpdate(CamelModel):
    name: Optional[str] = None
    enterprise_name: Optional[str] = None
    category: Optional[str] = None
    industry_type: Optional[str] = None
    sector: Optional[str] = None
    project_cost: Optional[float] = None
    promoter_capital: Optional[float] = None
    odop_commodity: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    block: Optional[str] = None
    village: Optional[str] = None
    is_rural: Optional[bool] = None


@router.get("")
def get_user_profile(
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_optional_current_user)
):
    user = current_user or db.query(UserModel).first()
    if not user:
        user = UserModel(
            id="user_default",
            email="ramesh.patil@gramdisha.in",
            full_name="Ramesh Patil",
            phone="+91 98223 45678",
            role="ENTREPRENEUR",
            category="OBC",
            social_category="OBC",
            gender="MALE",
            age_group="26-35",
            education_level="HIGHER_SECONDARY",
            annual_income=180000.0,
            state="Maharashtra",
            district="Yavatmal",
            block="Pusad",
            gram_panchayat="Shendurjana Khurd Gram Panchayat",
            village="Shendurjana Khurd",
            is_rural=True,
            udyam_number="UDYAM-MH-33-0094821",
            bank_ifsc="SBIN0000456",
            preferred_language="en",
            created_at=datetime.utcnow()
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "fullName": user.full_name,
        "phone": user.phone,
        "phoneNumber": user.phone,
        "role": user.role,
        "demographics": {
            "category": user.category,
            "gender": user.gender,
            "ageGroup": user.age_group,
            "educationLevel": user.education_level,
            "annualHouseholdIncome": user.annual_income,
        },
        "location": {
            "state": user.state,
            "district": user.district,
            "block": user.block,
            "gramPanchayat": user.gram_panchayat,
            "villageOrLocality": user.village,
            "isRural": user.is_rural,
        },
        "enterprise": {
            "udyamNumber": user.udyam_number,
            "bankIfsc": user.bank_ifsc,
        },
        "preferredLanguage": user.preferred_language
    }


@router.put("")
def update_user_profile(
    req: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_optional_current_user)
):
    user = current_user or db.query(UserModel).first()
    if not user:
        user = UserModel(id="user_default", email="entrepreneur@gramdisha.in", full_name="Rural Entrepreneur")
        db.add(user)

    for field, val in req.model_dump(exclude_unset=True).items():
        if hasattr(user, field) and val is not None:
            setattr(user, field, val)

    user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(user)

    return {"status": "SUCCESS", "message": "Profile updated successfully"}


@router.get("/enterprise")
def get_enterprise_profile(
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_optional_current_user)
):
    query = db.query(BusinessModel)
    if current_user:
        query = query.filter(BusinessModel.user_id == current_user.id)
    biz = query.first()

    if not biz:
        biz = db.query(BusinessModel).first()

    if not biz:
        biz = BusinessModel(
            id="biz_default",
            user_id=current_user.id if current_user else "user_default",
            name="Jai Kisan Agro Flour & Pulse Processing Unit",
            enterprise_name="Jai Kisan Agro Flour & Pulse Processing Unit",
            category="AGRO_PROCESSING",
            industry_type="Manufacturing",
            sector="Agro-Processing",
            location_type="Rural",
            entity_type="Proprietorship",
            stage="Idea / Inception",
            project_cost=850000.0,
            promoter_capital=150000.0,
            status="PLANNING",
            state="Maharashtra",
            district="Yavatmal",
            block="Pusad",
            gram_panchayat="Shendurjana Khurd Gram Panchayat",
            village="Shendurjana Khurd",
            is_rural=True,
            odop_commodity="Cotton & Chana Processing",
            created_at=datetime.utcnow()
        )
        db.add(biz)
        db.commit()
        db.refresh(biz)

    display_name = biz.name or biz.enterprise_name
    return {
        "id": biz.id,
        "name": display_name,
        "title": display_name,
        "enterprise_name": display_name,
        "category": biz.category,
        "industry_type": biz.industry_type,
        "sector": biz.sector,
        "location_type": biz.location_type,
        "project_cost": biz.project_cost,
        "promoter_capital": biz.promoter_capital,
        "status": biz.status,
        "location": {
            "state": biz.state,
            "district": biz.district,
            "block": biz.block,
            "gram_panchayat": biz.gram_panchayat,
            "village": biz.village,
            "is_rural": biz.is_rural,
        },
        "odop_commodity": biz.odop_commodity,
    }


@router.put("/enterprise")
def update_enterprise_profile(
    req: EnterpriseProfileUpdate,
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_optional_current_user)
):
    query = db.query(BusinessModel)
    if current_user:
        query = query.filter(BusinessModel.user_id == current_user.id)
    biz = query.first()

    if not biz:
        biz = db.query(BusinessModel).first()

    if not biz:
        biz = BusinessModel(id="biz_default", user_id="user_default", name="Micro Enterprise", enterprise_name="Micro Enterprise")
        db.add(biz)

    for field, val in req.model_dump(exclude_unset=True).items():
        if field in ("name", "enterprise_name") and val is not None:
            biz.name = val
            biz.enterprise_name = val
        elif hasattr(biz, field) and val is not None:
            setattr(biz, field, val)

    biz.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(biz)

    return {"status": "SUCCESS", "message": "Enterprise profile updated successfully"}
