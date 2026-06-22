@echo off
chcp 65001 >nul
setlocal

echo ========================================
echo 游戏背景图批量压缩工具
echo 位置: frontend\public\assets
echo 保留原图片格式，不强转 WebP
echo 输入目录: scenes_raw
echo 输出目录: scenes_compressed
echo 目标大小: 1MB以内
echo ========================================
echo.

set "ASSETS=%~dp0"

for %%I in ("%ASSETS%..\..") do set "FRONTEND=%%~fI"
set "INPUT=%ASSETS%scenes_raw"
set "OUTPUT=%ASSETS%scenes_compressed"
set "SCRIPT=%FRONTEND%\scripts\compress-scenes-keep-format.mjs"

if not exist "%FRONTEND%\package.json" (
  echo [错误] 没找到 frontend\package.json
  echo 当前识别到的 frontend 路径是：
  echo %FRONTEND%
  echo.
  echo 请确认本 bat 放在：
  echo frontend\public\assets\compress-scenes.bat
  pause
  exit /b 1
)

if not exist "%INPUT%" (
  echo [提示] 输入目录不存在，正在创建：
  echo %INPUT%
  mkdir "%INPUT%"
  echo.
  echo 请把要压缩的原图放进：
  echo frontend\public\assets\scenes_raw
  echo 然后重新运行本 bat。
  pause
  exit /b 0
)

if not exist "%OUTPUT%" (
  mkdir "%OUTPUT%"
)

cd /d "%FRONTEND%"

if not exist "node_modules\sharp" (
  echo [提示] 正在安装 sharp，用于图片压缩...
  npm i -D sharp
  if errorlevel 1 (
    echo [错误] sharp 安装失败。
    pause
    exit /b 1
  )
)

if not exist "%SCRIPT%" (
  echo [错误] 没找到压缩脚本：
  echo %SCRIPT%
  echo.
  echo 请创建：
  echo frontend\scripts\compress-scenes-keep-format.mjs
  pause
  exit /b 1
)

echo.
echo [开始] 正在压缩图片，保留原格式...
echo.

node "%SCRIPT%" "%INPUT%" "%OUTPUT%"

if errorlevel 1 (
  echo.
  echo [错误] 压缩失败。
  pause
  exit /b 1
)

echo.
echo ========================================
echo 压缩完成！
echo 输出目录：
echo %OUTPUT%
echo ========================================
pause