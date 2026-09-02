"""
Unit Test Suite for HBFS Feasibility Engine
Formula: HBFS = 0.25*D + 0.15*A + 0.10*I + 0.10*S + 0.10*Sc - 0.05*C - 0.15*Cap - 0.20*U
All terms bounded [0.0, 1.0]
"""

import pytest


def calculate_hbfs(
    demand: float,
    accessibility: float,
    infrastructure: float,
    socioeconomic: float,
    scheme: float,
    climate_risk: float,
    capital_deficit: float,
    uncertainty: float,
) -> float:
    raw = (
        (0.25 * demand)
        + (0.15 * accessibility)
        + (0.10 * infrastructure)
        + (0.10 * socioeconomic)
        + (0.10 * scheme)
        - (0.05 * climate_risk)
        - (0.15 * capital_deficit)
        - (0.20 * uncertainty)
    )
    return round(max(0.0, min(1.0, raw)), 3)


def test_perfect_feasibility_score():
    # D=1, A=1, I=1, S=1, Sc=1, C=0, Cap=0, U=0 -> 0.25+0.15+0.1+0.1+0.1 = 0.70
    score = calculate_hbfs(1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0)
    assert score == 0.70


def test_high_uncertainty_penalty():
    # If uncertainty U=1.0, score is deducted by 0.20
    score_normal = calculate_hbfs(0.8, 0.8, 0.8, 0.8, 0.8, 0.1, 0.1, 0.0)
    score_uncertain = calculate_hbfs(0.8, 0.8, 0.8, 0.8, 0.8, 0.1, 0.1, 1.0)
    assert score_normal - score_uncertain == pytest.approx(0.20, 0.001)


def test_lower_bound_zero_clamping():
    # Extreme penalties should never result in negative score
    score = calculate_hbfs(0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0)
    assert score == 0.0
