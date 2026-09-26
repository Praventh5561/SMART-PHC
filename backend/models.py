from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # 'ddhs', 'doctor', 'staff', 'patient', 'admin'
    phc_id = Column(String, nullable=True)

class PHC(Base):
    __tablename__ = "phcs"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    taluk = Column(String, nullable=False)
    location = Column(String, nullable=False)
    distance_from_hq = Column(Float, default=10.0)
    doctors_assigned = Column(Integer, default=3)
    doctors_on_duty = Column(Integer, default=3)
    doctors_absent = Column(Integer, default=0)
    patients_waiting = Column(Integer, default=0)
    avg_waiting_time = Column(Integer, default=15)
    status = Column(String, default="normal")  # 'normal', 'moderate', 'critical'
    medicine_alerts = Column(Integer, default=0)
    current_token = Column(Integer, default=1)
    last_token = Column(Integer, default=1)

class Doctor(Base):
    __tablename__ = "doctors"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    specialization = Column(String, nullable=False)
    home_phc_id = Column(String, nullable=False)
    current_phc_id = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    status = Column(String, default="available")  # 'available', 'absent', 'on-leave', 'delayed'
    check_in_time = Column(String, nullable=True)
    leave_reason = Column(String, nullable=True)
    patients_served_today = Column(Integer, default=0)
    avg_consultation_time = Column(Integer, default=10)
    is_temporarily_assigned = Column(Boolean, default=False)
    assigned_from_phc_id = Column(String, nullable=True)

class Patient(Base):
    __tablename__ = "patients"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    dob = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    village = Column(String, nullable=True)
    emergency_contact = Column(String, nullable=True)
    registered_phc_id = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Medicine(Base):
    __tablename__ = "medicines"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    batch_id = Column(String, nullable=False)
    quantity = Column(Integer, default=0)
    min_stock = Column(Integer, default=50)
    expiry_date = Column(String, nullable=False)
    phc_id = Column(String, nullable=False)
    status = Column(String, default="available")  # 'available', 'low-stock', 'out-of-stock', 'near-expiry', 'expired'

class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(String, primary_key=True, index=True)
    doctor_id = Column(String, nullable=False)
    doctor_name = Column(String, nullable=False)
    from_phc_id = Column(String, nullable=False)
    to_phc_id = Column(String, nullable=False)
    score = Column(Float, default=0.0)
    approved_by = Column(String, nullable=False)
    timestamp = Column(String, nullable=False)
    status = Column(String, default="active")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(String, primary_key=True, index=True)
    timestamp = Column(String, nullable=False)
    user = Column(String, nullable=False)
    role = Column(String, nullable=False)
    action = Column(String, nullable=False)
    phc_id = Column(String, nullable=True)
    doctor_id = Column(String, nullable=True)
    details = Column(Text, nullable=True)
    score = Column(Float, nullable=True)

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(String, primary_key=True, index=True)
    type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    phc_id = Column(String, nullable=True)
    doctor_id = Column(String, nullable=True)
    time = Column(String, nullable=False)
    read = Column(Boolean, default=False)
    severity = Column(String, default="info")  # 'info', 'warning', 'critical'

class AIWeights(Base):
    __tablename__ = "ai_weights"
    id = Column(Integer, primary_key=True, autoincrement=True)
    spec_weight = Column(Float, default=0.40)
    dist_weight = Column(Float, default=0.30)
    load_weight = Column(Float, default=0.30)
    updated_at = Column(DateTime, default=datetime.utcnow)
