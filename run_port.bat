@echo off
chcp 65001 >nul
echo 正在启动PDF习题拆分PPT工具（自定义端口）...
echo.
set /p PORT="请输入端口号（直接回车使用5001）: "
if "%PORT%"=="" set PORT=5001
echo 使用端口: %PORT%
echo 访问地址: http://localhost:%PORT%
echo.
python app.py %PORT%
pause

