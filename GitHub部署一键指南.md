# GitHub部署一键指南

## 🚀 快速开始（3步完成）

### 第一步：安装Git（如果还没有）

**方式1：Git for Windows（推荐）**
1. 访问：https://git-scm.com/download/win
2. 下载并安装（使用默认设置即可）
3. 安装完成后重启命令行窗口

**方式2：GitHub Desktop（图形界面，适合新手）**
1. 访问：https://desktop.github.com/
2. 下载并安装
3. 登录GitHub账号

**方式3：使用winget（Windows 11）**
```powershell
winget install --id Git.Git -e --source winget
```

### 第二步：创建GitHub仓库

1. 访问 https://github.com 并登录
2. 点击右上角 "+" → "New repository"
3. 填写信息：
   - **Repository name**: `pdf-to-ppt-manual`
   - **Description**: `PDF习题拆分PPT工具`
   - **Visibility**: 选择 Public（公开）或 Private（私有）
4. **不要**勾选 "Initialize this repository with a README"
5. 点击 "Create repository"
6. 复制仓库地址（例如：`https://github.com/your-username/pdf-to-ppt-manual.git`）

### 第三步：运行部署脚本

**使用PowerShell脚本（推荐）：**
```powershell
cd pdf-to-ppt-manual
.\部署到GitHub.ps1
```

**或使用批处理脚本：**
```cmd
cd pdf-to-ppt-manual
部署到GitHub.bat
```

**或手动执行Git命令：**
```bash
cd pdf-to-ppt-manual
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/pdf-to-ppt-manual.git
git push -u origin main
```

---

## 🔐 GitHub认证说明

### 使用Personal Access Token（推荐）

GitHub已不再支持密码认证，需要使用Personal Access Token：

1. **创建Token**：
   - 访问：https://github.com/settings/tokens
   - 点击 "Generate new token" → "Generate new token (classic)"
   - 填写名称（如：`pdf-to-ppt-deploy`）
   - 选择过期时间（建议90天或更长）
   - 勾选权限：`repo`（完整仓库权限）
   - 点击 "Generate token"
   - **重要**：复制Token（只显示一次）

2. **使用Token**：
   - 推送时，用户名输入你的GitHub用户名
   - 密码输入刚才复制的Token

### 使用SSH密钥（高级）

如果你熟悉SSH，可以配置SSH密钥：
1. 生成SSH密钥：`ssh-keygen -t ed25519 -C "your_email@example.com"`
2. 添加公钥到GitHub：https://github.com/settings/keys
3. 使用SSH地址：`git@github.com:username/pdf-to-ppt-manual.git`

---

## ✅ 部署检查清单

部署前确保以下文件存在：

- [x] `app.py` - 主应用文件
- [x] `requirements.txt` - Python依赖（已包含gunicorn）
- [x] `Procfile` - Render部署配置
- [x] `runtime.txt` - Python版本
- [x] `.gitignore` - Git忽略文件
- [x] `README.md` - 项目说明

---

## 🌐 部署到云平台（可选）

### Render部署（海外用户）

1. 访问 https://render.com
2. 使用GitHub账号登录
3. 点击 "New" → "Web Service"
4. 选择你的GitHub仓库
5. 配置：
   - **Name**: `pdf-to-ppt`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Plan**: Free
6. 点击 "Create Web Service"
7. 等待5-10分钟完成部署

### 国内服务器部署（推荐国内用户）

查看 `轻量服务器部署方案.md` 了解详细步骤。

---

## ❓ 常见问题

### Q: 推送时提示认证失败？
A: 使用Personal Access Token代替密码，参考上面的认证说明。

### Q: 提示"remote origin already exists"？
A: 运行 `git remote remove origin` 删除旧配置，然后重新添加。

### Q: 推送时提示"failed to push some refs"？
A: 可能是远程仓库有内容，先拉取：`git pull origin main --allow-unrelated-histories`

### Q: 如何更新代码？
A: 修改代码后，运行：
```bash
git add .
git commit -m "更新说明"
git push
```

### Q: 如何查看GitHub仓库？
A: 访问 `https://github.com/your-username/pdf-to-ppt-manual`

---

## 📚 更多文档

- `GitHub部署快速指南.md` - 快速部署指南
- `GitHub部署方案.md` - 详细部署方案
- `轻量服务器部署方案.md` - 国内服务器部署
- `README.md` - 项目说明

---

## 🆘 需要帮助？

如果遇到问题：
1. 检查Git是否正确安装：`git --version`
2. 检查网络连接
3. 查看错误信息并搜索解决方案
4. 查看GitHub帮助文档：https://docs.github.com

