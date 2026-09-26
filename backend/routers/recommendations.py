from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from ..database import get_db
from ..models import Doctor, PHC, Assignment, AuditLog, Notification, AIWeights
from ..schemas import ApproveSubstituteRequest, AIWeightsUpdate
from ..ai_engine import recommend_substitute_doctors, get_weights

router = APIRouter(prefix="/api/recommendations", tags=["AI Recommendations"])

@router.get("/doctor")
def get_recommendations(
    target_phc_id: str,
    required_specialization: str = "General Medicine",
    db: Session = Depends(get_db)
):
    recommendations = recommend_substitute_doctors(
        target_phc_id=target_phc_id,
        required_specialization=required_specialization,
        db=db,
        top_n=5
    )
    weights = get_weights(db)
    target_phc = db.query(PHC).filter(PHC.id == target_phc_id).first()

    return {
        "target_phc": {
            "id": target_phc.id if target_phc else target_phc_id,
            "name": target_phc.name if target_phc else "Target PHC",
            "required_specialization": required_specialization
        },
        "weights": weights,
        "recommendations": recommendations,
        "total_candidates_analyzed": len(recommendations)
    }

@router.post("/approve")
def approve_substitute(payload: ApproveSubstituteRequest, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.id == payload.doctor_id).first()
    to_phc = db.query(PHC).filter(PHC.id == payload.to_phc_id).first()
    
    if not doctor or not to_phc:
        raise HTTPException(status_code=404, detail="Doctor or Target PHC not found")

    from_phc_id = doctor.current_phc_id
    from_phc = db.query(PHC).filter(PHC.id == from_phc_id).first()

    # Reassign doctor
    doctor.current_phc_id = to_phc.id
    doctor.is_temporarily_assigned = True
    doctor.assigned_from_phc_id = from_phc_id

    # Update PHC counts
    if from_phc:
        from_phc.doctors_on_duty = max(1, from_phc.doctors_on_duty - 1)
    
    to_phc.doctors_on_duty += 1
    to_phc.doctors_absent = max(0, to_phc.doctors_absent - 1)
    to_phc.patients_waiting = max(5, int(to_phc.patients_waiting * 0.75))  # Relieve queue by 25%
    to_phc.avg_waiting_time = max(10, int(to_phc.avg_waiting_time * 0.75))

    if to_phc.doctors_on_duty >= 2:
        to_phc.status = "moderate" if to_phc.doctors_on_duty == 2 else "normal"

    # Create assignment record
    assign_id = f"ASN-{int(datetime.utcnow().timestamp())}"
    assignment = Assignment(
        id=assign_id,
        doctor_id=doctor.id,
        doctor_name=doctor.name,
        from_phc_id=from_phc_id,
        to_phc_id=to_phc.id,
        score=payload.score,
        approved_by="Dr. K. Ramesh (DDHS Authority)",
        timestamp=datetime.utcnow().strftime("%I:%M %p"),
        status="active"
    )
    db.add(assignment)

    # Log action in audit trail
    db.add(AuditLog(
        id=f"AUD-{int(datetime.utcnow().timestamp())}",
        timestamp=datetime.utcnow().strftime("%I:%M %p"),
        user="Dr. K. Ramesh",
        role="ddhs",
        action="APPROVE_SUBSTITUTE",
        phc_id=to_phc.id,
        doctor_id=doctor.id,
        details=f"Approved re-allocation of {doctor.name} from {from_phc.name if from_phc else from_phc_id} to {to_phc.name} (AI Match: {payload.score}%)",
        score=payload.score
    ))

    # Add notification for the doctor and staff
    db.add(Notification(
        id=f"NOTIF-{int(datetime.utcnow().timestamp())}",
        type="assignment-approved",
        title="Substitute Deployed Successfully",
        message=f"{doctor.name} has been assigned to {to_phc.name} to cover duty.",
        phc_id=to_phc.id,
        doctor_id=doctor.id,
        time=datetime.utcnow().strftime("%I:%M %p"),
        read=False,
        severity="info"
    ))

    db.commit()
    return {
        "message": f"Successfully approved {doctor.name} re-allocation to {to_phc.name}",
        "assignment_id": assign_id,
        "new_target_status": to_phc.status,
        "new_waiting_count": to_phc.patients_waiting
    }

@router.get("/weights")
def get_ai_weights(db: Session = Depends(get_db)):
    return get_weights(db)

@router.post("/weights")
def update_ai_weights(payload: AIWeightsUpdate, db: Session = Depends(get_db)):
    total = payload.spec_weight + payload.dist_weight + payload.load_weight
    if round(total, 2) != 1.00:
        raise HTTPException(status_code=400, detail="The sum of weights must equal 1.0 (100%)")

    new_weights = AIWeights(
        spec_weight=payload.spec_weight,
        dist_weight=payload.dist_weight,
        load_weight=payload.load_weight
    )
    db.add(new_weights)
    db.commit()
    return {"message": "AI weights updated successfully", "weights": payload}
