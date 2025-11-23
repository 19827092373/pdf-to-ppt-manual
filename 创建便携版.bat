@echo off
chcp 65001 >nul
echo ========================================
echo PDF习题拆分PPT工具 - 创建便携版
echo ========================================
echo.

set "PORTABLE_DIR=便携版"

if exist "%PORTABLE_DIR%" (
    echo 删除旧的便携版文件夹...
    rmdir /s /q "%PORTABLE_DIR%"
)

echo 创建便携版文件夹结构...
mkdir "%PORTABLE_DIR%"
mkdir "%PORTABLE_DIR%\templates"
mkdir "%PORTABLE_DIR%\static"
mkdir "%PORTABLE_DIR%\static\css"
mkdir "%PORTABLE_DIR%\static\js"
mkdir "%PORTABLE_DIR%\utils"
mkdir "%PORTABLE_DIR%\uploads"
mkdir "%PORTABLE_DIR%\temp"
mkdir "%PORTABLE_DIR%\output"

echo 复制文件...
copy /Y app.py "%PORTABLE_DIR%\"
copy /Y requirements.txt "%PORTABLE_DIR%\"
copy /Y README.md "%PORTABLE_DIR%\"
copy /Y 启动说明.md "%PORTABLE_DIR%\"
copy /Y 使用说明.md "%PORTABLE_DIR%\"
copy /Y run.bat "%PORTABLE_DIR%\"
copy /Y run_port.bat "%PORTABLE_DIR%\"

echo 复制文件夹...
xcopy /E /I /Y templates "%PORTABLE_DIR%\templates\" >nul
xcopy /E /I /Y static "%PORTABLE_DIR%\static\" >nul
xcopy /E /I /Y utils "%PORTABLE_DIR%\utils\" >nul

echo.
echo ========================================
echo 创建用户说明文件...
echo ========================================
(
echo PDF习题拆分PPT工具 - 便携版
echo.
echo 使用说明：
echo 1. 首次使用：运行"安装依赖.bat"安装Python依赖
echo 2. 启动应用：运行"run.bat"启动服务器
echo 3. 打开浏览器访问：http://localhost:5001
echo.
echo 注意事项：
echo - 需要Python 3.7或更高版本
echo - 如果端口5001被占用，使用run_port.bat选择其他端口
echo - 建议安装PyMuPDF：pip install PyMuPDF（无需poppler）
echo.
echo 更多说明请查看"使用说明.md"
) > "%PORTABLE_DIR%\使用说明.txt"

echo 创建安装依赖脚本...
(
echo @echo off
echo chcp 65001 ^>nul
echo echo 正在安装Python依赖...
echo echo.
echo pip install -r requirements.txt
echo echo.
echo echo 安装完成！
echo pause
) > "%PORTABLE_DIR%\安装依赖.bat"

echo.
echo ========================================
echo 便携版创建完成！
echo ========================================
echo.
echo 便携版位置：%CD%\%PORTABLE_DIR%
echo.
echo 下一步：
echo 1. 测试便携版：进入便携版文件夹，运行run.bat
echo 2. 打包分享：将便携版文件夹压缩成zip文件
echo.
pause

