from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Optional
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from shared_dm import get_dm

router = APIRouter(prefix="/api", tags=["customers"])


def require_auth(request: Request):
    if not request.session.get("user"):
        raise HTTPException(status_code=401, detail="Não autenticado")

class CustomerPayload(BaseModel):
    name: str
    cpf_cnpj: Optional[str] = ""
    phone: Optional[str] = ""
    email: Optional[str] = ""
    address: Optional[str] = ""
    veiculo: Optional[str] = ""
    placa: Optional[str] = ""

@router.get("/customers")
async def list_customers(request: Request, q: Optional[str] = None):
    require_auth(request)
    customers = get_dm().get_customers()
    if q:
        q = q.lower()
        customers = [c for c in customers
                     if q in c.get("name", "").lower()
                     or q in c.get("phone", "").lower()
                     or q in c.get("placa", "").lower()]
    return customers

@router.get("/customers/{customer_id}")
async def get_customer(customer_id: str, request: Request):
    require_auth(request)
    c = get_dm().get_customer_by_id(customer_id)
    if not c:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    return c

@router.post("/customers")
async def create_customer(payload: CustomerPayload, request: Request):
    require_auth(request)
    return get_dm().add_customer(payload.dict())

@router.put("/customers/{customer_id}")
async def update_customer(customer_id: str, payload: CustomerPayload, request: Request):
    require_auth(request)
    data = payload.dict()
    data["id"] = customer_id
    get_dm().update_customer(customer_id, data)
    return {"ok": True}

@router.delete("/customers/{customer_id}")
async def delete_customer(customer_id: str, request: Request):
    require_auth(request)
    get_dm().delete_customer(customer_id)
    return {"ok": True}

@router.get("/customers/{customer_id}/history")
async def customer_history(customer_id: str, request: Request):
    require_auth(request)
    dm = get_dm()
    c = dm.get_customer_by_id(customer_id)
    if not c:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    sales = [s for s in dm.get_sales() if s.get("customer_id") == customer_id]
    total = sum(s.get("total", 0) for s in sales if s.get("status") != "cancelada")
    return {"customer": c, "sales": sales, "total_spent": total}