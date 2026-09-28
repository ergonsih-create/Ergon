# GRAM-DISHA — API Specification

**Base Path:** `/api/v1`

---

## 1. Health Check
- **Endpoint:** `GET /health`
- **Response:**
```json
{
  "status": "healthy",
  "service": "GRAM-DISHA Backend Engine",
  "version": "1.0.0",
  "environment": "production",
  "mode": "deterministic_evidence_first"
}
```

---

## 2. Financial Structuring
- **Endpoint:** `POST /api/v1/finance/calculate`
- **Request Body:**
```json
{
  "project_cost": 800000.0,
  "promoter_capital": 150000.0,
  "interest_rate_annual": 10.5,
  "tenure_months": 60,
  "moratorium_months": 6,
  "unit_sale_price": 120.0,
  "unit_variable_cost": 75.0,
  "monthly_fixed_cost": 22000.0
}
```

---

## 3. HBFS Feasibility Scoring
- **Endpoint:** `POST /api/v1/feasibility/score`
- **Request Body:**
```json
{
  "demand_index": 0.82,
  "accessibility_index": 0.75,
  "infrastructure_index": 0.80,
  "socioeconomic_index": 0.70,
  "scheme_suitability_index": 0.85,
  "climate_vulnerability_index": 0.20,
  "capital_deficit_ratio": 0.15,
  "uncertainty_ratio": 0.25
}
```

---

## 4. Government Scheme Rule Matcher
- **Endpoint:** `POST /api/v1/schemes/match`
- **Request Body:**
```json
{
  "category": "OBC",
  "gender": "MALE",
  "is_rural": true,
  "project_cost": 800000.0,
  "activity_type": "AGRO_PROCESSING"
}
```

---

## 5. Provenance Sources Registry
- **Endpoint:** `GET /api/v1/provenance/sources`
