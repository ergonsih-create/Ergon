"""
GRAM-DISHA — Provenance & Audit Registry Router
Tracks official public datasets, vintage timestamps, and update cadences.
"""

from typing import List
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/provenance", tags=["Provenance & Audit Registry"])


class ProvenanceRecord(BaseModel):
    source_id: str
    source_name: str
    source_url: str
    dataset_name: str
    vintage_timestamp: str
    confidence_score: float
    is_authoritative: bool
    governance_body: str


@router.get("/sources", response_model=List[ProvenanceRecord])
def get_provenance_sources():
    return [
        ProvenanceRecord(
            source_id="SRC_LGD_01",
            source_name="Local Government Directory (LGD)",
            source_url="https://lgdirectory.gov.in/",
            dataset_name="All India Village & Block Directory 2025-2026",
            vintage_timestamp="2026-01-15T00:00:00Z",
            confidence_score=0.99,
            is_authoritative=True,
            governance_body="Ministry of Panchayati Raj",
        ),
        ProvenanceRecord(
            source_id="SRC_AGMARKNET_01",
            source_name="AGMARKNET Mandi Price Portal",
            source_url="https://agmarknet.gov.in/",
            dataset_name="Weekly APMC Commodity Arrivals & Modal Prices",
            vintage_timestamp="2026-03-01T08:30:00Z",
            confidence_score=0.95,
            is_authoritative=True,
            governance_body="Directorate of Marketing & Inspection (DMI)",
        ),
        ProvenanceRecord(
            source_id="SRC_MSME_PMEGP",
            source_name="KVIC PMEGP Portal",
            source_url="https://www.kviconline.gov.in/pmegpep/",
            dataset_name="PMEGP Scheme Guidelines v2.4",
            vintage_timestamp="2025-10-01T00:00:00Z",
            confidence_score=1.0,
            is_authoritative=True,
            governance_body="Ministry of MSME",
        ),
    ]
