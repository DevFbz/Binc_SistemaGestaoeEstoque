"""
Binc v4 - FastAPI Backend Main
Servidor principal que serve a API REST e os arquivos estáticos do frontend React.
"""

import os
import sys
import uvicorn

# ─── LOGGING FIX FOR EXE ──────────────────────────────────────────────────────
# Redireciona stdout/stderr se forem None (comum em PyInstaller --noconsole)
# para evitar erro 'NoneType' object has no attribute 'isatty' do uvicorn
import io
if sys.stdout is None: sys.stdout = io.StringIO()
if sys.stderr is None: sys.stderr = io.StringIO()

from fastapi import FastAPI, Request, Response, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from starlette.middleware.sessions import SessionMiddleware

# ─── PATH SETUP ───────────────────────────────────────────────────────────────
if getattr(sys, "frozen", False):
    # Rodando como .exe — arquivos extraídos em _MEIPASS
    BASE_DIR = os.path.dirname(sys.executable)
    _BUNDLE  = sys._MEIPASS          # type: ignore[attr-defined]
    STATIC_DIR = os.path.join(_BUNDLE, "static")
else:
    BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
    _BUNDLE    = BASE_DIR
    STATIC_DIR = os.path.join(BASE_DIR, "static")

PARENT_DIR = os.path.dirname(BASE_DIR)  # binc_v4/

# Add backend to path
sys.path.insert(0, BASE_DIR)

from data_manager import DataManager

# ─── APP ──────────────────────────────────────────────────────────────────────
app = FastAPI(title="Binc API", version="4.0.0", docs_url="/api/docs")

app.add_middleware(
    SessionMiddleware,
    secret_key="binc-secret-key-2024-ultra-secure",
    max_age=86400 * 7,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8765"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── DATA MANAGER SINGLETON ───────────────────────────────────────────────────
_dm: DataManager = None

def get_dm() -> DataManager:
    global _dm
    if _dm is None:
        _dm = DataManager()
    return _dm

def get_current_user(request: Request):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Não autenticado")
    return user

# ─── INCLUDE ROUTERS ──────────────────────────────────────────────────────────
from routers import auth, dashboard, products, customers, sales, returns, reports, users, settings, binc_ia, caixa, faltas, cosmos

app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(products.router)
app.include_router(customers.router)
app.include_router(sales.router)
app.include_router(returns.router)
app.include_router(reports.router)
app.include_router(users.router)
app.include_router(settings.router)
app.include_router(binc_ia.router)
app.include_router(caixa.router)
app.include_router(faltas.router)
app.include_router(cosmos.router)

# ─── STATIC FILES (React frontend) ────────────────────────────────────────────
if os.path.isdir(STATIC_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(STATIC_DIR, "assets")), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_react(full_path: str):
        # Don't intercept /api routes
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404)
        index_file = os.path.join(STATIC_DIR, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        raise HTTPException(status_code=404, detail="Frontend not built yet")

# ─── ENTRY POINT (when running as .exe) ───────────────────────────────────────
def start_server():
    """Called when running as standalone exe."""
    import threading
    import time
    import socket
    import os

    url = "http://localhost:8765"

    def is_port_in_use(port: int) -> bool:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            return s.connect_ex(('127.0.0.1', port)) == 0

    def open_browser():
        time.sleep(1.5)
        try:
            if hasattr(os, 'startfile'):
                os.startfile(url)
            else:
                import webbrowser
                webbrowser.open(url)
        except Exception as e:
            pass

    # Se a porta já estiver em uso, assume que o app já está rodando
    if is_port_in_use(8765):
        try:
            if hasattr(os, 'startfile'):
                os.startfile(url)
            else:
                import webbrowser
                webbrowser.open(url)
        except:
            pass
        return

    threading.Thread(target=open_browser, daemon=True).start()
    uvicorn.run(app, host="127.0.0.1", port=8765, log_level="warning", use_colors=False)

if __name__ == "__main__":
    start_server()
