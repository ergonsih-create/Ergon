"""
GRAM-DISHA — Business Entity Pydantic Schemas
Contracts for enterprise profiles, multi-stage lifecycle, and sector categorization.
"""

from typing import Optional
from datetime import datetime
from pydantic import Field
from app.schemas.common import CamelModel


class LocationContextSchema(CamelModel):
    state: str = "Maharashtra"
    district: str = "Yavatmal"
    block: str = "Pusad"
    gram_panchayat: Optional[str] = "Shendurjana Khurd Gram Panchayat"
    village_or_locality: Optional[str] = "Shendurjana Khurd"
    is_rural: bool = True
    pincode: Optional[str] = None


class BusinessCreateRequest(CamelModel):
    id: Optional[str] = None
    name: Optional[str] = None
    title: Optional[str] = None
    enterprise_name: Optional[str] = None
    category: Optional[str] = "AGRO_PROCESSING"
    industry_type: Optional[str] = "Manufacturing"
    sector: Optional[str] = "Agro-Processing"
    location_type: Optional[str] = "Rural"
    entity_type: Optional[str] = "Proprietorship"
    stage: Optional[str] = "Idea / Inception"
    project_cost: Optional[float] = 850000.0
    promoter_capital: Optional[float] = 150000.0
    state: Optional[str] = "Maharashtra"
    district: Optional[str] = "Yavatmal"
    block: Optional[str] = "Pusad"
    pin_code: Optional[str] = None
    odop_commodity: Optional[str] = "Cotton & Chana Processing"
    pan_number: Optional[str] = None
    udyam_number: Optional[str] = None
    proposed_location: Optional[LocationContextSchema] = None


class BusinessUpdateRequest(CamelModel):
    name: Optional[str] = None
    title: Optional[str] = None
    enterprise_name: Optional[str] = None
    category: Optional[str] = None
    industry_type: Optional[str] = None
    sector: Optional[str] = None
    location_type: Optional[str] = None
    entity_type: Optional[str] = None
    stage: Optional[str] = None
    project_cost: Optional[float] = None
    promoter_capital: Optional[float] = None
    state: Optional[str] = None
    district: Optional[str] = None
    block: Optional[str] = None
    pin_code: Optional[str] = None
    odop_commodity: Optional[str] = None
    pan_number: Optional[str] = None
    udyam_number: Optional[str] = None
    status: Optional[str] = None


class BusinessResponse(CamelModel):
    id: str
    user_id: Optional[str] = None
    name: str
    title: Optional[str] = None
    enterprise_name: Optional[str] = None
    category: str
    industry_type: str
    sector: str
    location_type: str
    entity_type: str
    stage: str
    project_cost: float
    promoter_capital: float
    status: str
    state: str
    district: str
    block: str
    pin_code: Optional[str] = None
    is_rural: bool = True
    odop_commodity: Optional[str] = None
    pan_number: Optional[str] = None
    udyam_number: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
