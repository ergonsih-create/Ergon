"""
GRAM-DISHA — Deterministic Financial Engine
Pure mathematical, formula-bound calculations independent of generative AI.
Calculates project cost breakdown, term loan/working capital split, EMI,
break-even, DSCR, ROI, and 5-year profitability projections.
"""

from typing import Dict, Any, List, Optional
import math


class FinancialEngine:
    @staticmethod
    def calculate_emi(principal: float, annual_rate_percent: float, tenure_months: int) -> float:
        if principal <= 0 or tenure_months <= 0:
            return 0.0
        if annual_rate_percent <= 0:
            return round(principal / tenure_months, 2)

        monthly_rate = annual_rate_percent / 12.0 / 100.0
        numerator = principal * monthly_rate * math.pow(1.0 + monthly_rate, tenure_months)
        denominator = math.pow(1.0 + monthly_rate, tenure_months) - 1.0

        if denominator == 0:
            return 0.0
        return round(numerator / denominator, 2)

    @staticmethod
    def calculate_break_even(monthly_fixed_cost: float, unit_price: float, unit_variable_cost: float) -> Dict[str, Any]:
        contribution_margin = max(1.0, unit_price - unit_variable_cost)
        if monthly_fixed_cost <= 0:
            return {"units": 0, "revenue": 0.0, "margin": round(contribution_margin, 2)}

        units = math.ceil(monthly_fixed_cost / contribution_margin)
        revenue = round(units * unit_price, 2)
        return {"units": units, "revenue": revenue, "margin": round(contribution_margin, 2)}

    @staticmethod
    def calculate_roi(annual_net_profit: float, total_project_cost: float) -> float:
        if total_project_cost <= 0:
            return 0.0
        return round((annual_net_profit / total_project_cost) * 100.0, 2)

    @staticmethod
    def calculate_dscr(annual_net_operating_income: float, annual_debt_service: float) -> float:
        if annual_debt_service <= 0:
            return 9.99
        return round(annual_net_operating_income / annual_debt_service, 2)

    @classmethod
    def structure_project(
        cls,
        project_cost: float,
        promoter_capital: float,
        interest_rate_annual: float = 9.5,
        tenure_months: int = 60,
        moratorium_months: int = 6,
        unit_sale_price: float = 100.0,
        unit_variable_cost: float = 60.0,
        monthly_fixed_cost: Optional[float] = None,
        custom_breakdown: Optional[Dict[str, float]] = None,
    ) -> Dict[str, Any]:
        total_project_cost = max(0.0, float(project_cost))
        promoter_contribution = min(total_project_cost, max(0.0, float(promoter_capital)))
        promoter_contribution_pct = (
            round((promoter_contribution / total_project_cost) * 100.0, 1)
            if total_project_cost > 0 else 0.0
        )

        net_loan = max(0.0, total_project_cost - promoter_contribution)
        required_term_loan = round(net_loan * 0.85, 2)
        required_wc_loan = round(net_loan - required_term_loan, 2)

        monthly_emi = cls.calculate_emi(required_term_loan, interest_rate_annual, tenure_months)

        unit_p = unit_sale_price or 100.0
        unit_v = unit_variable_cost or 60.0
        fixed_cost = monthly_fixed_cost if monthly_fixed_cost is not None else round(total_project_cost * 0.02, 2)

        break_even = cls.calculate_break_even(fixed_cost, unit_p, unit_v)
        margin_pct = round(((unit_p - unit_v) / unit_p) * 100.0, 1) if unit_p > 0 else 35.0

        projected_rev = round(break_even["revenue"] * 1.45, 2)
        projected_op_cost = round(fixed_cost + (projected_rev * 0.55), 2)
        noi = round(projected_rev - projected_op_cost, 2)

        annual_noi = round(noi * 12.0, 2)
        annual_debt_service = round(monthly_emi * 12.0, 2)
        projected_dscr = cls.calculate_dscr(annual_noi, annual_debt_service)

        annual_net_profit = max(0.0, round(annual_noi - annual_debt_service, 2))
        projected_annual_roi = cls.calculate_roi(annual_net_profit, total_project_cost)

        debt_to_equity = (
            f"{(required_term_loan / promoter_contribution):.1f}:1"
            if promoter_contribution > 0 else "100% Debt"
        )

        cb = custom_breakdown or {}
        project_cost_breakdown = {
            "fixedAssets": cb.get("fixedAssets", round(total_project_cost * 0.07, 2)),
            "equipmentAndMachinery": cb.get("equipmentAndMachinery", round(total_project_cost * 0.53, 2)),
            "infrastructureSetup": cb.get("infrastructureSetup", round(total_project_cost * 0.21, 2)),
            "initialRawMaterialInventory": cb.get("initialRawMaterialInventory", round(total_project_cost * 0.10, 2)),
            "workingCapitalContingency": cb.get("workingCapitalContingency", round(total_project_cost * 0.07, 2)),
            "statutoryLicensingCosts": cb.get("statutoryLicensingCosts", round(total_project_cost * 0.02, 2)),
            "totalProjectCost": total_project_cost,
            "fixed_assets": cb.get("fixedAssets", round(total_project_cost * 0.07, 2)),
            "equipment_and_machinery": cb.get("equipmentAndMachinery", round(total_project_cost * 0.53, 2)),
            "infrastructure_setup": cb.get("infrastructureSetup", round(total_project_cost * 0.21, 2)),
            "initial_raw_material_inventory": cb.get("initialRawMaterialInventory", round(total_project_cost * 0.10, 2)),
            "working_capital_contingency": cb.get("workingCapitalContingency", round(total_project_cost * 0.07, 2)),
            "statutory_licensing_costs": cb.get("statutoryLicensingCosts", round(total_project_cost * 0.02, 2)),
            "total_project_cost": total_project_cost,
        }

        running_cash = promoter_contribution * 0.2
        projected_monthly_cash_flow = []
        cash_flow_monthly = []

        for i in range(12):
            month = i + 1
            is_moratorium = month <= moratorium_months
            debt = round(monthly_emi * 0.35, 2) if is_moratorium else monthly_emi
            gross_rev = round(projected_rev * (0.85 + (i * 0.025)), 2)
            var_cost = round(gross_rev * (unit_v / unit_p), 2) if unit_p > 0 else 0.0
            net = round(gross_rev - (var_cost + fixed_cost), 2)
            surplus = round(net - debt, 2)
            running_cash += surplus

            entry = {
                "month": month,
                "cashInflows": gross_rev,
                "variableExpenses": var_cost,
                "fixedExpenses": fixed_cost,
                "debtServiceEMI": debt,
                "netCashFlow": surplus,
                "closingCashBalance": round(running_cash, 2),
                "grossRevenue": gross_rev,
                "variableCosts": var_cost,
                "fixedCosts": fixed_cost,
                "netOperatingIncome": net,
                "debtService": debt,
                "surplus": surplus,
                "closingCash": round(running_cash, 2),
                "gross_revenue": gross_rev,
                "variable_costs": var_cost,
                "fixed_costs": fixed_cost,
                "net_operating_income": net,
                "debt_service": debt,
                "closing_cash": round(running_cash, 2),
            }
            projected_monthly_cash_flow.append(entry)
            cash_flow_monthly.append(entry)

        five_year_projections = []
        base_annual_rev = projected_rev * 12.0
        base_annual_cost = projected_op_cost * 12.0

        for yr in range(1, 6):
            scale_factor = 1.0 + (yr - 1) * 0.12
            yr_rev = round(base_annual_rev * scale_factor, 2)
            yr_cost = round(base_annual_cost * scale_factor * 0.95, 2)
            yr_deprec = round((project_cost_breakdown["equipmentAndMachinery"] * 0.15) / yr, 2)
            yr_interest = round(annual_debt_service * max(0.2, (6 - yr) / 5.0), 2)
            yr_pat = round(max(0.0, yr_rev - yr_cost - yr_deprec - yr_interest), 2)
            yr_dscr = round((yr_pat + yr_deprec + yr_interest) / max(1.0, annual_debt_service), 2)

            five_year_projections.append({
                "year": yr,
                "revenue": yr_rev,
                "operatingExpenses": yr_cost,
                "operating_expenses": yr_cost,
                "depreciation": yr_deprec,
                "interest": yr_interest,
                "netProfit": yr_pat,
                "net_profit": yr_pat,
                "dscr": yr_dscr
            })

        return {
            "projectCost": project_cost_breakdown,
            "project_cost": project_cost_breakdown,
            "totalProjectCost": total_project_cost,
            "total_project_cost": total_project_cost,
            "promoterContribution": promoter_contribution,
            "promoter_contribution": promoter_contribution,
            "promoterContributionPercentage": promoter_contribution_pct,
            "promoter_contribution_percentage": promoter_contribution_pct,
            "requiredTermLoan": required_term_loan,
            "required_term_loan": required_term_loan,
            "requiredWorkingCapitalLoan": required_wc_loan,
            "required_working_capital_loan": required_wc_loan,
            "interestRateAnnual": interest_rate_annual,
            "interest_rate_annual": interest_rate_annual,
            "tenureMonths": tenure_months,
            "tenure_months": tenure_months,
            "moratoriumMonths": moratorium_months,
            "moratorium_months": moratorium_months,
            "monthlyEMI": monthly_emi,
            "monthly_emi": monthly_emi,
            "unitSellingPrice": unit_p,
            "unit_selling_price": unit_p,
            "unitVariableCost": unit_v,
            "unit_variable_cost": unit_v,
            "monthlyFixedCost": fixed_cost,
            "monthly_fixed_cost": fixed_cost,
            "contributionMarginPerUnit": break_even["margin"],
            "contribution_margin_per_unit": break_even["margin"],
            "contributionMarginPercentage": margin_pct,
            "contribution_margin_percentage": margin_pct,
            "breakEvenMonthlyUnits": break_even["units"],
            "break_even_monthly_units": break_even["units"],
            "breakEvenMonthlyRevenue": break_even["revenue"],
            "break_even_monthly_revenue": break_even["revenue"],
            "projectedAnnualROI": projected_annual_roi,
            "projected_annual_roi": projected_annual_roi,
            "projectedDSCR": projected_dscr,
            "projected_dscr": projected_dscr,
            "debtToEquityRatio": debt_to_equity,
            "debt_to_equity_ratio": debt_to_equity,
            "projectedMonthlyCashFlow": projected_monthly_cash_flow,
            "cashFlowMonthly": cash_flow_monthly,
            "cash_flow_monthly": cash_flow_monthly,
            "fiveYearProjections": five_year_projections,
            "five_year_projections": five_year_projections,
        }
