"""
GRAM-DISHA — Financial Structuring Router
Pure mathematical calculations for EMI, Break-even, DSCR, and cash flow.
"""

from typing import List, Optional
from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter(prefix="/finance", tags=["Financial Structuring"])


class FinancialCalculationRequest(BaseModel):
    project_cost: float = Field(..., gt=0, description="Total project setup cost in INR")
    promoter_capital: float = Field(..., ge=0, description="Own funds / equity in INR")
    interest_rate_annual: float = Field(..., gt=0, description="Annual lending rate percent")
    tenure_months: int = Field(..., gt=0, description="Loan repayment tenure in months")
    moratorium_months: int = Field(0, ge=0, description="Grace / moratorium months")
    unit_sale_price: Optional[float] = 100.0
    unit_variable_cost: Optional[float] = 60.0
    monthly_fixed_cost: Optional[float] = None


class CashFlowMonth(BaseModel):
    month: int
    gross_revenue: float
    operating_costs: float
    net_operating_income: float
    debt_service: float
    surplus: float


class FinancialCalculationResponse(BaseModel):
    total_project_cost: float
    promoter_contribution: float
    promoter_contribution_percentage: float
    required_term_loan: float
    required_working_capital_loan: float
    monthly_emi: float
    break_even_monthly_units: int
    break_even_monthly_revenue: float
    projected_annual_roi: float
    projected_dscr: float
    cash_flow_monthly: List[CashFlowMonth]


@router.post("/calculate", response_model=FinancialCalculationResponse)
def calculate_financials(req: FinancialCalculationRequest):
    total_cost = req.project_cost
    promoter_cap = min(total_cost, req.promoter_capital)
    promoter_pct = round((promoter_cap / total_cost) * 100, 1) if total_cost > 0 else 0.0

    net_loan = max(0.0, total_cost - promoter_cap)
    term_loan = round(net_loan * 0.75, 2)
    wc_loan = round(net_loan - term_loan, 2)

    # Deterministic EMI: P * r * (1+r)^n / ((1+r)^n - 1)
    monthly_rate = req.interest_rate_annual / 12.0 / 100.0
    n = req.tenure_months
    if monthly_rate > 0 and n > 0:
        factor = (1 + monthly_rate) ** n
        monthly_emi = round(term_loan * monthly_rate * factor / (factor - 1), 2)
    else:
        monthly_emi = round(term_loan / max(1, n), 2)

    # Break-even
    unit_p = req.unit_sale_price or 100.0
    unit_v = req.unit_variable_cost or 60.0
    fixed_c = req.monthly_fixed_cost or (total_cost * 0.02)
    margin = unit_p - unit_v
    be_units = int(fixed_c / margin) if margin > 0 else 0
    be_rev = round(be_units * unit_p, 2)

    proj_monthly_rev = round(be_rev * 1.45, 2)
    proj_monthly_op = round(fixed_c + (proj_monthly_rev * 0.55), 2)
    noi = proj_monthly_rev - proj_monthly_op
    annual_noi = noi * 12.0
    annual_debt = monthly_emi * 12.0
    dscr = round(annual_noi / annual_debt, 2) if annual_debt > 0 else 9.99

    annual_net_profit = max(0.0, annual_noi - annual_debt)
    roi = round((annual_net_profit / total_cost) * 100, 2) if total_cost > 0 else 0.0

    cash_flows = []
    for m in range(1, 13):
        is_mora = m <= req.moratorium_months
        debt = round(monthly_emi * 0.4, 2) if is_mora else monthly_emi
        rev = round(proj_monthly_rev * (0.85 + (m * 0.02)), 2)
        op = round(proj_monthly_op * (0.90 + (m * 0.015)), 2)
        surp = round(rev - op - debt, 2)
        cash_flows.append(CashFlowMonth(
            month=m,
            gross_revenue=rev,
            operating_costs=op,
            net_operating_income=round(rev - op, 2),
            debt_service=debt,
            surplus=surp,
        ))

    return FinancialCalculationResponse(
        total_project_cost=total_cost,
        promoter_contribution=promoter_cap,
        promoter_contribution_percentage=promoter_pct,
        required_term_loan=term_loan,
        required_working_capital_loan=wc_loan,
        monthly_emi=monthly_emi,
        break_even_monthly_units=be_units,
        break_even_monthly_revenue=be_rev,
        projected_annual_roi=roi,
        projected_dscr=dscr,
        cash_flow_monthly=cash_flows,
    )
