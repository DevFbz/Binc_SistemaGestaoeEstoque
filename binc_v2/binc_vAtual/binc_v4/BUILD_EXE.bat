@echo off
chcp 65001 > nul
title Binc v4 - Build para .EXE

echo.
echo ============================================================
echo   Binc v4 - Build para .EXE
echo ============================================================
echo.

cd /d "%~dp0"

echo [1/4] Compilando frontend React...
cd frontend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Build do frontend falhou!
    exit /b 1
)
cd ..
echo [OK] Frontend compilado!

echo.
echo [2/4] Instalando PyInstaller...
call .\venv\Scripts\python.exe -m pip install pyinstaller --quiet
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao instalar PyInstaller!
    exit /b 1
)
echo [OK] PyInstaller OK!

echo.
echo [3/4] Limpando builds anteriores...
if exist backend\build    rmdir /s /q backend\build
if exist backend\dist     rmdir /s /q backend\dist
if exist backend\Binc.spec del /f /q backend\Binc.spec
echo [OK] Limpo!

echo.
echo [4/4] Empacotando com PyInstaller (pode demorar 5-15 minutos)...
echo       NAO feche esta janela!
echo.

cd backend

..\venv\Scripts\python.exe -m PyInstaller ^
    --onefile ^
    --noconsole ^
    --name "Binc" ^
    --add-data "static;static" ^
    --add-data "routers;routers" ^
    --add-data "shared_dm.py;." ^
    --add-data "data_manager.py;." ^
    --hidden-import uvicorn.logging ^
    --hidden-import uvicorn.loops ^
    --hidden-import uvicorn.loops.auto ^
    --hidden-import uvicorn.protocols ^
    --hidden-import uvicorn.protocols.http ^
    --hidden-import uvicorn.protocols.http.auto ^
    --hidden-import uvicorn.protocols.http.h11_impl ^
    --hidden-import uvicorn.protocols.websockets ^
    --hidden-import uvicorn.protocols.websockets.auto ^
    --hidden-import uvicorn.lifespan ^
    --hidden-import uvicorn.lifespan.on ^
    --hidden-import starlette.middleware.sessions ^
    --hidden-import starlette.routing ^
    --hidden-import starlette.staticfiles ^
    --hidden-import fastapi.middleware.cors ^
    --hidden-import h11 ^
    --hidden-import anyio ^
    --hidden-import anyio._backends._asyncio ^
    --hidden-import click ^
    --collect-all uvicorn ^
    --collect-all starlette ^
    --collect-all fastapi ^
    --collect-all h11 ^
    main.py

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERRO] PyInstaller falhou! Veja os erros acima.
    cd ..
    exit /b 1
)

cd ..

echo.
echo Copiando Binc.exe para pasta raiz...
copy /y backend\dist\Binc.exe Binc.exe

if exist Binc.exe (
    echo.
    echo ============================================================
    echo   BUILD CONCLUIDO COM SUCESSO!
    echo   Arquivo: %CD%\Binc.exe
    echo ============================================================
    echo.
    echo   Para distribuir: copie apenas Binc.exe para qualquer PC.
    echo   Na primeira execucao, sera solicitado o PIN: 8602
    echo.
) else (
    echo [ERRO] Binc.exe nao foi criado.
)
