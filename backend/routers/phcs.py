from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import PHC, Doctor, Medicine
from ..schemas import PHCResponse

router = APIRouter(prefix="/api/phcs", tags=["PHCs"])

@router.get("", response_model=List[PHCResponse])
def get_all_phcs(taluk: Optional[str] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(PHC)
    if taluk:
        query = query.filter(PHC.taluk == taluk)
    if status:
        query = query.filter(PHC.status == status)
    return query.all()

@router.get("/{phc_id}")
def get_phc_detail(phc_id: str, db: Session = Depends(get_db)):
    phc = db.query(PHC).filter(PHC.id == phc_id).first()
    if not phc:
        raise HTTPException(status_code=404, detail="PHC not found")
    
    doctors = db.query(Doctor).filter(Doctor.current_phc_id == phc_id).all()
    medicines = db.query(Medicine).filter(Medicine.phc_id == phc_id).all()
    
    return {
        "phc": phc,
        "doctors": doctors,
        "medicines": medicines
    }
