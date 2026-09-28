"""
GRAM-DISHA — Deterministic Engine Test Suite
Validates mathematical calculations and statutory scheme logic.
"""

import pytest
from app.engines.financial_engine import FinancialEngine
from app.engines.scheme_engine import SchemeEngine
from app.engines.feasibility_engine import FeasibilityEngine


# ==========================================
# 1. Financial Engine Tests
# ==========================================

def test_financial_engine_emi_calculation():
    # Principal: 5,00,000, 10% annual, 60 months
    emi = FinancialEngine.calculate_emi(500000.0, 10.0, 60)
    assert emi > 0
    # Expected EMI is approx 10,624
    assert 10500 <= emi <= 10700


def test_financial_engine_dscr_calculation():
    noi = 300000.0
    debt_service = 150000.0
    dscr = FinancialEngine.calculate_dscr(noi, debt_service)
    assert dscr == 2.0


def test_financial_engine_break_even():
    fixed_cost = 20000.0
    unit_price = 100.0
    unit_var_cost = 60.0
    bep = FinancialEngine.calculate_break_even(fixed_cost, unit_price, unit_var_cost)
    # Margin = 40. Units = 20000 / 40 = 500
    assert bep["units"] == 500
    assert bep["revenue"] == 50000.0
    assert bep["margin"] == 40.0


def test_financial_engine_structure_project():
    res = FinancialEngine.structure_project(
        project_cost=1000000.0,
        promoter_capital=150000.0,
        interest_rate_annual=9.5,
        tenure_months=60
    )
    assert res["totalProjectCost"] == 1000000.0
    assert res["promoterContribution"] == 150000.0
    assert res["promoterContributionPercentage"] == 15.0
    assert res["requiredTermLoan"] > 0
    assert res["requiredWorkingCapitalLoan"] > 0
    assert len(res["cashFlowMonthly"]) == 12
    assert len(res["fiveYearProjections"]) == 5
    assert res["projectedDSCR"] > 0


# ==========================================
# 2. Scheme Engine Tests
# ==========================================

def test_pmegp_rural_special_category_subsidy():
    # Rural Women / OBC setup: should receive 35% subsidy and 5% promoter margin
    matches = SchemeEngine.evaluate_schemes(
        category="OBC",
        gender="FEMALE",
        is_rural=True,
        project_cost=1000000.0,
        activity_type="MANUFACTURING"
    )
    pmegp = next((s for s in matches if s["schemeCode"] == "PMEGP"), None)
    assert pmegp is not None
    assert pmegp["subsidyPercentage"] == 35.0
    assert pmegp["maxSubsidyOrAssistance"] == 350000.0
    assert pmegp["promoterContributionRequiredPercent"] == 5.0
    assert pmegp["eligibilityState"] == "POTENTIALLY_ELIGIBLE"


def test_pmegp_urban_general_subsidy():
    # Urban General Male setup: should receive 15% subsidy and 10% promoter margin
    matches = SchemeEngine.evaluate_schemes(
        category="GENERAL",
        gender="MALE",
        is_rural=False,
        project_cost=1000000.0,
        activity_type="MANUFACTURING"
    )
    pmegp = next((s for s in matches if s["schemeCode"] == "PMEGP"), None)
    assert pmegp is not None
    assert pmegp["subsidyPercentage"] == 15.0
    assert pmegp["maxSubsidyOrAssistance"] == 150000.0
    assert pmegp["promoterContributionRequiredPercent"] == 10.0


def test_mudra_shishu_tier():
    matches = SchemeEngine.evaluate_schemes(
        category="GENERAL",
        gender="MALE",
        is_rural=True,
        project_cost=45000.0,
        activity_type="SERVICE"
    )
    mudra = next((s for s in matches if "MUDRA" in s["schemeCode"]), None)
    assert mudra is not None
    assert mudra["schemeCode"] == "MUDRA_SHISHU"
    assert mudra["eligibleLoanAmount"] == 45000.0


def test_pmfme_food_processing_subsidy():
    matches = SchemeEngine.evaluate_schemes(
        category="GENERAL",
        gender="MALE",
        is_rural=True,
        project_cost=800000.0,
        activity_type="AGRO_PROCESSING"
    )
    pmfme = next((s for s in matches if s["schemeCode"] == "PMFME"), None)
    assert pmfme is not None
    # 35% of 800000 = 280000
    assert pmfme["subsidyPercentage"] == 35.0
    assert pmfme["maxSubsidyOrAssistance"] == 280000.0


# ==========================================
# 3. Feasibility Engine Tests
# ==========================================

def test_feasibility_engine_hbfs_bounds():
    res = FeasibilityEngine.calculate_hbfs(
        demand_index=0.8,
        accessibility_index=0.75,
        infrastructure_index=0.7,
        socioeconomic_index=0.65,
        scheme_suitability_index=0.85,
        climate_vulnerability_index=0.1,
        capital_deficit_ratio=0.1,
        uncertainty_ratio=0.1
    )
    assert 0.0 <= res["totalScore"] <= 1.0
    assert res["rankingTier"] in ("HIGH_FEASIBILITY", "MODERATE_FEASIBILITY", "LOW_FEASIBILITY")
    assert "strengths" in res["swotAnalysis"]
    assert len(res["swotAnalysis"]["strengths"]) > 0


def test_feasibility_engine_evidence_insufficient():
    # If uncertainty is higher than 0.45, tier must be EVIDENCE_INSUFFICIENT
    res = FeasibilityEngine.calculate_hbfs(
        demand_index=0.8,
        accessibility_index=0.75,
        infrastructure_index=0.7,
        socioeconomic_index=0.65,
        scheme_suitability_index=0.85,
        uncertainty_ratio=0.55
    )
    assert res["rankingTier"] == "EVIDENCE_INSUFFICIENT"
