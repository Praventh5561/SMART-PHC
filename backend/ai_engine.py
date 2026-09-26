import math
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from .models import Doctor, PHC, AIWeights

def get_weights(db: Session) -> Dict[str, float]:
    weights = db.query(AIWeights).order_by(AIWeights.id.desc()).first()
    if not weights:
        return {"spec": 0.40, "dist": 0.30, "load": 0.30}
    return {
        "spec": weights.spec_weight,
        "dist": weights.dist_weight,
        "load": weights.load_weight
    }

def calculate_distance(phc1: PHC, phc2: PHC) -> float:
    # Use relative distance from HQ and taluk proximity
    if phc1.id == phc2.id:
        return 0.0
    base_dist = abs(phc1.distance_from_hq - phc2.distance_from_hq)
    if phc1.taluk == phc2.taluk:
        return max(3.5, round(base_dist * 0.7 + 2.0, 1))
    return max(6.0, round(base_dist + 5.0, 1))

def recommend_substitute_doctors(
    target_phc_id: str,
    required_specialization: str,
    db: Session,
    top_n: int = 5
) -> List[Dict[str, Any]]:
    target_phc = db.query(PHC).filter(PHC.id == target_phc_id).first()
    if not target_phc:
        return []

    weights = get_weights(db)
    
    # Candidate pool: doctors who are available and not at target PHC, not temporarily assigned
    candidates = db.query(Doctor).filter(
        Doctor.current_phc_id != target_phc_id,
        Doctor.status == "available",
        Doctor.is_temporarily_assigned == False
    ).all()

    phc_map = {p.id: p for p in db.query(PHC).all()}

    scored_candidates = []
    for doc in candidates:
        home_phc = phc_map.get(doc.home_phc_id)
        if not home_phc:
            continue

        # 1. Specialization Match Score (0.0 to 1.0)
        if doc.specialization.lower() == required_specialization.lower():
            spec_score = 1.0
        elif required_specialization.lower() == "general medicine" and doc.specialization.lower() in ["ayush", "paediatrics"]:
            spec_score = 0.5
        elif doc.specialization.lower() == "general medicine":
            spec_score = 0.7
        else:
            spec_score = 0.1

        # 2. Distance Score (0.0 to 1.0, lower distance = higher score)
        distance_km = calculate_distance(home_phc, target_phc)
        dist_score = max(0.0, min(1.0, 1.0 - (distance_km / 50.0)))

        # 3. Workload Score (0.0 to 1.0, lower patients served = higher score)
        patients_served = doc.patients_served_today or 0
        load_score = max(0.0, min(1.0, 1.0 - (patients_served / 35.0)))

        # Weighted Total Score
        total_score = (
            weights["spec"] * spec_score +
            weights["dist"] * dist_score +
            weights["load"] * load_score
        )
        total_score_pct = round(total_score * 100, 1)

        scored_candidates.append({
            "doctor_id": doc.id,
            "doctor_name": doc.name,
            "specialization": doc.specialization,
            "home_phc_id": doc.home_phc_id,
            "home_phc_name": home_phc.name,
            "distance_km": distance_km,
            "patients_served_today": patients_served,
            "score": total_score_pct,
            "spec_score": round(spec_score * 100, 1),
            "dist_score": round(dist_score * 100, 1),
            "load_score": round(load_score * 100, 1),
            "status": doc.status
        })

    # Sort descending by composite score
    scored_candidates.sort(key=lambda x: x["score"], reverse=True)

    # Assign rank
    for idx, cand in enumerate(scored_candidates[:top_n]):
        cand["rank"] = idx + 1

    return scored_candidates[:top_n]
