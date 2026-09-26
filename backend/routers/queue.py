from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import PHC, Doctor
from ..schemas import CallNextRequest

router = APIRouter(prefix="/api/queue", tags=["Live Queue Management"])

@router.get("/{phc_id}")
def get_phc_queue(phc_id: str, db: Session = Depends(get_db)):
    phc = db.query(PHC).filter(PHC.id == phc_id).first()
    if not phc:
        raise HTTPException(status_code=404, detail="PHC not found")

    doctors_on_duty = db.query(Doctor).filter(
        Doctor.current_phc_id == phc_id,
        Doctor.status == "available"
    ).all()

    # Generate next 8 tokens
    tokens = [phc.current_token + i for i in range(1, min(phc.patients_waiting + 1, 9))]

    return {
        "phc_id": phc.id,
        "phc_name": phc.name,
        "current_token": phc.current_token,
        "serving": phc.current_token,
        "tokens": tokens,
        "patients_waiting": phc.patients_waiting,
        "avg_waiting_time": phc.avg_waiting_time,
        "doctors_on_duty": len(doctors_on_duty),
        "status": phc.status
    }

@router.post("/call-next")
def call_next_patient(payload: CallNextRequest, db: Session = Depends(get_db)):
    phc = db.query(PHC).filter(PHC.id == payload.phc_id).first()
    if not phc:
        raise HTTPException(status_code=404, detail="PHC not found")

    phc.current_token += 1
    phc.patients_waiting = max(0, phc.patients_waiting - 1)
    phc.last_token = max(phc.last_token, phc.current_token)

    # Recalculate status
    if phc.patients_waiting <= 25:
        phc.status = "normal"
    elif phc.patients_waiting <= 50:
        phc.status = "moderate"
    else:
        phc.status = "critical"

    db.commit()
    return {
        "message": f"Called next token #{phc.current_token}",
        "current_token": phc.current_token,
        "patients_waiting": phc.patients_waiting,
        "status": phc.status
    }
