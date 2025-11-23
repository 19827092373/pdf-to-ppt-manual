# GitHub部署完整指南（从零开始）

## 📋 前置准备

### 1. 安装Git（如果还没有）

#### Windows系统

**方法1：下载Git for Windows（推荐）**

1. 访问：https://git-scm.com/download/win
2. 下载最新版本
3. 运行安装程序
4. 安装时选择：
   - ✅ Git Bash Here
   - ✅ Git GUI Here
   - ✅ 使用默认编辑器（或选择VS Code）
5. 完成安装

**方法2：使用GitHub Desktop（图形界面，更简单）**

1. 访问：https://desktop.github.com/
2. 下载GitHub Desktop
3. 安装并登录GitHub账号

**验证安装**：
打开命令提示符（CMD）或PowerShell，输入：
```bash
git --version
```
如果显示版本号，说明安装成功。

---

## 第一步：创建GitHub账号和仓库

### 1. 创建GitHub账号

1. 访问：https://github.com
2. 点击右上角"Sign up"
3. 填写信息：
   - Username（用户名）
   - Email（邮箱）
   - Password（密码）
4. 验证邮箱
5. 完成注册

### 2. 创建新仓库

1. 登录GitHub
2. 点击右上角"+" → "New repository"
3. 填写仓库信息：
   - **Repository name**: `pdf-to-ppt-manual`
   - **Description**: `PDF习题拆分PPT工具 - 将PDF习题册转换为PPT，每页一题`
   - **Visibility**: 
     - Public（公开，推荐，免费）
     - Private（私有，需要付费）
   - **不要勾选**：
     - ❌ Add a README file
     - ❌ Add .gitignore
     - ❌ Choose a license
4. 点击"Create repository"

### 3. 复制仓库地址

创建完成后，GitHub会显示仓库地址，类似：
```
https://github.com/your-username/pdf-to-ppt-manual.git
```
**记住这个地址，后面会用到！**

---

## 第二步：初始化本地Git仓库

### 方法1：使用Git命令行（推荐）

#### 步骤1：打开项目目录

在项目文件夹中，右键选择"Git Bash Here"（如果安装了Git）
或打开命令提示符/PowerShell，进入项目目录：
```bash
cd C:\Users\86198\代码\pdf-to-ppt-manual
```

#### 步骤2：初始化Git仓库

```bash
# 初始化Git仓库
git init

# 检查状态
git status
```

#### 步骤3：添加文件

```bash
# 添加所有文件（.gitignore会自动排除不需要的文件）
git add .

# 检查状态，确认文件已添加
git status
```

#### 步骤4：提交文件

```bash
# 提交文件
git commit -m "Initial commit: PDF习题拆分PPT工具"
```

#### 步骤5：添加远程仓库

**替换 `your-username` 为你的GitHub用户名**：

```bash
git remote add origin https://github.com/your-username/pdf-to-ppt-manual.git
```

#### 步骤6：推送到GitHub

```bash
# 设置主分支为main
git branch -M main

# 推送到GitHub
git push -u origin main
```

**注意**：首次推送可能需要登录GitHub账号。

---

### 方法2：使用GitHub Desktop（更简单）

#### 步骤1：打开GitHub Desktop

1. 打开GitHub Desktop
2. 登录GitHub账号

#### 步骤2：添加本地仓库

1. 点击"File" → "Add Local Repository"
2. 点击"Choose..."选择项目文件夹：`C:\Users\86198\代码\pdf-to-ppt-manual`
3. 点击"Add repository"

#### 步骤3：发布到GitHub

1. 在GitHub Desktop中，点击"Publish repository"
2. 填写信息：
   - Name: `pdf-to-ppt-manual`
   - Description: `PDF习题拆分PPT工具`
   - 选择：Keep this code private（可选）
3. 点击"Publish Repository"

---

### 方法3：使用VS Code（如果使用VS Code）

#### 步骤1：打开项目

1. 打开VS Code
2. 打开项目文件夹：`C:\Users\86198\代码\pdf-to-ppt-manual`

#### 步骤2：初始化仓库

1. 点击左侧"源代码管理"图标（或按Ctrl+Shift+G）
2. 点击"初始化仓库"
3. 点击"+"添加所有文件
4. 输入提交信息："Initial commit"
5. 点击"提交"

#### 步骤3：推送到GitHub

1. 点击"..."菜单 → "推送"
2. 选择"发布到GitHub"
3. 选择仓库名称：`pdf-to-ppt-manual`
4. 选择Public或Private
5. 点击"确定"

---

## 第三步：验证部署

### 1. 检查GitHub仓库

1. 访问：https://github.com/your-username/pdf-to-ppt-manual
2. 确认所有文件都已上传
3. 检查文件结构是否正确

### 2. 检查重要文件

确保以下文件存在：
- ✅ `app.py`
- ✅ `requirements.txt`
- ✅ `Procfile`
- ✅ `runtime.txt`
- ✅ `README.md`
- ✅ `templates/` 文件夹
- ✅ `static/` 文件夹
- ✅ `utils/` 文件夹

---

## 第四步：后续更新代码

### 使用Git命令行

```bash
# 进入项目目录
cd C:\Users\86198\代码\pdf-to-ppt-manual

# 查看修改
git status

# 添加修改的文件
git add .

# 提交修改
git commit -m "更新说明"

# 推送到GitHub
git push
```

### 使用GitHub Desktop

1. 在GitHub Desktop中查看修改
2. 填写提交信息
3. 点击"Commit to main"
4. 点击"Push origin"

---

## 常见问题

### Q1: Git未安装？

**解决**：
1. 下载安装：https://git-scm.com/download/win
2. 或使用GitHub Desktop：https://desktop.github.com/

### Q2: 推送时要求登录？

**解决**：
1. 使用GitHub账号和密码（或Personal Access Token）
2. 或配置SSH密钥（更安全）

### Q3: 推送失败？

**检查**：
1. 网络连接是否正常
2. GitHub仓库地址是否正确
3. 是否有推送权限

**解决**：
```bash
# 检查远程仓库地址
git remote -v

# 如果地址错误，删除后重新添加
git remote remove origin
git remote add origin https://github.com/your-username/pdf-to-ppt-manual.git
```

### Q4: 文件太大无法推送？

**解决**：
- GitHub限制单个文件100MB
- 确保`.gitignore`正确配置，排除大文件
- 如果PDF文件太大，不要提交到GitHub

---

## 下一步：部署到Render（可选）

代码推送到GitHub后，可以部署到Render：

1. 访问：https://render.com
2. 创建账号（使用GitHub登录）
3. 创建Web Service
4. 选择你的GitHub仓库
5. 自动部署

**注意**：Render在中国可能无法访问，建议使用国内服务器。

---

## 需要帮助？

- **Git安装**：https://git-scm.com/download/win
- **GitHub Desktop**：https://desktop.github.com/
- **GitHub文档**：https://docs.github.com

