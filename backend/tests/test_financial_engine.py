"""
Unit Test Suite for Deterministic Financial Calculation Engine
Verifies exact mathematical formulas:
- EMI: P * r * (1+r)^n / ((1+r)^n - 1)
- Break-Even: Fixed Cost / Contribution Margin
- DSCR: NOI / Debt Service
"""

import pytest


def calculate_emi(principal: float, annual_rate: float, tenure_months: int) -> float:
    if principal <= 0 or tenure_months <= 0:
        return 0.0
    r = annual_rate / 12.0 / 100.0
    factor = (1 + r) ** tenure_months
    return round(principal * r * factor / (factor - 1), 2)


def calculate_break_even(fixed_cost: float, unit_price: float, unit_var_cost: float) -> int:
    margin = unit_price - unit_var_cost
    if margin <= 0:
        return 0
    return int(fixed_cost / margin)


def calculate_dscr(annual_noi: float, annual_debt_service: float) -> float:
    if annual_debt_service <= 0:
        return 9.99
    return round(annual_noi / annual_debt_service, 2)


def test_emi_calculation_exact():
    # Principal: 5,00,000, Rate: 10.5%, Tenure: 60 months
    # Standard banking EMI is approx Rs. 10,747
    emi = calculate_emi(500000, 10.5, 60)
    assert 10740 <= emi <= 10755


def test_break_even_calculation_exact():
    # Fixed cost: 20,000, Price: 100, Var: 60 -> Margin = 40 -> 500 units
    be_units = calculate_break_even(20000, 100, 60)
    assert be_units == 500


def test_dscr_healthy_coverage():
    # Annual NOI: 3,00,000, Annual Debt Service: 1,50,000 -> DSCR = 2.0
    dscr = calculate_dscr(300000, 150000)
    assert dscr == 2.0


def test_zero_principal_safety():
    assert calculate_emi(0, 10.5, 60) == 0.0
