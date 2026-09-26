import os
from datetime import datetime
from sqlalchemy.orm import Session
from .database import engine, Base, SessionLocal
from .models import User, PHC, Doctor, Patient, Medicine, Assignment, AuditLog, Notification, AIWeights

def seed_database(db: Session):
    # Only seed if users table is empty
    if db.query(User).first():
        print("[SmartPHC DB] Database already seeded.")
        return

    print("[SmartPHC DB] Seeding database with Coimbatore District PHC dataset...")

    # 1. Users
    demo_users = [
        User(id="DDHS001", email="ddhs@coimbatore.gov.in", name="Dr. K. Ramesh", password="Demo@1234", role="ddhs", phc_id=None),
        User(id="STF001", email="staff@phckuniyamuthur.gov.in", name="Nurse Lakshmi", password="Demo@1234", role="staff", phc_id="PHC001"),
        User(id="DOC001", email="dr.arun@phcsinganallur.gov.in", name="Dr. Arun Kumar", password="Demo@1234", role="doctor", phc_id="PHC002"),
        User(id="PAT001", email="patient@demo.in", name="Murugan R.", password="Demo@1234", role="patient", phc_id="PHC001"),
        User(id="ADM001", email="admin@smartphc.gov.in", name="Admin User", password="Demo@1234", role="admin", phc_id=None)
    ]
    db.add_all(demo_users)

    # 2. 30 PHCs across 6 Taluks of Coimbatore
    phc_info = [
        ("PHC001", "PHC Kuniyamuthur", "Coimbatore South", "Palakkad Main Road", 8.5, 3, 2, 1, 38, 35, "moderate", 1, 14, 48),
        ("PHC002", "PHC Singanallur", "Coimbatore South", "Trichy Road", 10.2, 3, 3, 0, 22, 18, "normal", 0, 21, 43),
        ("PHC003", "PHC Ganapathy", "Coimbatore North", "Sathy Road", 7.0, 3, 3, 0, 19, 15, "normal", 0, 18, 37),
        ("PHC004", "PHC Ondipudur", "Coimbatore South", "Trichy Highway", 12.0, 3, 1, 2, 65, 68, "critical", 3, 8, 73),
        ("PHC005", "PHC Kovaipudur", "Coimbatore South", "Ashram School Road", 14.5, 3, 3, 0, 25, 20, "normal", 0, 16, 41),
        ("PHC006", "PHC Peelamedu", "Coimbatore North", "Avinashi Road", 9.0, 3, 3, 0, 28, 22, "normal", 1, 25, 53),
        ("PHC007", "PHC Saravanampatti", "Coimbatore North", "Sathy Road", 15.0, 3, 3, 0, 31, 25, "normal", 0, 20, 51),
        ("PHC008", "PHC Kalapatti", "Coimbatore North", "Airport Road", 13.5, 3, 2, 1, 42, 38, "moderate", 2, 12, 54),
        ("PHC009", "PHC Sulur", "Coimbatore South", "Ranganathapuram", 24.0, 3, 1, 2, 72, 75, "critical", 4, 11, 83),
        ("PHC010", "PHC Thudiyalur", "Coimbatore North", "Mettupalayam Road", 11.5, 3, 3, 0, 20, 16, "normal", 0, 19, 39),
        ("PHC011", "PHC Pollachi Town", "Pollachi", "Palakkad Road", 42.0, 3, 3, 0, 29, 23, "normal", 0, 24, 53),
        ("PHC012", "PHC Anaimalai", "Pollachi", "Sethumadai Road", 48.0, 3, 2, 1, 45, 41, "moderate", 1, 15, 60),
        ("PHC013", "PHC Kinathukadavu Rural", "Pollachi", "Pollachi Highway", 32.0, 3, 3, 0, 18, 14, "normal", 0, 22, 40),
        ("PHC014", "PHC Negamam", "Pollachi", "Dharapuram Road", 46.0, 3, 3, 0, 21, 17, "normal", 0, 17, 38),
        ("PHC015", "PHC Samathur", "Pollachi", "Valparai Main Road", 44.0, 3, 3, 0, 16, 13, "normal", 0, 15, 31),
        ("PHC016", "PHC Valparai Town", "Valparai", "Main Bazaar", 64.0, 3, 2, 1, 35, 32, "moderate", 2, 10, 45),
        ("PHC017", "PHC Sholayar Nagar", "Valparai", "Dam Colony", 72.0, 3, 3, 0, 14, 11, "normal", 1, 12, 26),
        ("PHC018", "PHC Mudis", "Valparai", "Tea Estate Road", 68.0, 3, 1, 2, 62, 72, "critical", 3, 7, 69),
        ("PHC019", "PHC Cinchona", "Valparai", "Estate Junction", 70.0, 3, 3, 0, 12, 10, "normal", 0, 11, 23),
        ("PHC020", "PHC Rotikadai", "Valparai", "High Forest Road", 66.0, 3, 3, 0, 15, 12, "normal", 0, 14, 29),
        ("PHC021", "PHC Mettupalayam Town", "Mettupalayam", "Ooty Road", 36.0, 3, 3, 0, 27, 21, "normal", 0, 23, 50),
        ("PHC022", "PHC Sirumugai", "Mettupalayam", "Bhavani River Road", 40.0, 3, 2, 1, 39, 36, "moderate", 1, 13, 52),
        ("PHC023", "PHC Karamadai", "Mettupalayam", "Karamadai Town Centre", 48.0, 3, 3, 0, 17, 13, "normal", 0, 24, 41),
        ("PHC024", "PHC Annur", "Mettupalayam", "Annur Main Road", 45.0, 3, 3, 0, 21, 17, "normal", 0, 19, 40),
        ("PHC025", "PHC Chettipalayam", "Mettupalayam", "Chettipalayam Village", 52.0, 3, 2, 1, 40, 38, "moderate", 2, 13, 53),
        ("PHC026", "PHC Kinathukadavu", "Kinathukadavu", "Kinathukadavu Main Road", 30.0, 3, 3, 0, 24, 19, "normal", 0, 22, 46),
        ("PHC027", "PHC Madampatti", "Kinathukadavu", "Madampatti Village", 28.0, 3, 3, 0, 18, 14, "normal", 1, 17, 35),
        ("PHC028", "PHC Idigarai", "Kinathukadavu", "Idigarai Road", 32.0, 3, 2, 1, 36, 34, "moderate", 1, 15, 51),
        ("PHC029", "PHC Periyanaicken", "Kinathukadavu", "Periyanaickenpalayam Rd", 27.0, 3, 3, 0, 20, 16, "normal", 0, 21, 41),
        ("PHC030", "PHC Irugur", "Kinathukadavu", "Irugur Airport Road", 25.0, 3, 3, 0, 15, 12, "normal", 0, 18, 33)
    ]

    for p in phc_info:
        db.add(PHC(
            id=p[0], name=p[1], taluk=p[2], location=p[3], distance_from_hq=p[4],
            doctors_assigned=p[5], doctors_on_duty=p[6], doctors_absent=p[7],
            patients_waiting=p[8], avg_waiting_time=p[9], status=p[10],
            medicine_alerts=p[11], current_token=p[12], last_token=p[13]
        ))

    # 3. 90 Doctors (3 per PHC)
    doctor_names = [
        ("Dr. Raj Kumar", "General Medicine"), ("Dr. Arun Kumar", "General Medicine"), ("Dr. Priya S.", "Paediatrics"),
        ("Dr. Ravi M.", "General Medicine"), ("Dr. Kavya R.", "General Medicine"), ("Dr. Senthil K.", "AYUSH"),
        ("Dr. Meena T.", "Paediatrics"), ("Dr. Anand B.", "General Medicine"), ("Dr. Sumitha L.", "Dental"),
        ("Dr. Vignesh P.", "General Medicine"), ("Dr. Saranya K.", "Obstetrics & Gynaecology"), ("Dr. Karthik R.", "Paediatrics"),
        ("Dr. Latha M.", "General Medicine"), ("Dr. Gopal S.", "Dental"), ("Dr. Nithya V.", "AYUSH"),
        ("Dr. Suresh N.", "General Medicine"), ("Dr. Deepa R.", "Paediatrics"), ("Dr. Ramesh J.", "General Medicine"),
        ("Dr. Vanitha S.", "Obstetrics & Gynaecology"), ("Dr. Balan T.", "General Medicine"), ("Dr. Indira K.", "AYUSH"),
        ("Dr. Vijay A.", "General Medicine"), ("Dr. Parvathi M.", "Dental"), ("Dr. Chandran R.", "General Medicine"),
        ("Dr. Usha S.", "Paediatrics"), ("Dr. Mani K.", "General Medicine"), ("Dr. Selvi T.", "Obstetrics & Gynaecology"),
        ("Dr. Nathan B.", "General Medicine"), ("Dr. Malathy V.", "AYUSH"), ("Dr. Prasad R.", "Dental"),
        ("Dr. Geetha M.", "General Medicine"), ("Dr. Venkat S.", "Paediatrics"), ("Dr. Chitra K.", "General Medicine"),
        ("Dr. Ashok T.", "Obstetrics & Gynaecology"), ("Dr. Revathi N.", "General Medicine"), ("Dr. Kumar P.", "AYUSH"),
        ("Dr. Radha S.", "General Medicine"), ("Dr. Balaji K.", "Paediatrics"), ("Dr. Suganya M.", "General Medicine"),
        ("Dr. Prakash V.", "Dental"), ("Dr. Amala R.", "General Medicine"), ("Dr. Selvam T.", "Obstetrics & Gynaecology"),
        ("Dr. Krishnan S.", "General Medicine"), ("Dr. Dhivya K.", "Paediatrics"), ("Dr. Pandian M.", "AYUSH"),
        ("Dr. Yamini V.", "General Medicine"), ("Dr. Murugan T.", "General Medicine"), ("Dr. Rohini S.", "Dental"),
        ("Dr. Senthilnathan K.", "General Medicine"), ("Dr. Prema R.", "Paediatrics"), ("Dr. Thilaga M.", "Obstetrics & Gynaecology"),
        ("Dr. Annamalai T.", "General Medicine"), ("Dr. Kamala S.", "AYUSH"), ("Dr. Durai K.", "General Medicine"),
        ("Dr. Shanthi V.", "Paediatrics"), ("Dr. Ganesh R.", "General Medicine"), ("Dr. Ponmani S.", "Dental"),
        ("Dr. Lakshmi T.", "General Medicine"), ("Dr. Arjun K.", "Obstetrics & Gynaecology"), ("Dr. Malarvizhi N.", "General Medicine"),
        ("Dr. Santhosh P.", "AYUSH"), ("Dr. Eswari M.", "Paediatrics"), ("Dr. Baskaran R.", "General Medicine"),
        ("Dr. Kavitha S.", "General Medicine"), ("Dr. Sugumar K.", "Dental"), ("Dr. Dharani T.", "Obstetrics & Gynaecology"),
        ("Dr. Palani M.", "General Medicine"), ("Dr. Subha V.", "Paediatrics"), ("Dr. Raman S.", "AYUSH"),
        ("Dr. Devika K.", "General Medicine"), ("Dr. Arumugam T.", "General Medicine"), ("Dr. Sangeetha N.", "Dental"),
        ("Dr. Moorthy R.", "General Medicine"), ("Dr. Hema S.", "Obstetrics & Gynaecology"), ("Dr. Shankar K.", "General Medicine"),
        ("Dr. Pooja T.", "Paediatrics"), ("Dr. Babu M.", "AYUSH"), ("Dr. Sarathi R.", "General Medicine"),
        ("Dr. Gowri S.", "General Medicine"), ("Dr. Rajkumar K.", "Paediatrics"), ("Dr. Nirmala T.", "Dental"),
        ("Dr. Subramanian M.", "General Medicine"), ("Dr. Mythili S.", "Obstetrics & Gynaecology"), ("Dr. Marimuthu K.", "General Medicine"),
        ("Dr. Sindhu R.", "AYUSH"), ("Dr. Jayaraman T.", "General Medicine"), ("Dr. Poorani S.", "Paediatrics"),
        ("Dr. Ezhil M.", "General Medicine"), ("Dr. Vani K.", "Obstetrics & Gynaecology"), ("Dr. Tamizh S.", "Dental")
    ]

    absent_indices = [0, 8, 17, 26, 35, 44, 53, 62, 71, 80]
    leave_indices = [8, 44, 80]
    delayed_indices = [26, 62]

    for i in range(90):
        phc_id = f"PHC{str((i // 3) + 1).zfill(3)}"
        st = "absent" if i in absent_indices else "available"
        if i in leave_indices:
            st = "on-leave"
        elif i in delayed_indices:
            st = "delayed"

        hr = 8 + (i // 30)
        mn = str((i * 7) % 60).zfill(2)
        check_in = f"{hr}:{mn} AM" if st in ["available", "delayed"] else None
        leave_r = "Personal Leave" if st == "on-leave" else ("Not reported" if st == "absent" else None)
        served = 5 + (i % 18) if st == "available" else 0

        doc_name = doctor_names[i][0]
        specialization = doctor_names[i][1]

        # Specific demo anchor doctors
        if i == 0:
            doc_name = "Dr. Raj Kumar"
            specialization = "General Medicine"
            st = "absent"
            leave_r = "Leave"
        elif i == 1:
            doc_name = "Dr. Arun Kumar"
            specialization = "General Medicine"
            st = "available"
            check_in = "08:42 AM"
            served = 12

        db.add(Doctor(
            id=f"DOC{str(i+1).zfill(3)}",
            name=doc_name,
            specialization=specialization,
            home_phc_id=phc_id,
            current_phc_id=phc_id,
            phone=f"98{str(4000000 + i * 7654)[-8:]}",
            email=f"{doc_name.lower().replace(' ', '').replace('.', '')}@phc.gov.in",
            status=st,
            check_in_time=check_in,
            leave_reason=leave_r,
            patients_served_today=served,
            avg_consultation_time=8 + (i % 8),
            is_temporarily_assigned=False,
            assigned_from_phc_id=None
        ))

    # 4. Medicines (6 per PHC = 180 total)
    med_catalog = [
        ("Paracetamol 500mg", "Analgesic", 450, 100),
        ("Amoxicillin 250mg", "Antibiotic", 280, 80),
        ("Metformin 500mg", "Antidiabetic", 520, 120),
        ("Amlodipine 5mg", "Antihypertensive", 310, 80),
        ("Omeprazole 20mg", "Antacid", 240, 60),
        ("Cetirizine 10mg", "Antihistamine", 380, 70),
        ("ORS Sachet", "Essential", 600, 150),
        ("Iron & Folic Acid", "Supplements", 800, 200),
        ("Salbutamol Inhaler", "Respiratory", 45, 30),
        ("Atorvastatin 10mg", "Cardiovascular", 190, 50)
    ]

    for p_idx in range(1, 31):
        phc_id = f"PHC{str(p_idx).zfill(3)}"
        for m_idx in range(6):
            med_meta = med_catalog[(p_idx + m_idx) % len(med_catalog)]
            qty = med_meta[2]
            st = "available"

            # Inject simulated alerts
            if p_idx in [4, 9, 18] and m_idx in [1, 2]:
                qty = 0
                st = "out-of-stock"
            elif p_idx in [1, 8, 12, 25] and m_idx == 0:
                qty = 25
                st = "low-stock"

            db.add(Medicine(
                id=f"MED{str((p_idx-1)*6 + m_idx + 1).zfill(3)}",
                name=med_meta[0],
                category=med_meta[1],
                batch_id=f"BCH-2026-{(p_idx*7 + m_idx):03d}",
                quantity=qty,
                min_stock=med_meta[3],
                expiry_date="2027-08-15" if st != "near-expiry" else "2026-10-10",
                phc_id=phc_id,
                status=st
            ))

    # 5. Default AI Weights
    db.add(AIWeights(spec_weight=0.40, dist_weight=0.30, load_weight=0.30))

    # 6. Initial Active Assignment & Notifications
    db.add(Assignment(
        id="ASN001",
        doctor_id="DOC003",
        doctor_name="Dr. Priya S.",
        from_phc_id="PHC003",
        to_phc_id="PHC004",
        score=94.5,
        approved_by="Dr. K. Ramesh (DDHS)",
        timestamp="09:15 AM",
        status="active"
    ))

    db.add(Notification(
        id="NOTIF001",
        type="doctor-absence",
        title="Doctor Absence Alert",
        message="Dr. Raj Kumar (General Medicine) absent at PHC Kuniyamuthur. Coverage required.",
        phc_id="PHC001",
        doctor_id="DOC001",
        time="08:45 AM",
        read=False,
        severity="critical"
    ))

    db.add(Notification(
        id="NOTIF002",
        type="queue-alert",
        title="High Patient Wait Time",
        message="PHC Ondipudur wait time exceeds 65 mins. AI recommended substitute deployment.",
        phc_id="PHC004",
        doctor_id=None,
        time="09:00 AM",
        read=False,
        severity="warning"
    ))

    db.commit()
    print("[SmartPHC DB] Seeding completed successfully.")
