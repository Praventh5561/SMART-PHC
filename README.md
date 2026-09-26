# Smart PHC
## AI-Based Doctor Recommendation & Dynamic Resource Allocation Framework

> **Final Year Engineering Project** | Centralized Primary Health Centre (PHC) Management System  
> **District:** Coimbatore, Tamil Nadu (6 Taluks, 30 PHCs, 90 Doctors)

---

## 🌟 Architecture & Features

- **Frontend:** Responsive React 18 SPA, Tailwind CSS, Lucide Icons, Chart.js Analytics
- **Backend:** **Python (FastAPI)** with asynchronous REST endpoints
- **Database:** SQLite with SQLAlchemy ORM (auto-seeded with full Coimbatore dataset)
- **AI Recommendation Engine:** Multi-criteria weighted scoring algorithm:
  $$\text{Score} = (W_{\text{spec}} \times \text{SpecScore}) + (W_{\text{dist}} \times \text{DistScore}) + (W_{\text{load}} \times \text{LoadScore})$$
- **Modules:**
  1. **DDHS Authority Dashboard:** District monitoring, absence alerts, AI doctor re-allocation
  2. **PHC Staff Dashboard:** Patient registration, QR generation, token queue management
  3. **Doctor Dashboard:** Real-time consultations, queue caller, patient history
  4. **Patient Portal:** Mobile-first digital token, live waiting estimation, prescription history
  5. **Admin Console:** AI weights configuration, RBAC user management, audit logs
  6. **Medicine Inventory:** First-Expired, First-Out (FEFO) batch tracking & stock alerts

---

## 🚀 How to Run

### 1. Start the FastAPI Backend
```bash
# Install dependencies
pip install -r backend/requirements.txt

# Run backend server
python run_backend.py
```
- **Backend API:** [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Docs (Viva Demo):** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Alternative Redoc Docs:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

### 2. Start the Frontend
```bash
python -m http.server 8080
```
- **Web App:** [http://localhost:8080](http://localhost:8080)

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| **DDHS Authority** | `ddhs@coimbatore.gov.in` | `Demo@1234` |
| **Doctor** | `dr.arun@phcsinganallur.gov.in` | `Demo@1234` |
| **PHC Staff** | `staff@phckuniyamuthur.gov.in` | `Demo@1234` |
| **Patient** | `patient@demo.in` | `Demo@1234` |
| **System Admin** | `admin@smartphc.gov.in` | `Demo@1234` |

---

## 📡 Key REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user & return JWT token |
| `GET` | `/api/phcs` | List all 30 PHCs with live statuses |
| `GET` | `/api/doctors` | List doctors & attendance states |
| `POST` | `/api/doctors/mark-absent` | Report doctor absence & trigger alerts |
| `GET` | `/api/recommendations/doctor` | AI recommendation ranking for substitute doctors |
| `POST` | `/api/recommendations/approve` | DDHS approval & dynamic re-allocation |
| `GET` | `/api/queue/{phc_id}` | Live token queue & waiting estimates |
| `POST` | `/api/queue/call-next` | Advance token queue |
| `GET` | `/api/medicines` | FEFO medicine stock tracking |
| `GET` | `/api/reports/summary` | Aggregate district healthcare KPIs |

---

## 📄 Academic Disclaimer
*Smart PHC is a decision-support prototype built for academic demonstration. Doctor recommendations are advisory and require authorized DDHS approval.*
