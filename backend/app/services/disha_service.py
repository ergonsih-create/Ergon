"""
GRAM-DISHA — Disha Advisory Service
Builds evidence grounding from DB and dispatches chat queries to Gemini AI.
"""

import uuid
import json
from datetime import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.db.models import (
    DishaConversationModel,
    DishaMessageModel,
    BusinessModel,
    UserModel,
    DocumentItemModel
)
from app.engines.financial_engine import FinancialEngine
from app.engines.scheme_engine import SchemeEngine
from app.engines.feasibility_engine import FeasibilityEngine
from app.ai.gemini_service import GeminiAIService
from app.schemas.disha import ChatMessageRequest, ChatMessageResponse


class DishaService:
    @classmethod
    def chat(
        cls,
        db: Session,
        req: ChatMessageRequest,
        user: Optional[UserModel] = None
    ) -> ChatMessageResponse:
        user_id = user.id if user else "user_default"
        
        # 1. Resolve or create conversation thread
        conv = None
        if req.conversation_id:
            conv = db.query(DishaConversationModel).filter(DishaConversationModel.id == req.conversation_id).first()
        if not conv and req.business_id:
            conv = db.query(DishaConversationModel).filter(
                DishaConversationModel.business_id == req.business_id,
                DishaConversationModel.user_id == user_id
            ).first()
        if not conv:
            conv_id = req.conversation_id or f"conv_{uuid.uuid4().hex[:12]}"
            conv = DishaConversationModel(
                id=conv_id,
                user_id=user_id,
                business_id=req.business_id,
                title="Advisory Discussion",
                language=req.language or "en"
            )
            db.add(conv)
            db.commit()
            db.refresh(conv)

        # 2. Record User Message
        user_msg = DishaMessageModel(
            id=f"msg_{uuid.uuid4().hex[:12]}",
            conversation_id=conv.id,
            role="user",
            content=req.message,
            created_at=datetime.utcnow()
        )
        db.add(user_msg)
        db.commit()

        # 3. Assemble Grounding Context Snapshot
        biz = None
        if req.business_id:
            biz = db.query(BusinessModel).filter(BusinessModel.id == req.business_id).first()
        if not biz and user:
            biz = db.query(BusinessModel).filter(BusinessModel.user_id == user.id).first()
        if not biz:
            biz = db.query(BusinessModel).first()

        cost = biz.project_cost if biz else 850000.0
        equity = biz.promoter_capital if biz else 150000.0
        cat = (user.category if user else (biz.category if biz else "General")) or "General"
        gender = (user.gender if user else "Male") or "Male"
        is_rural = biz.is_rural if biz else True

        fin_data = FinancialEngine.structure_project(project_cost=cost, promoter_capital=equity)
        schemes_data = SchemeEngine.evaluate_schemes(
            category=cat,
            gender=gender,
            is_rural=is_rural,
            project_cost=cost,
            activity_type=biz.category if biz else "AGRO_PROCESSING"
        )
        feas_data = FeasibilityEngine.calculate_hbfs(
            demand_index=0.78,
            accessibility_index=0.72,
            infrastructure_index=0.68,
            socioeconomic_index=0.64,
            scheme_suitability_index=0.88
        )

        # Query verified and pending documents for this business
        doc_models = []
        if biz:
            doc_models = db.query(DocumentItemModel).filter(DocumentItemModel.business_id == biz.id).all()
        verified_docs = [d.name for d in doc_models if d.status in ("VERIFIED", "DIGILOCKER_SYNCED")]
        pending_docs = [d.name for d in doc_models if d.status not in ("VERIFIED", "DIGILOCKER_SYNCED")]

        # Query verified mandi commodities matching the district
        from app.domains.market.router import VERIFIED_MANDI_RECORDS
        biz_dist = (biz.district if biz else "Yavatmal").strip().lower()
        matching_mandi = [
            f"{m['commodity']} ({m['variety']}): Modal ₹{m['modal_price_per_quintal']}/Qtl at {m['market_mandi']}"
            for m in VERIFIED_MANDI_RECORDS
            if m["district"].lower() == biz_dist
        ]
        if not matching_mandi:
            matching_mandi = [
                f"{m['commodity']} ({m['variety']}): Modal ₹{m['modal_price_per_quintal']}/Qtl at {m['market_mandi']}"
                for m in VERIFIED_MANDI_RECORDS[:2]
            ]

        grounding_snapshot: Dict[str, Any] = {
            "business": {
                "name": biz.name if biz else "Rural Agro Unit",
                "sector": biz.sector if biz else "Agro-Processing",
                "industry_type": biz.industry_type if biz else "Manufacturing",
                "district": biz.district if biz else "Yavatmal",
                "state": biz.state if biz else "Maharashtra",
                "location_type": biz.location_type if biz else "Rural",
                "category": cat,
                "gender": gender,
            },
            "financials": fin_data,
            "schemes": schemes_data,
            "feasibility": feas_data,
            "documents": {
                "verified": verified_docs if verified_docs else ["Aadhaar Card (UIDAI Verified)", "PAN Card (Income Tax Dept)"],
                "pending": pending_docs if pending_docs else ["FSSAI Food Safety Registration", "Machinery Quotations", "Gram Panchayat NOC"],
            },
            "market_mandi": matching_mandi,
        }

        # 4. Generate Grounded AI Response with Target Language
        user_lang = req.language or conv.language or "en"
        ai_service = GeminiAIService()
        reply_text = ai_service.generate_grounded_response(
            user_query=req.message,
            grounding_data=grounding_snapshot,
            language=user_lang
        )

        # 5. Record Assistant Message
        assistant_msg = DishaMessageModel(
            id=f"msg_{uuid.uuid4().hex[:12]}",
            conversation_id=conv.id,
            role="assistant",
            content=reply_text,
            grounding_refs_json=json.dumps({
                "totalProjectCost": cost,
                "dscr": fin_data.get("projectedDSCR"),
                "topScheme": schemes_data[0].get("schemeCode") if schemes_data else "PMEGP"
            }),
            created_at=datetime.utcnow()
        )
        db.add(assistant_msg)
        db.commit()
        db.refresh(assistant_msg)

        return ChatMessageResponse(
            id=assistant_msg.id,
            conversation_id=conv.id,
            role="assistant",
            content=assistant_msg.content,
            grounding_refs=json.loads(assistant_msg.grounding_refs_json or "{}"),
            created_at=assistant_msg.created_at.isoformat()
        )

    @classmethod
    def get_history(
        cls,
        db: Session,
        business_id: Optional[str] = None,
        user: Optional[UserModel] = None
    ) -> List[ChatMessageResponse]:
        query = db.query(DishaMessageModel).join(DishaConversationModel)
        if business_id:
            query = query.filter(DishaConversationModel.business_id == business_id)
        elif user:
            query = query.filter(DishaConversationModel.user_id == user.id)

        messages = query.order_by(DishaMessageModel.created_at.asc()).all()
        return [
            ChatMessageResponse(
                id=m.id,
                conversation_id=m.conversation_id,
                role=m.role,
                content=m.content,
                grounding_refs=json.loads(m.grounding_refs_json or "{}") if m.grounding_refs_json else None,
                created_at=m.created_at.isoformat() if m.created_at else None
            )
            for m in messages
        ]
