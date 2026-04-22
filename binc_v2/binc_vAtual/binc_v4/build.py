# -*- coding: utf-8 -*-
"""
Binc v4 - Build Script
1. Compila o frontend React  ->  backend/static/
2. Garante que PyInstaller esta instalado
3. Gera Binc.exe com PyInstaller (--onefile)
4. Copia o .exe para a pasta raiz
"""
import os
import sys
import shutil
import subprocess

ROOT        = os.path.dirname(os.path.abspath(__file__))
FRONTEND    = os.path.join(ROOT, "frontend")
BACKEND     = os.path.join(ROOT, "backend")
STATIC_DIR  = os.path.join(BACKEND, "static")
VENV_PY     = os.path.join(ROOT, "venv", "Scripts", "python.exe")

# Usa o python do venv se existir, senao usa o do PATH
PYTHON = VENV_PY if os.path.exists(VENV_PY) else sys.executable


def run(cmd, cwd=None, check=True):
    print(f"\n>>> {cmd}")
    result = subprocess.run(cmd, shell=True, cwd=cwd)
    if check and result.returncode != 0:
        print(f"\n[ERRO] Codigo de saida: {result.returncode}")
        sys.exit(1)
    return result.returncode


def main():
    print("=" * 60)
    print("  Binc v4 - Build para .EXE")
    print("=" * 60)

    # -- PASSO 1: Build do frontend React --------------------------------
    print("\n[1/4] Compilando frontend React (npm run build)...")
    run("npm run build", cwd=FRONTEND)

    # Vite coloca o build em backend/static (configurado no vite.config.ts)
    if not os.path.isdir(STATIC_DIR):
        print(f"[ERRO] {STATIC_DIR} nao encontrado apos build!")
        sys.exit(1)
    print(f"[OK] Frontend compilado em {STATIC_DIR}")

    # -- PASSO 2: Instalar PyInstaller no venv ---------------------------
    print("\n[2/4] Verificando/instalando PyInstaller...")
    run(f'"{PYTHON}" -m pip install pyinstaller --quiet')
    print("[OK] PyInstaller pronto")

    # -- PASSO 3: Limpar build anterior ----------------------------------
    print("\n[3/4] Limpando builds anteriores...")
    for folder in ["build", "dist"]:
        p = os.path.join(BACKEND, folder)
        if os.path.isdir(p):
            shutil.rmtree(p)
    spec = os.path.join(BACKEND, "Binc.spec")
    if os.path.exists(spec):
        os.remove(spec)
    print("[OK] Limpo")

    # -- PASSO 4: PyInstaller --------------------------------------------
    print("\n[4/4] Empacotando com PyInstaller (pode demorar alguns minutos)...")

    sep = ";" if sys.platform == "win32" else ":"

    hidden_imports = [
        "uvicorn.logging",
        "uvicorn.loops",
        "uvicorn.loops.auto",
        "uvicorn.protocols",
        "uvicorn.protocols.http",
        "uvicorn.protocols.http.auto",
        "uvicorn.protocols.http.h11_impl",
        "uvicorn.protocols.websockets",
        "uvicorn.protocols.websockets.auto",
        "uvicorn.lifespan",
        "uvicorn.lifespan.on",
        "starlette.middleware.sessions",
        "starlette.routing",
        "starlette.staticfiles",
        "fastapi.middleware.cors",
        "h11",
        "email_validator",
        "anyio",
        "anyio._backends._asyncio",
        "click",
    ]

    hidden = " ".join(f"--hidden-import {h}" for h in hidden_imports)

    collect = (
        "--collect-all uvicorn "
        "--collect-all starlette "
        "--collect-all fastapi "
        "--collect-all h11 "
    )

    add_data = (
        f'--add-data "static{sep}static" '
        f'--add-data "routers{sep}routers" '
        f'--add-data "shared_dm.py{sep}." '
        f'--add-data "data_manager.py{sep}." '
    )

    cmd = (
        f'"{PYTHON}" -m PyInstaller '
        f"--onefile "
        f"--noconsole "
        f'--name "Binc" '
        f"{add_data}"
        f"{hidden} "
        f"{collect}"
        f"main.py"
    )
    run(cmd, cwd=BACKEND)

    # -- RESULTADO -------------------------------------------------------
    exe_src = os.path.join(BACKEND, "dist", "Binc.exe")
    exe_dst = os.path.join(ROOT, "Binc.exe")

    if os.path.exists(exe_src):
        shutil.copy2(exe_src, exe_dst)
        size_mb = os.path.getsize(exe_dst) / (1024 * 1024)
        print("\n" + "=" * 60)
        print("  BUILD CONCLUIDO COM SUCESSO!")
        print(f"  Arquivo: {exe_dst}")
        print(f"  Tamanho: {size_mb:.1f} MB")
        print("=" * 60)
        print("\n  Para distribuir: copie apenas Binc.exe para qualquer PC.")
        print("  Na primeira execucao, sera solicitado o PIN: 8602")
    else:
        print("\n[ERRO] Build falhou: Binc.exe nao encontrado em backend/dist/")
        sys.exit(1)


if __name__ == "__main__":
    main()
