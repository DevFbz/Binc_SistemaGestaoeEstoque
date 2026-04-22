from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Optional
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from shared_dm import get_dm

router = APIRouter(prefix="/api", tags=["returns"])


def require_auth(request: Request):
    if not request.session.get("user"):
        raise HTTPException(status_code=401, detail="Não autenticado")

class TrocaPayload(BaseModel):
    product_id: str
    product_name: str
    product_code: Optional[str] = ""
    quantity: int
    motivo: str
    sale_id: Optional[str] = None
    customer_name: Optional[str] = ""
    unit_price: Optional[float] = 0.0

class TrocaStatusPayload(BaseModel):
    status: str

@router.get("/trocas")
async def list_trocas(request: Request):
    require_auth(request)
    return get_dm().get_trocas()

@router.post("/trocas")
async def create_troca(payload: TrocaPayload, request: Request):
    require_auth(request)
    return get_dm().add_troca(payload.dict())

@router.put("/trocas/{troca_id}")
async def update_troca(troca_id: str, payload: TrocaStatusPayload, request: Request):
    require_auth(request)
    get_dm().update_troca(troca_id, payload.status)
    return {"ok": True}

@router.delete("/trocas/{troca_id}")
async def delete_troca(troca_id: str, request: Request):
    require_auth(request)
    get_dm().delete_troca(troca_id)
    return {"ok": True}