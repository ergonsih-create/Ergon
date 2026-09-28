"""
GRAM-DISHA — Master Data Seeder
Populates initial government scheme catalogs, verified users, demo enterprises,
inventory records, and milestones for local development and demonstration.
"""

import sys
import os
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.db.models import (
    UserModel,
    BusinessModel,
    SchemeCatalogModel,
    InventoryItemModel,
    SalesRecordModel,
    ActionMilestoneModel,
    AppNotificationModel,
    SupportTicketModel,
    DocumentItemModel,
)


def seed():
    db = SessionLocal()
    print("Beginning database seeding...")

    try:
        # 1. Admin & Beneficiary Users
        admin_user = db.query(UserModel).filter(UserModel.email == "admin@gramdisha.gov.in").first()
        if not admin_user:
            admin_user = UserModel(
                id="usr_admin_001",
                email="admin@gramdisha.gov.in",
                hashed_password=get_password_hash("Admin@123"),
                full_name="District Industries Officer (Yavatmal)",
                phone="+91 71322 45001",
                role="admin",
                category="General",
                social_category="General",
                gender="male",
                state="Maharashtra",
                district="Yavatmal",
                block="Yavatmal",
                is_active=True,
            )
            db.add(admin_user)
            print("  + Seeded Admin user: admin@gramdisha.gov.in")

        demo_user = db.query(UserModel).filter(UserModel.email == "ramesh.patil@gramdisha.in").first()
        if not demo_user:
            demo_user = UserModel(
                id="user_default",
                email="ramesh.patil@gramdisha.in",
                hashed_password=get_password_hash("Demo@123"),
                full_name="Ramesh Patil",
                phone="+91 98223 45678",
                role="beneficiary",
                category="OBC",
                social_category="OBC",
                gender="male",
                age_group="26-35",
                education_level="HIGHER_SECONDARY",
                annual_income=180000.0,
                state="Maharashtra",
                district="Yavatmal",
                block="Pusad",
                gram_panchayat="Shendurjana Khurd Gram Panchayat",
                village="Shendurjana Khurd",
                is_rural=True,
                udyam_number="UDYAM-MH-33-0094821",
                bank_ifsc="SBIN0000456",
                preferred_language="en",
                is_active=True,
            )
            db.add(demo_user)
            print("  + Seeded Demo Beneficiary: ramesh.patil@gramdisha.in")

        db.commit()

        # 2. Master Government Schemes Catalog
        schemes = [
            {
                "id": "pmegp",
                "name": "Prime Minister's Employment Generation Programme (PMEGP)",
                "ministry": "Ministry of MSME / KVIC, Government of India",
                "description": "Credit-linked capital subsidy up to 35% for rural and special category greenfield micro-units in manufacturing and service sectors.",
                "max_loan_amount": 5000000.0,
                "subsidy_percentage": 35.0,
            },
            {
                "id": "mudra_shishu",
                "name": "Pradhan Mantri MUDRA Yojana (Shishu)",
                "ministry": "Department of Financial Services, Government of India",
                "description": "Collateral-free micro loans up to ₹50,000 for nano-enterprises, small vendors, and artisan startups.",
                "max_loan_amount": 50000.0,
                "subsidy_percentage": 0.0,
            },
            {
                "id": "mudra_kishore",
                "name": "Pradhan Mantri MUDRA Yojana (Kishore)",
                "ministry": "Department of Financial Services, Government of India",
                "description": "Institutional bank loans between ₹50,001 and ₹5,00,000 for equipment purchase and working capital expansion.",
                "max_loan_amount": 500000.0,
                "subsidy_percentage": 0.0,
            },
            {
                "id": "mudra_tarun",
                "name": "Pradhan Mantri MUDRA Yojana (Tarun)",
                "ministry": "Department of Financial Services, Government of India",
                "description": "Institutional bank loans from ₹5,00,001 up to ₹20,00,000 for mature small enterprises scaling operational capacity.",
                "max_loan_amount": 2000000.0,
                "subsidy_percentage": 0.0,
            },
            {
                "id": "pmfme",
                "name": "PM Formalisation of Micro Food Processing Enterprises (PMFME ODOP)",
                "ministry": "Ministry of Food Processing Industries (MoFPI)",
                "description": "35% credit-linked capital subsidy (maximum ₹10 Lakhs) for individual food processing units with ODOP cluster prioritization.",
                "max_loan_amount": 1000000.0,
                "subsidy_percentage": 35.0,
            },
            {
                "id": "standup_india",
                "name": "Stand-Up India Scheme for SC/ST and Women Entrepreneurs",
                "ministry": "Department of Financial Services / SIDBI",
                "description": "Bank term loans between ₹10 Lakhs and ₹1 Crore for greenfield enterprises in manufacturing, services, or trading.",
                "max_loan_amount": 10000000.0,
                "subsidy_percentage": 0.0,
            },
            {
                "id": "nsfdc",
                "name": "NSFDC Micro Credit Finance for Scheduled Castes",
                "ministry": "National Scheduled Castes Finance & Development Corporation",
                "description": "Direct concessional term loans at 5% p.a. for income-generating micro-enterprises initiated by SC citizens.",
                "max_loan_amount": 500000.0,
                "subsidy_percentage": 20.0,
            }
        ]

        for s in schemes:
            existing_scheme = db.query(SchemeCatalogModel).filter(SchemeCatalogModel.id == s["id"]).first()
            if not existing_scheme:
                new_s = SchemeCatalogModel(
                    id=s["id"],
                    name=s["name"],
                    ministry=s["ministry"],
                    description=s["description"],
                    max_loan_amount=s["max_loan_amount"],
                    subsidy_percentage=s["subsidy_percentage"],
                    is_active=True
                )
                db.add(new_s)
        db.commit()
        print(f"  + Seeded {len(schemes)} official government schemes in catalog.")

        # 3. Demo Enterprise
        biz = db.query(BusinessModel).filter(BusinessModel.id == "biz_default").first()
        if not biz:
            biz = BusinessModel(
                id="biz_default",
                user_id="user_default",
                name="Jai Kisan Agro Flour & Pulse Processing Unit",
                enterprise_name="Jai Kisan Agro Flour & Pulse Processing Unit",
                category="AGRO_PROCESSING",
                industry_type="Manufacturing",
                sector="Agro-Processing",
                location_type="Rural",
                entity_type="Proprietorship",
                stage="Idea / Inception",
                project_cost=850000.0,
                promoter_capital=150000.0,
                status="PLANNING",
                state="Maharashtra",
                district="Yavatmal",
                block="Pusad",
                pin_code="445204",
                gram_panchayat="Shendurjana Khurd Gram Panchayat",
                village="Shendurjana Khurd",
                is_rural=True,
                odop_commodity="Cotton & Chana Processing",
                created_at=datetime.utcnow()
            )
            db.add(biz)
            db.commit()
            print("  + Seeded Demo Enterprise: Jai Kisan Agro Flour & Pulse Processing Unit")

        print("Database seeding completed successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed()
