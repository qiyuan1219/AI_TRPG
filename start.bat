@echo off
chcp 65001 >nul
title 碎冠之影 — D&D AI-TRPG

echo ========================================
echo   碎冠之影 — D&D AI-TRPG 一键启动
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] 启动后端 (FastAPI) ...
start "DND-Backend" cmd /c "cd backend && python main.py"

echo [2/2] 启动前端 (Vite + React) ...
start "DND-Frontend" cmd /c "cd frontend && npm run dev"

echo.
echo ========================================
echo   后端: http://localhost:8190
echo   前端: http://localhost:5174
echo ========================================
echo.
echo 关闭本窗口不会停止服务，请手动关闭两个终端。
pause
