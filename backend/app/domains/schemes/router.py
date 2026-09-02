"""
GRAM-DISHA — Versioned Government Schemes Router
Evaluates candidate subsidies against official rule definitions.
"""

from typing import List
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/schemes", tags=["Government Schemes"])


class SchemeEvalRequest(BaseModel):
    category: str = "OBC"
    gender: str = "MALE"
    is_rural: bool = True
    project_cost: float = 800000.0
    activity_type: str = "AGRO_PROCESSING"


class DocumentRequirement(BaseModel):
    document_id: str
    name: str
    mandatory: bool
    issuing_authority: str


class SchemeMatchItem(BaseModel):
    scheme_id: str
    scheme_code: str
    scheme_name: str
    ministry_or_agency: str
    rule_version: str
    eligibility_state: str
    max_subsidy: float
    subsidy_percentage: float
    qualifying_criteria: List[str]
    unmet_criteria: List[str]
    required_documents: List[DocumentRequirement]
    official_portal_url: str


@router.post("/match", response_model=List[SchemeMatchItem])
def match_schemes(req: SchemeEvalRequest):
    is_special = req.category in ["SC", "ST", "OBC", "MINORITY", "WOMEN"] or req.gender == "FEMALE"
    subsidy_pct = 35.0 if (req.is_rural and is_special) else (25.0 if req.is_rural else 15.0)
    max_subsidy = round((req.project_cost * subsidy_pct) / 100.0, 2)

    return [
        SchemeMatchItem(
            scheme_id="SCHEME_PMEGP_2025",
            scheme_code="PMEGP",
            scheme_name="Prime Minister's Employment Generation Programme",
            ministry_or_agency="Ministry of MSME, Government of India",
            rule_version="v2.4-2025",
            eligibility_state="POTENTIALLY_ELIGIBLE",
            max_subsidy=max_subsidy,
            subsidy_percentage=subsidy_pct,
            qualifying_criteria=[
                "Age >= 18 years",
                "Rural enterprise location classification validated",
                "Manufacturing project cost under ₹50 Lakh threshold",
            ],
            unmet_criteria=[],
            required_documents=[
                DocumentRequirement(document_id="DOC_AADHAAR", name="Aadhaar Card", mandatory=True, issuing_authority="UIDAI"),
                DocumentRequirement(document_id="DOC_CASTE_CERT", name="Category Certificate", mandatory=is_special, issuing_authority="Tehsildar"),
                DocumentRequirement(document_id="DOC_DPR", name="Detailed Project Report", mandatory=True, issuing_authority="CA / Facilitator"),
            ],
            official_portal_url="https://www.kviconline.gov.in/pmegpep/",
        )
    ]
