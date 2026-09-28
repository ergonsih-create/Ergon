"""
GRAM-DISHA — End-to-End API Test Suite
Validates authentication, business entity isolation, financial calculations,
scheme matching, DPR compiler, and Disha AI chat endpoints.
"""

import pytest
import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_checks():
    res1 = client.get("/health")
    assert res1.status_code == 200
    assert res1.json()["status"] == "healthy"

    res2 = client.get("/api/health")
    assert res2.status_code == 200
    assert res2.json()["status"] == "healthy"


def test_auth_registration_and_login_flow():
    test_email = f"citizen_{uuid.uuid4().hex[:8]}@gramdisha.in"
    reg_payload = {
        "email": test_email,
        "password": "Password@123",
        "fullName": "Kisanrao Deshmukh",
        "phone": "+91 94231 11222",
        "category": "OBC",
        "gender": "male",
        "state": "Maharashtra",
        "district": "Yavatmal"
    }

    # 1. Register
    reg_res = client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_res.status_code == 201
    data = reg_res.json()
    assert "accessToken" in data
    token = data["accessToken"]

    # 2. Get Me with Bearer Token
    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["email"] == test_email
    assert me_data["fullName"] == "Kisanrao Deshmukh"

    # 3. Login
    login_res = client.post("/api/v1/auth/login", json={
        "email": test_email,
        "password": "Password@123"
    })
    assert login_res.status_code == 200
    assert "accessToken" in login_res.json()


def test_business_crud():
    # Login as seeded demo user
    login_res = client.post("/api/v1/auth/login", json={
        "email": "ramesh.patil@gramdisha.in",
        "password": "Demo@123"
    })
    assert login_res.status_code == 200
    token = login_res.json()["accessToken"]
    auth_headers = {"Authorization": f"Bearer {token}"}

    # 1. List user businesses
    list_res = client.get("/api/v1/businesses", headers=auth_headers)
    assert list_res.status_code == 200
    assert isinstance(list_res.json(), list)

    # 2. Create new business
    biz_name = f"Agro Chana Mill {uuid.uuid4().hex[:6]}"
    create_res = client.post("/api/v1/businesses", headers=auth_headers, json={
        "name": biz_name,
        "category": "AGRO_PROCESSING",
        "industryType": "Manufacturing",
        "projectCost": 1200000.0,
        "promoterCapital": 200000.0,
        "state": "Maharashtra",
        "district": "Yavatmal"
    })
    assert create_res.status_code == 201
    new_biz = create_res.json()
    biz_id = new_biz["id"]
    assert new_biz["name"] == biz_name

    # 3. Get single business
    get_res = client.get(f"/api/v1/businesses/{biz_id}", headers=auth_headers)
    assert get_res.status_code == 200
    assert get_res.json()["id"] == biz_id

    # 4. Update business
    update_res = client.put(f"/api/v1/businesses/{biz_id}", headers=auth_headers, json={
        "projectCost": 1350000.0,
        "stage": "Ready for Bank Appraisal"
    })
    assert update_res.status_code == 200
    assert update_res.json()["projectCost"] == 1350000.0


def test_finance_calculation_api():
    res = client.post("/api/v1/finance/calculate", json={
        "projectCost": 1000000.0,
        "promoterCapital": 150000.0,
        "interestRateAnnual": 9.5,
        "tenureMonths": 60
    })
    assert res.status_code == 200
    data = res.json()
    assert data["totalProjectCost"] == 1000000.0
    assert data["promoterContribution"] == 150000.0
    assert data["requiredTermLoan"] > 0
    assert len(data["cashFlowMonthly"]) == 12


def test_schemes_match_api():
    res = client.post("/api/v1/schemes/match", json={
        "category": "OBC",
        "gender": "FEMALE",
        "isRural": True,
        "projectCost": 900000.0,
        "activityType": "AGRO_PROCESSING"
    })
    assert res.status_code == 200
    matches = res.json()
    assert len(matches) > 0
    pmegp = next((s for s in matches if s["schemeCode"] == "PMEGP"), None)
    assert pmegp is not None
    assert pmegp["subsidyPercentage"] == 35.0


def test_feasibility_scoring_api():
    res = client.post("/api/v1/feasibility/score", json={
        "demandIndex": 0.82,
        "accessibilityIndex": 0.74,
        "infrastructureIndex": 0.68,
        "socioeconomicIndex": 0.62,
        "schemeSuitabilityIndex": 0.88
    })
    assert res.status_code == 200
    data = res.json()
    assert 0.0 <= data["totalScore"] <= 1.0
    assert "swotAnalysis" in data


def test_documents_generate_dpr_api():
    res = client.post("/api/v1/documents/generate-dpr", json={
        "enterpriseName": "Sai Krupa Dal Mill",
        "promoterName": "Ramesh Patil",
        "promoterCategory": "OBC",
        "promoterGender": "MALE",
        "isRural": True,
        "state": "Maharashtra",
        "district": "Yavatmal",
        "block": "Pusad",
        "village": "Shendurjana Khurd",
        "totalProjectCost": 850000.0,
        "promoterCapital": 150000.0
    })
    assert res.status_code == 200
    dpr = res.json()
    assert "dprDossierId" in dpr
    assert len(dpr["fiveYearFinancialProjections"]) == 5
    assert "keyBankRatios" in dpr


def test_disha_chat_advisory_api():
    res = client.post("/api/v1/disha/chat", json={
        "message": "What is the PMEGP subsidy percentage for a rural unit in Yavatmal?",
        "businessId": "biz_default"
    })
    assert res.status_code == 200
    chat = res.json()
    assert "content" in chat
    assert len(chat["content"]) > 20
    assert chat["role"] == "assistant"
