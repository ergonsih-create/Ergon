"""
GRAM-DISHA — Business Entity Service
CRUD operations and multi-tenant isolation for micro-enterprise profiles.
"""

import uuid
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.db.models import BusinessModel, UserModel
from app.schemas.business import BusinessCreateRequest, BusinessUpdateRequest, BusinessResponse


class BusinessService:
    @staticmethod
    def _to_response(b: BusinessModel) -> BusinessResponse:
        display_name = b.name or b.enterprise_name or "Rural Enterprise"
        return BusinessResponse(
            id=b.id,
            user_id=b.user_id,
            name=display_name,
            title=display_name,
            enterprise_name=display_name,
            category=b.category or "AGRO_PROCESSING",
            industry_type=b.industry_type or "Manufacturing",
            sector=b.sector or "Agro-Processing",
            location_type=b.location_type or "Rural",
            entity_type=b.entity_type or "Proprietorship",
            stage=b.stage or "Idea / Inception",
            project_cost=b.project_cost or 850000.0,
            promoter_capital=b.promoter_capital or 150000.0,
            status=b.status or "PLANNING",
            state=b.state or "Maharashtra",
            district=b.district or "Yavatmal",
            block=b.block or "Pusad",
            pin_code=b.pin_code,
            is_rural=b.is_rural,
            odop_commodity=b.odop_commodity,
            pan_number=b.pan_number,
            udyam_number=b.udyam_number,
            created_at=b.created_at,
            updated_at=b.updated_at
        )

    @classmethod
    def list_businesses(cls, db: Session, user: Optional[UserModel] = None) -> List[BusinessResponse]:
        query = db.query(BusinessModel)
        if user and user.role.lower() not in ("admin", "administrator"):
            query = query.filter(BusinessModel.user_id == user.id)
            
        records = query.all()
        return [cls._to_response(b) for b in records]

    @classmethod
    def get_business(cls, db: Session, business_id: str, user: Optional[UserModel] = None) -> BusinessResponse:
        biz = db.query(BusinessModel).filter(BusinessModel.id == business_id).first()
        if not biz:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Business profile with ID '{business_id}' does not exist."
            )
        if user and user.role.lower() not in ("admin", "administrator") and biz.user_id and biz.user_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this business profile."
            )
        return cls._to_response(biz)

    @classmethod
    def create_business(cls, db: Session, req: BusinessCreateRequest, user: Optional[UserModel] = None) -> BusinessResponse:
        biz_id = req.id or f"biz_{uuid.uuid4().hex[:12]}"
        
        # Check if ID already exists (upsert behavior)
        existing = db.query(BusinessModel).filter(BusinessModel.id == biz_id).first()
        if existing:
            update_req = BusinessUpdateRequest(**req.model_dump(exclude_unset=True))
            return cls.update_business(db, biz_id, update_req, user)

        display_name = req.name or req.title or req.enterprise_name or "New Rural Enterprise"
        
        state_val = req.state or (req.proposed_location.state if req.proposed_location else "Maharashtra")
        district_val = req.district or (req.proposed_location.district if req.proposed_location else "Yavatmal")
        block_val = req.block or (req.proposed_location.block if req.proposed_location else "Pusad")
        is_rural_val = req.proposed_location.is_rural if req.proposed_location else (req.location_type != "Urban")

        biz = BusinessModel(
            id=biz_id,
            user_id=user.id if user else None,
            name=display_name,
            enterprise_name=display_name,
            category=req.category or "AGRO_PROCESSING",
            industry_type=req.industry_type or "Manufacturing",
            sector=req.sector or "Agro-Processing",
            location_type=req.location_type or "Rural",
            entity_type=req.entity_type or "Proprietorship",
            stage=req.stage or "Idea / Inception",
            project_cost=req.project_cost or 850000.0,
            promoter_capital=req.promoter_capital or 150000.0,
            state=state_val,
            district=district_val,
            block=block_val,
            pin_code=req.pin_code,
            is_rural=is_rural_val,
            odop_commodity=req.odop_commodity or "Cotton & Chana Processing",
            pan_number=req.pan_number,
            udyam_number=req.udyam_number,
            status="PLANNING"
        )
        db.add(biz)
        db.commit()
        db.refresh(biz)
        return cls._to_response(biz)

    @classmethod
    def update_business(
        cls, db: Session, business_id: str, req: BusinessUpdateRequest, user: Optional[UserModel] = None
    ) -> BusinessResponse:
        biz = db.query(BusinessModel).filter(BusinessModel.id == business_id).first()
        if not biz:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Business profile with ID '{business_id}' does not exist."
            )
        if user and user.role.lower() not in ("admin", "administrator") and biz.user_id and biz.user_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to modify this business profile."
            )

        name_val = req.name or req.title or req.enterprise_name
        if name_val:
            biz.name = name_val
            biz.enterprise_name = name_val
        if req.category is not None: biz.category = req.category
        if req.industry_type is not None: biz.industry_type = req.industry_type
        if req.sector is not None: biz.sector = req.sector
        if req.location_type is not None: biz.location_type = req.location_type
        if req.entity_type is not None: biz.entity_type = req.entity_type
        if req.stage is not None: biz.stage = req.stage
        if req.project_cost is not None: biz.project_cost = req.project_cost
        if req.promoter_capital is not None: biz.promoter_capital = req.promoter_capital
        if req.state is not None: biz.state = req.state
        if req.district is not None: biz.district = req.district
        if req.block is not None: biz.block = req.block
        if req.pin_code is not None: biz.pin_code = req.pin_code
        if req.odop_commodity is not None: biz.odop_commodity = req.odop_commodity
        if req.pan_number is not None: biz.pan_number = req.pan_number
        if req.udyam_number is not None: biz.udyam_number = req.udyam_number
        if req.status is not None: biz.status = req.status

        db.commit()
        db.refresh(biz)
        return cls._to_response(biz)

    @classmethod
    def delete_business(cls, db: Session, business_id: str, user: Optional[UserModel] = None) -> dict:
        biz = db.query(BusinessModel).filter(BusinessModel.id == business_id).first()
        if not biz:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Business profile with ID '{business_id}' does not exist."
            )
        if user and user.role.lower() not in ("admin", "administrator") and biz.user_id and biz.user_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to delete this business profile."
            )
        db.delete(biz)
        db.commit()
        return {"success": True, "message": f"Business '{business_id}' deleted successfully."}
