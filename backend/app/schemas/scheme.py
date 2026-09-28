"""
GRAM-DISHA — Scheme Schemas (Pydantic v2)
Dual camelCase/snake_case serialization for scheme evaluation, catalog, and applications.
"""

from typing import List, Optional
from datetime import datetime
from app.schemas.common import CamelModel


class DocumentRequirementSchema(CamelModel):
    document_id: str
    name: str
    category: Optional[str] = "IDENTITY"
    mandatory: bool = True
    issuing_authority: str = "Government Authority"


class SchemeMatchItemSchema(CamelModel):
    scheme_id: str
    scheme_code: str
    scheme_name: str
    ministry_or_agency: str
    rule_version: str
    eligibility_state: str
    max_subsidy_or_assistance: float = 0.0
    max_subsidy: Optional[float] = None
    subsidy_percentage: float = 0.0
    eligible_loan_amount: Optional[float] = None
    promoter_contribution_required_percent: Optional[float] = None
    qualifying_criteria_passed: List[str] = []
    qualifying_criteria: Optional[List[str]] = None
    unmet_criteria: List[str] = []
    unknown_criteria: Optional[List[str]] = None
    required_documents: List[DocumentRequirementSchema] = []
    application_route: Optional[str] = "ONLINE_PORTAL"
    official_portal_url: str = ""
    responsible_authority: Optional[str] = None
    last_verified_date: Optional[str] = None


class SchemeEvalRequest(CamelModel):
    category: Optional[str] = "OBC"
    gender: Optional[str] = "MALE"
    is_rural: Optional[bool] = True
    project_cost: float = 850000.0
    activity_type: Optional[str] = "AGRO_PROCESSING"
    annual_income: Optional[float] = 180000.0
    business_id: Optional[str] = None


class SchemeCatalogItemSchema(CamelModel):
    id: str
    name: str
    ministry: str
    description: str
    max_loan_amount: float
    subsidy_percentage: float
    is_active: bool = True


class SchemeApplicationCreateRequest(CamelModel):
    business_id: str
    scheme_id: str
    scheme_name: str
    requested_amount: float
    calculated_subsidy: Optional[float] = 0.0
    remarks: Optional[str] = None


class SchemeApplicationResponse(CamelModel):
    id: str
    business_id: str
    user_id: Optional[str] = None
    scheme_id: str
    scheme_name: str
    application_number: str
    requested_amount: float
    calculated_subsidy: float
    sanctioned_amount: Optional[float] = None
    current_stage: str
    status: str
    submission_date: Optional[str] = None
    remarks: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
