from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Optional
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from shared_dm import get_dm

router = APIRouter(prefix="/api", tags=["settings"])


def require_auth(request: Request):
    if not request.session.get("user"):
        raise HTTPException(status_code=401, detail="Não autenticado")

@router.get("/settings")
async def get_settings(request: Request):
    require_auth(request)
    return get_dm().get_settings()

@router.put("/settings")
async def update_settings(request: Request):
    require_auth(request)
    body = await request.json()
    get_dm().save_settings(body)
    return {"ok": True}

@router.get("/empresa")
async def get_empresa(request: Request):
    require_auth(request)
    return get_dm().get_empresa()

@router.put("/empresa")
async def update_empresa(request: Request):
    require_auth(request)
    body = await request.json()
    get_dm().save_empresa(body)
    return {"ok": True}

@router.get("/nfce")
async def get_nfce(request: Request):
    require_auth(request)
    return get_dm().get_nfce()

@router.put("/nfce")
async def update_nfce(request: Request):
    require_auth(request)
    body = await request.json()
    get_dm().save_nfce(body)
    return {"ok": True}