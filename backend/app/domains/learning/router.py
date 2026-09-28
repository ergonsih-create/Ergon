"""
GRAM-DISHA — Learning Resources & Statutory Knowledge Vault Router
Verified government master circulars, FSSAI filing guides, and RSETI EDP training modules.
"""

from typing import List, Optional
from fastapi import APIRouter, Query
from pydantic import BaseModel

router = APIRouter(prefix="/learning", tags=["Learning & Knowledge Resources"])

VERIFIED_LEARNING_RESOURCES = [
    {
        "id": "res_pmegp_circular",
        "title": "PMEGP Master Guidelines 2025-26 (Official Scheme Circular)",
        "category": "SCHEMES",
        "source": "Ministry of MSME / KVIC",
        "format": "Official PDF Master Circular",
        "size": "2.4 MB",
        "official_url": "https://www.kviconline.gov.in/pmegp/pmegpweb/docs/pmegpguidelines.pdf",
        "description": "Comprehensive circular covering 35% rural capital subsidy calculation, mandatory 10-day EDP training, margin money lock-in rules, and the statutory negative list."
    },
    {
        "id": "res_fssai_form_a",
        "title": "FSSAI Basic Petty Food Manufacturer Registration Guide (Form A)",
        "category": "COMPLIANCE",
        "source": "Food Safety and Standards Authority of India (FSSAI)",
        "format": "Interactive Step-by-Step SOP",
        "size": "15 Mins Walkthrough",
        "official_url": "https://foscos.fssai.gov.in/",
        "description": "How to register petty food enterprises (turnover up to ₹12 Lakhs/year) for ₹100/year via FoSCoS portal for spice mills, flour mills, and mini pulse processing."
    },
    {
        "id": "res_dscr_appraisal",
        "title": "Bank Branch Manager Credit Appraisal Norms for MSME Loans",
        "category": "BANKING",
        "source": "Indian Banks Association (IBA) / Reserve Bank of India",
        "format": "Technical Appraisal Manual",
        "size": "1.8 MB",
        "official_url": "https://www.rbi.org.in/scripts/BS_ViewMasCirculardetails.aspx?id=12140",
        "description": "Covers Debt Service Coverage Ratio (DSCR) benchmarks, collateral-free credit under CGTMSE up to ₹2 Crore, and inventory stock hypothecation audits."
    },
    {
        "id": "res_rseti_edp",
        "title": "RSETI 10-Day Residential Entrepreneurship Development Program (EDP)",
        "category": "TRAINING",
        "source": "Ministry of Rural Development (MoRD) / National Academy of RUDSETI",
        "format": "Certified Course Curriculum",
        "size": "Free Sponsored Program",
        "official_url": "https://rudseti.com/rseti-training-programmes/",
        "description": "Free residential boarding and practical technical training mandated by KVIC prior to first bank loan installment release."
    },
    {
        "id": "res_cgtmse_credit",
        "title": "CGTMSE Credit Guarantee Coverage Norms for Rural Micro Enterprises",
        "category": "BANKING",
        "source": "Credit Guarantee Fund Trust for Micro and Small Enterprises",
        "format": "Circular & Fee Table",
        "size": "850 KB",
        "official_url": "https://www.cgtmse.in/",
        "description": "Explains how rural entrepreneurs obtain collateral-free bank loans with up to 85% government guarantee coverage for women and special category promoters."
    },
    {
        "id": "res_udyam_verification",
        "title": "Udyam Online Self-Declaration & Classification Procedure",
        "category": "COMPLIANCE",
        "source": "Office of Development Commissioner (MSME)",
        "format": "Gazette Notification S.O. 2119(E)",
        "size": "1.1 MB",
        "official_url": "https://udyamregistration.gov.in/",
        "description": "Paperless, free registration mechanism linking GSTIN, PAN, and Income Tax returns for automated micro-enterprise classification."
    }
]


class LearningResourceItem(BaseModel):
    id: str
    title: str
    category: str
    source: str
    format: str
    size: str
    official_url: str
    description: str


@router.get("/resources", response_model=List[LearningResourceItem])
def get_learning_resources(category: Optional[str] = Query(None)):
    if not category or category == "ALL":
        return VERIFIED_LEARNING_RESOURCES
    return [r for r in VERIFIED_LEARNING_RESOURCES if r["category"].upper() == category.upper()]
