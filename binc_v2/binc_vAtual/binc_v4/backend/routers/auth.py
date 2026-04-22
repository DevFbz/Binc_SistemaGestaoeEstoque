from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from shared_dm import get_dm
from data_manager import is_activated, activate_machine, verify_pin

router = APIRouter(tags=["auth"])

class LoginPayload(BaseModel):
    username: str
    password: str
    pin: str = ""

@router.post("/login")
async def login(payload: LoginPayload, request: Request):
    dm = get_dm()
    # PIN check on first use
    if not is_activated():
        if not payload.pin:
            raise HTTPException(status_code=403, detail="PIN de ativação necessário")
        if not verify_pin(payload.pin):
            raise HTTPException(status_code=403, detail="PIN incorreto")

    user = dm.authenticate(payload.username, payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="Usuário ou senha incorretos")

    # Activate if PIN was provided and correct
    if payload.pin and not is_activated():
        activate_machine()

    # Store in session (exclude password)
    session_user = {k: v for k, v in user.items() if k != "password"}
    request.session["user"] = session_user
    return {"user": session_user, "needs_pin": False}

@router.post("/logout")
async def logout(request: Request):
    request.session.clear()
    return {"ok": True}

@router.get("/api/me")
async def me(request: Request):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Não autenticado")
    needs_pin = not is_activated()
    return {"user": user, "needs_pin": needs_pin}

@router.get("/api/check-activation")
async def check_activation():
    return {"activated": is_activated()}