@echo off
setlocal
chcp 65001 >nul
title Gate of the Earth's Heart - DND TRPG

set "ROOT=%~dp0"
set "BACKEND=%ROOT%backend"
set "FRONTEND=%ROOT%frontend"
set "VENV=%BACKEND%\.venv"
set "PY=%VENV%\Scripts\python.exe"

echo ========================================
echo   Gate of the Earth's Heart  DND TRPG
echo ========================================
echo.

if not exist "%PY%" (
    echo Creating backend Python environment...
    python -m venv "%VENV%"
    if errorlevel 1 (
        echo Failed to create backend Python environment.
        pause
        exit /b 1
    )
)

echo Installing backend dependencies...
"%PY%" -m pip install -r "%BACKEND%\requirements.txt"
if errorlevel 1 (
    echo Failed to install backend dependencies.
    pause
    exit /b 1
)

echo Starting backend on port 8000...
start "Backend - DM Service" /D "%BACKEND%" cmd /k ""%PY%" main.py"

echo Starting frontend on port 5174...
start "Frontend - DND UI" /D "%FRONTEND%" cmd /k "npm run dev"

echo.
echo ========================================
echo   Startup commands sent.
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:5174
echo ========================================
pause
