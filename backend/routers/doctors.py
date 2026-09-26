from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from ..database import get_db
from ..models import Doctor, PHC, AuditLog, Notification
from ..schemas import DoctorResponse, MarkAbsentRequest, AttendanceActionRequest

router = APIRouter(prefix="/api/doctors", tags=["Doctors & Attendance"])

@router.get("", response_model=List[DoctorResponse])
def get_doctors(phc_id: Optional[str] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Doctor)
    if phc_id:
        query = query.filter(Doctor.current_phc_id == phc_id)
    if status:
        query = query.filter(Doctor.status == status)
    return query.all()

@router.post("/mark-absent")
def mark_doctor_absent(payload: MarkAbsentRequest, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.id == payload.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    doctor.status = "absent"
    doctor.leave_reason = payload.reason
    
    # Update PHC counters
    phc = db.query(PHC).filter(PHC.id == doctor.current_phc_id).first()
    if phc:
        phc.doctors_on_duty = max(0, phc.doctors_on_duty - 1)
        phc.doctors_absent += 1
        if phc.doctors_on_duty <= 1:
            phc.status = "critical"
        elif phc.doctors_on_duty == 2:
            phc.status = "moderate"

    # Add audit log
    db.add(AuditLog(
        id=f"AUD-{int(datetime.utcnow().timestamp())}",
        timestamp=datetime.utcnow().strftime("%I:%M %p"),
        user="Staff / DDHS",
        role="staff",
        action="MARK_ABSENT",
        phc_id=doctor.current_phc_id,
        doctor_id=doctor.id,
        details=f"{doctor.name} marked absent. Reason: {payload.reason}"
    ))

    # Add alert notification
    db.add(Notification(
        id=f"NOTIF-{int(datetime.utcnow().timestamp())}",
        type="doctor-absence",
        title="Doctor Absence Reported",
        message=f"{doctor.name} ({doctor.specialization}) marked absent at {phc.name if phc else 'PHC'}. Substitute allocation recommended.",
        phc_id=doctor.current_phc_id,
        doctor_id=doctor.id,
        time=datetime.utcnow().strftime("%I:%M %p"),
        read=False,
        severity="critical"
    ))

    db.commit()
    return {"message": f"{doctor.name} marked absent successfully", "doctor_id": doctor.id}

@router.post("/check-in")
def doctor_check_in(payload: AttendanceActionRequest, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.id == payload.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    doctor.status = "available"
    doctor.check_in_time = datetime.utcnow().strftime("%I:%M %p")
    db.commit()
    return {"message": f"{doctor.name} checked in at {doctor.check_in_time}"}

@router.post("/check-out")
def doctor_check_out(payload: AttendanceActionRequest, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.id == payload.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    doctor.status = "available"
    db.commit()
    return {"message": f"{doctor.name} checked out successfully"}
