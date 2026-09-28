"""
GRAM-DISHA — Geographic & Urbanity SQLAlchemy Models
Smart India Hackathon 2026 (Team ERGON)
Database models for MySQL 8.0 normalized tables.
"""

from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Boolean,
    Float,
    Integer,
    DateTime,
    Text,
    ForeignKey,
    Index,
)
from sqlalchemy.orm import relationship
from app.core.database import Base


class Dataset(Base):
    __tablename__ = "datasets"

    dataset_id = Column(String(64), primary_key=True)
    dataset_name = Column(String(255), nullable=False)
    category = Column(String(128), nullable=False)
    scope = Column(String(128), default="India")
    geographic_levels = Column(String(255), default="State, District")
    primary_purpose = Column(Text, nullable=False)
    source_document = Column(String(255), nullable=False)
    source_authority = Column(String(255), nullable=False)
    source_url = Column(String(512), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    versions = relationship("DatasetVersion", back_populates="dataset")


class DatasetVersion(Base):
    __tablename__ = "dataset_versions"

    version_id = Column(String(64), primary_key=True)
    dataset_id = Column(String(64), ForeignKey("datasets.dataset_id"), nullable=False)
    version_number = Column(String(32), nullable=False)
    data_vintage = Column(String(64), nullable=False)
    ingestion_date = Column(DateTime, default=datetime.utcnow)
    verification_date = Column(DateTime, nullable=True)
    effective_from = Column(DateTime, default=datetime.utcnow)
    effective_to = Column(DateTime, nullable=True)
    is_current = Column(Boolean, default=True)
    record_count = Column(Integer, default=0)
    status = Column(String(32), default="PROVISIONAL")  # VERIFIED, PROVISIONAL, etc.
    confidence = Column(Float, default=0.95)
    notes = Column(Text, nullable=True)

    dataset = relationship("Dataset", back_populates="versions")


class GeographicState(Base):
    __tablename__ = "geographic_states"

    state_lgd_code = Column(String(32), primary_key=True)
    state_name = Column(String(128), nullable=False, unique=True)
    territory_type = Column(String(32), nullable=False)  # STATE, UNION_TERRITORY
    total_districts = Column(Integer, default=0)
    data_vintage = Column(String(32), default="2025-2026")
    verification_status = Column(String(32), default="VERIFIED")
    created_at = Column(DateTime, default=datetime.utcnow)

    districts = relationship("GeographicDistrict", back_populates="state")


class GeographicDistrict(Base):
    __tablename__ = "geographic_districts"

    district_lgd_code = Column(String(32), primary_key=True)
    state_lgd_code = Column(String(32), ForeignKey("geographic_states.state_lgd_code"), nullable=False)
    state_name = Column(String(128), nullable=False)
    district_name = Column(String(128), nullable=False)
    territory_type = Column(String(32), nullable=False)
    urbanity_classification = Column(String(64), nullable=False)  # RURAL, SEMI_URBAN / PERI_URBAN, etc.
    census_rural_percentage = Column(Float, nullable=True)
    rbi_tier_classification = Column(String(32), default="UNKNOWN")
    gram_disha_primary_scope = Column(Boolean, default=True)

    # Reference link fields
    source_id = Column(String(64), default="SRC_LGD_01")
    source_url = Column(String(512), default="https://lgdirectory.gov.in/")
    source_authority = Column(String(255), default="Ministry of Panchayati Raj / MoMSME / MoFPI / RBI")
    data_vintage = Column(String(32), default="2025-2026")
    verification_status = Column(String(32), default="PROVISIONAL")
    verification_date = Column(DateTime, nullable=True)
    confidence = Column(Float, default=0.95)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    state = relationship("GeographicState", back_populates="districts")
    context = relationship("DistrictContext", back_populates="district", uselist=False)

    __table_args__ = (
        Index("idx_district_state_lookup", "state_lgd_code", "district_name"),
        Index("idx_district_urbanity", "urbanity_classification"),
    )


class DistrictContext(Base):
    __tablename__ = "district_context"

    context_id = Column(String(64), primary_key=True)
    district_lgd_code = Column(String(32), ForeignKey("geographic_districts.district_lgd_code"), nullable=False, unique=True)
    
    # ODOP & Economic Reference
    notified_odop_commodity = Column(String(255), default="UNKNOWN")
    odop_category = Column(String(128), default="UNKNOWN")
    
    # Agro-Climatic & Infrastructure Reference
    agro_climatic_zone = Column(String(255), default="UNKNOWN")
    power_tariff_zone = Column(String(255), default="UNKNOWN")
    power_subsidies = Column(String(255), default="UNKNOWN")
    
    # PMEGP Indicative Context (Reference only, separate from Scheme Rules)
    pmegp_general_rural_pct = Column(Float, default=25.0)
    pmegp_special_rural_pct = Column(Float, default=35.0)
    pmegp_general_urban_pct = Column(Float, default=15.0)
    pmegp_special_urban_pct = Column(Float, default=25.0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    district = relationship("GeographicDistrict", back_populates="context")


class DataProvenance(Base):
    __tablename__ = "data_provenance"

    provenance_id = Column(String(64), primary_key=True)
    dataset_id = Column(String(64), nullable=False)
    version = Column(String(32), nullable=False)
    source_name = Column(String(255), nullable=False)
    source_authority = Column(String(255), nullable=False)
    source_url = Column(String(512), nullable=False)
    source_document = Column(String(255), nullable=False)
    data_vintage = Column(String(64), nullable=False)
    ingestion_timestamp = Column(DateTime, default=datetime.utcnow)
    verification_timestamp = Column(DateTime, nullable=True)
    geographic_level = Column(String(64), default="DISTRICT")
    verification_status = Column(String(32), default="PROVISIONAL")
    confidence = Column(Float, default=0.95)
    notes = Column(Text, nullable=True)


class DataValidationResult(Base):
    __tablename__ = "data_validation_results"

    validation_id = Column(String(64), primary_key=True)
    dataset_id = Column(String(64), nullable=False)
    version = Column(String(32), nullable=False)
    validation_timestamp = Column(DateTime, default=datetime.utcnow)
    total_records = Column(Integer, default=0)
    valid_records = Column(Integer, default=0)
    invalid_records = Column(Integer, default=0)
    unknown_fields_count = Column(Integer, default=0)
    conflicts_count = Column(Integer, default=0)
    quality_score = Column(Float, default=1.0)
    report_json = Column(Text, nullable=False)


class DataConflict(Base):
    __tablename__ = "data_conflicts"

    conflict_id = Column(String(64), primary_key=True)
    district_lgd_code = Column(String(32), nullable=False)
    field_name = Column(String(128), nullable=False)
    old_value = Column(String(255), nullable=True)
    new_value = Column(String(255), nullable=True)
    source_a = Column(String(255), nullable=False)
    source_b = Column(String(255), nullable=False)
    detected_at = Column(DateTime, default=datetime.utcnow)
    resolution_status = Column(String(64), default="PENDING_HUMAN_VERIFICATION")
    resolution_notes = Column(Text, nullable=True)
