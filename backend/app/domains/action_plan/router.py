"""
GRAM-DISHA — Action Plan & Operational Milestones Router
Sequences enterprise lifecycle milestones and persists progress in MySQL/SQLite.
"""

from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import Field
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.db.models import ActionMilestoneModel
from app.schemas.common import CamelModel

router = APIRouter(prefix="/action-plan", tags=["Action Plan & Milestones"])

DEFAULT_MILESTONES = [
    {
        "stage_order": 1,
        "title": "Udyam MSME Online Registration",
        "description": "Obtain Udyam Registration Number (URN) with Aadhaar and PAN linkage on official portal (udyamregistration.gov.in).",
        "timeframe": "Day 1–3",
        "authority": "Ministry of MSME",
        "status": "COMPLETED",
        "target_date": "2026-03-05"
    },
    {
        "stage_order": 2,
        "title": "Chartered DPR Formulation & DSCR Ratios",
        "description": "Compile bankable Detailed Project Report with DSCR > 1.5 and KVIC 35% margin money subsidy structure.",
        "timeframe": "Day 4–7",
        "authority": "GRAM-DISHA Engine / Empaneled CA",
        "status": "COMPLETED",
        "target_date": "2026-03-09"
    },
    {
        "stage_order": 3,
        "title": "PMEGP e-Portal Application Submission",
        "description": "Submit online dossier to District Task Force Committee with uploaded 7/12 land extract, machinery quotations, and caste certificate.",
        "timeframe": "Day 8–12",
        "authority": "KVIC / DIC Yavatmal Task Force",
        "status": "IN_PROGRESS",
        "target_date": "2026-03-14"
    },
    {
        "stage_order": 4,
        "title": "Lead Bank Appraisal & In-Principle Sanction",
        "description": "Branch manager technical site inspection, CIBIL verification, and issuance of bank in-principle loan sanction letter.",
        "timeframe": "Day 13–28",
        "authority": "State Bank of India (Pusad Branch)",
        "status": "PENDING",
        "target_date": "2026-03-30"
    },
    {
        "stage_order": 5,
        "title": "FSSAI Basic Registration & Gram Panchayat NOC",
        "description": "File Form A online for ₹100/yr petty agro-food processing certificate and secure village Panchayat commercial premise consent.",
        "timeframe": "Day 29–35",
        "authority": "FSSAI FoSCoS Portal / Gram Panchayat",
        "status": "PENDING",
        "target_date": "2026-04-06"
    },
    {
        "stage_order": 6,
        "title": "Equipment Procurement & 3-Phase Power Sanction",
        "description": "Disbursement of term loan for mini Dal mill plant delivery, civil foundation, and 15 HP industrial agricultural tariff energization.",
        "timeframe": "Day 36–50",
        "authority": "Verified Machinery Supplier / MSEDCL",
        "status": "PENDING",
        "target_date": "2026-04-21"
    },
    {
        "stage_order": 7,
        "title": "Trial Batch Processing & Local Kirana Launch",
        "description": "Conduct trial milling of 5 quintals raw desi chana, verify packaging seal integrity, and distribute initial batches to taluka retailers.",
        "timeframe": "Day 51–60",
        "authority": "Enterprise Promoter / Self Help Federation",
        "status": "PENDING",
        "target_date": "2026-05-02"
    }
]


class MilestoneResponse(CamelModel):
    id: int
    business_id: str
    stage_order: int
    title: str
    description: Optional[str] = None
    timeframe: str
    authority: str
    status: str
    target_date: Optional[str] = None
    completed_at: Optional[str] = None


class MilestoneCreate(CamelModel):
    business_id: str
    stage_order: int
    title: str
    description: Optional[str] = None
    timeframe: Optional[str] = "1–2 Weeks"
    authority: Optional[str] = "District Industries Centre"
    target_date: Optional[str] = None


@router.get("/milestones", response_model=List[MilestoneResponse])
def get_action_milestones(
    business_id: str = Query("biz_default"),
    db: Session = Depends(get_db)
):
    milestones = db.query(ActionMilestoneModel).filter(
        ActionMilestoneModel.business_id == business_id
    ).order_by(ActionMilestoneModel.stage_order.asc()).all()

    if not milestones:
        seeded = []
        for m in DEFAULT_MILESTONES:
            item = ActionMilestoneModel(
                business_id=business_id,
                stage_order=m["stage_order"],
                title=m["title"],
                description=m["description"],
                timeframe=m["timeframe"],
                authority=m["authority"],
                status=m["status"],
                target_date=m["target_date"],
                completed_at=datetime.utcnow() if m["status"] == "COMPLETED" else None,
            )
            db.add(item)
            seeded.append(item)
        db.commit()
        for it in seeded:
            db.refresh(it)
        milestones = seeded

    return [
        MilestoneResponse(
            id=m.id,
            business_id=m.business_id,
            stage_order=m.stage_order,
            title=m.title,
            description=m.description,
            timeframe=m.timeframe,
            authority=m.authority,
            status=m.status,
            target_date=m.target_date,
            completed_at=m.completed_at.isoformat() if m.completed_at else None,
        )
        for m in milestones
    ]


@router.post("/milestones", response_model=MilestoneResponse)
def add_milestone(m_in: MilestoneCreate, db: Session = Depends(get_db)):
    record = ActionMilestoneModel(
        business_id=m_in.business_id,
        stage_order=m_in.stage_order,
        title=m_in.title,
        description=m_in.description,
        timeframe=m_in.timeframe or "1–2 Weeks",
        authority=m_in.authority or "District Industries Centre",
        status="PENDING",
        target_date=m_in.target_date
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return MilestoneResponse(
        id=record.id,
        business_id=record.business_id,
        stage_order=record.stage_order,
        title=record.title,
        description=record.description,
        timeframe=record.timeframe,
        authority=record.authority,
        status=record.status,
        target_date=record.target_date,
        completed_at=None,
    )


@router.patch("/milestones/{milestone_id}/toggle", response_model=MilestoneResponse)
def toggle_milestone(milestone_id: int, db: Session = Depends(get_db)):
    m = db.query(ActionMilestoneModel).filter(ActionMilestoneModel.id == milestone_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Milestone not found")

    if m.status == "COMPLETED":
        m.status = "PENDING"
        m.completed_at = None
    elif m.status == "PENDING":
        m.status = "IN_PROGRESS"
        m.completed_at = None
    else:
        m.status = "COMPLETED"
        m.completed_at = datetime.utcnow()

    db.commit()
    db.refresh(m)

    return MilestoneResponse(
        id=m.id,
        business_id=m.business_id,
        stage_order=m.stage_order,
        title=m.title,
        description=m.description,
        timeframe=m.timeframe,
        authority=m.authority,
        status=m.status,
        target_date=m.target_date,
        completed_at=m.completed_at.isoformat() if m.completed_at else None,
    )
