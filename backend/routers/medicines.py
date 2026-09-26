from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Medicine
from ..schemas import UpdateStockRequest, IssueMedicineRequest

router = APIRouter(prefix="/api/medicines", tags=["Medicines & FEFO Inventory"])

@router.get("")
def get_medicines(phc_id: Optional[str] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Medicine)
    if phc_id:
        query = query.filter(Medicine.phc_id == phc_id)
    if status:
        query = query.filter(Medicine.status == status)
    
    # Sort by FEFO (First-Expired, First-Out)
    return query.order_by(Medicine.expiry_date.asc()).all()

@router.post("/update-stock")
def update_stock(payload: UpdateStockRequest, db: Session = Depends(get_db)):
    med = db.query(Medicine).filter(Medicine.id == payload.medicine_id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Medicine not found")

    med.quantity = max(0, med.quantity + payload.quantity_delta)
    if med.quantity == 0:
        med.status = "out-of-stock"
    elif med.quantity < med.min_stock:
        med.status = "low-stock"
    else:
        med.status = "available"

    db.commit()
    return {"message": "Stock updated", "medicine_id": med.id, "quantity": med.quantity, "status": med.status}

@router.post("/issue")
def issue_medicine(payload: IssueMedicineRequest, db: Session = Depends(get_db)):
    med = db.query(Medicine).filter(Medicine.id == payload.medicine_id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Medicine not found")

    if med.quantity < payload.quantity:
        raise HTTPException(status_code=400, detail=f"Insufficient stock. Available: {med.quantity}")

    med.quantity -= payload.quantity
    if med.quantity == 0:
        med.status = "out-of-stock"
    elif med.quantity < med.min_stock:
        med.status = "low-stock"

    db.commit()
    return {
        "message": f"Successfully dispensed {payload.quantity} units of {med.name}",
        "remaining_quantity": med.quantity,
        "batch_id": med.batch_id,
        "status": med.status
    }
