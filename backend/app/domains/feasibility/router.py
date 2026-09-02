"""
GRAM-DISHA — Feasibility & HBFS Scoring Router
Formula: HBFS = 0.25*D + 0.15*A + 0.10*I + 0.10*S + 0.10*Sc - 0.05*C - 0.15*Cap - 0.20*U
"""

from typing import List, Optional
from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter(prefix="/feasibility", tags=["Feasibility & SWOT"])


class FeasibilityRequest(BaseModel):
    demand_index: float = Field(..., ge=0, le=1)
    accessibility_index: float = Field(..., ge=0, le=1)
    infrastructure_index: float = Field(..., ge=0, le=1)
    socioeconomic_index: float = Field(..., ge=0, le=1)
    scheme_suitability_index: float = Field(..., ge=0, le=1)
    climate_vulnerability_index: float = Field(0.1, ge=0, le=1)
    capital_deficit_ratio: float = Field(0.1, ge=0, le=1)
    uncertainty_ratio: float = Field(0.2, ge=0, le=1)


class SWOTAnalysis(BaseModel):
    strengths: List[str]
    weaknesses: List[str]
    opportunities: List[str]
    threats: List[str]


class FeasibilityResponse(BaseModel):
    total_score: float
    ranking_tier: str
    swot_analysis: SWOTAnalysis
    evidence_gaps: List[str]
    disclaimer: str


@router.post("/score", response_model=FeasibilityResponse)
def score_feasibility(req: FeasibilityRequest):
    d = req.demand_index
    a = req.accessibility_index
    i = req.infrastructure_index
    s = req.socioeconomic_index
    sc = req.scheme_suitability_index
    c = req.climate_vulnerability_index
    cap = req.capital_deficit_ratio
    u = req.uncertainty_ratio

    raw = (0.25 * d) + (0.15 * a) + (0.10 * i) + (0.10 * s) + (0.10 * sc) - (0.05 * c) - (0.15 * cap) - (0.20 * u)
    score = round(max(0.0, min(1.0, raw)), 3)

    if u > 0.45:
        tier = "EVIDENCE_INSUFFICIENT"
    elif score >= 0.65:
        tier = "HIGH_FEASIBILITY"
    elif score >= 0.40:
        tier = "MODERATE_FEASIBILITY"
    else:
        tier = "LOW_FEASIBILITY"

    evidence_gaps = []
    if u > 0.2:
        evidence_gaps.append("Local unorganized competitor turnover is marked UNKNOWN")

    return FeasibilityResponse(
        total_score=score,
        ranking_tier=tier,
        swot_analysis=SWOTAnalysis(
            strengths=["Local agricultural raw materials available in close radius", "Eligible for state & central capital subsidies"],
            weaknesses=["High initial capital investment for automated machinery", "Initial working capital sensitivity"],
            opportunities=["Direct supply contract with district FPOs and SHG networks", "Export to neighboring urban mandis"],
            threats=["Seasonal raw commodity price volatility", "Power outage contingencies"],
        ),
        evidence_gaps=evidence_gaps,
        disclaimer="HBFS represents an analytical ranking under stated assumptions and official public datasets. It is not an institutional credit sanction or business guarantee.",
    )
