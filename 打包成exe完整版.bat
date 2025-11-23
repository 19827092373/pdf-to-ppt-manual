@echo off
chcp 65001 >nul
echo ========================================
echo PDF习题拆分PPT工具 - 打包成exe（完整版）
echo ========================================
echo.

REM 检查Python是否安装
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Python！
    echo 请先安装Python：https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [1/5] 检查PyInstaller...
pip show pyinstaller >nul 2>&1
if %errorlevel% neq 0 (
    echo PyInstaller未安装，正在安装...
    pip install pyinstaller
    if %errorlevel% neq 0 (
        echo [错误] 安装失败，请手动运行：pip install pyinstaller
        pause
        exit /b 1
    )
    echo [✓] PyInstaller安装成功
) else (
    echo [✓] PyInstaller已安装
)

echo.
echo [2/5] 清理旧的打包文件...
if exist build rmdir /s /q build
if exist dist rmdir /s /q dist
if exist "PDF习题拆分工具.spec" del /q "PDF习题拆分工具.spec"
echo [✓] 清理完成

echo.
echo [3/5] 创建必要的目录...
if not exist uploads mkdir uploads
if not exist temp mkdir temp
if not exist output mkdir output
echo [✓] 目录创建完成

echo.
echo [4/5] 开始打包应用...
echo 这可能需要5-10分钟，请耐心等待...
echo.

REM 使用PyInstaller打包
pyinstaller --name="PDF习题拆分工具" ^
    --onefile ^
    --noconsole ^
    --add-data "templates;templates" ^
    --add-data "static;static" ^
    --add-data "utils;utils" ^
    --hidden-import=flask ^
    --hidden-import=werkzeug ^
    --hidden-import=jinja2 ^
    --hidden-import=pdf2image ^
    --hidden-import=PIL ^
    --hidden-import=PIL.Image ^
    --hidden-import=pptx ^
    --hidden-import=pptx.shapes ^
    --hidden-import=pptx.util ^
    --hidden-import=pptx.enum.shapes ^
    --hidden-import=fitz ^
    --hidden-import=pymupdf ^
    --hidden-import=PyMuPDF ^
    --icon=NONE ^
    --clean ^
    app.py

if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo [错误] 打包失败！
    echo ========================================
    echo.
    echo 请检查错误信息：
    echo 1. 确保所有依赖已安装：pip install -r requirements.txt
    echo 2. 检查是否有文件缺失
    echo 3. 查看上方的错误信息
    echo.
    pause
    exit /b 1
)

echo.
echo [5/5] 打包完成！
echo.

REM 检查exe文件是否存在
if exist "dist\PDF习题拆分工具.exe" (
    echo ========================================
    echo [成功] 打包成功！
    echo ========================================
    echo.
    echo 可执行文件位置：dist\PDF习题拆分工具.exe
    echo 文件大小：约 80-150 MB
    echo.
    echo 使用说明：
    echo 1. 双击 dist\PDF习题拆分工具.exe 运行
    echo 2. 首次运行可能需要等待几秒
    echo 3. 运行后会自动打开浏览器，如果没有，请手动访问：
    echo    http://localhost:5001
    echo 4. 关闭程序：关闭浏览器窗口或任务管理器结束进程
    echo.
    echo 分享给他人：
    echo - 将 dist\PDF习题拆分工具.exe 发送给他人
    echo - 对方双击即可使用，无需安装Python
    echo.
    echo 注意事项：
    echo - exe文件较大，首次运行较慢（正常现象）
    echo - 杀毒软件可能误报，需要添加信任
    echo - 建议将exe文件放在单独的文件夹中
    echo.
    
    REM 询问是否打开文件夹
    set /p OPEN="是否打开dist文件夹？(Y/N): "
    if /i "%OPEN%"=="Y" (
        explorer dist
    )
) else (
    echo [错误] 未找到生成的exe文件！
    echo 请检查打包过程中的错误信息
)

echo.
pause

