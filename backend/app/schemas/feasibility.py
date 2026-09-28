"""
GRAM-DISHA — Feasibility Schemas (Pydantic v2)
Dual camelCase and snake_case contracts for HBFS scoring and SWOT analysis.
"""

from typing import List, Optional, Dict, Any
from app.schemas.common import CamelModel


class SWOTAnalysisSchema(CamelModel):
    strengths: List[str] = []
    weaknesses: List[str] = []
    opportunities: List[str] = []
    threats: List[str] = []


class ViabilityOutlookSchema(CamelModel):
    short_term_viability: str
    operating_sustainability: str
    growth_potential: str
    long_term_scalability: str
    scaling_constraints: List[str] = []
    longevity_factors: List[str] = []


class ScoreBreakdownSchema(CamelModel):
    demand: float
    accessibility: float
    infrastructure: float
    socioeconomic: float
    schemes: float
    climate: float
    capital_penalty: float
    uncertainty_penalty: float


class FeasibilityComponentsSchema(CamelModel):
    demand_score: float
    accessibility_score: float
    infrastructure_score: float
    socioeconomic_score: float
    scheme_suitability_score: float
    climate_risk_penalty: float
    capital_penalty: float
    uncertainty_penalty: float


class FeasibilityRequest(CamelModel):
    demand_index: float = 0.75
    accessibility_index: float = 0.70
    infrastructure_index: float = 0.65
    socioeconomic_index: float = 0.60
    scheme_suitability_index: float = 0.85
    climate_vulnerability_index: Optional[float] = 0.1
    capital_deficit_ratio: Optional[float] = 0.1
    uncertainty_ratio: Optional[float] = 0.2
    business_id: Optional[str] = None
    strengths: Optional[List[str]] = None
    weaknesses: Optional[List[str]] = None
    opportunities: Optional[List[str]] = None
    threats: Optional[List[str]] = None


class FeasibilityResponse(CamelModel):
    total_score: float
    ranking_tier: str
    components: Optional[FeasibilityComponentsSchema] = None
    score_breakdown: Optional[ScoreBreakdownSchema] = None
    swot_analysis: SWOTAnalysisSchema
    strengths: List[str] = []
    weaknesses: List[str] = []
    opportunities: List[str] = []
    threats: List[str] = []
    viability_outlook: Optional[ViabilityOutlookSchema] = None
    evidence_gaps: List[str] = []
    disclaimer: str
