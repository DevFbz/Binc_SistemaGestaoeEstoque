from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Optional
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from shared_dm import get_dm

router = APIRouter(prefix="/api", tags=["faltas"])


def require_auth(request: Request):
    if not request.session.get("user"):
        raise HTTPException(status_code=401, detail="Não autenticado")

class FaltaPayload(BaseModel):
    name: str
    category: Optional[str] = "Outros"
    brand: Optional[str] = ""
    unit: Optional[str] = "UN"
    quantity_needed: Optional[int] = 1
    estimated_price: Optional[float] = 0.0
    notes: Optional[str] = ""

class FaltaToStockPayload(BaseModel):
    name: str
    category: Optional[str] = "Outros"
    brand: Optional[str] = ""
    unit: Optional[str] = "UN"
    cost_price: Optional[float] = 0.0
    sale_price: Optional[float] = 0.0
    stock: Optional[int] = 1
    min_stock: Optional[int] = 5
    code: Optional[str] = ""

@router.get("/faltas")
async def list_faltas(request: Request):
    require_auth(request)
    return get_dm().get_faltas()

@router.post("/faltas")
async def create_falta(payload: FaltaPayload, request: Request):
    require_auth(request)
    return get_dm().add_falta(payload.dict())

@router.put("/faltas/{falta_id}")
async def update_falta(falta_id: str, payload: FaltaPayload, request: Request):
    require_auth(request)
    get_dm().update_falta(falta_id, payload.dict())
    return {"ok": True}

@router.delete("/faltas/{falta_id}")
async def delete_falta(falta_id: str, request: Request):
    require_auth(request)
    get_dm().delete_falta(falta_id)
    return {"ok": True}

@router.post("/faltas/{falta_id}/to-stock")
async def falta_to_stock(falta_id: str, payload: FaltaToStockPayload, request: Request):
    require_auth(request)
    product = get_dm().falta_to_stock(falta_id, payload.dict())
    if not product:
        raise HTTPException(status_code=404, detail="Falta não encontrada")
    return product