"""
GRAM-DISHA — Feasibility Service
Coordinates HBFS calculations and persists SWOT/viability assessments.
"""

import uuid
import json
from typing import Optional
from sqlalchemy.orm import Session
from app.db.models import FeasibilityReportModel, BusinessModel, UserModel
from app.engines.feasibility_engine import FeasibilityEngine
from app.schemas.feasibility import FeasibilityRequest, FeasibilityResponse


class FeasibilityService:
    @classmethod
    def calculate_and_store(
        cls,
        db: Session,
        req: FeasibilityRequest,
        user: Optional[UserModel] = None
    ) -> FeasibilityResponse:
        data = FeasibilityEngine.calculate_hbfs(
            demand_index=req.demand_index,
            accessibility_index=req.accessibility_index,
            infrastructure_index=req.infrastructure_index,
            socioeconomic_index=req.socioeconomic_index,
            scheme_suitability_index=req.scheme_suitability_index,
            climate_vulnerability_index=req.climate_vulnerability_index or 0.1,
            capital_deficit_ratio=req.capital_deficit_ratio or 0.1,
            uncertainty_ratio=req.uncertainty_ratio or 0.2,
            strengths=req.strengths,
            weaknesses=req.weaknesses,
            opportunities=req.opportunities,
            threats=req.threats,
        )

        biz_id = req.business_id
        if not biz_id and user:
            biz = db.query(BusinessModel).filter(BusinessModel.user_id == user.id).first()
            if biz:
                biz_id = biz.id

        if biz_id:
            report = FeasibilityReportModel(
                id=f"feas_{uuid.uuid4().hex[:12]}",
                business_id=biz_id,
                overall_score=data["totalScore"],
                market_demand_score=data["components"]["demandScore"],
                financial_viability_score=data["components"]["schemeSuitabilityScore"],
                operational_readiness_score=data["components"]["infrastructureScore"],
                promoter_competence_score=data["components"]["accessibilityScore"],
                verdict=data["rankingTier"],
                strengths_json=json.dumps(data["strengths"]),
                risks_json=json.dumps(data["threats"]),
                recommendations_json=json.dumps(data["opportunities"])
            )
            db.add(report)
            db.commit()

        return FeasibilityResponse.model_validate(data)

    @classmethod
    def get_latest_report(cls, db: Session, business_id: str) -> FeasibilityResponse:
        report = (
            db.query(FeasibilityReportModel)
            .filter(FeasibilityReportModel.business_id == business_id)
            .order_by(FeasibilityReportModel.created_at.desc())
            .first()
        )
        if report:
            data = FeasibilityEngine.calculate_hbfs(
                demand_index=report.market_demand_score,
                accessibility_index=report.promoter_competence_score,
                infrastructure_index=report.operational_readiness_score,
                socioeconomic_index=0.65,
                scheme_suitability_index=report.financial_viability_score,
                strengths=json.loads(report.strengths_json) if report.strengths_json else None,
                threats=json.loads(report.risks_json) if report.risks_json else None,
                opportunities=json.loads(report.recommendations_json) if report.recommendations_json else None
            )
            return FeasibilityResponse.model_validate(data)

        # Fallback default evaluation
        default_data = FeasibilityEngine.calculate_hbfs(
            demand_index=0.78,
            accessibility_index=0.72,
            infrastructure_index=0.68,
            socioeconomic_index=0.64,
            scheme_suitability_index=0.88,
        )
        return FeasibilityResponse.model_validate(default_data)
