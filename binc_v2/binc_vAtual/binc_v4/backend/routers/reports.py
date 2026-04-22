from fastapi import APIRouter, Request, HTTPException
from typing import Optional
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from shared_dm import get_dm

router = APIRouter(prefix="/api", tags=["reports"])


def require_auth(request: Request):
    if not request.session.get("user"):
        raise HTTPException(status_code=401, detail="Não autenticado")

@router.get("/reports/summary")
async def report_summary(
    request: Request,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
):
    require_auth(request)
    return get_dm().get_report_summary(start_date, end_date)