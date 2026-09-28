-- ==============================================================================
-- GRAM-DISHA — India District Urbanity & Policy Reference Master Seed
-- Team ERGON | Smart India Hackathon 2026
-- ==============================================================================

USE gram_disha_db;

-- 1. DATASET REGISTRY
INSERT INTO datasets 
(dataset_id, dataset_name, category, scope, geographic_levels, primary_purpose, source_document, source_authority, source_url)
VALUES
('district_urbanity_policy_reference', 'Gram-Disha India District Urbanity Reference With UTs', 'Geographic + Policy Reference Dataset', 'India', 'State, District', 'Administrative validation, Urbanity classification, PMEGP geographic differentiation, ODOP alignment, RBI tier contextualization, Feasibility analysis, Hyper-local analytical context', 'Gram-Disha_India_District_Urbanity_Reference_With_UTs-2.docx', 'Ministry of Panchayati Raj (MoPR), KVIC/MoMSME, MoFPI, RBI, ORGI', 'https://lgdirectory.gov.in/')
ON DUPLICATE KEY UPDATE dataset_name = VALUES(dataset_name);

-- 2. DATASET VERSION
INSERT INTO dataset_versions
(version_id, dataset_id, version_number, data_vintage, ingestion_date, verification_date, is_current, record_count, status, confidence, notes)
VALUES
('VER_DUR_1_0_0', 'district_urbanity_policy_reference', '1.0.0', '2025-2026', '2026-03-01 00:00:00', '2026-03-01 00:00:00', 1, 788, 'PROVISIONAL', 0.95, 'Primary geographic reference dataset for Gram-Disha decision intelligence engine.')
ON DUPLICATE KEY UPDATE version_number = VALUES(version_number);

-- 3. GEOGRAPHIC STATES & UNION TERRITORIES (28 States + 8 UTs)
INSERT INTO geographic_states
(state_lgd_code, state_name, territory_type, total_districts, data_vintage, verification_status)
VALUES
('28', 'Andhra Pradesh', 'STATE', 26, '2025-2026', 'VERIFIED'),
('12', 'Arunachal Pradesh', 'STATE', 26, '2025-2026', 'VERIFIED'),
('18', 'Assam', 'STATE', 35, '2025-2026', 'VERIFIED'),
('10', 'Bihar', 'STATE', 38, '2025-2026', 'VERIFIED'),
('22', 'Chhattisgarh', 'STATE', 33, '2025-2026', 'VERIFIED'),
('30', 'Goa', 'STATE', 2, '2025-2026', 'VERIFIED'),
('24', 'Gujarat', 'STATE', 33, '2025-2026', 'VERIFIED'),
('06', 'Haryana', 'STATE', 22, '2025-2026', 'VERIFIED'),
('02', 'Himachal Pradesh', 'STATE', 12, '2025-2026', 'VERIFIED'),
('20', 'Jharkhand', 'STATE', 24, '2025-2026', 'VERIFIED'),
('29', 'Karnataka', 'STATE', 31, '2025-2026', 'VERIFIED'),
('32', 'Kerala', 'STATE', 14, '2025-2026', 'VERIFIED'),
('23', 'Madhya Pradesh', 'STATE', 55, '2025-2026', 'VERIFIED'),
('27', 'Maharashtra', 'STATE', 36, '2025-2026', 'VERIFIED'),
('14', 'Manipur', 'STATE', 16, '2025-2026', 'VERIFIED'),
('17', 'Meghalaya', 'STATE', 12, '2025-2026', 'VERIFIED'),
('15', 'Mizoram', 'STATE', 11, '2025-2026', 'VERIFIED'),
('13', 'Nagaland', 'STATE', 16, '2025-2026', 'VERIFIED'),
('21', 'Odisha', 'STATE', 30, '2025-2026', 'VERIFIED'),
('03', 'Punjab', 'STATE', 23, '2025-2026', 'VERIFIED'),
('08', 'Rajasthan', 'STATE', 50, '2025-2026', 'VERIFIED'),
('11', 'Sikkim', 'STATE', 6, '2025-2026', 'VERIFIED'),
('33', 'Tamil Nadu', 'STATE', 38, '2025-2026', 'VERIFIED'),
('36', 'Telangana', 'STATE', 33, '2025-2026', 'VERIFIED'),
('16', 'Tripura', 'STATE', 8, '2025-2026', 'VERIFIED'),
('09', 'Uttar Pradesh', 'STATE', 75, '2025-2026', 'VERIFIED'),
('05', 'Uttarakhand', 'STATE', 13, '2025-2026', 'VERIFIED'),
('19', 'West Bengal', 'STATE', 23, '2025-2026', 'VERIFIED'),
('35', 'Andaman and Nicobar Islands', 'UNION_TERRITORY', 3, '2025-2026', 'VERIFIED'),
('04', 'Chandigarh', 'UNION_TERRITORY', 1, '2025-2026', 'VERIFIED'),
('26', 'Dadra and Nagar Haveli and Daman and Diu', 'UNION_TERRITORY', 3, '2025-2026', 'VERIFIED'),
('07', 'Delhi', 'UNION_TERRITORY', 11, '2025-2026', 'VERIFIED'),
('01', 'Jammu and Kashmir', 'UNION_TERRITORY', 20, '2025-2026', 'VERIFIED'),
('37', 'Ladakh', 'UNION_TERRITORY', 2, '2025-2026', 'VERIFIED'),
('31', 'Lakshadweep', 'UNION_TERRITORY', 1, '2025-2026', 'VERIFIED'),
('34', 'Puducherry', 'UNION_TERRITORY', 4, '2025-2026', 'VERIFIED')
ON DUPLICATE KEY UPDATE total_districts = VALUES(total_districts);

-- 4. GEOGRAPHIC DISTRICTS (SAMPLE EXTRACTS)
INSERT INTO geographic_districts
(district_lgd_code, state_lgd_code, state_name, district_name, territory_type, urbanity_classification, census_rural_percentage, rbi_tier_classification, gram_disha_primary_scope, verification_status)
VALUES
('489', '27', 'Maharashtra', 'Yavatmal', 'STATE', 'RURAL', 78.4, 'TIER_3', 1, 'VERIFIED'),
('488', '27', 'Maharashtra', 'Wardha', 'STATE', 'SEMI_URBAN / PERI_URBAN', 67.5, 'TIER_3', 1, 'VERIFIED'),
('478', '27', 'Maharashtra', 'Nagpur', 'STATE', 'URBAN', 31.7, 'TIER_1', 0, 'VERIFIED'),
('175', '09', 'Uttar Pradesh', 'Varanasi', 'STATE', 'SEMI_URBAN / PERI_URBAN', 56.6, 'TIER_2', 1, 'VERIFIED'),
('144', '09', 'Uttar Pradesh', 'Gorakhpur', 'STATE', 'RURAL', 81.2, 'TIER_2', 1, 'VERIFIED'),
('112', '08', 'Rajasthan', 'Jodhpur', 'STATE', 'SEMI_URBAN / PERI_URBAN', 65.7, 'TIER_2', 1, 'VERIFIED'),
('208', '10', 'Bihar', 'Muzaffarpur', 'STATE', 'RURAL', 90.1, 'TIER_2', 1, 'VERIFIED'),
('444', '24', 'Gujarat', 'Anand', 'STATE', 'SEMI_URBAN / PERI_URBAN', 69.6, 'TIER_2', 1, 'VERIFIED'),
('001', '01', 'Jammu and Kashmir', 'Anantnag', 'UNION_TERRITORY', 'RURAL', 73.8, 'TIER_3', 1, 'VERIFIED'),
('009', '37', 'Ladakh', 'Leh', 'UNION_TERRITORY', 'RURAL', 66.0, 'TIER_4', 1, 'VERIFIED')
ON DUPLICATE KEY UPDATE urbanity_classification = VALUES(urbanity_classification);

-- 5. DISTRICT POLICY & ECONOMIC CONTEXT
INSERT INTO district_context
(context_id, district_lgd_code, notified_odop_commodity, odop_category, agro_climatic_zone, power_tariff_zone, power_subsidies, pmegp_general_rural_pct, pmegp_special_rural_pct, pmegp_general_urban_pct, pmegp_special_urban_pct)
VALUES
('CTX_489', '489', 'Cotton Ginning & Processing / Soybean Oil', 'AGRO_PROCESSING', 'Western Plateau & Hill Region (Zone IX)', 'MSEDCL Zone 4 Rural Feeder', 'Agro-Processing & Rural Micro-Enterprise Tariff Support', 25.0, 35.0, 15.0, 25.0),
('CTX_488', '488', 'Organic Cotton Khadi / Spices', 'HANDICRAFTS', 'Western Plateau & Hill Region (Zone IX)', 'MSEDCL Wardha Semi-Urban Feeder', 'Rural Artisanal Khadi Subsidized Power', 25.0, 35.0, 15.0, 25.0),
('CTX_175', '175', 'Banarasi Silk Weaving & Handloom / Zardozi', 'TEXTILES', 'Middle Gangetic Plain (Zone IV)', 'UPPCL Rural-Peri-Urban Feeder', 'Weaver Subsidized Power Scheme', 25.0, 35.0, 15.0, 25.0),
('CTX_144', '144', 'Terracotta Clay Crafts / Readymade Garments', 'HANDICRAFTS', 'Middle Gangetic Plain (Zone IV)', 'UPPCL Purvanchal Rural Feeder', 'Rural Craft Artisan Tariff Exemption', 25.0, 35.0, 15.0, 25.0),
('CTX_112', '112', 'Wooden Furniture & Handicrafts / Spices', 'WOOD_CRAFT', 'Western Dry Region (Zone XIV)', 'JVVNL Rural Feeder', 'Solar Micro-Grid & Handicraft Incentive', 25.0, 35.0, 15.0, 25.0),
('CTX_208', '208', 'Shahi Litchi Processing & Pulping / Lac Bangles', 'AGRO_PROCESSING', 'Middle Gangetic Plain (Zone IV)', 'NBPDCL Rural Feeder', 'Bihar Industrial Investment Promotion Subsidies', 25.0, 35.0, 15.0, 25.0),
('CTX_444', '444', 'Dairy Products & Milk Processing / Banana', 'DAIRY_AGRO', 'Gujarat Plains & Hills Region (Zone XIII)', 'MGVCL Agro Feeder', 'Jyotigram Yojana Continuous Power Support', 25.0, 35.0, 15.0, 25.0),
('CTX_001', '001', 'Trout Fish Farming & Processing / Cricket Bats (Willow)', 'FISHERIES_SPORTS', 'Western Himalayan Region (Zone I)', 'KPDCL Kashmir Rural Grid', 'Hill Area & Special UT Industrial Package', 35.0, 35.0, 25.0, 35.0),
('CTX_009', '009', 'Seabuckthorn Berry Processing / Pashmina Wool', 'AGRO_WOOL', 'Western Himalayan High Altitude Cold Desert', 'Ladakh Power Dev Dept Hydro/Solar Grid', 'Cold Desert Special Development Subsidies', 35.0, 35.0, 25.0, 35.0)
ON DUPLICATE KEY UPDATE notified_odop_commodity = VALUES(notified_odop_commodity);
