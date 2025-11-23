# PDF习题拆分PPT工具 - 部署到GitHub (PowerShell版本)
# 编码: UTF-8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PDF习题拆分PPT工具 - 部署到GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查Git是否安装
$gitPath = $null
try {
    $gitPath = Get-Command git -ErrorAction Stop | Select-Object -ExpandProperty Source
    Write-Host "[✓] 检测到Git: $gitPath" -ForegroundColor Green
} catch {
    Write-Host "[✗] 未检测到Git！" -ForegroundColor Red
    Write-Host ""
    Write-Host "请先安装Git，有以下几种方式：" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "方式1: 下载Git for Windows" -ForegroundColor Yellow
    Write-Host "  访问: https://git-scm.com/download/win" -ForegroundColor Cyan
    Write-Host "  下载并安装，然后重新运行此脚本" -ForegroundColor Gray
    Write-Host ""
    Write-Host "方式2: 使用GitHub Desktop（推荐新手）" -ForegroundColor Yellow
    Write-Host "  访问: https://desktop.github.com/" -ForegroundColor Cyan
    Write-Host "  下载并安装，然后使用图形界面操作" -ForegroundColor Gray
    Write-Host ""
    Write-Host "方式3: 使用winget安装（Windows 11）" -ForegroundColor Yellow
    Write-Host "  运行: winget install --id Git.Git -e --source winget" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "安装完成后，请重新运行此脚本。" -ForegroundColor Yellow
    Read-Host "按回车键退出"
    exit 1
}

# 检查是否在项目目录
if (-not (Test-Path "app.py")) {
    Write-Host "[✗] 错误：未找到app.py，请确保在项目根目录运行此脚本" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

Write-Host ""
Write-Host "[1/6] 检查Git仓库状态..." -ForegroundColor Yellow

# 检查是否已初始化Git仓库
if (-not (Test-Path ".git")) {
    Write-Host "  初始化Git仓库..." -ForegroundColor Gray
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[✗] Git初始化失败" -ForegroundColor Red
        Read-Host "按回车键退出"
        exit 1
    }
    Write-Host "  [✓] Git仓库初始化成功" -ForegroundColor Green
} else {
    Write-Host "  [✓] Git仓库已存在" -ForegroundColor Green
}

Write-Host ""
Write-Host "[2/6] 检查远程仓库..." -ForegroundColor Yellow

# 检查远程仓库
$remoteUrl = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  未配置远程仓库" -ForegroundColor Gray
    Write-Host ""
    $githubUrl = Read-Host "请输入GitHub仓库地址（例如：https://github.com/username/pdf-to-ppt-manual.git）"
    
    if ([string]::IsNullOrWhiteSpace($githubUrl)) {
        Write-Host "[✗] 未输入仓库地址，退出" -ForegroundColor Red
        Read-Host "按回车键退出"
        exit 1
    }
    
    git remote add origin $githubUrl
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[✗] 添加远程仓库失败" -ForegroundColor Red
        Read-Host "按回车键退出"
        exit 1
    }
    Write-Host "  [✓] 已添加远程仓库: $githubUrl" -ForegroundColor Green
} else {
    Write-Host "  [✓] 远程仓库已配置: $remoteUrl" -ForegroundColor Green
}

Write-Host ""
Write-Host "[3/6] 检查.gitignore文件..." -ForegroundColor Yellow
if (Test-Path ".gitignore") {
    Write-Host "  [✓] .gitignore文件存在" -ForegroundColor Green
} else {
    Write-Host "  [⚠] .gitignore文件不存在，建议创建" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[4/6] 添加文件到Git..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "[✗] 添加文件失败" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}
Write-Host "  [✓] 文件已添加到暂存区" -ForegroundColor Green

Write-Host ""
Write-Host "[5/6] 检查是否有修改..." -ForegroundColor Yellow
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "  没有需要提交的修改" -ForegroundColor Gray
    Write-Host "  跳过提交步骤" -ForegroundColor Gray
} else {
    Write-Host "  检测到修改，准备提交..." -ForegroundColor Gray
    $commitMessage = Read-Host "请输入提交信息（直接回车使用默认信息）"
    if ([string]::IsNullOrWhiteSpace($commitMessage)) {
        $commitMessage = "Update: PDF习题拆分PPT工具"
    }
    
    git commit -m $commitMessage
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[✗] 提交失败" -ForegroundColor Red
        Read-Host "按回车键退出"
        exit 1
    }
    Write-Host "  [✓] 文件已提交" -ForegroundColor Green
}

Write-Host ""
Write-Host "[6/6] 推送到GitHub..." -ForegroundColor Yellow
Write-Host "  如果首次推送，可能需要输入GitHub账号和密码" -ForegroundColor Gray
Write-Host "  建议使用Personal Access Token代替密码" -ForegroundColor Yellow
Write-Host ""

# 检查当前分支
$currentBranch = git branch --show-current
if ([string]::IsNullOrWhiteSpace($currentBranch)) {
    $currentBranch = "main"
    git branch -M main
}

Write-Host "  推送到分支: $currentBranch" -ForegroundColor Gray
git push -u origin $currentBranch

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[✗] 推送失败！" -ForegroundColor Red
    Write-Host ""
    Write-Host "可能的原因：" -ForegroundColor Yellow
    Write-Host "1. 网络连接问题" -ForegroundColor Gray
    Write-Host "2. GitHub账号认证失败（需要使用Personal Access Token）" -ForegroundColor Gray
    Write-Host "3. 仓库地址错误" -ForegroundColor Gray
    Write-Host "4. 仓库权限不足" -ForegroundColor Gray
    Write-Host ""
    Write-Host "解决方案：" -ForegroundColor Yellow
    Write-Host "1. 检查网络连接" -ForegroundColor Gray
    Write-Host "2. 创建Personal Access Token: https://github.com/settings/tokens" -ForegroundColor Cyan
    Write-Host "3. 使用Token作为密码进行认证" -ForegroundColor Gray
    Write-Host ""
    Read-Host "按回车键退出"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "部署成功！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "你的代码已推送到GitHub" -ForegroundColor Green
Write-Host "访问你的GitHub仓库查看代码" -ForegroundColor Cyan
Write-Host ""

# 获取仓库URL
$repoUrl = git remote get-url origin
if ($repoUrl -match "github\.com[:/](.+?)(?:\.git)?$") {
    $repoPath = $matches[1]
    $repoUrl = "https://github.com/$repoPath"
    Write-Host "仓库地址: $repoUrl" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "下一步：" -ForegroundColor Yellow
Write-Host "1. 访问 https://render.com 部署到Render（海外用户）" -ForegroundColor Gray
Write-Host "2. 或使用国内服务器部署（推荐国内用户）" -ForegroundColor Gray
Write-Host "3. 查看部署文档: GitHub部署快速指南.md" -ForegroundColor Gray
Write-Host ""
Read-Host "按回车键退出"

