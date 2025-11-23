@echo off
chcp 65001 >nul
echo 正在启动PDF习题拆分PPT工具...
echo.
echo 如果端口5001被占用，可以手动指定端口：python app.py 5002
echo.
python app.py 5001
pause

