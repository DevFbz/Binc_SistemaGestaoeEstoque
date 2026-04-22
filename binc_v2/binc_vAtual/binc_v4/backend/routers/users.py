from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Optional
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from shared_dm import get_dm

router = APIRouter(prefix="/api", tags=["users"])


def require_admin(request: Request):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Não autenticado")
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Apenas administradores")

class UserPayload(BaseModel):
    username: str
    password: str
    name: str
    role: str = "operator"
    active: Optional[bool] = True

@router.get("/users")
async def list_users(request: Request):
    require_admin(request)
    users = get_dm().get_users()
    return [{k: v for k, v in u.items() if k != "password"} for u in users]

@router.post("/users")
async def create_user(payload: UserPayload, request: Request):
    require_admin(request)
    ok, msg = get_dm().add_user(payload.dict())
    if not ok:
        raise HTTPException(status_code=400, detail=msg)
    return {"ok": True, "message": msg}

@router.put("/users/{user_id}")
async def update_user(user_id: str, payload: UserPayload, request: Request):
    require_admin(request)
    data = payload.dict()
    data["id"] = user_id
    get_dm().update_user(user_id, data)
    return {"ok": True}

@router.delete("/users/{user_id}")
async def delete_user(user_id: str, request: Request):
    require_admin(request)
    ok, msg = get_dm().delete_user(user_id)
    if not ok:
        raise HTTPException(status_code=400, detail=msg)
    return {"ok": True}

@router.patch("/users/{user_id}/toggle")
async def toggle_user(user_id: str, request: Request):
    require_admin(request)
    get_dm().toggle_user_active(user_id)
    return {"ok": True}