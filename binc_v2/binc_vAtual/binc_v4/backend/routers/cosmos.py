"""
Binc v4 - Integração Bluesoft Cosmos API
Consulta EAN/GTIN e retorna nome, marca, categoria e imagem do produto.
Rotação automática de tokens: a cada 25 produtos cadastrados via API, troca o token.
"""
from fastapi import APIRouter, Request, HTTPException
import sys, os, httpx
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from shared_dm import get_dm

router = APIRouter(prefix="/api", tags=["cosmos"])

COSMOS_BASE = "https://api.cosmos.bluesoft.com.br"
COSMOS_USER_AGENT = "Cosmos-API-Request"

def require_auth(request: Request):
    if not request.session.get("user"):
        raise HTTPException(status_code=401, detail="Não autenticado")

def get_active_token(settings: dict) -> str | None:
    """Retorna o token ativo baseado no contador de usos (rotação a cada 25)."""
    tokens = settings.get("cosmos_tokens", [])
    tokens = [t for t in tokens if t and t.strip()]
    if not tokens:
        return None
    count = settings.get("cosmos_usage_count", 0)
    idx = (count // 25) % len(tokens)
    return tokens[idx]

@router.get("/cosmos/ean/{ean}")
async def lookup_ean(ean: str, request: Request):
    require_auth(request)
    dm = get_dm()
    settings = dm.get_settings()

    token = get_active_token(settings)
    if not token:
        raise HTTPException(
            status_code=400,
            detail="Nenhum token Cosmos configurado. Acesse Configurações → Cosmos para adicionar."
        )

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            headers = {
                "X-Cosmos-Token": token,
                "User-Agent": COSMOS_USER_AGENT,
                "Content-Type": "application/json",
            }
            resp = await client.get(f"{COSMOS_BASE}/gtins/{ean}.json", headers=headers)

            if resp.status_code == 404:
                raise HTTPException(status_code=404, detail="Produto não encontrado na base Cosmos.")
            if resp.status_code == 429:
                raise HTTPException(status_code=429, detail="Limite de requisições atingido para este token. Tente novamente ou adicione mais tokens.")
            if resp.status_code == 401:
                raise HTTPException(status_code=401, detail="Token Cosmos inválido ou sem permissão.")
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail=f"Erro Cosmos: {resp.text[:200]}")

            data = resp.json()

        # Incrementar contador de uso
        count = settings.get("cosmos_usage_count", 0) + 1
        settings["cosmos_usage_count"] = count
        dm.save_settings(settings)

        # Mapear campos retornados
        description = data.get("description", "")
        brand_obj = data.get("brand", {}) or {}
        brand = brand_obj.get("name", "") if isinstance(brand_obj, dict) else str(brand_obj)
        gpc_obj = data.get("gpc", {}) or {}
        category = gpc_obj.get("description", "") if isinstance(gpc_obj, dict) else ""

        # Pegar imagem
        thumbnail = data.get("thumbnail", "") or ""
        images = data.get("images", []) or []
        image_url = thumbnail
        if not image_url and images:
            image_url = images[0] if isinstance(images[0], str) else images[0].get("url", "")

        return {
            "ean": ean,
            "name": description,
            "brand": brand,
            "category": category,
            "image_url": image_url,
            "ncm": data.get("ncm", {}).get("code", "") if isinstance(data.get("ncm"), dict) else data.get("ncm", ""),
            "raw": data,
            "token_index": ((count - 1) // 25) % max(1, len([t for t in settings.get("cosmos_tokens", []) if t and t.strip()])),
            "usage_count": count,
        }

    except httpx.TimeoutException:
        raise HTTPException(status_code=408, detail="Timeout ao consultar API Cosmos.")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")
