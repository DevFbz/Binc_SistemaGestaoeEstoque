from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Optional
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from shared_dm import get_dm

router = APIRouter(prefix="/api/caixa", tags=["caixa"])


def require_auth(request: Request):
    if not request.session.get("user"):
        raise HTTPException(status_code=401, detail="Não autenticado")

class AbrirCaixaPayload(BaseModel):
    valor_inicial: float
    operador: str

class FecharCaixaPayload(BaseModel):
    valor_contado: float
    operador: str

@router.get("/status")
async def caixa_status(request: Request):
    require_auth(request)
    return get_dm().get_caixa()

@router.post("/abrir")
async def abrir(payload: AbrirCaixaPayload, request: Request):
    require_auth(request)
    ok, msg = get_dm().abrir_caixa(payload.valor_inicial, payload.operador)
    if not ok:
        raise HTTPException(status_code=400, detail=msg)
    return {"ok": True, "message": msg}

@router.post("/fechar")
async def fechar(payload: FecharCaixaPayload, request: Request):
    require_auth(request)
    ok, msg, resumo = get_dm().fechar_caixa(payload.valor_contado, payload.operador)
    if not ok:
        raise HTTPException(status_code=400, detail=msg)
    return {"ok": True, "message": msg, "resumo": resumo}