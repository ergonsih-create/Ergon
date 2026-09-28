-- GRAM-DISHA — Authoritative Provenance Sources Seed
USE gram_disha_db;

INSERT INTO provenance_sources 
(source_id, source_name, governance_body, dataset_name, source_url, vintage_timestamp, refresh_cadence, is_authoritative)
VALUES
('SRC_LGD_01', 'Local Government Directory', 'Ministry of Panchayati Raj', 'National LGD Hierarchy 2025-2026', 'https://lgdirectory.gov.in/', '2026-01-15 00:00:00', 'MONTHLY', 1),
('SRC_AGMARKNET_01', 'AGMARKNET Portal', 'Directorate of Marketing & Inspection (DMI)', 'APMC Daily/Weekly Commodity Price Bulletin', 'https://agmarknet.gov.in/', '2026-03-01 08:30:00', 'DAILY', 1),
('SRC_MSME_PMEGP', 'KVIC PMEGP Portal', 'Ministry of MSME', 'PMEGP Official Guidelines Register v2.4', 'https://www.kviconline.gov.in/pmegpep/', '2025-10-01 00:00:00', 'QUARTERLY', 1),
('SRC_NSFDC_01', 'NSFDC Portal', 'National Scheduled Castes Finance and Development Corporation', 'Credit & Term Assistance Criteria v1.8', 'https://nsfdc.nic.in/', '2025-08-01 00:00:00', 'ANNUAL', 1)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;
