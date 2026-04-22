from fastapi import APIRouter, Request, HTTPException
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from shared_dm import get_dm

router = APIRouter(prefix="/api", tags=["dashboard"])

def require_auth(request: Request):
    if not request.session.get("user"):
        raise HTTPException(status_code=401, detail="Não autenticado")

@router.get("/dashboard")
async def dashboard(request: Request):
    require_auth(request)
    return get_dm().get_dashboard_data()