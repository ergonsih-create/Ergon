"""
GRAM-DISHA — Geographic & Urbanity Policy Reference Schemas
Smart India Hackathon 2026 (Team ERGON)
Strict Pydantic v2 schemas preserving source terminology, provenance, versions, and UNKNOWN policy.
"""

from enum import Enum
from typing import List, Optional, Dict, Any

try:
    from pydantic import BaseModel as _PydanticBaseModel, Field
    class BaseModel(_PydanticBaseModel):
        class Config:
            populate_by_name = True
            extra = "ignore"
except ImportError:
    class BaseModel:
        def __init__(self, **kwargs):
            # Apply class annotations defaults
            for k in getattr(self.__class__, '__annotations__', {}):
                if hasattr(self.__class__, k):
                    setattr(self, k, getattr(self.__class__, k))
            for k, v in kwargs.items():
                setattr(self, k, v)
        def model_dump(self) -> Dict[str, Any]:
            res = {}
            for k, v in self.__dict__.items():
                if not k.startswith('_'):
                    if hasattr(v, 'model_dump'):
                        res[k] = v.model_dump()
                    elif hasattr(v, 'value'):
                        res[k] = v.value
                    elif isinstance(v, list):
                        res[k] = [item.model_dump() if hasattr(item, 'model_dump') else (item.value if hasattr(item, 'value') else item) for item in v]
                    else:
                        res[k] = v
            return res
        def __repr__(self):
            return f"{self.__class__.__name__}({self.__dict__})"

    def Field(default=None, *args, **kwargs):
        return default


class TerritoryType(str, Enum):
    STATE = "STATE"
    UNION_TERRITORY = "UNION_TERRITORY"


class UrbanityClassification(str, Enum):
    RURAL = "RURAL"  # >75% rural population
    SEMI_URBAN = "SEMI_URBAN"  # 50-75% rural population
    PERI_URBAN = "PERI_URBAN"
    SEMI_URBAN_PERI_URBAN = "SEMI_URBAN / PERI_URBAN"  # Preserved source terminology
    URBAN = "URBAN"  # 25-50% rural population
    METROPOLITAN = "METROPOLITAN"  # <25% rural population
    UNKNOWN = "UNKNOWN"


class RBITierClassification(str, Enum):
    TIER_1 = "TIER_1"  # 100,000+ population
    TIER_2 = "TIER_2"  # 50,000 to 99,999
    TIER_3 = "TIER_3"  # 20,000 to 49,999
    TIER_4 = "TIER_4"  # 10,000 to 19,999
    TIER_5 = "TIER_5"  # 5,000 to 9,999
    TIER_6 = "TIER_6"  # Less than 5,000
    UNKNOWN = "UNKNOWN"


class VerificationStatus(str, Enum):
    VERIFIED = "VERIFIED"
    PROVISIONAL = "PROVISIONAL"
    UNVERIFIED = "UNVERIFIED"
    CONFLICTING = "CONFLICTING"
    UNKNOWN = "UNKNOWN"


class ValueState(str, Enum):
    SOURCE_DATA = "SOURCE_DATA"
    VALIDATED_DATA = "VALIDATED_DATA"
    PROXY_DATA = "PROXY_DATA"
    UNKNOWN = "UNKNOWN"
    CONFLICTING = "CONFLICTING"
    UNVERIFIED = "UNVERIFIED"


# -------------------------------------------------------------------------
# PROVENANCE & REGISTRY SCHEMAS
# -------------------------------------------------------------------------

class ProvenanceInfo(BaseModel):
    source_id: str
    source_name: str
    source_authority: str
    source_url: str
    source_document: str
    source_version: str = "1.0.0"
    data_vintage: str = "2025-2026"
    ingestion_timestamp: str
    verification_timestamp: Optional[str] = None
    geographic_level: str = "DISTRICT"
    verification_status: VerificationStatus = VerificationStatus.PROVISIONAL
    confidence: float = Field(default=0.95, ge=0.0, le=1.0)
    notes: Optional[str] = None


class DatasetRegistryEntry(BaseModel):
    dataset_id: str = "district_urbanity_policy_reference"
    dataset_name: str = "Gram-Disha India District Urbanity Reference With UTs"
    human_readable_name: str = "Gram-Disha India District Urbanity Reference With UTs"
    category: str = "Geographic + Policy Reference Dataset"
    scope: str = "India"
    geographic_levels: List[str] = ["State", "District"]
    primary_purpose: str = (
        "Administrative validation, Urbanity classification, PMEGP geographic "
        "differentiation context, ODOP alignment, RBI tier contextualization, "
        "Feasibility analysis, Hyper-local analytical context"
    )
    source_document: str = "Gram-Disha_India_District_Urbanity_Reference_With_UTs-2.docx"
    source_authority: str = "Ministry of Panchayati Raj (MoPR), KVIC/MoMSME, MoFPI, RBI, ORGI"
    source_url: str = "https://lgdirectory.gov.in/"
    version: str = "1.0.0"
    data_vintage: str = "2025-2026"
    ingestion_date: str
    verification_date: Optional[str] = None
    geographic_scope: str = "28 States and 8 Union Territories (~788+ Districts)"
    geographic_level: str = "DISTRICT"
    record_count: int
    status: VerificationStatus = VerificationStatus.PROVISIONAL
    confidence: float = 0.95
    notes: str = (
        "Reference dataset providing geographic context. Does NOT replace deterministic "
        "scheme rule engines or create statutory classifications."
    )


# -------------------------------------------------------------------------
# NORMALIZED DISTRICT & STATE SCHEMAS
# -------------------------------------------------------------------------

class StateReference(BaseModel):
    state_lgd_code: str
    state_name: str
    territory_type: TerritoryType
    total_districts: int
    data_vintage: str = "2025-2026"
    verification_status: VerificationStatus = VerificationStatus.VERIFIED


class PMEGPGeographicContext(BaseModel):
    urbanity: UrbanityClassification
    is_rural: bool
    indicative_general_subsidy_pct: float
    indicative_special_subsidy_pct: float
    indicative_promoter_margin_pct: float
    context_note: str = "Indicative geographic context only. Final eligibility determined by Scheme Master rules."
    value_state: ValueState = ValueState.SOURCE_DATA


class ODOPContext(BaseModel):
    district_name: str
    district_lgd_code: str
    notified_odop_commodity: str
    commodity_category: str
    value_state: ValueState = ValueState.SOURCE_DATA
    notes: str = "District ODOP alignment reference. Grant eligibility determined separately by PMFME scheme rules."


class DistrictRecord(BaseModel):
    state_lgd_code: str
    state_name: str
    district_lgd_code: str
    district_name: str
    territory_type: TerritoryType
    urbanity_classification: UrbanityClassification
    census_rural_percentage: Optional[float] = None
    rbi_tier_classification: RBITierClassification = RBITierClassification.UNKNOWN
    pmegp_subsidy_eligibility: Optional[Dict[str, Any]] = None
    notified_odop_commodity: str = "UNKNOWN"
    agro_climatic_zone: str = "UNKNOWN"
    power_tariff_zone: str = "UNKNOWN"
    power_subsidies: str = "UNKNOWN"
    
    # Metadata & Provenance
    source_id: str = "SRC_LGD_01"
    source_url: str = "https://lgdirectory.gov.in/"
    source_authority: str = "Ministry of Panchayati Raj / MoMSME / MoFPI / RBI"
    data_vintage: str = "2025-2026"
    verification_status: VerificationStatus = VerificationStatus.PROVISIONAL
    verification_date: Optional[str] = None
    geographic_level: str = "DISTRICT"
    confidence: float = Field(default=0.95, ge=0.0, le=1.0)
    notes: Optional[str] = None
    gram_disha_primary_scope: bool = True  # True if RURAL or SEMI_URBAN / PERI_URBAN


class DistrictDetailContext(BaseModel):
    district: DistrictRecord
    pmegp_context: PMEGPGeographicContext
    odop_context: ODOPContext
    provenance: ProvenanceInfo
    data_classification: ValueState = ValueState.SOURCE_DATA


# -------------------------------------------------------------------------
# CONFLICT & VALIDATION MODELS
# -------------------------------------------------------------------------

class DataConflictRecord(BaseModel):
    conflict_id: str
    field_name: str
    district_lgd_code: str
    old_value: Any
    new_value: Any
    source_a: str
    source_b: str
    detected_at: str
    resolution_status: str = "PENDING_HUMAN_VERIFICATION"
    resolution_notes: Optional[str] = None


class DataQualityReport(BaseModel):
    report_id: str
    generated_at: str
    dataset_name: str
    version: str
    total_records: int
    states_count: int
    union_territories_count: int
    districts_count: int
    duplicate_records_count: int
    missing_lgd_codes_count: int
    missing_urbanity_count: int
    missing_rural_percentage_count: int
    missing_rbi_tier_count: int
    missing_pmegp_context_count: int
    missing_odop_count: int
    missing_acz_count: int
    missing_power_data_count: int
    unknown_values_count: int
    conflicting_values_count: int
    unverified_values_count: int
    provenance_coverage_pct: float
    data_integrity_score_pct: float
    validation_passed: bool
    summary: str
