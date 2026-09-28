"""
GRAM-DISHA — Notifications & Activity Stream Router
Delivers real-time notifications for scheme updates, inventory thresholds, and application stages.
"""

from typing import List, Optional
from datetime import datetime
import uuid
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_optional_current_user
from app.db.models import AppNotificationModel, UserModel
from app.schemas.common import CamelModel

router = APIRouter(prefix="/notifications", tags=["Notifications & Alerts"])


class NotificationResponse(CamelModel):
    id: str
    user_id: Optional[str] = None
    title: str
    message: str
    type: str  # SCHEME_UPDATE, DOCUMENT_ALERT, INVENTORY_LOW, FINANCIAL_REMINDER, DISHA_INSIGHT
    is_read: bool
    action_url: Optional[str] = None
    created_at: str


class NotificationCreate(CamelModel):
    user_id: Optional[str] = "user_default"
    title: str
    message: str
    type: str = "SCHEME_UPDATE"
    action_url: Optional[str] = None


@router.get("", response_model=List[NotificationResponse])
def get_notifications(
    user_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_optional_current_user)
):
    query = db.query(AppNotificationModel)
    target_uid = current_user.id if current_user else user_id
    if target_uid and (not current_user or current_user.role.lower() not in ("admin", "administrator")):
        query = query.filter(AppNotificationModel.user_id == target_uid)

    notifs = query.order_by(AppNotificationModel.created_at.desc()).all()

    if not notifs:
        initial_notifs = [
            AppNotificationModel(
                id="notif_pmegp_stage",
                user_id=target_uid or "user_default",
                title="PMEGP Application Verified by DIC",
                message="Your application (PMEGP-MH-YAV-2026-8942) has been scrutinized and forwarded to Lead District Bank (SBI Pusad).",
                type="SCHEME_UPDATE",
                is_read=False,
                action_url="/applications",
                created_at=datetime.utcnow()
            ),
            AppNotificationModel(
                id="notif_stock_warning",
                user_id=target_uid or "user_default",
                title="Low Packaging Stock Alert",
                message="HDPE 50kg Bags stock is at 120 bags, which is below your reorder threshold of 200 bags.",
                type="INVENTORY_LOW",
                is_read=False,
                action_url="/operations",
                created_at=datetime.utcnow()
            ),
            AppNotificationModel(
                id="notif_disha_advisor",
                user_id=target_uid or "user_default",
                title="Mandi Rate Movement: Chana Pulse Upward",
                message="Pusad APMC daily modal price for Desi Chana rose to ₹6,180/quintal. Consider locking in raw material supply.",
                type="DISHA_INSIGHT",
                is_read=False,
                action_url="/market",
                created_at=datetime.utcnow()
            )
        ]
        db.add_all(initial_notifs)
        db.commit()
        for n in initial_notifs:
            db.refresh(n)
        notifs = initial_notifs

    return [
        NotificationResponse(
            id=n.id,
            user_id=n.user_id,
            title=n.title,
            message=n.message,
            type=n.type,
            is_read=n.is_read,
            action_url=n.action_url,
            created_at=n.created_at.isoformat() if n.created_at else "",
        )
        for n in notifs
    ]


@router.post("/{notification_id}/read")
def mark_notification_read(notification_id: str, db: Session = Depends(get_db)):
    n = db.query(AppNotificationModel).filter(AppNotificationModel.id == notification_id).first()
    if n:
        n.is_read = True
        db.commit()
    return {"status": "SUCCESS", "id": notification_id}


@router.post("/clear")
def clear_all_notifications(
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_optional_current_user)
):
    query = db.query(AppNotificationModel)
    if current_user and current_user.role.lower() not in ("admin", "administrator"):
        query = query.filter(AppNotificationModel.user_id == current_user.id)
    query.delete()
    db.commit()
    return {"status": "SUCCESS", "message": "Notifications cleared"}


@router.post("/trigger", response_model=NotificationResponse)
def trigger_notification(
    req: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_optional_current_user)
):
    user_id = current_user.id if current_user else req.user_id
    new_notif = AppNotificationModel(
        id=f"notif_{int(datetime.utcnow().timestamp())}_{uuid.uuid4().hex[:6]}",
        user_id=user_id,
        title=req.title,
        message=req.message,
        type=req.type,
        is_read=False,
        action_url=req.action_url,
        created_at=datetime.utcnow()
    )
    db.add(new_notif)
    db.commit()
    db.refresh(new_notif)

    return NotificationResponse(
        id=new_notif.id,
        user_id=new_notif.user_id,
        title=new_notif.title,
        message=new_notif.message,
        type=new_notif.type,
        is_read=new_notif.is_read,
        action_url=new_notif.action_url,
        created_at=new_notif.created_at.isoformat(),
    )
