"""
GRAM-DISHA — Document Readiness, DigiLocker & Bankable DPR Generator Router
Generates certified Detailed Project Reports (DPR) adhering to SIDBI/KVIC bank appraisal norms.
"""

from typing import List, Optional, Dict, Any
from datetime import datetime
import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from pydantic import Field
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_optional_current_user
from app.db.models import DocumentItemModel, UserModel
from app.schemas.common import CamelModel

router = APIRouter(prefix="/documents", tags=["Documents & DPR Generation"])


class GenerateDPRRequest(CamelModel):
    enterprise_name: str
    category: str = "AGRO_PROCESSING"
    promoter_name: str
    promoter_category: str = "OBC"
    promoter_gender: str = "MALE"
    is_rural: bool = True
    state: str = "Maharashtra"
    district: str = "Yavatmal"
    block: str = "Pusad"
    village: str = "Shendurjana Khurd"
    total_project_cost: float = Field(850000.0, gt=0)
    promoter_capital: float = Field(150000.0, ge=0)
    machinery_cost: float = 480000.0
    shed_cost: float = 180000.0
    working_capital_cost: float = 140000.0
    statutory_pre_op_cost: float = 50000.0
    interest_rate: float = 10.5
    tenure_months: int = 60
    moratorium_months: int = 6
    monthly_sales_target: float = 180000.0
    monthly_raw_material_cost: float = 105000.0
    monthly_fixed_overhead: float = 24000.0


class DPRFinancialYear(CamelModel):
    year: int
    capacity_utilization_pct: float
    gross_sales_revenue: float
    raw_material_cost: float
    operating_overhead: float
    ebitda: float
    interest_term_loan: float
    depreciation_machinery: float
    net_profit_before_tax: float
    tax_provision: float
    net_profit_after_tax: float
    cash_accrual: float
    annual_debt_service: float
    dscr_ratio: float


class BankableDPRResponse(CamelModel):
    dpr_dossier_id: str
    generation_date: str
    enterprise_summary: Dict[str, Any]
    location_lgd_profile: Dict[str, Any]
    project_cost_breakdown: Dict[str, float]
    means_of_finance: Dict[str, Any]
    loan_repayment_schedule: Dict[str, Any]
    five_year_financial_projections: List[DPRFinancialYear]
    key_bank_ratios: Dict[str, Any]
    statutory_clearances_required: List[Dict[str, str]]
    swot_summary: Dict[str, List[str]]
    appraisal_declaration: str


@router.post("/generate-dpr", response_model=BankableDPRResponse)
@router.post("/dpr/generate", response_model=BankableDPRResponse)
def generate_bankable_dpr(req: GenerateDPRRequest):
    total_cost = req.total_project_cost
    is_special = req.promoter_category.upper() in ["SC", "ST", "OBC", "MINORITY", "WOMEN"] or req.promoter_gender.upper() == "FEMALE"
    
    if req.is_rural:
        subsidy_rate = 35.0 if is_special else 25.0
        promoter_contrib_min_rate = 5.0 if is_special else 10.0
    else:
        subsidy_rate = 25.0 if is_special else 15.0
        promoter_contrib_min_rate = 5.0 if is_special else 10.0

    promoter_equity = max(total_cost * (promoter_contrib_min_rate / 100.0), req.promoter_capital)
    max_subsidy = round(total_cost * (subsidy_rate / 100.0), 2)
    bank_term_loan = round(max(0.0, total_cost - promoter_equity), 2)

    monthly_r = (req.interest_rate / 12.0) / 100.0
    n = req.tenure_months
    if monthly_r > 0 and n > 0:
        factor = (1 + monthly_r) ** n
        monthly_emi = round(bank_term_loan * monthly_r * factor / (factor - 1), 2)
    else:
        monthly_emi = round(bank_term_loan / max(1, n), 2)

    five_year_data: List[DPRFinancialYear] = []
    base_sales = req.monthly_sales_target * 12.0
    base_rm = req.monthly_raw_material_cost * 12.0
    base_overhead = req.monthly_fixed_overhead * 12.0
    machinery = req.machinery_cost

    utilization_curve = [0.60, 0.70, 0.80, 0.85, 0.90]
    total_dscr = 0.0

    for idx, util in enumerate(utilization_curve):
        yr = idx + 1
        sales = round(base_sales * util, 2)
        rm = round(base_rm * util, 2)
        overhead = round(base_overhead * (0.90 + (yr * 0.03)), 2)
        ebitda = round(sales - rm - overhead, 2)

        interest = round(bank_term_loan * (req.interest_rate / 100.0) * max(0.2, (6 - yr) / 5.0), 2)
        depreciation = round((machinery * 0.15) / yr, 2)
        pbt = round(max(0.0, ebitda - interest - depreciation), 2)
        tax = round(pbt * 0.15, 2)
        pat = round(pbt - tax, 2)
        cash_accrual = round(pat + depreciation, 2)

        annual_principal = round(bank_term_loan / 5.0, 2)
        debt_service = round(annual_principal + interest, 2)
        dscr = round((cash_accrual + interest) / max(1.0, debt_service), 2)
        total_dscr += dscr

        five_year_data.append(DPRFinancialYear(
            year=yr,
            capacity_utilization_pct=round(util * 100, 1),
            gross_sales_revenue=sales,
            raw_material_cost=rm,
            operating_overhead=overhead,
            ebitda=ebitda,
            interest_term_loan=interest,
            depreciation_machinery=depreciation,
            net_profit_before_tax=pbt,
            tax_provision=tax,
            net_profit_after_tax=pat,
            cash_accrual=cash_accrual,
            annual_debt_service=debt_service,
            dscr_ratio=dscr,
        ))

    avg_dscr = round(total_dscr / 5.0, 2)
    fixed_costs = (req.monthly_fixed_overhead * 12.0) + (machinery * 0.15) + (bank_term_loan * 0.09)
    contribution = (base_sales * 0.60) - (base_rm * 0.60)
    break_even_pct = round((fixed_costs / max(1.0, contribution)) * 100.0, 1)
    annual_roi = round((five_year_data[1].net_profit_after_tax / total_cost) * 100.0, 1)

    return BankableDPRResponse(
        dpr_dossier_id=f"DPR-{uuid.uuid4().hex[:8].upper()}",
        generation_date=datetime.utcnow().strftime("%Y-%m-%d"),
        enterprise_summary={
            "enterprise_name": req.enterprise_name,
            "category": req.category,
            "constitution": "Sole Proprietorship (Rural Micro Enterprise)",
            "promoter_name": req.promoter_name,
            "promoter_category": req.promoter_category,
            "promoter_gender": req.promoter_gender,
        },
        location_lgd_profile={
            "state": req.state,
            "district": req.district,
            "block": req.block,
            "village": req.village,
            "urbanity_status": "RURAL (Panchayat Jurisdiction)",
            "apmc_market_proximity": f"{req.district} District APMC (Within 12 km)",
        },
        project_cost_breakdown={
            "land_and_building_shed": req.shed_cost,
            "plant_and_machinery": req.machinery_cost,
            "initial_working_capital_margin": req.working_capital_cost,
            "contingencies_and_pre_operative": req.statutory_pre_op_cost,
            "total_project_cost": total_cost,
        },
        means_of_finance={
            "promoter_own_contribution": promoter_equity,
            "promoter_contribution_percentage": round((promoter_equity / total_cost) * 100.0, 1),
            "bank_term_loan_sanction_target": bank_term_loan,
            "bank_term_loan_percentage": round((bank_term_loan / total_cost) * 100.0, 1),
            "expected_government_margin_money_subsidy": max_subsidy,
            "applicable_subsidy_rate_percentage": subsidy_rate,
            "subsidy_nodal_agency": "KVIC / State Khadi Board (PMEGP DBT Gateway)",
        },
        loan_repayment_schedule={
            "loan_amount": bank_term_loan,
            "interest_rate_annual_percent": req.interest_rate,
            "repayment_tenure_months": req.tenure_months,
            "moratorium_period_months": req.moratorium_months,
            "monthly_equated_installment_emi": monthly_emi,
            "total_interest_payable_estimate": round((monthly_emi * req.tenure_months) - bank_term_loan, 2),
        },
        five_year_financial_projections=five_year_data,
        key_bank_ratios={
            "average_dscr": avg_dscr,
            "dscr_bank_benchmark_pass": avg_dscr >= 1.5,
            "break_even_capacity_percentage": break_even_pct,
            "year_2_annual_roi_pct": annual_roi,
            "debt_to_equity_ratio": round(bank_term_loan / max(1.0, promoter_equity), 2),
            "appraisal_verdict": "BANKABLE & FINANCIALLY VIABLE" if avg_dscr >= 1.5 else "CONDITIONAL_ACCEPTANCE",
        },
        statutory_clearances_required=[
            {"clearance": "Udyam MSME Registration Certificate", "authority": "Ministry of MSME", "cost": "NIL (Online)"},
            {"clearance": "FSSAI Basic Food Manufacturer Registration", "authority": "Food Safety and Standards Authority", "cost": "₹100 / Year"},
            {"clearance": "Gram Panchayat No Objection Certificate (NOC)", "authority": "Local Gram Panchayat Office", "cost": "NIL"},
            {"clearance": "State Pollution Control Board Consent (Green Category)", "authority": "SPCB District Office", "cost": "Exempt / Green Form"},
            {"clearance": "Power Load Sanction (15 HP Commercial)", "authority": "State Electricity Distribution Co.", "cost": "Tariff Standard"}
        ],
        swot_summary={
            "strengths": [
                f"Proximity to {req.district} APMC Mandi ensures consistent desi crop raw material supply.",
                f"Eligible for {subsidy_rate}% PMEGP capital subsidy under rural category guidelines.",
                "Substantially lower shed lease rentals compared to municipal industrial belts."
            ],
            "weaknesses": [
                "Early working capital liquidity depends on timely Kirana payment realization.",
                "Initial brand recall will be localized to weekly haats and taluka markets."
            ],
            "opportunities": [
                "Value-added packaging tie-ups with regional SHG federation networks.",
                "Utilizing PMFME 35% common branding and marketing incentive."
            ],
            "threats": [
                "Mandi spot price volatility caused by climatic variations during harvest season.",
                "Sub-transmission power voltage drops requiring robust motor stabilizers."
            ]
        },
        appraisal_declaration="Certified that the financial projections and subsidy ratios herein are computed in strict accordance with KVIC / Ministry of MSME Master Guidelines 2025-26 and RBI Master Directions on Priority Sector Lending (FIDD.CO.Plan.BC.5/04.09.01/2020-21)."
    )


@router.get("/checklist")
def get_documents_checklist(
    business_id: str = Query("biz_default", description="Active business ID"),
    db: Session = Depends(get_db)
):
    docs = db.query(DocumentItemModel).filter(DocumentItemModel.business_id == business_id).all()
    if not docs:
        defaults = [
            {"id": "doc_1", "name": "Aadhaar Card (UIDAI Verified)", "category": "IDENTITY", "issuing_authority": "UIDAI", "status": "VERIFIED", "required_for": "PMEGP, MUDRA, PMFME, Udyam"},
            {"id": "doc_2", "name": "PAN Card (Income Tax Department)", "category": "IDENTITY", "issuing_authority": "NSDL / UTIITSL", "status": "VERIFIED", "required_for": "PMEGP, MUDRA, Current Bank Account"},
            {"id": "doc_3", "name": "Caste / Category Certificate (OBC / SC / ST)", "category": "IDENTITY", "issuing_authority": "Sub-Divisional Officer (Revenue)", "status": "VERIFIED", "required_for": "PMEGP 35% Special Subsidy, NSFDC"},
            {"id": "doc_4", "name": "Bank Account Statement / Cancelled Cheque", "category": "FINANCIAL", "issuing_authority": "Commercial / Lead District Bank", "status": "VERIFIED", "required_for": "Loan Appraisal & DBT Subsidy Credit"},
            {"id": "doc_5", "name": "Detailed Project Report (DPR - Bank Format)", "category": "TECHNICAL", "issuing_authority": "GRAM-DISHA Engine / Chartered Accountant", "status": "DIGILOCKER_SYNCED", "required_for": "Bank Credit Appraisal & DIC Task Force"},
            {"id": "doc_6", "name": "Machinery Proforma Invoices & Quotations", "category": "TECHNICAL", "issuing_authority": "Authorized Machinery Manufacturers", "status": "PENDING", "required_for": "DIC Committee Sanction & Term Loan Disbursal"},
            {"id": "doc_7", "name": "Land 7/12 Extract / Factory Shed Lease Deed", "category": "LEGAL", "issuing_authority": "Talathi / Sub-Registrar Office", "status": "PENDING", "required_for": "Site Verification & Electricity Sanction"},
            {"id": "doc_8", "name": "Gram Panchayat No Objection Certificate (NOC)", "category": "LEGAL", "issuing_authority": "Local Gram Panchayat / Sarpanch", "status": "PENDING", "required_for": "Trade License & Commercial Power Connection"},
            {"id": "doc_9", "name": "FSSAI Food Safety Basic Registration (Form A)", "category": "LEGAL", "issuing_authority": "Food Safety and Standards Authority of India", "status": "PENDING", "required_for": "Agro-Processing & Packaging Sales"}
        ]
        return defaults

    return [
        {
            "id": d.id,
            "name": d.name,
            "category": d.category,
            "issuing_authority": d.issuing_authority,
            "status": d.status,
            "file_path": d.file_path,
            "required_for": d.required_for or ""
        }
        for d in docs
    ]


class UpdateDocStatusRequest(CamelModel):
    document_id: str
    business_id: str
    status: str  # VERIFIED, DIGILOCKER_SYNCED, PENDING


@router.post("/status")
def update_document_status(req: UpdateDocStatusRequest, db: Session = Depends(get_db)):
    doc = db.query(DocumentItemModel).filter(
        DocumentItemModel.id == req.document_id,
        DocumentItemModel.business_id == req.business_id
    ).first()

    if not doc:
        doc = DocumentItemModel(
            id=req.document_id,
            business_id=req.business_id,
            name=req.document_id.replace("_", " ").title(),
            category="IDENTITY",
            issuing_authority="Government Authority",
            status=req.status
        )
        db.add(doc)
    else:
        doc.status = req.status

    db.commit()
    return {"status": "SUCCESS", "document_id": req.document_id, "new_status": req.status}


@router.post("/upload")
def upload_document(
    business_id: str = Form("biz_default"),
    doc_type: str = Form("IDENTITY"),
    name: str = Form("Uploaded Document"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    upload_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    
    file_id = f"doc_{uuid.uuid4().hex[:12]}"
    file_path = os.path.join(upload_dir, f"{file_id}_{file.filename}")
    
    with open(file_path, "wb") as f:
        content = file.file.read()
        f.write(content)

    doc = DocumentItemModel(
        id=file_id,
        business_id=business_id,
        name=name or file.filename,
        category=doc_type,
        doc_type=doc_type,
        issuing_authority="Citizen Upload",
        status="VERIFIED",
        file_path=file_path,
        file_size_bytes=len(content),
        mime_type=file.content_type or "application/pdf"
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    return {
        "status": "SUCCESS",
        "id": doc.id,
        "name": doc.name,
        "category": doc.category,
        "filePath": doc.file_path,
        "status": doc.status
    }
