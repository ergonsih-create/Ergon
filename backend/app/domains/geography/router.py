"""
GRAM-DISHA — Geography & Policy Reference API Router
Smart India Hackathon 2026 (Team ERGON)
FastAPI endpoints providing auditable, versioned geographic and urbanity lookups.
"""

from typing import List, Optional

try:
    from fastapi import APIRouter, HTTPException, Query, status
except ImportError:
    class APIRouter:
        def __init__(self, *args, **kwargs): pass
        def get(self, *args, **kwargs): return lambda f: f
        def post(self, *args, **kwargs): return lambda f: f
    class HTTPException(Exception):
        def __init__(self, status_code: int, detail: str):
            self.status_code = status_code
            self.detail = detail
    def Query(default=None, *args, **kwargs): return default
    class _Status:
        HTTP_404_NOT_FOUND = 404
    status = _Status()

from app.domains.geography.schemas import (
    StateReference,
    DistrictRecord,
    DistrictDetailContext,
    PMEGPGeographicContext,
    ODOPContext,
    ProvenanceInfo,
    DatasetRegistryEntry,
    DataQualityReport,
    UrbanityClassification,
    RBITierClassification,
)
from app.domains.geography.service import geography_service
from app.domains.geography.pipeline import ingestion_pipeline

router = APIRouter(prefix="/geography", tags=["Geography & Urbanity Reference"])


@router.get("/states", response_model=List[StateReference], summary="List all 28 States and 8 Union Territories")
def get_all_states():
    return geography_service.get_all_states()


@router.get("/states/{state_code}/districts", response_model=List[DistrictRecord], summary="List districts in a state")
def get_districts_for_state(state_code: str):
    districts = geography_service.get_districts_by_state(state_code)
    if not districts:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No districts found for state code or name: '{state_code}'",
        )
    return districts


@router.get("/districts", response_model=List[DistrictRecord], summary="List or query districts by state code or name")
def get_districts(
    state_code: Optional[str] = Query(None, description="State code or abbreviation"),
    state_name: Optional[str] = Query(None, description="State name"),
):
    key = state_name or state_code
    if key:
        return geography_service.get_districts_by_state(key)
    return geography_service.search_districts(state_code=state_code)


@router.get("/blocks", summary="List blocks in a district")
def get_blocks(
    district_name: Optional[str] = Query(None, description="District name"),
    district_code: Optional[str] = Query(None, description="District code"),
):
    dist = district_name or district_code or "Yavatmal"
    return [
        {"block_name": "Pusad", "district": dist, "is_rural": True},
        {"block_name": "Umarkhed", "district": dist, "is_rural": True},
        {"block_name": "Digras", "district": dist, "is_rural": True},
        {"block_name": "Haveli", "district": dist, "is_rural": False},
        {"block_name": "Baramati", "district": dist, "is_rural": True},
    ]


@router.get("/panchayats", summary="List gram panchayats in a block")
def get_panchayats(
    block_name: Optional[str] = Query(None, description="Block name"),
):
    blk = block_name or "Pusad"
    return [
        {"panchayat_name": "Shendurjana Gram Panchayat", "block": blk, "lgd_code": "GP-4421"},
        {"panchayat_name": "Loni Kalbhor Gram Panchayat", "block": blk, "lgd_code": "GP-1092"},
        {"panchayat_name": "Somayampalayam Gram Panchayat", "block": blk, "lgd_code": "GP-2204"},
    ]


@router.get("/villages", summary="List villages in a gram panchayat")
def get_villages(
    panchayat_name: Optional[str] = Query(None, description="Panchayat name"),
):
    gp = panchayat_name or "Shendurjana"
    return [
        {"village_name": "Shendurjana Khurd", "panchayat": gp, "is_rural": True},
        {"village_name": "Shendurjana Budruk", "panchayat": gp, "is_rural": True},
        {"village_name": "Loni Gaon", "panchayat": gp, "is_rural": True},
    ]


@router.get("/districts/search", response_model=List[DistrictRecord], summary="Search and filter districts")
def search_districts(
    query: Optional[str] = Query(None, description="District or State name search"),
    state_code: Optional[str] = Query(None, description="Filter by State LGD code"),
    urbanity: Optional[UrbanityClassification] = Query(None, description="Filter by Urbanity"),
    rbi_tier: Optional[RBITierClassification] = Query(None, description="Filter by RBI Tier"),
    primary_scope_only: bool = Query(False, description="Filter to Gram-Disha primary focus (Rural & Semi-Urban)"),
):
    return geography_service.search_districts(
        query=query,
        state_code=state_code,
        urbanity=urbanity,
        rbi_tier=rbi_tier,
        primary_scope_only=primary_scope_only,
    )


@router.get("/districts/{district_code}", response_model=DistrictRecord, summary="Get district by LGD code")
def get_district_by_code(district_code: str):
    district = geography_service.get_district_by_lgd_code(district_code)
    if not district:
        # Fallback to name match
        district = geography_service.get_district_by_name(district_code)
    if not district:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"District with code or name '{district_code}' not found in master reference.",
        )
    return district


@router.get("/districts/{district_code}/context", response_model=DistrictDetailContext, summary="Get full aggregated district context")
def get_district_context(district_code: str):
    ctx = geography_service.get_district_context(district_code)
    if not ctx:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Context for district '{district_code}' unavailable in dataset.",
        )
    return ctx


@router.get("/districts/{district_code}/urbanity", summary="Get urbanity classification & rural population")
def get_district_urbanity(district_code: str):
    return geography_service.get_urbanity_classification(district_code)


@router.get("/districts/{district_code}/pmegp-context", response_model=PMEGPGeographicContext, summary="Get PMEGP geographic subsidy tier")
def get_district_pmegp_context(district_code: str):
    return geography_service.get_pmegp_context(district_code)


@router.get("/districts/{district_code}/odop", response_model=ODOPContext, summary="Get notified ODOP commodity")
def get_district_odop_context(district_code: str):
    return geography_service.get_odop_context(district_code)


@router.get("/districts/{district_code}/provenance", response_model=ProvenanceInfo, summary="Get provenance audit trail")
def get_district_provenance(district_code: str):
    return geography_service.get_provenance()


@router.get("/datasets/district-reference", response_model=DatasetRegistryEntry, summary="Get dataset registry entry & version")
def get_dataset_metadata():
    return geography_service.get_dataset_registry_entry()


@router.get("/quality-report", response_model=DataQualityReport, summary="Generate live data quality and integrity report")
def get_quality_report():
    return geography_service.get_quality_report()


@router.post("/ingest/run", summary="Trigger deterministic data ingestion pipeline")
def run_ingestion_pipeline():
    return ingestion_pipeline.run_ingestion()
