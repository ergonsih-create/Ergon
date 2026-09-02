-- GRAM-DISHA — Baseline Versioned Scheme Definitions
USE gram_disha_db;

INSERT INTO scheme_definitions 
(scheme_id, scheme_code, scheme_name, ministry_or_agency, rule_version, max_project_cost_mfg, max_project_cost_serv, rural_subsidy_general_pct, rural_subsidy_special_pct, urban_subsidy_general_pct, urban_subsidy_special_pct, official_portal_url, is_active, provenance_source_id)
VALUES
('SCHEME_PMEGP_2025', 'PMEGP', 'Prime Minister''s Employment Generation Programme', 'Ministry of MSME', 'v2.4-2025', 5000000.00, 2000000.00, 25.00, 35.00, 15.00, 25.00, 'https://www.kviconline.gov.in/pmegpep/', 1, 'SRC_MSME_PMEGP'),
('SCHEME_NSFDC_MCS', 'NSFDC_MCS', 'NSFDC Micro Credit Scheme', 'National Scheduled Castes Finance & Dev Corp', 'v1.8-2025', 150000.00, 150000.00, 20.00, 20.00, 20.00, 20.00, 'https://nsfdc.nic.in/', 1, 'SRC_NSFDC_01')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;
