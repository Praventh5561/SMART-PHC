import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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

# Base project directory containing index.html, js, vendor
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

app = FastAPI(
    title="Smart PHC - AI Healthcare Management System",
    description="Unified Full-Stack App & REST API for Smart PHC (Coimbatore District, Tamil Nadu)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(auth.router)
app.include_router(phcs.router)
app.include_router(doctors.router)
app.include_router(recommendations.router)
app.include_router(queue.router)
app.include_router(medicines.router)
app.include_router(patients.router)
app.include_router(reports.router)
app.include_router(audit.router)

# Health check endpoint
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Smart PHC Unified Application",
        "version": "1.0.0"
    }

# Mount static asset folders for frontend
js_dir = os.path.join(ROOT_DIR, "js")
vendor_dir = os.path.join(ROOT_DIR, "vendor")

if os.path.exists(js_dir):
    app.mount("/js", StaticFiles(directory=js_dir), name="js")

if os.path.exists(vendor_dir):
    app.mount("/vendor", StaticFiles(directory=vendor_dir), name="vendor")

# Serve the merged frontend web application at root
@app.get("/")
async def serve_frontend():
    index_file = os.path.join(ROOT_DIR, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"message": "index.html not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
