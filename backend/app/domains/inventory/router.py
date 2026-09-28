"""
GRAM-DISHA — Micro-ERP Inventory, Stock Alerts & Sales Router
Directly updates stock registers and records customer sales transactions in MySQL/SQLite.
"""

from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import Field
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.db.models import InventoryItemModel, SalesRecordModel
from app.schemas.common import CamelModel

router = APIRouter(prefix="/inventory", tags=["Micro-ERP Inventory & Sales"])


class InventoryItemCreate(CamelModel):
    id: Optional[str] = None
    business_id: str = "biz_default"
    item_name: str
    category: str = "RAW_MATERIAL"
    unit: str = "kg"
    current_stock: float = Field(..., ge=0)
    reorder_threshold: float = Field(0.0, ge=0)
    avg_purchase_rate: float = Field(0.0, ge=0)


class InventoryItemResponse(CamelModel):
    id: str
    business_id: str
    item_name: str
    category: str
    unit: str
    current_stock: float
    reorder_threshold: float
    avg_purchase_rate: float
    is_low_stock: bool
    created_at: str


class SaleCreateRequest(CamelModel):
    business_id: str = "biz_default"
    item_id: Optional[str] = None
    sale_date: Optional[str] = None
    product_name: str
    customer_name: Optional[str] = "Local Kirana Buyer"
    customer_type: str = "RETAIL_KIRANA"
    units_sold: float = Field(default=1.0, gt=0)
    unit_sale_price: Optional[float] = None
    rate_per_unit: Optional[float] = None
    unit: Optional[str] = "kg"
    total_revenue: Optional[float] = None
    payment_mode: str = "UPI"


class SaleResponse(CamelModel):
    id: str
    business_id: str
    sale_date: str
    product_name: str
    customer_name: Optional[str] = None
    customer_type: str
    units_sold: float
    unit_sale_price: float
    total_amount: float
    payment_mode: str
    created_at: str


class InventoryStatsResponse(CamelModel):
    total_items_count: int
    total_stock_valuation: float
    low_stock_alerts_count: int
    total_sales_revenue: float
    total_sales_count: int
    items: List[InventoryItemResponse]


@router.get("/items", response_model=List[InventoryItemResponse])
def get_inventory_items(
    business_id: str = Query("biz_default"),
    db: Session = Depends(get_db)
):
    items = db.query(InventoryItemModel).filter(InventoryItemModel.business_id == business_id).all()
    if not items:
        all_items = db.query(InventoryItemModel).all()
        if all_items:
            items = all_items
        else:
            initial_items = [
                InventoryItemModel(
                    id=f"inv_desichana_{business_id}",
                    business_id=business_id,
                    item_name="Desi Chana (Raw Pulse - Pusad Mandi)",
                    category="RAW_MATERIAL",
                    unit="kg",
                    current_stock=2400.0,
                    reorder_threshold=500.0,
                    avg_purchase_rate=61.8,
                ),
                InventoryItemModel(
                    id=f"inv_chana_dal_pkg_{business_id}",
                    business_id=business_id,
                    item_name="Packaged Chana Dal (1 kg Retail Pouch)",
                    category="FINISHED_GOODS",
                    unit="packets",
                    current_stock=480.0,
                    reorder_threshold=150.0,
                    avg_purchase_rate=78.0,
                ),
                InventoryItemModel(
                    id=f"inv_gunny_bags_{business_id}",
                    business_id=business_id,
                    item_name="HDPE Woven 50kg Bags (Printed)",
                    category="PACKAGING",
                    unit="bags",
                    current_stock=120.0,
                    reorder_threshold=200.0,
                    avg_purchase_rate=22.5,
                )
            ]
            db.add_all(initial_items)
            db.commit()
            for it in initial_items:
                db.refresh(it)
            items = initial_items

    return [
        InventoryItemResponse(
            id=i.id,
            business_id=i.business_id,
            item_name=i.item_name,
            category=i.category,
            unit=i.unit,
            current_stock=i.current_stock,
            reorder_threshold=i.reorder_threshold,
            avg_purchase_rate=i.avg_purchase_rate,
            is_low_stock=(i.current_stock <= i.reorder_threshold),
            created_at=i.created_at.isoformat() if i.created_at else "",
        )
        for i in items
    ]


@router.post("/items", response_model=InventoryItemResponse)
def add_inventory_item(item_in: InventoryItemCreate, db: Session = Depends(get_db)):
    item_id = item_in.id or f"inv_{int(datetime.utcnow().timestamp())}_{uuid.uuid4().hex[:6]}"
    new_item = InventoryItemModel(
        id=item_id,
        business_id=item_in.business_id,
        item_name=item_in.item_name,
        category=item_in.category,
        unit=item_in.unit,
        current_stock=item_in.current_stock,
        reorder_threshold=item_in.reorder_threshold,
        avg_purchase_rate=item_in.avg_purchase_rate,
        created_at=datetime.utcnow()
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return InventoryItemResponse(
        id=new_item.id,
        business_id=new_item.business_id,
        item_name=new_item.item_name,
        category=new_item.category,
        unit=new_item.unit,
        current_stock=new_item.current_stock,
        reorder_threshold=new_item.reorder_threshold,
        avg_purchase_rate=new_item.avg_purchase_rate,
        is_low_stock=(new_item.current_stock <= new_item.reorder_threshold),
        created_at=new_item.created_at.isoformat(),
    )


@router.delete("/items/{item_id}")
def delete_inventory_item(item_id: str, db: Session = Depends(get_db)):
    item = db.query(InventoryItemModel).filter(InventoryItemModel.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"status": "SUCCESS", "deleted_item_id": item_id}


@router.get("/sales", response_model=List[SaleResponse])
def get_sales_records(
    business_id: str = Query("biz_default"),
    db: Session = Depends(get_db)
):
    sales = db.query(SalesRecordModel).filter(
        SalesRecordModel.business_id == business_id
    ).order_by(SalesRecordModel.created_at.desc()).all()

    if not sales:
        init_sales = [
            SalesRecordModel(
                id="sale_01",
                business_id=business_id,
                sale_date="2026-02-24",
                product_name="Packaged Chana Dal (1 kg Retail Pouch)",
                customer_name="Om Sai Kirana General Stores, Pusad",
                customer_type="RETAIL_KIRANA",
                units_sold=120.0,
                unit_sale_price=95.0,
                total_amount=11400.0,
                payment_mode="UPI",
                created_at=datetime.utcnow()
            ),
            SalesRecordModel(
                id="sale_02",
                business_id=business_id,
                sale_date="2026-02-22",
                product_name="Bulk Cleaned Desi Chana (50 kg Bag)",
                customer_name="Vasant Wholesale Trader, Yavatmal Mandi",
                customer_type="WHOLESALE_TRADER",
                units_sold=20.0,
                unit_sale_price=3400.0,
                total_amount=68000.0,
                payment_mode="BANK_TRANSFER",
                created_at=datetime.utcnow()
            )
        ]
        db.add_all(init_sales)
        db.commit()
        for s in init_sales:
            db.refresh(s)
        sales = init_sales

    return [
        SaleResponse(
            id=s.id,
            business_id=s.business_id,
            sale_date=s.sale_date,
            product_name=s.product_name,
            customer_name=s.customer_name,
            customer_type=s.customer_type,
            units_sold=s.units_sold,
            unit_sale_price=s.unit_sale_price,
            total_amount=s.total_amount,
            payment_mode=s.payment_mode,
            created_at=s.created_at.isoformat() if s.created_at else "",
        )
        for s in sales
    ]


@router.post("/sales", response_model=SaleResponse)
def record_sale_transaction(sale_in: SaleCreateRequest, db: Session = Depends(get_db)):
    sale_price = sale_in.unit_sale_price if sale_in.unit_sale_price is not None else (sale_in.rate_per_unit or 100.0)
    calculated_tot = round(sale_in.units_sold * sale_price, 2)
    tot = sale_in.total_revenue if sale_in.total_revenue is not None else calculated_tot
    s_date = sale_in.sale_date or datetime.utcnow().strftime("%Y-%m-%d")
    sale_id = f"sale_{int(datetime.utcnow().timestamp())}_{uuid.uuid4().hex[:6]}"

    sale_record = SalesRecordModel(
        id=sale_id,
        business_id=sale_in.business_id,
        sale_date=s_date,
        product_name=sale_in.product_name,
        customer_name=sale_in.customer_name,
        customer_type=sale_in.customer_type,
        units_sold=sale_in.units_sold,
        unit_sale_price=sale_price,
        total_amount=tot,
        payment_mode=sale_in.payment_mode,
        created_at=datetime.utcnow()
    )
    db.add(sale_record)

    # Automatically decrement stock in inventory
    matched_item = None
    if sale_in.item_id:
        matched_item = db.query(InventoryItemModel).filter(
            InventoryItemModel.id == sale_in.item_id
        ).first()

    if not matched_item:
        matched_item = db.query(InventoryItemModel).filter(
            InventoryItemModel.business_id == sale_in.business_id,
            InventoryItemModel.item_name == sale_in.product_name
        ).first()

    if not matched_item:
        matched_item = db.query(InventoryItemModel).filter(
            InventoryItemModel.business_id == sale_in.business_id,
            InventoryItemModel.item_name.ilike(f"%{sale_in.product_name[:8]}%")
        ).first()

    if matched_item and matched_item.current_stock >= sale_in.units_sold:
        matched_item.current_stock = max(0.0, matched_item.current_stock - sale_in.units_sold)

    db.commit()
    db.refresh(sale_record)

    return SaleResponse(
        id=sale_record.id,
        business_id=sale_record.business_id,
        sale_date=sale_record.sale_date,
        product_name=sale_record.product_name,
        customer_name=sale_record.customer_name,
        customer_type=sale_record.customer_type,
        units_sold=sale_record.units_sold,
        unit_sale_price=sale_record.unit_sale_price,
        total_amount=sale_record.total_amount,
        payment_mode=sale_record.payment_mode,
        created_at=sale_record.created_at.isoformat(),
    )


@router.get("/stats", response_model=InventoryStatsResponse)
def get_inventory_stats(
    business_id: str = Query("biz_default"),
    db: Session = Depends(get_db)
):
    items = db.query(InventoryItemModel).filter(InventoryItemModel.business_id == business_id).all()
    sales = db.query(SalesRecordModel).filter(SalesRecordModel.business_id == business_id).all()

    total_val = sum(i.current_stock * i.avg_purchase_rate for i in items)
    low_stock = sum(1 for i in items if i.current_stock <= i.reorder_threshold)
    total_sales_rev = sum(s.total_amount for s in sales)

    items_res = [
        InventoryItemResponse(
            id=i.id,
            business_id=i.business_id,
            item_name=i.item_name,
            category=i.category,
            unit=i.unit,
            current_stock=i.current_stock,
            reorder_threshold=i.reorder_threshold,
            avg_purchase_rate=i.avg_purchase_rate,
            is_low_stock=(i.current_stock <= i.reorder_threshold),
            created_at=i.created_at.isoformat() if i.created_at else "",
        )
        for i in items
    ]

    return InventoryStatsResponse(
        total_items_count=len(items),
        total_stock_valuation=round(total_val, 2),
        low_stock_alerts_count=low_stock,
        total_sales_revenue=round(total_sales_rev, 2),
        total_sales_count=len(sales),
        items=items_res,
    )
