from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import PHC, Doctor, Medicine, Assignment, AuditLog, Notification

router = APIRouter(prefix="/api/reports", tags=["Reports & District Analytics"])

@router.get("/summary")
def get_district_summary(db: Session = Depends(get_db)):
    total_phcs = db.query(PHC).count()
    critical_phcs = db.query(PHC).filter(PHC.status == "critical").count()
    moderate_phcs = db.query(PHC).filter(PHC.status == "moderate").count()
    normal_phcs = db.query(PHC).filter(PHC.status == "normal").count()

    total_doctors = db.query(Doctor).count()
    doctors_on_duty = db.query(Doctor).filter(Doctor.status == "available").count()
    doctors_absent = db.query(Doctor).filter(Doctor.status.in_(["absent", "on-leave"])).count()

    total_waiting = db.query(func.sum(PHC.patients_waiting)).scalar() or 0
    active_assignments = db.query(Assignment).filter(Assignment.status == "active").count()
    medicine_alerts = db.query(Medicine).filter(Medicine.status.in_(["low-stock", "out-of-stock"])).count()

    # Specialization distribution
    spec_counts = db.query(Doctor.specialization, func.count(Doctor.id)).group_by(Doctor.specialization).all()

    # Taluk breakdown
    taluk_counts = db.query(
        PHC.taluk,
        func.count(PHC.id),
        func.sum(PHC.patients_waiting)
    ).group_by(PHC.taluk).all()

    return {
        "kpis": {
            "total_phcs": total_phcs,
            "critical_phcs": critical_phcs,
            "moderate_phcs": moderate_phcs,
            "normal_phcs": normal_phcs,
            "total_doctors": total_doctors,
            "doctors_on_duty": doctors_on_duty,
            "doctors_absent": doctors_absent,
            "total_patients_waiting": total_waiting,
            "active_assignments": active_assignments,
            "medicine_alerts": medicine_alerts
        },
        "specializations": [{"specialization": s[0], "count": s[1]} for s in spec_counts],
        "taluks": [{"taluk": t[0], "phcs_count": t[1], "patients_waiting": t[2] or 0} for t in taluk_counts]
    }
