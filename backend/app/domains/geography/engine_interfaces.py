"""
GRAM-DISHA — Engine Dependency Interfaces & Boundaries
Smart India Hackathon 2026 (Team ERGON)
Establishes clean contract boundaries so engines consume only what they are allowed
to consume, preventing hardcoding of scheme rules into district datasets.
"""

from typing import Dict, Any, Optional, List
from app.domains.geography.service import geography_service
from app.domains.geography.schemas import (
    UrbanityClassification,
    RBITierClassification,
    ValueState,
)


class GeographyEngineInterface:
    """Consumes LGD codes, administrative relationships, and territory types."""

    @staticmethod
    def resolve_location_hierarchy(state_code: str, district_code: str) -> Dict[str, Any]:
        state = geography_service.get_state_by_lgd_code(state_code)
        district = geography_service.get_district_by_lgd_code(district_code)

        if not state or not district:
            return {
                "is_valid": False,
                "error": "Invalid State or District LGD code",
                "hierarchy_level": "UNKNOWN",
            }

        # Validate state-district relationship
        if district.state_lgd_code != state.state_lgd_code:
            return {
                "is_valid": False,
                "error": f"District '{district.district_name}' does not belong to state '{state.state_name}'",
                "hierarchy_level": "INVALID_RELATIONSHIP",
            }

        return {
            "is_valid": True,
            "state_name": state.state_name,
            "state_lgd_code": state.state_lgd_code,
            "district_name": district.district_name,
            "district_lgd_code": district.district_lgd_code,
            "territory_type": state.territory_type.value,
            "hierarchy_level": "DISTRICT",
        }


class UrbanityEngineInterface:
    """Consumes urbanity classification and rural population proportions."""

    @staticmethod
    def get_urbanity_metrics(district_code: str) -> Dict[str, Any]:
        return geography_service.get_urbanity_classification(district_code)


class PMEGPEngineInterface:
    """
    Consumes geographic context for PMEGP.
    NOTE: Does NOT determine final eligibility; that is the job of the Scheme Master.
    """

    @staticmethod
    def get_pmegp_geo_tier(district_code: str) -> Dict[str, Any]:
        ctx = geography_service.get_pmegp_context(district_code)
        return {
            "is_rural": ctx.is_rural,
            "urbanity": ctx.urbanity.value,
            "indicative_general_subsidy_pct": ctx.indicative_general_subsidy_pct,
            "indicative_special_subsidy_pct": ctx.indicative_special_subsidy_pct,
            "indicative_promoter_margin_pct": ctx.indicative_promoter_margin_pct,
            "rule_delegation": "SCHEME_RULES_EVALUATION_REQUIRED",
        }


class ODOPEngineInterface:
    """
    Consumes notified ODOP product clusters for sector alignment.
    NOTE: Does NOT automatically award grants; PMFME rules evaluate eligibility.
    """

    @staticmethod
    def check_odop_alignment(district_code: str, business_activity: str) -> Dict[str, Any]:
        odop = geography_service.get_odop_context(district_code)
        if odop.notified_odop_commodity == "UNKNOWN":
            return {
                "aligned": False,
                "commodity": "UNKNOWN",
                "status": "UNKNOWN_DATA",
                "notes": "ODOP dataset does not list a notified commodity for this district.",
            }

        # Check keyword overlap
        b_clean = business_activity.lower()
        c_clean = odop.notified_odop_commodity.lower()
        aligned = any(token in c_clean for token in b_clean.split() if len(token) > 3)

        return {
            "aligned": aligned,
            "notified_odop_commodity": odop.notified_odop_commodity,
            "district_name": odop.district_name,
            "alignment_confidence": 0.90 if aligned else 0.40,
            "benefit_eligibility_state": "REQUIRES_SCHEME_EVALUATION",
        }


class FeasibilityEngineInterface:
    """Consumes urbanity, agro-climatic zone, power grid, and RBI tier."""

    @staticmethod
    def get_feasibility_context(district_code: str) -> Dict[str, Any]:
        district = geography_service.get_district_by_lgd_code(district_code)
        if not district:
            return {
                "status": "UNKNOWN",
                "urbanity": "UNKNOWN",
                "agro_climatic_zone": "UNKNOWN",
                "rbi_tier": "UNKNOWN",
                "power_grid": "UNKNOWN",
                "uncertainty_penalty": 0.20,
            }

        is_rural = district.urbanity_classification in [
            UrbanityClassification.RURAL,
            UrbanityClassification.SEMI_URBAN_PERI_URBAN,
        ]

        uncertainty_fields = sum(
            1 for val in [district.agro_climatic_zone, district.power_tariff_zone, district.notified_odop_commodity]
            if val == "UNKNOWN"
        )
        uncertainty_penalty = round(uncertainty_fields * 0.05, 3)

        return {
            "status": "LOADED",
            "district_name": district.district_name,
            "is_rural": is_rural,
            "urbanity": district.urbanity_classification.value,
            "agro_climatic_zone": district.agro_climatic_zone,
            "rbi_tier": district.rbi_tier_classification.value,
            "power_tariff_zone": district.power_tariff_zone,
            "uncertainty_penalty": uncertainty_penalty,
        }


class FinancialEngineInterface:
    """
    CRITICAL: Financial engine does NOT calculate arbitrary numbers from urbanity.
    It receives explicit parameters derived from verified scheme rules.
    """

    @staticmethod
    def get_financial_geo_constraints(district_code: str) -> Dict[str, Any]:
        district = geography_service.get_district_by_lgd_code(district_code)
        return {
            "district_lgd_code": district_code,
            "rbi_tier": district.rbi_tier_classification.value if district else "UNKNOWN",
            "delegation": "FINANCIAL_MATH_DETERMINISTIC_ONLY",
        }


class DishaAIContextInterface:
    """Grounds Disha AI explanations in verified reference data."""

    @staticmethod
    def get_grounding_context(district_code: str) -> Dict[str, Any]:
        ctx = geography_service.get_district_context(district_code)
        if not ctx:
            return {
                "available": False,
                "message": "District not found. Provide general guidance and state that local LGD data is UNKNOWN.",
            }

        return {
            "available": True,
            "district_name": ctx.district.district_name,
            "state_name": ctx.district.state_name,
            "territory_type": ctx.district.territory_type.value,
            "urbanity": ctx.district.urbanity_classification.value,
            "odop_commodity": ctx.district.notified_odop_commodity,
            "agro_climatic_zone": ctx.district.agro_climatic_zone,
            "power_tariff_zone": ctx.district.power_tariff_zone,
            "pmegp_subsidy_tier": f"{ctx.pmegp_context.indicative_special_subsidy_pct}% Special / {ctx.pmegp_context.indicative_general_subsidy_pct}% General",
            "provenance_authority": ctx.provenance.source_authority,
            "vintage": ctx.provenance.data_vintage,
            "notes": "Disha must present UNKNOWN fields as unavailable and not hallucinate missing infrastructure.",
        }
