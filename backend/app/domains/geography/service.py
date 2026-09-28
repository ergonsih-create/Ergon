"""
GRAM-DISHA — Geographic & Urbanity Reference Lookup Service
Smart India Hackathon 2026 (Team ERGON)
Core deterministic lookup and validation services consumed by Onboarding, Feasibility,
Finance, Schemes, Market, and Disha AI Context Generator.
"""

from typing import List, Optional, Dict, Any
from app.domains.geography.schemas import (
    StateReference,
    DistrictRecord,
    DistrictDetailContext,
    PMEGPGeographicContext,
    ODOPContext,
    ProvenanceInfo,
    DatasetRegistryEntry,
    DataQualityReport,
    DataConflictRecord,
    UrbanityClassification,
    RBITierClassification,
    ValueState,
    VerificationStatus,
)
from app.domains.geography.data_store import (
    STATES_REGISTRY,
    DISTRICT_RECORDS,
    DATASET_REGISTRY,
    PROVENANCE_METADATA,
    DATA_CONFLICTS,
)
from app.domains.geography.validation import GeographyValidator


STATE_ABBR_TO_LGD: Dict[str, str] = {
    "MH": "27", "UP": "09", "MP": "23", "TN": "33", "GJ": "24",
    "RJ": "08", "KA": "29", "AP": "28", "TG": "36", "WB": "19",
    "BR": "10", "PB": "03", "HR": "06", "KL": "32", "OR": "21", "OD": "21",
    "AS": "18", "JH": "20", "CG": "22", "UT": "05", "UK": "05", "HP": "02",
    "JK": "01", "GA": "30", "TR": "16", "ML": "17", "MN": "14", "NL": "13",
    "MZ": "15", "SK": "11", "AR": "12", "DL": "07", "CH": "04", "PY": "34",
    "AN": "35", "LD": "31", "DN": "26", "LA": "37"
}


class GeographyService:
    """Deterministic lookup service for all geographic & policy reference queries."""

    def __init__(
        self,
        states: Optional[List[StateReference]] = None,
        districts: Optional[List[DistrictRecord]] = None,
    ):
        self._states = states if states is not None else STATES_REGISTRY
        self._districts = districts if districts is not None else DISTRICT_RECORDS
        self._dataset_registry = DATASET_REGISTRY
        self._provenance = PROVENANCE_METADATA
        self._conflicts = DATA_CONFLICTS

    # -------------------------------------------------------------------------
    # STATE LOOKUPS
    # -------------------------------------------------------------------------

    def get_all_states(self) -> List[StateReference]:
        """Return all 28 States and 8 Union Territories in India."""
        return self._states

    def get_state_by_lgd_code(self, state_lgd_code: str) -> Optional[StateReference]:
        """Lookup state by official MoPR 2-digit LGD code or 2-letter abbreviation."""
        cleaned = state_lgd_code.strip().upper()
        if cleaned in STATE_ABBR_TO_LGD:
            cleaned = STATE_ABBR_TO_LGD[cleaned]
        for s in self._states:
            if s.state_lgd_code == cleaned or s.state_lgd_code.lstrip("0") == cleaned.lstrip("0"):
                return s
        return None

    def get_state_by_name(self, state_name: str) -> Optional[StateReference]:
        """Lookup state by name (case-insensitive)."""
        target = state_name.strip().lower()
        for s in self._states:
            if s.state_name.lower() == target:
                return s
        return None

    # -------------------------------------------------------------------------
    # DISTRICT LOOKUPS
    # -------------------------------------------------------------------------

    def get_districts_by_state(self, state_code_or_name: str) -> List[DistrictRecord]:
        """Retrieve all districts registered under a specific state."""
        state = self.get_state_by_lgd_code(state_code_or_name)
        if not state:
            state = self.get_state_by_name(state_code_or_name)

        if not state:
            return []

        return [d for d in self._districts if d.state_lgd_code == state.state_lgd_code]

    def get_district_by_lgd_code(self, district_lgd_code: str) -> Optional[DistrictRecord]:
        """Lookup district by official 3-digit LGD code."""
        cleaned = district_lgd_code.strip()
        for d in self._districts:
            if d.district_lgd_code == cleaned or d.district_lgd_code.lstrip("0") == cleaned.lstrip("0"):
                return d
        return None

    def get_district_by_name(self, district_name: str, state_name: Optional[str] = None) -> Optional[DistrictRecord]:
        """Lookup district by name with optional state disambiguation."""
        d_name_clean = district_name.strip().lower()
        candidates = [d for d in self._districts if d.district_name.lower() == d_name_clean]

        if not candidates:
            # Partial prefix match fallback
            candidates = [d for d in self._districts if d_name_clean in d.district_name.lower()]

        if not candidates:
            return None

        if state_name and len(candidates) > 1:
            s_name_clean = state_name.strip().lower()
            for c in candidates:
                if c.state_name.lower() == s_name_clean:
                    return c

        return candidates[0]

    # -------------------------------------------------------------------------
    # DOMAIN-SPECIFIC CONTEXT & ENGINE GETTERS
    # -------------------------------------------------------------------------

    def get_urbanity_classification(self, district_lgd_code: str) -> Dict[str, Any]:
        """Return urbanity classification with source provenance."""
        district = self.get_district_by_lgd_code(district_lgd_code)
        if not district:
            return {
                "district_lgd_code": district_lgd_code,
                "urbanity": UrbanityClassification.UNKNOWN,
                "census_rural_percentage": None,
                "value_state": ValueState.UNKNOWN,
                "is_rural": False,
            }

        is_rural = district.urbanity_classification in [
            UrbanityClassification.RURAL,
            UrbanityClassification.SEMI_URBAN,
            UrbanityClassification.PERI_URBAN,
            UrbanityClassification.SEMI_URBAN_PERI_URBAN,
        ]

        return {
            "district_lgd_code": district.district_lgd_code,
            "district_name": district.district_name,
            "urbanity": district.urbanity_classification,
            "census_rural_percentage": district.census_rural_percentage,
            "is_rural": is_rural,
            "value_state": ValueState.SOURCE_DATA,
        }

    def get_rbi_tier(self, district_lgd_code: str) -> Dict[str, Any]:
        """Return RBI population tier classification."""
        district = self.get_district_by_lgd_code(district_lgd_code)
        if not district:
            return {
                "district_lgd_code": district_lgd_code,
                "rbi_tier": RBITierClassification.UNKNOWN,
                "value_state": ValueState.UNKNOWN,
                "notes": "District not found in reference dataset.",
            }

        return {
            "district_lgd_code": district.district_lgd_code,
            "district_name": district.district_name,
            "rbi_tier": district.rbi_tier_classification,
            "value_state": ValueState.SOURCE_DATA,
            "notes": "Contextual RBI banking center grouping.",
        }

    def get_pmegp_context(self, district_lgd_code: str) -> PMEGPGeographicContext:
        """
        Return indicative PMEGP geographic subsidy tier.
        CRITICAL: This provides geographic reference context; final eligibility
        is strictly evaluated by the versioned Scheme Rule Engine.
        """
        district = self.get_district_by_lgd_code(district_lgd_code)
        if not district:
            return PMEGPGeographicContext(
                urbanity=UrbanityClassification.UNKNOWN,
                is_rural=False,
                indicative_general_subsidy_pct=15.0,
                indicative_special_subsidy_pct=25.0,
                indicative_promoter_margin_pct=10.0,
                context_note="UNKNOWN location - defaulting to standard general urban context until verified.",
                value_state=ValueState.UNKNOWN,
            )

        is_rural = district.urbanity_classification in [
            UrbanityClassification.RURAL,
            UrbanityClassification.SEMI_URBAN,
            UrbanityClassification.PERI_URBAN,
            UrbanityClassification.SEMI_URBAN_PERI_URBAN,
        ]

        general_pct = 25.0 if is_rural else 15.0
        special_pct = 35.0 if is_rural else 25.0
        margin_pct = 5.0 if is_rural else 10.0

        return PMEGPGeographicContext(
            urbanity=district.urbanity_classification,
            is_rural=is_rural,
            indicative_general_subsidy_pct=general_pct,
            indicative_special_subsidy_pct=special_pct,
            indicative_promoter_margin_pct=margin_pct,
            context_note=(
                f"{district.district_name} is classified as {district.urbanity_classification.value}. "
                f"Rural area grants: 35% Special / 25% General. Final eligibility requires Scheme Rule evaluation."
            ),
            value_state=ValueState.SOURCE_DATA,
        )

    def get_odop_context(self, district_lgd_code: str) -> ODOPContext:
        """Return district ODOP alignment commodity."""
        district = self.get_district_by_lgd_code(district_lgd_code)
        if not district:
            return ODOPContext(
                district_name="UNKNOWN",
                district_lgd_code=district_lgd_code,
                notified_odop_commodity="UNKNOWN",
                commodity_category="UNKNOWN",
                value_state=ValueState.UNKNOWN,
                notes="District record unavailable.",
            )

        return ODOPContext(
            district_name=district.district_name,
            district_lgd_code=district.district_lgd_code,
            notified_odop_commodity=district.notified_odop_commodity,
            commodity_category="AGRO_HANDICRAFT_PRIORITY",
            value_state=ValueState.SOURCE_DATA,
            notes="Notified ODOP product for PMFME / MSME cluster priority matching.",
        )

    def get_agro_climatic_context(self, district_lgd_code: str) -> Dict[str, Any]:
        """Return Agro-Climatic Zone (ACZ) classification."""
        district = self.get_district_by_lgd_code(district_lgd_code)
        if not district:
            return {
                "district_lgd_code": district_lgd_code,
                "agro_climatic_zone": "UNKNOWN",
                "value_state": ValueState.UNKNOWN,
            }

        return {
            "district_lgd_code": district.district_lgd_code,
            "district_name": district.district_name,
            "agro_climatic_zone": district.agro_climatic_zone,
            "value_state": ValueState.SOURCE_DATA,
        }

    def get_power_context(self, district_lgd_code: str) -> Dict[str, Any]:
        """Return power grid and tariff support context."""
        district = self.get_district_by_lgd_code(district_lgd_code)
        if not district:
            return {
                "district_lgd_code": district_lgd_code,
                "power_tariff_zone": "UNKNOWN",
                "power_subsidies": "UNKNOWN",
                "value_state": ValueState.UNKNOWN,
            }

        return {
            "district_lgd_code": district.district_lgd_code,
            "district_name": district.district_name,
            "power_tariff_zone": district.power_tariff_zone,
            "power_subsidies": district.power_subsidies,
            "value_state": ValueState.SOURCE_DATA if district.power_subsidies != "UNKNOWN" else ValueState.UNKNOWN,
        }

    def get_district_context(self, district_lgd_code: str) -> Optional[DistrictDetailContext]:
        """Retrieve full aggregated context for a district."""
        district = self.get_district_by_lgd_code(district_lgd_code)
        if not district:
            return None

        pmegp = self.get_pmegp_context(district_lgd_code)
        odop = self.get_odop_context(district_lgd_code)

        return DistrictDetailContext(
            district=district,
            pmegp_context=pmegp,
            odop_context=odop,
            provenance=self._provenance,
            data_classification=ValueState.SOURCE_DATA,
        )

    def get_provenance(self) -> ProvenanceInfo:
        """Return provenance registry metadata."""
        return self._provenance

    def get_dataset_registry_entry(self) -> DatasetRegistryEntry:
        """Return official dataset registry descriptor."""
        return self._dataset_registry

    def get_quality_report(self) -> DataQualityReport:
        """Generate live quality report across loaded reference records."""
        return GeographyValidator.generate_quality_report(self._states, self._districts)

    def search_districts(
        self,
        query: Optional[str] = None,
        urbanity: Optional[UrbanityClassification] = None,
        rbi_tier: Optional[RBITierClassification] = None,
        state_code: Optional[str] = None,
        primary_scope_only: bool = False,
    ) -> List[DistrictRecord]:
        """Search and filter districts by name, urbanity, RBI tier, and state."""
        results = self._districts

        if primary_scope_only:
            results = [d for d in results if d.gram_disha_primary_scope]

        if state_code:
            results = [d for d in results if d.state_lgd_code == state_code]

        if urbanity:
            results = [d for d in results if d.urbanity_classification == urbanity]

        if rbi_tier:
            results = [d for d in results if d.rbi_tier_classification == rbi_tier]

        if query and query.strip():
            q = query.strip().lower()
            results = [
                d for d in results
                if q in d.district_name.lower()
                or q in d.state_name.lower()
                or q in d.district_lgd_code
                or q in d.notified_odop_commodity.lower()
            ]

        return results


# Singleton instance
geography_service = GeographyService()
