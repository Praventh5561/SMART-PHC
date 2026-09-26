import os
import sys
import uvicorn

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, base_dir)
    print("=" * 60)
    print("   [+] SMART PHC - FASTAPI BACKEND SERVER")
    print("   AI Doctor Recommendation & Dynamic Resource Allocation")
    print("=" * 60)
    print("   * Server:       http://localhost:8000")
    print("   * Swagger Docs: http://localhost:8000/docs")
    print("   * Redoc:        http://localhost:8000/redoc")
    print("=" * 60)
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=False)
