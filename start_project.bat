@echo off
echo 启动圆运阁排盘系统...
echo.

REM 启动后端服务
echo 启动后端服务...
start "后端服务" cmd /k "cd /d %~dp0backend && python main.py"

REM 等待后端服务启动
timeout /t 3 /nobreak >nul

REM 启动前端服务
echo 启动前端服务...
start "前端服务" cmd /k "cd /d %~dp0frontend && npm run dev"

REM 等待前端服务启动
timeout /t 5 /nobreak >nul

echo.
echo 项目启动完成！
echo 后端服务: http://localhost:8000
echo 前端服务: http://localhost:3000
echo.
echo 按任意键关闭此窗口...
pause >nul