@echo off
chcp 65001 >nul
title 碎冠之影 - DND TRPG

echo ========================================
echo   碎冠之影  DND TRPG
echo ========================================
echo.
echo 正在启动后端 (端口 8000)...
start "后端-DM服务" cmd /c "cd /d %~dp0backend && python main.py && pause"

echo 正在启动前端 (端口 5174)...
start "前端-DND界面" cmd /c "cd /d %~dp0frontend && npm run dev && pause"

echo.
echo ========================================
echo   启动完成！
echo   后端: http://localhost:8000
echo   前端: http://localhost:5174
echo ========================================
pause
