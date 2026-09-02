"""
Integration Test Suite for FastAPI Endpoints
Tests health check, financial calculations, feasibility scoring, schemes matching, and provenance.
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["mode"] == "deterministic_evidence_first"


def test_financial_calculation_endpoint():
    payload = {
        "project_cost": 800000.0,
        "promoter_capital": 150000.0,
        "interest_rate_annual": 10.5,
        "tenure_months": 60,
        "moratorium_months": 6,
        "unit_sale_price": 120.0,
        "unit_variable_cost": 75.0,
        "monthly_fixed_cost": 22000.0,
    }
    response = client.post("/api/v1/finance/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_project_cost"] == 800000.0
    assert data["promoter_contribution_percentage"] == 18.8
    assert data["monthly_emi"] > 0
    assert data["projected_dscr"] > 0
    assert len(data["cash_flow_monthly"]) == 12


def test_feasibility_scoring_endpoint():
    payload = {
        "demand_index": 0.82,
        "accessibility_index": 0.75,
        "infrastructure_index": 0.80,
        "socioeconomic_index": 0.70,
        "scheme_suitability_index": 0.85,
        "climate_vulnerability_index": 0.20,
        "capital_deficit_ratio": 0.15,
        "uncertainty_ratio": 0.25,
    }
    response = client.post("/api/v1/feasibility/score", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert 0.0 <= data["total_score"] <= 1.0
    assert data["ranking_tier"] in ["HIGH_FEASIBILITY", "MODERATE_FEASIBILITY", "LOW_FEASIBILITY", "EVIDENCE_INSUFFICIENT"]


def test_schemes_matching_endpoint():
    payload = {
        "category": "OBC",
        "gender": "MALE",
        "is_rural": True,
        "project_cost": 800000.0,
        "activity_type": "AGRO_PROCESSING",
    }
    response = client.post("/api/v1/schemes/match", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["scheme_code"] == "PMEGP"
    assert data[0]["eligibility_state"] == "POTENTIALLY_ELIGIBLE"


def test_provenance_sources_endpoint():
    response = client.get("/api/v1/provenance/sources")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 3
    source_ids = [s["source_id"] for s in data]
    assert "SRC_LGD_01" in source_ids
    assert "SRC_AGMARKNET_01" in source_ids
