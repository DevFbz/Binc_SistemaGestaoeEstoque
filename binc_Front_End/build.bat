@echo off
echo ============================================
echo   MOTO PECAS - Build de Executavel (.exe)
echo ============================================
echo.

REM Instala/atualiza o PyInstaller
echo [1/3] Instalando PyInstaller...
pip install pyinstaller --quiet

echo.
echo [2/3] Gerando executavel...
echo.

pyinstaller ^
  --onefile ^
  --windowed ^
  --name "MotoPecas" ^
  --add-data "autopecas_data.json;." ^
  --hidden-import "reportlab" ^
  --hidden-import "qrcode" ^
  --hidden-import "openpyxl" ^
  --hidden-import "requests" ^
  main.py

echo.
echo [3/3] Concluido!
echo.
echo O executavel esta em: dist\MotoPecas.exe
echo.
pause
