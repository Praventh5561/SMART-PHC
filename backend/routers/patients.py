from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
import random
from ..database import get_db
from ..models import Patient, PHC
from ..schemas import PatientRegisterRequest

router = APIRouter(prefix="/api/patients", tags=["Patients"])

@router.get("")
def list_patients(search: Optional[str] = None, phc_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Patient)
    if phc_id:
        query = query.filter(Patient.registered_phc_id == phc_id)
    if search:
        query = query.filter(
            (Patient.name.ilike(f"%{search}%")) |
            (Patient.id.ilike(f"%{search}%")) |
            (Patient.phone.ilike(f"%{search}%"))
        )
    return query.limit(50).all()

@router.post("/register")
def register_patient(payload: PatientRegisterRequest, db: Session = Depends(get_db)):
    patient_id = f"SPHC-2026-{random.randint(10000, 99999)}"
    new_patient = Patient(
        id=patient_id,
        name=payload.name,
        dob=payload.dob,
        gender=payload.gender,
        phone=payload.phone,
        village=payload.village,
        emergency_contact=payload.emergency_contact,
        registered_phc_id=payload.registered_phc_id
    )
    db.add(new_patient)

    # Issue queue token for this patient at the registered PHC
    phc = db.query(PHC).filter(PHC.id == payload.registered_phc_id).first()
    token_num = 1
    if phc:
        phc.last_token += 1
        phc.patients_waiting += 1
        token_num = phc.last_token

    db.commit()
    return {
        "message": "Patient registered successfully",
        "patient": new_patient,
        "token_number": token_num,
        "phc_name": phc.name if phc else "PHC"
    }
