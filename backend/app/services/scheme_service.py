"""
GRAM-DISHA — Scheme Service
Orchestrates scheme matching engine, scheme catalog querying, and application submissions.
"""

import uuid
import json
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from app.db.models import SchemeCatalogModel, SchemeApplicationModel, BusinessModel, UserModel
from app.engines.scheme_engine import SchemeEngine
from app.schemas.scheme import (
    SchemeEvalRequest,
    SchemeMatchItemSchema,
    SchemeCatalogItemSchema,
    SchemeApplicationCreateRequest,
    SchemeApplicationResponse
)


class SchemeService:
    @classmethod
    def match_schemes(
        cls,
        db: Session,
        req: SchemeEvalRequest,
        user: Optional[UserModel] = None
    ) -> List[SchemeMatchItemSchema]:
        category = req.category or "OBC"
        gender = req.gender or "MALE"
        is_rural = True if req.is_rural is None else req.is_rural
        project_cost = req.project_cost or 850000.0
        activity_type = req.activity_type or "AGRO_PROCESSING"
        annual_income = req.annual_income or 180000.0

        # Auto-enrich from business record if available
        if req.business_id:
            biz = db.query(BusinessModel).filter(BusinessModel.id == req.business_id).first()
            if biz:
                project_cost = biz.project_cost or project_cost
                is_rural = biz.is_rural
                activity_type = biz.category or activity_type

        # Auto-enrich from user record if available
        if user:
            category = user.category or user.social_category or category
            gender = user.gender or gender

        raw_matches = SchemeEngine.evaluate_schemes(
            category=category,
            gender=gender,
            is_rural=is_rural,
            project_cost=project_cost,
            activity_type=activity_type,
            annual_income=annual_income
        )

        results = []
        for m in raw_matches:
            # Sync alias fields for frontend compatibility
            m["maxSubsidy"] = m.get("maxSubsidyOrAssistance", 0.0)
            m["qualifyingCriteria"] = m.get("qualifyingCriteriaPassed", [])
            results.append(SchemeMatchItemSchema.model_validate(m))

        return results

    @classmethod
    def get_catalog(cls, db: Session) -> List[SchemeCatalogItemSchema]:
        records = db.query(SchemeCatalogModel).filter(SchemeCatalogModel.is_active == True).all()
        if records:
            return [SchemeCatalogItemSchema.model_validate(r) for r in records]

        # Built-in fallback catalog
        fallback_catalog = [
            SchemeCatalogItemSchema(
                id="pmegp",
                name="Prime Minister's Employment Generation Programme (PMEGP)",
                ministry="Ministry of MSME",
                description="Credit-linked subsidy programme to generate employment opportunities through micro-enterprises.",
                max_loan_amount=5000000.0,
                subsidy_percentage=35.0,
                is_active=True
            ),
            SchemeCatalogItemSchema(
                id="mudra_tarun",
                name="Pradhan Mantri MUDRA Yojana (Tarun)",
                ministry="Department of Financial Services",
                description="Collateral-free institutional loans from ₹5 Lakh up to ₹20 Lakh for small scale enterprises.",
                max_loan_amount=2000000.0,
                subsidy_percentage=0.0,
                is_active=True
            ),
            SchemeCatalogItemSchema(
                id="pmfme",
                name="PM Formalisation of Micro Food Processing Enterprises (PMFME)",
                ministry="Ministry of Food Processing Industries",
                description="35% capital subsidy for upgrading agro and food processing micro-units under ODOP.",
                max_loan_amount=1000000.0,
                subsidy_percentage=35.0,
                is_active=True
            ),
            SchemeCatalogItemSchema(
                id="standup_india",
                name="Stand-Up India Scheme",
                ministry="Department of Financial Services",
                description="Bank loans between ₹10 Lakh and ₹100 Lakh for SC/ST and Women entrepreneurs.",
                max_loan_amount=10000000.0,
                subsidy_percentage=0.0,
                is_active=True
            ),
        ]
        return fallback_catalog

    @classmethod
    def create_application(
        cls,
        db: Session,
        req: SchemeApplicationCreateRequest,
        user: Optional[UserModel] = None
    ) -> SchemeApplicationResponse:
        app_id = f"app_{uuid.uuid4().hex[:12]}"
        app_number = f"GD-2026-{uuid.uuid4().hex[:6].upper()}"

        app = SchemeApplicationModel(
            id=app_id,
            business_id=req.business_id,
            user_id=user.id if user else None,
            scheme_id=req.scheme_id,
            scheme_name=req.scheme_name,
            application_number=app_number,
            requested_amount=req.requested_amount,
            calculated_subsidy=req.calculated_subsidy or 0.0,
            status="UNDER_SCRUTINY",
            current_stage="District Industries Centre (DIC) Verification",
            submission_date=datetime.utcnow().strftime("%Y-%m-%d"),
            remarks=req.remarks
        )
        db.add(app)
        db.commit()
        db.refresh(app)

        return SchemeApplicationResponse.model_validate(app)

    @classmethod
    def list_applications(
        cls,
        db: Session,
        business_id: Optional[str] = None,
        user: Optional[UserModel] = None
    ) -> List[SchemeApplicationResponse]:
        query = db.query(SchemeApplicationModel)
        if business_id:
            query = query.filter(SchemeApplicationModel.business_id == business_id)
        elif user and user.role.lower() not in ("admin", "administrator"):
            query = query.filter(SchemeApplicationModel.user_id == user.id)

        apps = query.order_by(SchemeApplicationModel.created_at.desc()).all()
        return [SchemeApplicationResponse.model_validate(a) for a in apps]
