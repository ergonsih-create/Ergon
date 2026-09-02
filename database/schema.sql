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
