-- ==============================================================================
-- GRAM-DISHA — MySQL 8.0 Master Schema Definition
-- Team ERGON | Smart India Hackathon 2026
-- Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS gram_disha_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE gram_disha_db;

-- 1. PROVENANCE & OFFICIAL DATA REGISTRY
CREATE TABLE IF NOT EXISTS provenance_sources (
    source_id VARCHAR(64) PRIMARY KEY,
    source_name VARCHAR(255) NOT NULL,
    governance_body VARCHAR(255) NOT NULL,
    dataset_name VARCHAR(255) NOT NULL,
    source_url VARCHAR(512) NOT NULL,
    vintage_timestamp DATETIME NOT NULL,
    refresh_cadence VARCHAR(64) DEFAULT 'MONTHLY',
    is_authoritative BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. ADMINISTRATIVE & GEOGRAPHIC REFERENCE (LGD)
CREATE TABLE IF NOT EXISTS lgd_locations (
    lgd_code VARCHAR(32) PRIMARY KEY,
    state_name VARCHAR(128) NOT NULL,
    district_name VARCHAR(128) NOT NULL,
    block_name VARCHAR(128) NOT NULL,
    village_name VARCHAR(128) NOT NULL,
    pincode VARCHAR(12),
    is_rural BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_location_geo (state_name, district_name, block_name)
) ENGINE=InnoDB;

-- 3. USERS & PROFILES
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(32) DEFAULT 'ENTREPRENEUR',
    social_category VARCHAR(32) DEFAULT 'GENERAL', -- GENERAL, SC, ST, OBC, EWS, MINORITY
    gender VARCHAR(16) DEFAULT 'MALE',
    annual_income DECIMAL(12, 2) DEFAULT 0.00,
    lgd_code VARCHAR(32),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lgd_code) REFERENCES lgd_locations(lgd_code) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 4. ENTERPRISE / BUSINESS PROFILES
CREATE TABLE IF NOT EXISTS enterprise_projects (
    project_id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    business_title VARCHAR(255) NOT NULL,
    activity_type VARCHAR(64) NOT NULL, -- MANUFACTURING, SERVICE, AGRO_PROCESSING
    target_capacity VARCHAR(128),
    estimated_project_cost DECIMAL(14, 2) NOT NULL,
    promoter_capital DECIMAL(14, 2) NOT NULL,
    lgd_code VARCHAR(32),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (lgd_code) REFERENCES lgd_locations(lgd_code) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 5. FEASIBILITY EVALUATIONS (HBFS AUDIT LOG)
CREATE TABLE IF NOT EXISTS feasibility_evaluations (
    evaluation_id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL,
    hbfs_total_score DECIMAL(5, 3) NOT NULL,
    ranking_tier VARCHAR(32) NOT NULL,
    demand_index DECIMAL(4, 3) NOT NULL,
    accessibility_index DECIMAL(4, 3) NOT NULL,
    infrastructure_index DECIMAL(4, 3) NOT NULL,
    socioeconomic_index DECIMAL(4, 3) NOT NULL,
    scheme_suitability_index DECIMAL(4, 3) NOT NULL,
    climate_vulnerability_index DECIMAL(4, 3) NOT NULL,
    capital_deficit_ratio DECIMAL(4, 3) NOT NULL,
    uncertainty_ratio DECIMAL(4, 3) NOT NULL,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES enterprise_projects(project_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. DETERMINISTIC FINANCIAL STRUCTURES
CREATE TABLE IF NOT EXISTS financial_structures (
    structure_id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL,
    total_project_cost DECIMAL(14, 2) NOT NULL,
    promoter_equity DECIMAL(14, 2) NOT NULL,
    term_loan_amount DECIMAL(14, 2) NOT NULL,
    working_capital_loan DECIMAL(14, 2) NOT NULL,
    interest_rate_annual DECIMAL(5, 2) NOT NULL,
    tenure_months INT NOT NULL,
    moratorium_months INT DEFAULT 0,
    monthly_emi DECIMAL(12, 2) NOT NULL,
    break_even_monthly_revenue DECIMAL(14, 2) NOT NULL,
    projected_dscr DECIMAL(5, 2) NOT NULL,
    projected_annual_roi DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES enterprise_projects(project_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. GOVERNMENT SCHEME RULES REGISTRY
CREATE TABLE IF NOT EXISTS scheme_definitions (
    scheme_id VARCHAR(64) PRIMARY KEY,
    scheme_code VARCHAR(32) UNIQUE NOT NULL,
    scheme_name VARCHAR(255) NOT NULL,
    ministry_or_agency VARCHAR(255) NOT NULL,
    rule_version VARCHAR(32) NOT NULL,
    max_project_cost_mfg DECIMAL(14, 2),
    max_project_cost_serv DECIMAL(14, 2),
    rural_subsidy_general_pct DECIMAL(5, 2) DEFAULT 25.00,
    rural_subsidy_special_pct DECIMAL(5, 2) DEFAULT 35.00,
    urban_subsidy_general_pct DECIMAL(5, 2) DEFAULT 15.00,
    urban_subsidy_special_pct DECIMAL(5, 2) DEFAULT 25.00,
    official_portal_url VARCHAR(512) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    provenance_source_id VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provenance_source_id) REFERENCES provenance_sources(source_id)
) ENGINE=InnoDB;

-- 8. DATASET REGISTRY & VERSIONING
CREATE TABLE IF NOT EXISTS datasets (
    dataset_id VARCHAR(64) PRIMARY KEY,
    dataset_name VARCHAR(255) NOT NULL,
    category VARCHAR(128) NOT NULL,
    scope VARCHAR(128) DEFAULT 'India',
    geographic_levels VARCHAR(255) DEFAULT 'State, District',
    primary_purpose TEXT NOT NULL,
    source_document VARCHAR(255) NOT NULL,
    source_authority VARCHAR(255) NOT NULL,
    source_url VARCHAR(512) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS dataset_versions (
    version_id VARCHAR(64) PRIMARY KEY,
    dataset_id VARCHAR(64) NOT NULL,
    version_number VARCHAR(32) NOT NULL,
    data_vintage VARCHAR(64) NOT NULL,
    ingestion_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    verification_date DATETIME NULL,
    effective_from DATETIME DEFAULT CURRENT_TIMESTAMP,
    effective_to DATETIME NULL,
    is_current BOOLEAN DEFAULT TRUE,
    record_count INT DEFAULT 0,
    status VARCHAR(32) DEFAULT 'PROVISIONAL',
    confidence FLOAT DEFAULT 0.95,
    notes TEXT NULL,
    FOREIGN KEY (dataset_id) REFERENCES datasets(dataset_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. GEOGRAPHIC STATES & UNION TERRITORIES (LGD)
CREATE TABLE IF NOT EXISTS geographic_states (
    state_lgd_code VARCHAR(32) PRIMARY KEY,
    state_name VARCHAR(128) UNIQUE NOT NULL,
    territory_type VARCHAR(32) NOT NULL, -- STATE, UNION_TERRITORY
    total_districts INT DEFAULT 0,
    data_vintage VARCHAR(32) DEFAULT '2025-2026',
    verification_status VARCHAR(32) DEFAULT 'VERIFIED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 10. GEOGRAPHIC DISTRICTS & URBANITY REFERENCE
CREATE TABLE IF NOT EXISTS geographic_districts (
    district_lgd_code VARCHAR(32) PRIMARY KEY,
    state_lgd_code VARCHAR(32) NOT NULL,
    state_name VARCHAR(128) NOT NULL,
    district_name VARCHAR(128) NOT NULL,
    territory_type VARCHAR(32) NOT NULL,
    urbanity_classification VARCHAR(64) NOT NULL, -- RURAL, SEMI_URBAN / PERI_URBAN, URBAN, METROPOLITAN
    census_rural_percentage FLOAT NULL,
    rbi_tier_classification VARCHAR(32) DEFAULT 'UNKNOWN',
    gram_disha_primary_scope BOOLEAN DEFAULT TRUE,
    source_id VARCHAR(64) DEFAULT 'SRC_LGD_01',
    source_url VARCHAR(512) DEFAULT 'https://lgdirectory.gov.in/',
    source_authority VARCHAR(255) DEFAULT 'Ministry of Panchayati Raj / MoMSME / MoFPI / RBI',
    data_vintage VARCHAR(32) DEFAULT '2025-2026',
    verification_status VARCHAR(32) DEFAULT 'PROVISIONAL',
    verification_date DATETIME NULL,
    confidence FLOAT DEFAULT 0.95,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (state_lgd_code) REFERENCES geographic_states(state_lgd_code) ON DELETE CASCADE,
    INDEX idx_dist_state_lookup (state_lgd_code, district_name),
    INDEX idx_dist_urbanity (urbanity_classification)
) ENGINE=InnoDB;

-- 11. DISTRICT POLICY & ECONOMIC CONTEXT
CREATE TABLE IF NOT EXISTS district_context (
    context_id VARCHAR(64) PRIMARY KEY,
    district_lgd_code VARCHAR(32) UNIQUE NOT NULL,
    notified_odop_commodity VARCHAR(255) DEFAULT 'UNKNOWN',
    odop_category VARCHAR(128) DEFAULT 'UNKNOWN',
    agro_climatic_zone VARCHAR(255) DEFAULT 'UNKNOWN',
    power_tariff_zone VARCHAR(255) DEFAULT 'UNKNOWN',
    power_subsidies VARCHAR(255) DEFAULT 'UNKNOWN',
    pmegp_general_rural_pct FLOAT DEFAULT 25.0,
    pmegp_special_rural_pct FLOAT DEFAULT 35.0,
    pmegp_general_urban_pct FLOAT DEFAULT 15.0,
    pmegp_special_urban_pct FLOAT DEFAULT 25.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (district_lgd_code) REFERENCES geographic_districts(district_lgd_code) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 12. DATA PROVENANCE, AUDIT & VALIDATION LOGS
CREATE TABLE IF NOT EXISTS data_provenance (
    provenance_id VARCHAR(64) PRIMARY KEY,
    dataset_id VARCHAR(64) NOT NULL,
    version VARCHAR(32) NOT NULL,
    source_name VARCHAR(255) NOT NULL,
    source_authority VARCHAR(255) NOT NULL,
    source_url VARCHAR(512) NOT NULL,
    source_document VARCHAR(255) NOT NULL,
    data_vintage VARCHAR(64) NOT NULL,
    ingestion_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    verification_timestamp DATETIME NULL,
    geographic_level VARCHAR(64) DEFAULT 'DISTRICT',
    verification_status VARCHAR(32) DEFAULT 'PROVISIONAL',
    confidence FLOAT DEFAULT 0.95,
    notes TEXT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS data_validation_results (
    validation_id VARCHAR(64) PRIMARY KEY,
    dataset_id VARCHAR(64) NOT NULL,
    version VARCHAR(32) NOT NULL,
    validation_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_records INT DEFAULT 0,
    valid_records INT DEFAULT 0,
    invalid_records INT DEFAULT 0,
    unknown_fields_count INT DEFAULT 0,
    conflicts_count INT DEFAULT 0,
    quality_score FLOAT DEFAULT 1.0,
    report_json TEXT NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS data_conflicts (
    conflict_id VARCHAR(64) PRIMARY KEY,
    district_lgd_code VARCHAR(32) NOT NULL,
    field_name VARCHAR(128) NOT NULL,
    old_value VARCHAR(255) NULL,
    new_value VARCHAR(255) NULL,
    source_a VARCHAR(255) NOT NULL,
    source_b VARCHAR(255) NOT NULL,
    detected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolution_status VARCHAR(64) DEFAULT 'PENDING_HUMAN_VERIFICATION',
    resolution_notes TEXT NULL
) ENGINE=InnoDB;

-- 13. BUSINESS ENTITIES & PROJECTS
CREATE TABLE IF NOT EXISTS businesses (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    constitution VARCHAR(64) DEFAULT 'Sole Proprietorship',
    state VARCHAR(64) DEFAULT 'Maharashtra',
    district VARCHAR(64) DEFAULT 'Yavatmal',
    block VARCHAR(64) DEFAULT 'Pusad',
    village VARCHAR(128) DEFAULT 'Shendurjana Khurd',
    is_rural BOOLEAN DEFAULT TRUE,
    total_project_cost DOUBLE DEFAULT 0.0,
    promoter_capital DOUBLE DEFAULT 0.0,
    term_loan_amount DOUBLE DEFAULT 0.0,
    working_capital_loan DOUBLE DEFAULT 0.0,
    interest_rate DOUBLE DEFAULT 9.5,
    tenure_months INT DEFAULT 60,
    moratorium_months INT DEFAULT 6,
    annual_turnover DOUBLE DEFAULT 0.0,
    profit_margin DOUBLE DEFAULT 0.0,
    break_even_units INT DEFAULT 0,
    projected_dscr DOUBLE DEFAULT 0.0,
    feasibility_score DOUBLE DEFAULT 0.0,
    feasibility_tier VARCHAR(64) DEFAULT 'MODERATE_FEASIBILITY',
    market_demand_index DOUBLE DEFAULT 0.8,
    status VARCHAR(32) DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_biz_user (user_id)
) ENGINE=InnoDB;

-- 14. FINANCIAL REPORTS
CREATE TABLE IF NOT EXISTS financial_reports (
    id VARCHAR(64) PRIMARY KEY,
    business_id VARCHAR(64) NOT NULL,
    total_project_cost DOUBLE NOT NULL,
    promoter_capital DOUBLE NOT NULL,
    promoter_contribution_pct DOUBLE NOT NULL,
    term_loan_amount DOUBLE NOT NULL,
    working_capital_loan DOUBLE NOT NULL,
    monthly_emi DOUBLE NOT NULL,
    projected_dscr DOUBLE NOT NULL,
    projected_roi DOUBLE NOT NULL,
    break_even_units INT NOT NULL,
    break_even_revenue DOUBLE NOT NULL,
    cost_breakdown_json LONGTEXT,
    cash_flow_monthly_json LONGTEXT,
    five_year_projections_json LONGTEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_fin_biz (business_id)
) ENGINE=InnoDB;

-- 15. FEASIBILITY REPORTS
CREATE TABLE IF NOT EXISTS feasibility_reports (
    id VARCHAR(64) PRIMARY KEY,
    business_id VARCHAR(64) NOT NULL,
    total_score DOUBLE NOT NULL,
    ranking_tier VARCHAR(64) NOT NULL,
    viability_status VARCHAR(64) NOT NULL,
    demand_index DOUBLE NOT NULL,
    accessibility_index DOUBLE NOT NULL,
    infrastructure_index DOUBLE NOT NULL,
    socioeconomic_index DOUBLE NOT NULL,
    scheme_suitability_index DOUBLE NOT NULL,
    climate_vulnerability_index DOUBLE NOT NULL,
    capital_deficit_ratio DOUBLE NOT NULL,
    uncertainty_ratio DOUBLE NOT NULL,
    swot_analysis_json LONGTEXT,
    recommendations_json LONGTEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_feas_biz (business_id)
) ENGINE=InnoDB;

-- 16. SCHEMES CATALOG
CREATE TABLE IF NOT EXISTS schemes_catalog (
    id VARCHAR(64) PRIMARY KEY,
    scheme_code VARCHAR(32) UNIQUE NOT NULL,
    scheme_name VARCHAR(255) NOT NULL,
    ministry VARCHAR(255) NOT NULL,
    nodal_agency VARCHAR(255),
    description TEXT,
    max_project_cost DOUBLE NOT NULL,
    subsidy_percentage DOUBLE NOT NULL,
    subsidy_cap DOUBLE NOT NULL,
    promoter_contribution_pct DOUBLE NOT NULL,
    is_rural_only BOOLEAN DEFAULT FALSE,
    portal_url VARCHAR(512),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 17. SCHEME APPLICATIONS
CREATE TABLE IF NOT EXISTS scheme_applications (
    id VARCHAR(64) PRIMARY KEY,
    application_number VARCHAR(64) UNIQUE NOT NULL,
    business_id VARCHAR(64) NOT NULL,
    scheme_id VARCHAR(64) NOT NULL,
    scheme_name VARCHAR(255) NOT NULL,
    requested_amount DOUBLE NOT NULL,
    sanctioned_amount DOUBLE DEFAULT 0.0,
    status VARCHAR(32) DEFAULT 'SUBMITTED',
    current_stage VARCHAR(128) DEFAULT 'Application Submitted to DIC Task Force',
    remarks TEXT,
    submission_date VARCHAR(32),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_app_biz (business_id)
) ENGINE=InnoDB;

-- 18. INVENTORY ITEMS
CREATE TABLE IF NOT EXISTS inventory_items (
    id VARCHAR(64) PRIMARY KEY,
    business_id VARCHAR(64) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(64) DEFAULT 'RAW_MATERIAL',
    unit VARCHAR(32) DEFAULT 'kg',
    current_stock DOUBLE DEFAULT 0.0,
    reorder_threshold DOUBLE DEFAULT 0.0,
    avg_purchase_rate DOUBLE DEFAULT 0.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_inv_biz (business_id)
) ENGINE=InnoDB;

-- 19. SALES RECORDS
CREATE TABLE IF NOT EXISTS sales_records (
    id VARCHAR(64) PRIMARY KEY,
    business_id VARCHAR(64) NOT NULL,
    sale_date VARCHAR(32) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    customer_type VARCHAR(64) DEFAULT 'RETAIL_KIRANA',
    units_sold DOUBLE NOT NULL,
    unit_sale_price DOUBLE NOT NULL,
    total_amount DOUBLE NOT NULL,
    payment_mode VARCHAR(32) DEFAULT 'UPI',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sales_biz (business_id)
) ENGINE=InnoDB;

-- 20. ACTION MILESTONES
CREATE TABLE IF NOT EXISTS action_milestones (
    id VARCHAR(64) PRIMARY KEY,
    business_id VARCHAR(64) NOT NULL,
    phase_number INT DEFAULT 1,
    phase_title VARCHAR(128) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    estimated_days INT DEFAULT 7,
    status VARCHAR(32) DEFAULT 'PENDING',
    due_date VARCHAR(32),
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_miles_biz (business_id)
) ENGINE=InnoDB;

-- 21. SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS support_tickets (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    category VARCHAR(64) DEFAULT 'SCHEME_ELIGIBILITY',
    priority VARCHAR(32) DEFAULT 'NORMAL',
    status VARCHAR(32) DEFAULT 'OPEN',
    description TEXT NOT NULL,
    officer_response TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tkt_user (user_id)
) ENGINE=InnoDB;

-- 22. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(32) DEFAULT 'SYSTEM',
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_notif_user (user_id)
) ENGINE=InnoDB;

-- 23. STATUTORY DOCUMENTS
CREATE TABLE IF NOT EXISTS document_items (
    id VARCHAR(64) PRIMARY KEY,
    business_id VARCHAR(64) NOT NULL,
    document_code VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(64) DEFAULT 'IDENTITY',
    is_mandatory BOOLEAN DEFAULT TRUE,
    is_uploaded BOOLEAN DEFAULT FALSE,
    file_path VARCHAR(512),
    verification_status VARCHAR(32) DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_doc_biz (business_id)
) ENGINE=InnoDB;

-- 24. DISHA AI ADVISORY CONVERSATIONS & MESSAGES
CREATE TABLE IF NOT EXISTS disha_conversations (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) DEFAULT 'Advisory Session',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_conv_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS disha_messages (
    id VARCHAR(64) PRIMARY KEY,
    conversation_id VARCHAR(64) NOT NULL,
    role VARCHAR(32) NOT NULL,
    content TEXT NOT NULL,
    grounding_refs_json LONGTEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES disha_conversations(id) ON DELETE CASCADE,
    INDEX idx_msg_conv (conversation_id)
) ENGINE=InnoDB;

-- 25. APMC MANDI MARKET PRICES
CREATE TABLE IF NOT EXISTS market_prices (
    id VARCHAR(64) PRIMARY KEY,
    commodity VARCHAR(128) NOT NULL,
    variety VARCHAR(128),
    market_mandi VARCHAR(128) NOT NULL,
    district VARCHAR(64) NOT NULL,
    state VARCHAR(64) NOT NULL,
    min_price DOUBLE NOT NULL,
    max_price DOUBLE NOT NULL,
    modal_price DOUBLE NOT NULL,
    daily_arrival_tonnes DOUBLE DEFAULT 0.0,
    price_trend VARCHAR(32) DEFAULT 'STABLE',
    bulletin_date VARCHAR(32) NOT NULL,
    provenance_json LONGTEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_mandi_geo (district, commodity)
) ENGINE=InnoDB;


