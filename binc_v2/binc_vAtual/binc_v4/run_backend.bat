@echo off
echo =====================================
echo  Binc v4 - Iniciando servidor...
echo =====================================
echo.

REM Verifica se existe venv
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
) else (
    echo Criando ambiente virtual...
    python -m venv venv
    call venv\Scripts\activate.bat
    echo Instalando dependencias...
    pip install -r backend\requirements.txt
)

echo Iniciando FastAPI na porta 8765...
cd backend
python main.py
