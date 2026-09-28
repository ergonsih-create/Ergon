"""
GRAM-DISHA — SQLAlchemy Database Models
Persistent relational schema for MySQL / SQLite.
Full 14-entity relational schema supporting multi-tenancy, deterministic engines,
and grounded AI advisory.
"""

from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Boolean,
    DateTime,
    Text,
    ForeignKey
)
from sqlalchemy.orm import relationship
from app.core.database import Base


class UserModel(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, index=True)
    email = Column(String(128), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False, default="")
    full_name = Column(String(128), nullable=False)
    phone = Column(String(32), nullable=True)
    role = Column(String(32), default="beneficiary")  # beneficiary, admin, mentor
    category = Column(String(32), default="General")   # General, SC, ST, OBC, Minority, Ex-Servicemen
    social_category = Column(String(32), default="General")
    gender = Column(String(32), default="male")        # male, female, other
    is_differently_abled = Column(Boolean, default=False)
    age_group = Column(String(32), default="26-35")
    education_level = Column(String(64), default="HIGHER_SECONDARY")
    annual_income = Column(Float, default=180000.0)
    state = Column(String(64), default="Maharashtra")
    district = Column(String(64), default="Yavatmal")
    block = Column(String(64), default="Pusad")
    gram_panchayat = Column(String(128), default="Shendurjana Khurd Gram Panchayat")
    village = Column(String(128), default="Shendurjana Khurd")
    is_rural = Column(Boolean, default=True)
    udyam_number = Column(String(64), nullable=True)
    bank_ifsc = Column(String(32), nullable=True)
    preferred_language = Column(String(16), default="en")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    businesses = relationship("BusinessModel", back_populates="user", cascade="all, delete-orphan")
    support_tickets = relationship("SupportTicketModel", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("AppNotificationModel", back_populates="user", cascade="all, delete-orphan")
    conversations = relationship("DishaConversationModel", back_populates="user", cascade="all, delete-orphan")


class BusinessModel(Base):
    __tablename__ = "businesses"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=True)
    name = Column(String(150), nullable=False)
    enterprise_name = Column(String(150), nullable=True)
    category = Column(String(64), default="AGRO_PROCESSING")
    industry_type = Column(String(64), default="Manufacturing")
    sector = Column(String(128), default="Agro-Processing")
    location_type = Column(String(32), default="Rural")
    entity_type = Column(String(64), default="Proprietorship")
    stage = Column(String(64), default="Idea / Inception")
    project_cost = Column(Float, default=850000.0)
    promoter_capital = Column(Float, default=150000.0)
    status = Column(String(32), default="PLANNING")
    state = Column(String(64), default="Maharashtra")
    district = Column(String(64), default="Yavatmal")
    block = Column(String(64), default="Pusad")
    pin_code = Column(String(16), nullable=True)
    gram_panchayat = Column(String(128), default="Shendurjana Khurd Gram Panchayat")
    village = Column(String(128), default="Shendurjana Khurd")
    is_rural = Column(Boolean, default=True)
    odop_commodity = Column(String(128), default="Cotton & Chana Processing")
    pan_number = Column(String(32), nullable=True)
    udyam_number = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("UserModel", back_populates="businesses")
    financial_reports = relationship("FinancialReportModel", back_populates="business", cascade="all, delete-orphan")
    feasibility_reports = relationship("FeasibilityReportModel", back_populates="business", cascade="all, delete-orphan")
    applications = relationship("SchemeApplicationModel", back_populates="business", cascade="all, delete-orphan")
    inventory_items = relationship("InventoryItemModel", back_populates="business", cascade="all, delete-orphan")
    sales_records = relationship("SalesRecordModel", back_populates="business", cascade="all, delete-orphan")
    milestones = relationship("ActionMilestoneModel", back_populates="business", cascade="all, delete-orphan")
    documents = relationship("DocumentItemModel", back_populates="business", cascade="all, delete-orphan")


class FinancialReportModel(Base):
    __tablename__ = "financial_reports"

    id = Column(String(64), primary_key=True, index=True)
    business_id = Column(String(64), ForeignKey("businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    project_cost = Column(Float, default=0.0)
    promoter_contribution = Column(Float, default=0.0)
    term_loan = Column(Float, default=0.0)
    working_capital_loan = Column(Float, default=0.0)
    projected_annual_revenue = Column(Float, default=0.0)
    annual_operating_cost = Column(Float, default=0.0)
    gross_profit = Column(Float, default=0.0)
    net_profit = Column(Float, default=0.0)
    dscr = Column(Float, default=0.0)
    break_even_percentage = Column(Float, default=0.0)
    roi_percentage = Column(Float, default=0.0)
    payback_period_years = Column(Float, default=0.0)
    projections_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    business = relationship("BusinessModel", back_populates="financial_reports")


class FeasibilityReportModel(Base):
    __tablename__ = "feasibility_reports"

    id = Column(String(64), primary_key=True, index=True)
    business_id = Column(String(64), ForeignKey("businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    overall_score = Column(Float, default=0.0)
    market_demand_score = Column(Float, default=0.0)
    financial_viability_score = Column(Float, default=0.0)
    operational_readiness_score = Column(Float, default=0.0)
    promoter_competence_score = Column(Float, default=0.0)
    verdict = Column(String(64), default="Moderate Feasibility")
    strengths_json = Column(Text, nullable=True)
    risks_json = Column(Text, nullable=True)
    recommendations_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    business = relationship("BusinessModel", back_populates="feasibility_reports")


class SchemeCatalogModel(Base):
    __tablename__ = "schemes_catalog"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(256), nullable=False)
    ministry = Column(String(256), nullable=False)
    description = Column(Text, nullable=False)
    max_loan_amount = Column(Float, default=0.0)
    subsidy_percentage = Column(Float, default=0.0)
    eligible_sectors_json = Column(Text, nullable=True)
    eligible_entities_json = Column(Text, nullable=True)
    special_benefits_json = Column(Text, nullable=True)
    required_docs_json = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class SchemeApplicationModel(Base):
    __tablename__ = "scheme_applications"

    id = Column(String(64), primary_key=True, index=True)
    business_id = Column(String(64), ForeignKey("businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="SET NULL"), index=True, nullable=True)
    scheme_id = Column(String(64), nullable=False)
    scheme_name = Column(String(256), nullable=False)
    application_number = Column(String(64), unique=True, index=True, nullable=False)
    requested_amount = Column(Float, nullable=False)
    calculated_subsidy = Column(Float, default=0.0)
    sanctioned_amount = Column(Float, nullable=True)
    current_stage = Column(String(128), default="District Industries Centre (DIC) Verification")
    status = Column(String(32), default="UNDER_SCRUTINY")
    remarks = Column(Text, nullable=True)
    submission_date = Column(String(32), default=lambda: datetime.utcnow().strftime("%Y-%m-%d"))
    dpr_snapshot_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    business = relationship("BusinessModel", back_populates="applications")


class InventoryItemModel(Base):
    __tablename__ = "inventory_items"

    id = Column(String(64), primary_key=True, index=True)
    business_id = Column(String(64), ForeignKey("businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    item_name = Column(String(128), nullable=False)
    category = Column(String(32), default="RAW_MATERIAL")  # RAW_MATERIAL, FINISHED_GOODS, PACKAGING
    unit = Column(String(32), default="kg")
    current_stock = Column(Float, default=0.0)
    reorder_threshold = Column(Float, default=0.0)
    minimum_required = Column(Float, default=0.0)
    avg_purchase_rate = Column(Float, default=0.0)
    cost_per_unit = Column(Float, default=0.0)
    supplier_contact = Column(String(120), nullable=True)
    last_restocked_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    business = relationship("BusinessModel", back_populates="inventory_items")


class SalesRecordModel(Base):
    __tablename__ = "sales_records"

    id = Column(String(64), primary_key=True, index=True)
    business_id = Column(String(64), ForeignKey("businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    sale_date = Column(String(32), nullable=False)
    product_name = Column(String(128), nullable=False)
    item_name = Column(String(128), nullable=True)
    customer_name = Column(String(128), nullable=True)
    buyer_name = Column(String(128), nullable=True)
    customer_type = Column(String(32), default="RETAIL_KIRANA")
    units_sold = Column(Float, default=0.0)
    quantity = Column(Float, default=0.0)
    unit_sale_price = Column(Float, default=0.0)
    unit_price = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False)
    payment_mode = Column(String(32), default="UPI")
    payment_status = Column(String(32), default="Paid")
    created_at = Column(DateTime, default=datetime.utcnow)

    business = relationship("BusinessModel", back_populates="sales_records")


class ActionMilestoneModel(Base):
    __tablename__ = "action_milestones"

    id = Column(Integer, primary_key=True, autoincrement=True)
    business_id = Column(String(64), ForeignKey("businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    phase = Column(String(64), default="Phase 1: Setup & Registration")
    stage_order = Column(Integer, default=1)
    title = Column(String(256), nullable=False)
    description = Column(Text, nullable=True)
    timeframe = Column(String(64), default="2 Weeks")
    authority = Column(String(128), default="DIC / MSME")
    status = Column(String(32), default="PENDING")  # PENDING, IN_PROGRESS, COMPLETED
    is_completed = Column(Boolean, default=False)
    target_date = Column(String(32), nullable=True)
    completed_at = Column(DateTime, nullable=True)

    business = relationship("BusinessModel", back_populates="milestones")


class SupportTicketModel(Base):
    __tablename__ = "support_tickets"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=True)
    subject = Column(String(256), nullable=False)
    category = Column(String(64), default="SCHEME_ELIGIBILITY")
    priority = Column(String(32), default="NORMAL")
    description = Column(Text, nullable=False)
    status = Column(String(32), default="OPEN")  # OPEN, IN_PROGRESS, RESOLVED, CLOSED
    resolution_notes = Column(Text, nullable=True)
    admin_response = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("UserModel", back_populates="support_tickets")


class AppNotificationModel(Base):
    __tablename__ = "notifications"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=True)
    title = Column(String(128), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(32), default="SCHEME_UPDATE")
    is_read = Column(Boolean, default=False)
    action_url = Column(String(256), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("UserModel", back_populates="notifications")


class DocumentItemModel(Base):
    __tablename__ = "document_items"

    id = Column(String(64), primary_key=True, index=True)
    business_id = Column(String(64), ForeignKey("businesses.id", ondelete="CASCADE"), index=True, nullable=False)
    name = Column(String(256), nullable=False)
    category = Column(String(32), default="IDENTITY")
    doc_type = Column(String(64), default="IDENTITY")
    issuing_authority = Column(String(128), default="Government of India")
    status = Column(String(32), default="PENDING")  # VERIFIED, DIGILOCKER_SYNCED, PENDING, OPTIONAL
    file_path = Column(String(256), nullable=True)
    file_size_bytes = Column(Integer, default=0)
    mime_type = Column(String(64), default="application/pdf")
    required_for = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    business = relationship("BusinessModel", back_populates="documents")


class DishaConversationModel(Base):
    __tablename__ = "disha_conversations"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    business_id = Column(String(64), ForeignKey("businesses.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(150), default="New Discussion")
    language = Column(String(16), default="en")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("UserModel", back_populates="conversations")
    messages = relationship("DishaMessageModel", back_populates="conversation", cascade="all, delete-orphan")


class DishaMessageModel(Base):
    __tablename__ = "disha_messages"

    id = Column(String(64), primary_key=True, index=True)
    conversation_id = Column(String(64), ForeignKey("disha_conversations.id", ondelete="CASCADE"), index=True, nullable=False)
    role = Column(String(20), nullable=False)  # user, assistant
    content = Column(Text, nullable=False)
    grounding_refs_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    conversation = relationship("DishaConversationModel", back_populates="messages")


class MarketPriceModel(Base):
    __tablename__ = "market_prices"

    id = Column(String(64), primary_key=True, index=True)
    commodity = Column(String(80), index=True, nullable=False)
    market_name = Column(String(100), nullable=False)
    district = Column(String(80), index=True, nullable=False)
    state = Column(String(80), nullable=False)
    modal_price = Column(Float, nullable=False)
    min_price = Column(Float, nullable=False)
    max_price = Column(Float, nullable=False)
    price_trend = Column(String(20), default="Stable")  # Rising, Falling, Stable
    reported_date = Column(String(32), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
