from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from shared_dm import get_dm

router = APIRouter(prefix="/api/binc-ia", tags=["binc-ia"])


def require_auth(request: Request):
    if not request.session.get("user"):
        raise HTTPException(status_code=401, detail="Não autenticado")

class ChatPayload(BaseModel):
    message: str

@router.get("/suggestions")
async def suggestions(request: Request):
    require_auth(request)
    return get_dm().get_ia_suggestions()

@router.post("/chat")
async def chat(payload: ChatPayload, request: Request):
    require_auth(request)
    response = get_dm().answer_ia_query(payload.message)
    return {"response": response}