"""
GRAM-DISHA — Finance Service
Coordinates deterministic financial calculations and persists report records.
"""

import uuid
import json
from typing import Optional
from sqlalchemy.orm import Session
from app.db.models import FinancialReportModel, BusinessModel, UserModel
from app.engines.financial_engine import FinancialEngine
from app.schemas.finance import FinancialCalculationRequest, FinancialCalculationResponse


class FinanceService:
    @classmethod
    def calculate_and_store(
        cls,
        db: Session,
        req: FinancialCalculationRequest,
        user: Optional[UserModel] = None
    ) -> FinancialCalculationResponse:
        data = FinancialEngine.structure_project(
            project_cost=req.project_cost,
            promoter_capital=req.promoter_capital,
            interest_rate_annual=req.interest_rate_annual,
            tenure_months=req.tenure_months,
            moratorium_months=req.moratorium_months,
            unit_sale_price=req.unit_sale_price or 100.0,
            unit_variable_cost=req.unit_variable_cost or 60.0,
            monthly_fixed_cost=req.monthly_fixed_cost,
            custom_breakdown=req.custom_breakdown
        )

        biz_id = req.business_id
        if not biz_id and user:
            biz = db.query(BusinessModel).filter(BusinessModel.user_id == user.id).first()
            if biz:
                biz_id = biz.id

        if biz_id:
            # Persist financial report
            report = FinancialReportModel(
                id=f"fin_{uuid.uuid4().hex[:12]}",
                business_id=biz_id,
                project_cost=data["totalProjectCost"],
                promoter_contribution=data["promoterContribution"],
                term_loan=data["requiredTermLoan"],
                working_capital_loan=data["requiredWorkingCapitalLoan"],
                projected_annual_revenue=round(data["breakEvenMonthlyRevenue"] * 1.45 * 12.0, 2),
                annual_operating_cost=round((data["monthlyFixedCost"] + (data["breakEvenMonthlyRevenue"] * 1.45 * 0.55)) * 12.0, 2),
                gross_profit=round(data["breakEvenMonthlyRevenue"] * 1.45 * 0.45 * 12.0, 2),
                net_profit=round(data["breakEvenMonthlyRevenue"] * 1.45 * 12.0 * (data["projectedAnnualROI"] / 100.0), 2),
                dscr=data["projectedDSCR"],
                break_even_percentage=data["contributionMarginPercentage"],
                roi_percentage=data["projectedAnnualROI"],
                payback_period_years=round(data["totalProjectCost"] / max(1.0, data["breakEvenMonthlyRevenue"] * 1.45 * 12.0 * 0.25), 2),
                projections_json=json.dumps(data)
            )
            db.add(report)
            db.commit()

        return FinancialCalculationResponse.model_validate(data)

    @classmethod
    def get_latest_report(cls, db: Session, business_id: str) -> FinancialCalculationResponse:
        report = (
            db.query(FinancialReportModel)
            .filter(FinancialReportModel.business_id == business_id)
            .order_by(FinancialReportModel.created_at.desc())
            .first()
        )
        if report and report.projections_json:
            try:
                data = json.loads(report.projections_json)
                return FinancialCalculationResponse.model_validate(data)
            except Exception:
                pass

        # Fallback to computing from business record
        biz = db.query(BusinessModel).filter(BusinessModel.id == business_id).first()
        cost = biz.project_cost if biz else 850000.0
        equity = biz.promoter_capital if biz else 150000.0
        data = FinancialEngine.structure_project(project_cost=cost, promoter_capital=equity)
        return FinancialCalculationResponse.model_validate(data)
