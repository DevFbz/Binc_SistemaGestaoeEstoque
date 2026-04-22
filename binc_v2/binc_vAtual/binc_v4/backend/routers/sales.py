from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from shared_dm import get_dm
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
import datetime

router = APIRouter(prefix="/api", tags=["sales"])

def require_auth(request: Request):
    if not request.session.get("user"):
        raise HTTPException(status_code=401, detail="Não autenticado")

class SaleItem(BaseModel):
    product_id: str
    name: str
    code: Optional[str] = ""
    unit: Optional[str] = "UN"
    quantity: float
    unit_price: float
    discount: Optional[float] = 0.0

class SalePayload(BaseModel):
    customer_id: Optional[str] = None
    customer_name: Optional[str] = "Consumidor Final"
    customer_phone: Optional[str] = None
    items: List[SaleItem]
    subtotal: float
    discount_pct: Optional[float] = 0.0
    discount_value: Optional[float] = 0.0
    total: float
    payment_method: str
    cash_received: Optional[float] = None
    observations: Optional[str] = ""

class SaleUpdatePayload(BaseModel):
    payment_method: Optional[str] = None
    observations: Optional[str] = None
    customer_id: Optional[str] = None
    customer_name: Optional[str] = None
    cash_received: Optional[float] = None

class CancelItemPayload(BaseModel):
    send_to_trocas: Optional[bool] = True
    quantity: Optional[float] = None

@router.get("/sales")
async def list_sales(
    request: Request,
    q: Optional[str] = None,
    status: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    limit: int = 100,
):
    require_auth(request)
    dm = get_dm()
    sales = dm.get_sales()
    if status:
        sales = [s for s in sales if s.get("status") == status]
    if start_date:
        sales = [s for s in sales if s.get("date", "") >= start_date]
    if end_date:
        sales = [s for s in sales if s.get("date", "") <= end_date + "T23:59:59"]
    if q:
        q_l = q.lower()
        sales = [s for s in sales
                 if q_l in s.get("customer_name", "").lower()
                 or any(q_l in it.get("name", "").lower() for it in s.get("items", []))]
    sales = sorted(sales, key=lambda s: s.get("date", ""), reverse=True)
    return sales[:limit]

@router.get("/sales/{sale_id}")
async def get_sale(sale_id: str, request: Request):
    require_auth(request)
    s = get_dm().get_sale_by_id(sale_id)
    if not s:
        raise HTTPException(status_code=404, detail="Venda não encontrada")
    return s

def generate_receipt_pdf(sale, nf_cfg):
    if getattr(sys, "frozen", False):
        base_path = os.path.dirname(sys.executable)
    else:
        base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    notas_dir = os.path.join(base_path, "Notas_Fiscais")
    os.makedirs(notas_dir, exist_ok=True)
    
    file_name = f"Nota_{sale['id'][:8]}.pdf"
    file_path = os.path.join(notas_dir, file_name)
    
    c = canvas.Canvas(file_path, pagesize=(80*mm, 200*mm))
    c.setFont("Helvetica-Bold", 12)
    c.drawCentredString(40*mm, 190*mm, nf_cfg.get("nome_loja", "Loja"))
    
    c.setFont("Helvetica", 10)
    c.drawCentredString(40*mm, 185*mm, nf_cfg.get("slogan", ""))
    
    y = 175*mm
    c.setFont("Helvetica", 8)
    # sale['date'] is isoformat string
    date_str = sale.get('date', '')[:16].replace('T', ' ')
    c.drawString(5*mm, y, f"Data: {date_str}")
    y -= 5*mm
    c.drawString(5*mm, y, f"Cliente: {sale.get('customer_name', 'Consumidor Final')}")
    y -= 10*mm
    
    c.drawString(5*mm, y, "-"*50)
    y -= 5*mm
    
    for it in sale.get("items", []):
        if it.get("cancelled"): continue
        c.drawString(5*mm, y, f"{it['name']}")
        y -= 4*mm
        val = it['quantity'] * it['unit_price'] * (1 - it.get('discount', 0)/100)
        c.drawString(10*mm, y, f"{it['quantity']} {it.get('unit', 'UN')} x R$ {it['unit_price']:.2f} = R$ {val:.2f}")
        y -= 6*mm
        
        if y < 20*mm:
            c.showPage()
            c.setFont("Helvetica", 8)
            y = 190*mm
            
    c.drawString(5*mm, y, "-"*50)
    y -= 6*mm
    
    c.setFont("Helvetica-Bold", 10)
    c.drawString(5*mm, y, f"TOTAL: R$ {sale.get('total', 0):.2f}")
    y -= 6*mm
    c.setFont("Helvetica", 8)
    c.drawString(5*mm, y, f"Pagamento: {sale.get('payment_method', '')}")
    
    y -= 10*mm
    c.drawCentredString(40*mm, y, nf_cfg.get("rodape", "Obrigado pela preferência!"))
    
    c.save()
    return file_path

@router.post("/sales")
async def create_sale(payload: SalePayload, request: Request):
    require_auth(request)
    user = request.session.get("user", {})
    dm = get_dm()
    sale_data = payload.dict()
    sale_data["items"] = [item.dict() for item in payload.items]
    sale_data["operator"] = user.get("name", "Sistema")
    sale_data["status"] = "concluida"
    
    saved_sale = dm.add_sale(sale_data)
    
    try:
        nf_cfg = dm.get_nota_fiscal_cfg()
        generate_receipt_pdf(saved_sale, nf_cfg)
    except Exception as e:
        print("Erro ao gerar PDF:", e)
        
    return saved_sale

@router.put("/sales/{sale_id}")
async def update_sale(sale_id: str, payload: SaleUpdatePayload, request: Request):
    require_auth(request)
    updates = {k: v for k, v in payload.dict().items() if v is not None}
    ok = get_dm().update_sale(sale_id, updates)
    if not ok:
        raise HTTPException(status_code=404, detail="Venda não encontrada")
    return {"ok": True}

@router.post("/sales/{sale_id}/cancel")
async def cancel_sale(sale_id: str, request: Request):
    require_auth(request)
    ok, msg = get_dm().cancel_sale(sale_id)
    if not ok:
        raise HTTPException(status_code=400, detail=msg)
    return {"ok": True, "message": msg}

@router.post("/sales/{sale_id}/cancel-item/{item_index}")
async def cancel_sale_item(sale_id: str, item_index: int, request: Request, payload: CancelItemPayload = None):
    require_auth(request)
    send = payload.send_to_trocas if payload else True
    qty = payload.quantity if payload else None
    dm = get_dm()
    ok, msg = dm.cancel_sale_item(sale_id, item_index, send, qty)
    if not ok:
        raise HTTPException(status_code=400, detail=msg)
    updated_sale = dm.get_sale_by_id(sale_id)
    return {"ok": True, "message": msg, "sale": updated_sale}

@router.delete("/sales/{sale_id}")
async def delete_sale(sale_id: str, request: Request):
    require_auth(request)
    user = request.session.get("user", {})
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Apenas administradores")
    get_dm().delete_sale(sale_id)
    return {"ok": True}