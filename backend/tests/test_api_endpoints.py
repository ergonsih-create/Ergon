"""
Integration Test Suite for FastAPI Endpoints
Tests health check, financial calculations, feasibility, schemes, geography,
market insights, bankable DPR generation, applications, inventory, action plan,
progress KPIs, learning resources, support tickets, admin datasets, and profile.
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


def test_geography_endpoints():
    response = client.get("/api/v1/geography/states")
    assert response.status_code == 200
    states = response.json()
    assert len(states) >= 28


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
    total_cost = data.get("total_project_cost") or data.get("totalProjectCost")
    assert total_cost == 800000.0
    promoter_pct = data.get("promoter_contribution_percentage") or data.get("promoterContributionPercentage")
    assert promoter_pct == 18.8
    monthly_emi = data.get("monthly_emi") or data.get("monthlyEMI") or data.get("monthlyEmi")
    assert monthly_emi > 0
    dscr = data.get("projected_dscr") or data.get("projectedDSCR") or data.get("projectedDscr")
    assert dscr > 0
    cash_flow = data.get("cash_flow_monthly") or data.get("cashFlowMonthly")
    assert len(cash_flow) == 12


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
    score = data.get("total_score") if "total_score" in data else data.get("totalScore")
    assert 0.0 <= score <= 1.0
    tier = data.get("ranking_tier") if "ranking_tier" in data else data.get("rankingTier")
    assert tier in ["HIGH_FEASIBILITY", "MODERATE_FEASIBILITY", "LOW_FEASIBILITY", "EVIDENCE_INSUFFICIENT"]


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
    code = data[0].get("scheme_code") or data[0].get("schemeCode")
    assert code == "PMEGP"
    elig = data[0].get("eligibility_state") or data[0].get("eligibilityState")
    assert elig in ["POTENTIALLY_ELIGIBLE", "HIGHLY_ELIGIBLE", "ELIGIBLE"]


def test_market_insights_endpoint():
    response = client.get("/api/v1/market/insights?district=Yavatmal&category=AGRO_PROCESSING")
    assert response.status_code == 200
    data = response.json()
    assert data["district"] == "Yavatmal"
    prices = data.get("mandi_prices") or data.get("mandiPrices") or data.get("commodities") or []
    assert len(prices) >= 1


def test_documents_dpr_generator_endpoint():
    payload = {
        "enterprise_name": "Jai Kisan Pulse Mill",
        "category": "AGRO_PROCESSING",
        "promoter_name": "Ramesh Patil",
        "promoter_category": "OBC",
        "promoter_gender": "MALE",
        "is_rural": True,
        "state": "Maharashtra",
        "district": "Yavatmal",
        "block": "Pusad",
        "village": "Shendurjana Khurd",
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
    }
    response = client.post("/api/v1/documents/generate-dpr", json=payload)
    assert response.status_code == 200
    dpr = response.json()
    assert "dpr_dossier_id" in dpr or "dprDossierId" in dpr
    projections = dpr.get("five_year_financial_projections") or dpr.get("fiveYearFinancialProjections")
    assert len(projections) == 5
    ratios = dpr.get("key_bank_ratios") or dpr.get("keyBankRatios")
    avg_dscr = ratios.get("average_dscr") or ratios.get("averageDscr")
    assert avg_dscr >= 1.0


def test_applications_flow():
    response = client.get("/api/v1/applications/my-applications")
    assert response.status_code == 200
    apps = response.json()
    assert len(apps) >= 1


def test_inventory_and_sales_flow():
    # 1. Fetch items
    res1 = client.get("/api/v1/inventory/items?business_id=biz_test")
    assert res1.status_code == 200
    items = res1.json()
    assert len(items) >= 1

    # 2. Record sale
    item_name = items[0].get("item_name") or items[0].get("itemName")
    sale_payload = {
        "business_id": "biz_test",
        "product_name": item_name,
        "customer_name": "Test Kirana",
        "customer_type": "RETAIL_KIRANA",
        "units_sold": 5.0,
        "unit_sale_price": 100.0,
        "payment_mode": "UPI"
    }
    res2 = client.post("/api/v1/inventory/sales", json=sale_payload)
    assert res2.status_code == 200
    sale = res2.json()
    total_amt = sale.get("total_amount") if "total_amount" in sale else sale.get("totalAmount")
    assert total_amt == 500.0

    # 3. Stats
    res3 = client.get("/api/v1/inventory/stats?business_id=biz_test")
    assert res3.status_code == 200
    stats = res3.json()
    total_sales = stats.get("total_sales_count") if "total_sales_count" in stats else stats.get("totalSalesCount")
    assert total_sales >= 1


def test_action_plan_flow():
    res = client.get("/api/v1/action-plan/milestones?business_id=biz_test")
    assert res.status_code == 200
    milestones = res.json()
    assert len(milestones) >= 5

    first_id = milestones[0]["id"]
    res_toggle = client.patch(f"/api/v1/action-plan/milestones/{first_id}/toggle")
    assert res_toggle.status_code == 200


def test_progress_kpis():
    res = client.get("/api/v1/progress/kpis?business_id=biz_test&district=Yavatmal")
    assert res.status_code == 200
    data = res.json()
    assert len(data["kpis"]) == 4


def test_learning_resources():
    res = client.get("/api/v1/learning/resources")
    assert res.status_code == 200
    resources = res.json()
    assert len(resources) >= 4


def test_support_tickets_flow():
    res = client.get("/api/v1/support/tickets")
    assert res.status_code == 200
    tickets = res.json()
    assert len(tickets) >= 1

    new_tkt = {
        "user_id": "user_test",
        "subject": "Inquiry regarding PMEGP Task Force Schedule",
        "category": "SCHEME_ELIGIBILITY",
        "priority": "NORMAL",
        "description": "Please confirm the date of the next District Task Force Committee meeting at DIC Yavatmal."
    }
    res_post = client.post("/api/v1/support/tickets", json=new_tkt)
    assert res_post.status_code == 200


def test_admin_datasets_registry():
    res = client.get("/api/v1/admin/datasets")
    assert res.status_code == 200
    datasets = res.json()
    assert len(datasets) >= 8


def test_notifications_flow():
    res = client.get("/api/v1/notifications")
    assert res.status_code == 200
    notifs = res.json()
    assert len(notifs) >= 1


def test_profile_flow():
    res = client.get("/api/v1/profile")
    assert res.status_code == 200
    profile = res.json()
    assert "email" in profile
    assert "demographics" in profile
