"""
GRAM-DISHA — End-to-End Live Integration Verification Script
Validates all newly aligned endpoints, route aliases, and schemas.
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_full_integration():
    print("Testing End-to-End Integration...")

    # 1. Health
    res = client.get("/health")
    assert res.status_code == 200, f"Health failed: {res.text}"
    print("  [OK] Health Check Passed")

    # 2. Auth Login (Seeded Demo Beneficiary)
    res = client.post("/api/v1/auth/login", json={
        "email": "ramesh.patil@gramdisha.in",
        "password": "Demo@123"
    })
    assert res.status_code == 200, f"Auth login failed: {res.text}"
    token_data = res.json()
    token = token_data.get("accessToken") or token_data.get("access_token")
    assert token, "No access token in response"
    headers = {"Authorization": f"Bearer {token}"}
    print("  [OK] Auth Login & JWT Generation Passed")

    # 3. Auth Google OAuth
    res = client.post("/api/v1/auth/google", json={
        "email": "ramesh.patil@gramdisha.in",
        "name": "Ramesh Patil",
        "credential": "test_google_cred"
    })
    assert res.status_code == 200, f"Auth Google failed: {res.text}"
    print("  [OK] Auth Google OAuth Passed")

    # 4. Finance Calculate
    res = client.post("/api/v1/finance/calculate", json={
        "project_cost": 850000.0,
        "promoter_capital": 150000.0,
        "interest_rate_annual": 9.5,
        "tenure_months": 60,
        "moratorium_months": 6
    })
    assert res.status_code == 200, f"Finance calculate failed: {res.text}"
    fin_data = res.json()
    assert (fin_data.get("monthlyEmi") or fin_data.get("monthly_emi")) > 0
    print("  [OK] Finance Calculation Passed")

    # 5. Feasibility Assess (Alias)
    res = client.post("/api/v1/feasibility/assess", json={
        "demand_index": 0.85,
        "accessibility_index": 0.78,
        "infrastructure_index": 0.80,
        "socioeconomic_index": 0.72,
        "scheme_suitability_index": 0.88,
        "climate_vulnerability_index": 0.15,
        "capital_deficit_ratio": 0.12,
        "uncertainty_ratio": 0.20
    })
    assert res.status_code == 200, f"Feasibility assess alias failed: {res.text}"
    print("  [OK] Feasibility /assess Route Alias Passed")

    # 6. Applications Collection GET (Alias)
    res = client.get("/api/v1/applications", headers=headers)
    assert res.status_code == 200, f"Applications GET alias failed: {res.text}"
    apps = res.json()
    assert len(apps) >= 1
    print("  [OK] Applications GET Route Alias Passed")

    # 7. Applications Collection POST (Alias)
    res = client.post("/api/v1/applications", json={
        "business_id": "biz_default",
        "scheme_id": "scheme_pmegp_01",
        "requested_amount": 750000.0
    }, headers=headers)
    assert res.status_code in (200, 201), f"Applications POST alias failed: {res.text}"
    created_app = res.json()
    app_id = created_app["id"]
    print("  [OK] Applications POST Route Alias Passed")

    # 8. Applications PUT (Alias)
    res = client.put(f"/api/v1/applications/{app_id}", json={
        "current_stage": "Task Force Committee Approved",
        "status": "SANCTIONED"
    }, headers=headers)
    assert res.status_code == 200, f"Applications PUT alias failed: {res.text}"
    print("  [OK] Applications PUT Route Alias Passed")

    # 9. Documents DPR Generate (Alias)
    res = client.post("/api/v1/documents/dpr/generate", json={
        "enterprise_name": "Patil Agro Milling",
        "category": "AGRO_PROCESSING",
        "promoter_name": "Ramesh Patil",
        "promoter_category": "OBC",
        "promoter_gender": "MALE",
        "is_rural": True,
        "total_project_cost": 850000.0,
        "promoter_capital": 150000.0,
        "machinery_cost": 480000.0,
        "shed_cost": 180000.0,
        "working_capital_cost": 140000.0,
        "statutory_pre_op_cost": 50000.0,
        "interest_rate": 10.5,
        "tenure_months": 60,
        "moratorium_months": 6,
        "monthly_sales_target": 180000.0,
        "monthly_raw_material_cost": 105000.0,
        "monthly_fixed_overhead": 24000.0
    })
    assert res.status_code == 200, f"DPR generate alias failed: {res.text}"
    print("  [OK] Documents /dpr/generate Route Alias Passed")

    # 10. Operations Sales (with ratePerUnit & totalRevenue)
    res = client.post("/api/v1/inventory/sales", json={
        "business_id": "biz_default",
        "product_name": "Organic Dal 1kg",
        "customer_name": "Kisan Retail Store",
        "units_sold": 10.0,
        "rate_per_unit": 95.0,
        "total_revenue": 950.0
    })
    assert res.status_code == 200, f"Inventory sale recording failed: {res.text}"
    print("  [OK] Inventory Sales Record (rate_per_unit alias) Passed")

    # 11. Support Ticket
    res = client.post("/api/v1/support/tickets", json={
        "user_id": "user_default",
        "subject": "Inquiry regarding Task Force Verification",
        "category": "SCHEME_ELIGIBILITY",
        "description": "Please confirm the DIC schedule."
    }, headers=headers)
    assert res.status_code == 200, f"Support ticket creation failed: {res.text}"
    print("  [OK] Support Ticket Creation Passed")

    # 12. Disha Grounded Chat
    res = client.post("/api/v1/disha/chat", json={
        "message": "What is the PMEGP subsidy rate for rural OBC?",
        "business_id": "biz_default",
        "language": "en"
    }, headers=headers)
    assert res.status_code == 200, f"Disha chat failed: {res.text}"
    chat_reply = res.json()
    assert chat_reply.get("content"), "Empty chat reply"
    print("  [OK] Disha Grounded AI Chat Passed")

    print("\nALL 12 INTEGRATION TESTS SUCCESSFULLY PASSED!")

if __name__ == "__main__":
    test_full_integration()
