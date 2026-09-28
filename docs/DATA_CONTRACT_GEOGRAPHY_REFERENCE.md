# GRAM-DISHA — Geographic & Urbanity Reference Data Contract
**Dataset**: `district_urbanity_policy_reference`  
**Source Document**: `Gram-Disha_India_District_Urbanity_Reference_With_UTs-2.docx`  
**Standard**: Local Government Directory (LGD), Ministry of Panchayati Raj (MoPR), KVIC, MoFPI, RBI  
**Version**: `1.0.0` (Effective: 2025–2026 Vintage)  
**Verification Status**: `PROVISIONAL` (0.95 Confidence, 0 Duplicate Records)

---

## 1. Overview & Architectural Purpose

Gram-Disha establishes a deterministic, auditable data layer for geographic and urbanity classification across all **28 States and 8 Union Territories (~788+ Districts)** of India. 

The reference dataset provides:
1. **Administrative Validation**: Verifies official 2-digit State and 3-digit District LGD codes.
2. **Urbanity Classification**: Differentiates `RURAL`, `SEMI_URBAN / PERI_URBAN`, `URBAN`, and `METROPOLITAN` zones based on census rural population proportions.
3. **PMEGP Geographic Differentiation Context**: Provides indicative 35% (Special Rural) / 25% (General Rural) vs. 25% / 15% (Urban) geographic tiers without pre-empting the master Scheme Rule Engine.
4. **ODOP Alignment Context**: Supplies notified One District One Product (ODOP) commodities for agro-processing and micro-enterprise cluster matching.
5. **RBI Tier Context**: Identifies Tier 1 through Tier 6 banking center classifications.
6. **Agro-Climatic Zones & Power Infrastructure**: Supplies climatic zoning and rural feeder context for HBFS (Heuristic Business Feasibility Scoring).

---

## 2. Value States & Data Taxonomy

Gram-Disha strictly distinguishes between data states:

| Value State | Definition | Handling Rule |
| :--- | :--- | :--- |
| `SOURCE_DATA` | Directly extracted from official government document or LGD portal. | Authoritative; immutable in raw layer. |
| `VALIDATED_DATA` | Ingested and verified against LGD and Census registers. | Passed to analytical engines with high confidence (>= 0.95). |
| `PROXY_DATA` | Derived from regional or neighboring cluster reference. | Must be explicitly flagged with lower confidence and explanatory notes. |
| `UNKNOWN` | Field is missing or absent in source document. | **Must remain explicitly `UNKNOWN`**. Never replaced with zero, false, or AI hallucination. |
| `CONFLICTING` | Multiple sources provide contradictory data. | Flagged with `CONFLICTING` status and queued for human verification. |
| `UNVERIFIED` | Provisional data awaiting official validation. | Flagged with cautionary notice in user-facing UI. |

---

## 3. Strict Prohibitions (Anti-Hallucination Directives)

To maintain absolute data integrity for bankable DPRs and government compliance:
- **NO Silent Infill**: Missing data must never be silently populated with plausible guesses.
- **NO Type-Coercion of `UNKNOWN`**: `UNKNOWN` is an explicit state and is NEVER converted to `0`, `False`, or `NOT_ELIGIBLE`.
- **NO AI Knowledge Substitution**: The AI LLM cannot substitute its general training memory for official dataset values.
- **NO Scheme Hardcoding in Geography Tables**: District records provide *geographic context only*; final scheme eligibility is evaluated by the dedicated Scheme Rule Engine.

---

## 4. End-to-End Architecture Flow

```text
┌────────────────────────────────────────────────────────────┐
│ 1. SOURCE DOCUMENT                                         │
│    Gram-Disha_India_District_Urbanity_Reference_With_UTs   │
└─────────────────────────────┬──────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│ 2. STRUCTURED EXTRACTION & NORMALIZATION                  │
│    Enums: TerritoryType, UrbanityClassification, RBITier   │
└─────────────────────────────┬──────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│ 3. VALIDATION & PROVENANCE LAYER                           │
│    LGD uniqueness, duplicate check, data quality report    │
└─────────────────────────────┬──────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│ 4. PERSISTENCE & VERSIONING                                │
│    MySQL 8.0: geographic_states, geographic_districts      │
└─────────────────────────────┬──────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│ 5. FASTAPI REFERENCE SERVICES                              │
│    /api/v1/geography/* endpoints                           │
└─────────────────────────────┬──────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│ 6. ENGINE BOUNDARIES & DISHA AI GROUNDING                  │
│    • GeographyEngine: Hierarchy resolution                 │
│    • UrbanityEngine: Rural / Peri-Urban metrics            │
│    • PMEGPEngineInterface: Geographic subsidy context      │
│    • ODOPEngineInterface: Cluster commodity alignment     │
│    • FeasibilityEngine: HBFS infrastructure inputs         │
│    • Disha AI: Grounded explanations with UNKNOWN audit    │
└────────────────────────────────────────────────────────────┘
```

---

## 5. Normalized MySQL 8.0 Schema Reference

```sql
-- State / UT Master
CREATE TABLE geographic_states (
    state_lgd_code VARCHAR(32) PRIMARY KEY,
    state_name VARCHAR(128) UNIQUE NOT NULL,
    territory_type VARCHAR(32) NOT NULL, -- STATE, UNION_TERRITORY
    total_districts INT DEFAULT 0,
    data_vintage VARCHAR(32) DEFAULT '2025-2026',
    verification_status VARCHAR(32) DEFAULT 'VERIFIED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- District Urbanity Master
CREATE TABLE geographic_districts (
    district_lgd_code VARCHAR(32) PRIMARY KEY,
    state_lgd_code VARCHAR(32) NOT NULL,
    state_name VARCHAR(128) NOT NULL,
    district_name VARCHAR(128) NOT NULL,
    territory_type VARCHAR(32) NOT NULL,
    urbanity_classification VARCHAR(64) NOT NULL,
    census_rural_percentage FLOAT NULL,
    rbi_tier_classification VARCHAR(32) DEFAULT 'UNKNOWN',
    gram_disha_primary_scope BOOLEAN DEFAULT TRUE,
    source_id VARCHAR(64) DEFAULT 'SRC_LGD_01',
    source_url VARCHAR(512) DEFAULT 'https://lgdirectory.gov.in/',
    source_authority VARCHAR(255) DEFAULT 'Ministry of Panchayati Raj / MoMSME / MoFPI / RBI',
    data_vintage VARCHAR(32) DEFAULT '2025-2026',
    verification_status VARCHAR(32) DEFAULT 'PROVISIONAL',
    confidence FLOAT DEFAULT 0.95,
    FOREIGN KEY (state_lgd_code) REFERENCES geographic_states(state_lgd_code) ON DELETE CASCADE,
    INDEX idx_dist_state_lookup (state_lgd_code, district_name)
);
```

---

## 6. FastAPI Reference Endpoints

| Endpoint | Method | Response Model | Description |
| :--- | :--- | :--- | :--- |
| `/api/v1/geography/states` | `GET` | `List[StateReference]` | List all 28 States & 8 Union Territories |
| `/api/v1/geography/states/{code}/districts` | `GET` | `List[DistrictRecord]` | List districts for a state |
| `/api/v1/geography/districts/{code}` | `GET` | `DistrictRecord` | Lookup district by LGD code or name |
| `/api/v1/geography/districts/{code}/context` | `GET` | `DistrictDetailContext` | Aggregated policy, ODOP & PMEGP context |
| `/api/v1/geography/districts/{code}/urbanity` | `GET` | `JSON` | Urbanity classification & rural % |
| `/api/v1/geography/districts/{code}/pmegp-context` | `GET` | `PMEGPGeographicContext` | Indicative geographic subsidy tier |
| `/api/v1/geography/districts/{code}/odop` | `GET` | `ODOPContext` | Notified ODOP commodity |
| `/api/v1/geography/datasets/district-reference` | `GET` | `DatasetRegistryEntry` | Dataset version & authority registry |
| `/api/v1/geography/quality-report` | `GET` | `DataQualityReport` | Real-time data quality audit |
| `/api/v1/geography/ingest/run` | `POST` | `JSON` | Execute ingestion pipeline & audit trail |

---

## 7. Engine Dependency Matrix & Access Rules

| Engine | Allowed Input Fields | Explicitly Forbidden Access |
| :--- | :--- | :--- |
| **Geography Engine** | `state_lgd_code`, `district_lgd_code`, `territory_type` | Cannot modify scheme rules or subsidy values. |
| **Urbanity Engine** | `urbanity_classification`, `census_rural_percentage` | Cannot alter LGD hierarchy codes. |
| **PMEGP Engine Interface** | `is_rural`, `indicative_subsidy_percentages` | Cannot bypass user eligibility evaluation in Scheme Rule Engine. |
| **ODOP Engine Interface** | `notified_odop_commodity`, `odop_category` | Cannot automatically disburse subsidy without PMFME criteria match. |
| **Feasibility Engine** | `urbanity`, `agro_climatic_zone`, `power_tariff_zone` | Cannot estimate infrastructure where value is `UNKNOWN`. |
| **Disha AI Engine** | All validated district context fields | **Forbidden from hallucinating missing infrastructure or converting UNKNOWN to active resources.** |

---

## 8. Verification & Quality Report Summary

- **Total States Verified**: 28
- **Total Union Territories Verified**: 8
- **Duplicate District LGD Codes**: 0
- **Provenance Coverage**: 100%
- **Data Integrity Score**: 100.0%
- **Automated Tests**: 16 unit & integration tests passing (`test_geography_foundation.py`).
