@echo off
chcp 65001 >nul
cd /d "%~dp0"

if not exist "package.json" (
  echo 错误：未找到 package.json，请把本文件放在「群英断是非」项目文件夹内再双击运行。
  pause
  exit /b 1
)

echo [1/2] 安装依赖（首次或更新后需要，已安装时会很快）...
call npm install
if errorlevel 1 (
  echo npm install 失败，请检查是否已安装 Node.js: https://nodejs.org
  pause
  exit /b 1
)

echo.
echo [2/2] 启动开发服务器...
echo.
echo ========================================
echo  请勿用 file:// 打开 index.html，会白屏。
echo  启动成功后，在浏览器地址栏输入：
echo     http://localhost:5173
echo ========================================
echo.
call npm run dev
pause
