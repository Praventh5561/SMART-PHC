from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import PHC, Doctor, Medicine
from ..schemas import PHCResponse, CreatePHCRequest

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

@router.post("", response_model=PHCResponse)
def create_phc(payload: CreatePHCRequest, db: Session = Depends(get_db)):
    # Calculate next PHC ID
    total_phcs = db.query(PHC).count()
    next_id = f"PHC{str(total_phcs + 1).zfill(3)}"
    while db.query(PHC).filter(PHC.id == next_id).first():
        total_phcs += 1
        next_id = f"PHC{str(total_phcs + 1).zfill(3)}"

    new_phc = PHC(
        id=next_id,
        name=payload.name,
        taluk=payload.taluk,
        location=payload.location,
        distance_from_hq=payload.distance_from_hq,
        doctors_assigned=payload.doctors_assigned,
        doctors_on_duty=payload.doctors_assigned,
        doctors_absent=0,
        patients_waiting=0,
        avg_waiting_time=10,
        status="normal",
        medicine_alerts=0,
        current_token=1,
        last_token=1
    )
    db.add(new_phc)
    db.commit()
    db.refresh(new_phc)
    return new_phc

