import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .seed_data import seed_database
from .routers import auth, phcs, doctors, recommendations, queue, medicines, patients, reports, audit

# Initialize database tables
Base.metadata.create_all(bind=engine)

# Seed database with initial Coimbatore dataset
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

app = FastAPI(
    title="Smart PHC REST API",
    description="Backend API for Smart PHC: AI-Based Doctor Recommendation & Dynamic Resource Allocation Framework (Coimbatore District, Tamil Nadu)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for all local development and GitHub Pages origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all API routers
app.include_router(auth.router)
app.include_router(phcs.router)
app.include_router(doctors.router)
app.include_router(recommendations.router)
app.include_router(queue.router)
app.include_router(medicines.router)
app.include_router(patients.router)
app.include_router(reports.router)
app.include_router(audit.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": "Smart PHC Backend API",
        "district": "Coimbatore, Tamil Nadu",
        "docs": "/docs",
        "redoc": "/redoc",
        "version": "1.0.0"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "Smart PHC FastAPI Service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
