@echo off
chcp 65001 >nul
echo ========================================
echo PDF习题拆分PPT工具 - 打包成exe
echo ========================================
echo.

echo 检查PyInstaller...
pip show pyinstaller >nul 2>&1
if %errorlevel% neq 0 (
    echo PyInstaller未安装，正在安装...
    pip install pyinstaller
    if %errorlevel% neq 0 (
        echo 安装失败，请手动运行：pip install pyinstaller
        pause
        exit /b 1
    )
)

echo.
echo 正在打包应用...
echo 这可能需要几分钟时间，请耐心等待...
echo.

pyinstaller --name="PDF习题拆分工具" --onefile --windowed --add-data "templates;templates" --add-data "static;static" --add-data "utils;utils" --hidden-import=flask --hidden-import=pdf2image --hidden-import=PIL --hidden-import=pptx app.py

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo 打包成功！
    echo ========================================
    echo.
    echo 可执行文件位置：dist\PDF习题拆分工具.exe
    echo.
    echo 注意：
    echo - exe文件较大（约50-100MB）
    echo - 首次运行可能较慢
    echo - 需要确保系统已安装必要的依赖
    echo.
) else (
    echo.
    echo ========================================
    echo 打包失败！
    echo ========================================
    echo.
    echo 请检查错误信息并重试
    echo.
)

pause

