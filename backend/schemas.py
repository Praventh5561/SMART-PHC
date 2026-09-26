from pydantic import BaseModel, Field
from typing import Optional, List

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

class PHCResponse(BaseModel):
    id: str
    name: str
    taluk: str
    location: str
    distance_from_hq: float
    doctors_assigned: int
    doctors_on_duty: int
    doctors_absent: int
    patients_waiting: int
    avg_waiting_time: int
    status: str
    medicine_alerts: int
    currentToken: int = Field(alias="current_token")
    lastToken: int = Field(alias="last_token")

    class Config:
        populate_by_name = True
        from_attributes = True

class DoctorResponse(BaseModel):
    id: str
    name: str
    specialization: str
    home_phc_id: str
    current_phc_id: str
    phone: Optional[str]
    email: Optional[str]
    status: str
    check_in_time: Optional[str]
    leave_reason: Optional[str]
    patients_served_today: int
    avg_consultation_time: int
    is_temporarily_assigned: bool
    assigned_from_phc_id: Optional[str]

    class Config:
        from_attributes = True

class MarkAbsentRequest(BaseModel):
    doctor_id: str
    reason: str = "Personal Leave"

class AttendanceActionRequest(BaseModel):
    doctor_id: str

class RecommendationCandidate(BaseModel):
    rank: int
    doctor_id: str
    doctor_name: str
    specialization: str
    home_phc_id: str
    home_phc_name: str
    distance_km: float
    patients_served_today: int
    score: float
    spec_score: float
    dist_score: float
    load_score: float
    status: str

class ApproveSubstituteRequest(BaseModel):
    doctor_id: str
    to_phc_id: str
    score: float

class PatientRegisterRequest(BaseModel):
    name: str
    dob: Optional[str] = None
    gender: Optional[str] = "Other"
    phone: Optional[str] = None
    village: Optional[str] = None
    emergency_contact: Optional[str] = None
    registered_phc_id: str

class CallNextRequest(BaseModel):
    phc_id: str

class UpdateStockRequest(BaseModel):
    medicine_id: str
    quantity_delta: int

class IssueMedicineRequest(BaseModel):
    medicine_id: str
    quantity: int
    patient_id: Optional[str] = None

class AIWeightsUpdate(BaseModel):
    spec_weight: float
    dist_weight: float
    load_weight: float
