"""
GRAM-DISHA — Financial Schemas (Pydantic v2)
Dual camelCase and snake_case contracts for banking calculations, DSCR, and cash flows.
"""

from typing import List, Optional, Dict, Any
from app.schemas.common import CamelModel


class ProjectCostBreakdownSchema(CamelModel):
    fixed_assets: float = 0.0
    equipment_and_machinery: float = 0.0
    infrastructure_setup: float = 0.0
    initial_raw_material_inventory: float = 0.0
    working_capital_contingency: float = 0.0
    statutory_licensing_costs: float = 0.0
    total_project_cost: float = 0.0


class CashFlowMonthSchema(CamelModel):
    month: int
    gross_revenue: float = 0.0
    variable_costs: float = 0.0
    fixed_costs: float = 0.0
    net_operating_income: float = 0.0
    debt_service: float = 0.0
    surplus: float = 0.0
    closing_cash: float = 0.0


class FiveYearYearSchema(CamelModel):
    year: int
    revenue: float
    operating_expenses: float
    depreciation: float
    interest: float
    net_profit: float
    dscr: float


from pydantic import Field


class FinancialCalculationRequest(CamelModel):
    project_cost: float = Field(..., gt=0, description="Total project capital outlay in INR (must be > 0)")
    promoter_capital: float = Field(..., ge=0, description="Promoter equity contribution in INR (must be >= 0)")
    interest_rate_annual: float = Field(default=9.5, ge=0)
    tenure_months: int = Field(default=60, gt=0)
    moratorium_months: int = Field(default=6, ge=0)
    unit_sale_price: Optional[float] = 100.0
    unit_variable_cost: Optional[float] = 60.0
    monthly_fixed_cost: Optional[float] = None
    business_id: Optional[str] = None
    custom_breakdown: Optional[Dict[str, float]] = None


class FinancialCalculationResponse(CamelModel):
    project_cost: Optional[ProjectCostBreakdownSchema] = None
    total_project_cost: float
    promoter_contribution: float
    promoter_contribution_percentage: float
    required_term_loan: float
    required_working_capital_loan: float
    interest_rate_annual: float
    tenure_months: int
    moratorium_months: int
    monthly_emi: float
    unit_selling_price: float
    unit_variable_cost: float
    monthly_fixed_cost: float
    contribution_margin_per_unit: float
    contribution_margin_percentage: float
    break_even_monthly_units: int
    break_even_monthly_revenue: float
    projected_annual_roi: float
    projected_dscr: float
    debt_to_equity_ratio: str
    cash_flow_monthly: List[CashFlowMonthSchema] = []
    five_year_projections: List[FiveYearYearSchema] = []
