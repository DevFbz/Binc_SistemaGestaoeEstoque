from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Optional
import sys, os, re, urllib.parse, httpx
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from shared_dm import get_dm

router = APIRouter(prefix="/api", tags=["products"])


def require_auth(request: Request):
    if not request.session.get("user"):
        raise HTTPException(status_code=401, detail="Não autenticado")

class ProductPayload(BaseModel):
    code: Optional[str] = ""
    name: str
    category: Optional[str] = "Outros"
    brand: Optional[str] = ""
    unit: Optional[str] = "UN"
    cost_price: Optional[float] = 0.0
    sale_price: float
    stock: Optional[int] = 0
    min_stock: Optional[int] = 5
    description: Optional[str] = ""
    ncm: Optional[str] = ""
    cfop: Optional[str] = "5102"
    csosn: Optional[str] = "400"
    image_url: Optional[str] = ""

async def _fetch_image_from_bing(query: str) -> str:
    """Busca thumbnail no Bing Images pelo nome/marca do produto."""
    q = urllib.parse.quote_plus(query)
    url = f"https://www.bing.com/images/search?q={q}&form=HDRSC3&first=1"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9",
        "Referer": "https://www.bing.com/",
    }
    async with httpx.AsyncClient(timeout=10, follow_redirects=True) as client:
        r = await client.get(url, headers=headers)
        # Extract Bing thumbnail IDs (OIP.XXXX pattern)
        thumb_ids = re.findall(r"th\?id=(OIP\.[A-Za-z0-9_\-]+)", r.text)
        if thumb_ids:
            # tse1 CDN serves Bing thumbnails at 200x200
            return f"https://tse1.mm.bing.net/th?id={thumb_ids[0]}&pid=Api&w=200&h=200&c=7"
    return ""

@router.get("/products/search-image")
async def search_product_image(request: Request, name: str = "", brand: str = ""):
    """Busca automaticamente uma imagem do produto no Bing Images."""
    require_auth(request)
    if not name:
        return {"image_url": ""}
    query = f"{name} {brand} autopecas".strip()
    try:
        url = await _fetch_image_from_bing(query)
        return {"image_url": url}
    except Exception as e:
        return {"image_url": ""}

@router.get("/products")
async def list_products(request: Request, q: Optional[str] = None):
    require_auth(request)
    products = get_dm().get_products()
    if q:
        q = q.lower()
        products = [p for p in products
                    if q in p.get("name", "").lower() or q in p.get("code", "").lower()]
    return products

@router.get("/products/{product_id}")
async def get_product(product_id: str, request: Request):
    require_auth(request)
    p = get_dm().get_product_by_id(product_id)
    if not p:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return p

@router.post("/products")
async def create_product(payload: ProductPayload, request: Request):
    require_auth(request)
    return get_dm().add_product(payload.dict())

@router.put("/products/{product_id}")
async def update_product(product_id: str, payload: ProductPayload, request: Request):
    require_auth(request)
    existing = get_dm().get_product_by_id(product_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    data = payload.dict()
    data["id"] = product_id
    get_dm().update_product(product_id, data)
    return {"ok": True}

@router.delete("/products/{product_id}")
async def delete_product(product_id: str, request: Request):
    require_auth(request)
    user = request.session.get("user", {})
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Apenas administradores podem excluir produtos")
    get_dm().delete_product(product_id)
    return {"ok": True}

@router.patch("/products/{product_id}/stock")
async def adjust_stock(product_id: str, request: Request):
    require_auth(request)
    body = await request.json()
    qty = body.get("quantity", 0)
    dm = get_dm()
    p = dm.get_product_by_id(product_id)
    if not p:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    p["stock"] = max(0, p["stock"] + qty)
    dm.update_product(product_id, p)
    return {"ok": True, "new_stock": p["stock"]}