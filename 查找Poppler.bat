@echo off
chcp 65001 >nul
echo 正在查找poppler安装位置...
echo.

echo 检查PATH环境变量...
where pdftoppm 2>nul
if %errorlevel% equ 0 (
    echo.
    echo ✓ 找到poppler！已在PATH中配置
    pause
    exit /b 0
)

echo.
echo 未在PATH中找到poppler，正在搜索常见安装位置...
echo.

set FOUND=0

for %%p in (
    "C:\poppler\Library\bin"
    "C:\poppler\bin"
    "C:\Program Files\poppler\bin"
    "C:\Program Files (x86)\poppler\bin"
    "%USERPROFILE%\poppler\bin"
    "%USERPROFILE%\AppData\Local\poppler\bin"
    "C:\msys64\mingw64\bin"
    "C:\msys64\usr\bin"
) do (
    if exist "%%p\pdftoppm.exe" (
        echo ✓ 找到poppler: %%p
        echo.
        echo 请将此路径添加到系统PATH环境变量：
        echo   %%p
        echo.
        set FOUND=1
    )
)

if %FOUND% equ 0 (
    echo ✗ 未找到poppler安装
    echo.
    echo 建议：
    echo 1. 如果已安装poppler，请手动将bin目录添加到PATH
    echo 2. 或者使用PyMuPDF（无需poppler）：pip install PyMuPDF
)

echo.
pause

