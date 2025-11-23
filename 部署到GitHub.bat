@echo off
chcp 65001 >nul
echo ========================================
echo PDF习题拆分PPT工具 - 部署到GitHub
echo ========================================
echo.

REM 检查Git是否安装
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Git！
    echo.
    echo 请先安装Git：
    echo 1. 访问 https://git-scm.com/download/win 下载安装
    echo 2. 或使用GitHub Desktop: https://desktop.github.com/
    echo.
    pause
    exit /b 1
)

echo [1/6] 检查Git状态...
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo 初始化Git仓库...
    git init
)

echo.
echo [2/6] 检查远程仓库...
git remote -v >nul 2>&1
if %errorlevel% neq 0 (
    echo 未配置远程仓库。
    echo.
    set /p GITHUB_URL="请输入GitHub仓库地址（例如：https://github.com/username/pdf-to-ppt-manual.git）: "
    if "%GITHUB_URL%"=="" (
        echo 未输入仓库地址，退出。
        pause
        exit /b 1
    )
    git remote add origin %GITHUB_URL%
    echo 已添加远程仓库：%GITHUB_URL%
)

echo.
echo [3/6] 添加文件到Git...
git add .

echo.
echo [4/6] 检查是否有修改...
git diff --cached --quiet
if %errorlevel% equ 0 (
    echo 没有需要提交的修改。
    echo 跳过提交步骤。
) else (
    echo 提交文件...
    git commit -m "Update: PDF习题拆分PPT工具"
)

echo.
echo [5/6] 推送到GitHub...
echo 如果首次推送，可能需要输入GitHub账号和密码。
echo.
git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo 推送失败！可能的原因：
    echo 1. 网络连接问题
    echo 2. GitHub账号认证失败
    echo 3. 仓库地址错误
    echo.
    echo 请检查错误信息并重试。
    pause
    exit /b 1
)

echo.
echo ========================================
echo 部署成功！
echo ========================================
echo.
echo 你的代码已推送到GitHub。
echo 访问你的GitHub仓库查看代码。
echo.
echo 下一步：
echo 1. 访问 https://render.com 部署到Render（可选）
echo 2. 或使用国内服务器部署（推荐国内用户）
echo.
pause

