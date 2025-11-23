# GitHub部署方案（免费，通过网址访问）

## ⚠️ 重要提醒：国内用户访问问题

**对于中国国内用户**：
- ❌ Render、Railway等国外服务在中国大陆**可能无法访问**
- ❌ 需要科学上网才能访问
- ✅ **强烈推荐使用国内服务器**（24元/月）

**详细说明**：查看 `国内用户访问说明.md`

---

## 💰 成本：0元（完全免费）

**注意**：仅适用于海外用户或有科学上网条件的用户

---

## 一、为什么选择GitHub部署？

### 优势
- ✅ **完全免费**：无需购买服务器
- ✅ **自动部署**：代码推送后自动更新
- ✅ **全球访问**：CDN加速，访问速度快
- ✅ **版本控制**：Git管理，方便回滚
- ✅ **协作方便**：多人协作开发

### 限制
- ⚠️ GitHub Pages只能部署静态网站，不能直接运行Flask
- ⚠️ 需要使用第三方服务（Render、Railway等）运行Flask应用

---

## 二、推荐方案对比

| 方案 | 免费额度 | 部署难度 | 推荐度 | 访问速度 |
|------|----------|----------|--------|----------|
| Render | 750小时/月 | ⭐ 简单 | ⭐⭐⭐⭐⭐ | 快 |
| Railway | $5免费额度 | ⭐⭐ 中等 | ⭐⭐⭐⭐ | 快 |
| PythonAnywhere | 免费账户 | ⭐⭐ 中等 | ⭐⭐⭐ | 中等 |
| Fly.io | 免费额度 | ⭐⭐⭐ 较难 | ⭐⭐⭐ | 快 |

---

## 🏆 方案一：GitHub + Render（最推荐）

### 为什么推荐Render？

- ✅ **完全免费**：每月750小时免费运行时间
- ✅ **部署简单**：连接GitHub后自动部署
- ✅ **自动HTTPS**：自动配置SSL证书
- ✅ **全球CDN**：访问速度快
- ✅ **支持Flask**：完美支持Python Flask应用

### 免费额度
- **运行时间**：750小时/月（足够24小时运行）
- **带宽**：100GB/月
- **存储**：512MB
- **完全免费**，无需信用卡

---

## 三、Render部署详细步骤

### 步骤1：准备GitHub仓库

#### 1.1 创建GitHub账号（如果还没有）

访问：https://github.com

#### 1.2 创建新仓库

1. 登录GitHub
2. 点击右上角"+" → "New repository"
3. 填写信息：
   - Repository name: `pdf-to-ppt-manual`
   - Description: PDF习题拆分PPT工具
   - 选择：Public（公开）或 Private（私有）
   - 不要勾选"Initialize this repository with a README"
4. 点击"Create repository"

#### 1.3 上传代码到GitHub

**方法1：使用Git命令行**

```bash
# 在项目目录中执行
cd pdf-to-ppt-manual

# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/your-username/pdf-to-ppt-manual.git

# 推送代码
git branch -M main
git push -u origin main
```

**方法2：使用GitHub Desktop**

1. 下载：https://desktop.github.com/
2. 登录GitHub账号
3. 点击"File" → "Add Local Repository"
4. 选择项目文件夹
5. 点击"Publish repository"

**方法3：使用VS Code**

1. 安装Git扩展
2. 打开项目文件夹
3. 点击"源代码管理"
4. 初始化仓库
5. 提交并推送到GitHub

---

### 步骤2：创建Render账号

1. 访问：https://render.com
2. 点击"Get Started for Free"
3. 选择"Sign up with GitHub"（推荐，最简单）
4. 授权GitHub账号
5. 完成注册

---

### 步骤3：在Render上创建Web服务

#### 3.1 创建新Web服务

1. 登录Render控制台
2. 点击"New" → "Web Service"
3. 选择你的GitHub仓库：`pdf-to-ppt-manual`
4. 点击"Connect"

#### 3.2 配置服务

**基本信息**：
- **Name**: `pdf-to-ppt`（会自动生成URL）
- **Region**: 选择离你最近的地域（如：Singapore）
- **Branch**: `main`（或你的主分支）
- **Root Directory**: 留空（如果项目在根目录）

**构建和启动**：
- **Environment**: `Python 3`
- **Build Command**: 
  ```bash
  pip install -r requirements.txt
  ```
- **Start Command**: 
  ```bash
  gunicorn app:app
  ```

**环境变量**（可选）：
- `PYTHON_VERSION`: `3.10.0`
- `PORT`: Render会自动设置，无需手动配置

#### 3.3 高级设置

**计划**：
- 选择：**Free**（免费计划）

**其他设置**：
- **Auto-Deploy**: Yes（代码推送后自动部署）
- **Health Check Path**: `/`（可选）

#### 3.4 创建服务

1. 点击"Create Web Service"
2. 等待部署完成（通常5-10分钟）

---

### 步骤4：获取访问地址

部署完成后，Render会提供一个URL：

```
https://pdf-to-ppt.onrender.com
```

**注意**：
- URL格式：`https://your-service-name.onrender.com`
- 自动配置HTTPS
- 全球CDN加速

---

### 步骤5：配置应用（重要）

#### 5.1 修改app.py以支持Render

需要修改Flask应用的启动方式：

```python
# 在app.py末尾修改
if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
```

#### 5.2 创建requirements.txt（如果还没有）

确保包含所有依赖：
```
Flask==3.0.0
pdf2image==1.16.3
Pillow==10.1.0
python-pptx==0.6.23
PyMuPDF==1.23.8
gunicorn==21.2.0
```

#### 5.3 创建runtime.txt（可选）

指定Python版本：
```
python-3.10.0
```

#### 5.4 创建Procfile（可选）

```
web: gunicorn app:app
```

---

### 步骤6：推送更新

修改代码后，推送到GitHub：

```bash
git add .
git commit -m "Update for Render deployment"
git push
```

Render会自动检测更新并重新部署。

---

## 四、Railway部署方案（备选）

### 为什么选择Railway？

- ✅ **免费额度**：$5/月免费额度
- ✅ **部署简单**：连接GitHub自动部署
- ✅ **支持Flask**：完美支持

### 部署步骤

#### 1. 创建Railway账号

1. 访问：https://railway.app
2. 点击"Start a New Project"
3. 选择"Deploy from GitHub repo"
4. 授权GitHub账号

#### 2. 选择仓库

1. 选择你的仓库：`pdf-to-ppt-manual`
2. Railway会自动检测Python项目

#### 3. 配置部署

Railway会自动：
- 检测requirements.txt
- 安装依赖
- 启动应用

#### 4. 获取访问地址

部署完成后，Railway会提供一个URL：
```
https://your-project.up.railway.app
```

---

## 五、PythonAnywhere部署方案（备选）

### 为什么选择PythonAnywhere？

- ✅ **完全免费**：免费账户可用
- ✅ **专为Python设计**：完美支持Flask
- ⚠️ **限制**：免费账户只能运行一个Web应用

### 部署步骤

#### 1. 创建账号

1. 访问：https://www.pythonanywhere.com
2. 注册免费账号

#### 2. 上传代码

**方法1：使用Git**
```bash
cd ~
git clone https://github.com/your-username/pdf-to-ppt-manual.git
```

**方法2：使用Files页面**
- 在Web界面中上传文件

#### 3. 配置Web应用

1. 进入"Web"标签
2. 点击"Add a new web app"
3. 选择"Flask"
4. 选择Python版本：3.10
5. 设置路径：`/home/yourusername/pdf-to-ppt-manual/app.py`

#### 4. 配置WSGI文件

编辑WSGI配置文件：
```python
import sys
path = '/home/yourusername/pdf-to-ppt-manual'
if path not in sys.path:
    sys.path.insert(0, path)

from app import app as application
```

#### 5. 访问应用

免费账户的URL格式：
```
https://yourusername.pythonanywhere.com
```

---

## 六、修改代码以支持部署

### 1. 修改app.py

```python
# 在app.py末尾
if __name__ == '__main__':
    import os
    # 获取环境变量PORT，如果没有则使用5000
    port = int(os.environ.get('PORT', 5000))
    # 生产环境不使用debug模式
    app.run(debug=False, host='0.0.0.0', port=port)
```

### 2. 确保requirements.txt完整

```
Flask==3.0.0
pdf2image==1.16.3
Pillow==10.1.0
python-pptx==0.6.23
PyMuPDF==1.23.8
gunicorn==21.2.0
```

### 3. 创建runtime.txt（可选）

```
python-3.10.0
```

### 4. 创建Procfile（Render推荐）

```
web: gunicorn app:app
```

### 5. 处理文件存储

由于免费服务通常不持久化存储，建议：

**方案1：使用云存储**
- 阿里云OSS
- 腾讯云COS
- AWS S3

**方案2：使用数据库**
- SQLite（简单）
- PostgreSQL（Render免费提供）

**方案3：临时存储**
- 使用内存存储（重启后丢失）
- 适合临时使用

---

## 七、推荐配置（Render）

### 完整部署配置

#### 1. requirements.txt
```
Flask==3.0.0
pdf2image==1.16.3
Pillow==10.1.0
python-pptx==0.6.23
PyMuPDF==1.23.8
gunicorn==21.2.0
```

#### 2. Procfile
```
web: gunicorn app:app
```

#### 3. runtime.txt
```
python-3.10.0
```

#### 4. .gitignore
```
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
venv/
env/
uploads/
temp/
output/
*.log
.DS_Store
```

---

## 八、访问地址示例

部署完成后，你的应用可以通过以下方式访问：

### Render
```
https://pdf-to-ppt.onrender.com
```

### Railway
```
https://your-project.up.railway.app
```

### PythonAnywhere
```
https://yourusername.pythonanywhere.com
```

---

## 九、常见问题

### Q1: Render部署失败？

**检查**：
1. requirements.txt是否正确
2. Start Command是否正确
3. 查看构建日志

**解决**：
- 查看Render的构建日志
- 确保所有依赖都在requirements.txt中
- 确保Start Command正确

### Q2: 应用启动后无法访问？

**检查**：
1. 应用是否监听0.0.0.0而不是127.0.0.1
2. 端口是否正确（使用环境变量PORT）
3. 查看应用日志

### Q3: 文件上传失败？

**原因**：
- 免费服务通常有文件大小限制
- 存储空间有限

**解决**：
- 使用云存储服务
- 或限制上传文件大小

### Q4: 应用休眠？

**Render免费计划**：
- 15分钟无活动后会自动休眠
- 首次访问需要几秒唤醒时间

**解决**：
- 使用付费计划（$7/月）避免休眠
- 或使用定时任务保持活跃

---

## 十、成本对比

| 方案 | 月成本 | 年成本 | 限制 |
|------|--------|--------|------|
| Render免费 | 0元 | 0元 | 15分钟休眠 |
| Render付费 | $7 | $84 | 无休眠 |
| Railway免费 | 0元 | 0元 | $5额度 |
| PythonAnywhere免费 | 0元 | 0元 | 1个应用 |

---

## 十一、推荐方案总结

### 最推荐：Render免费版

**优点**：
- ✅ 完全免费
- ✅ 部署简单
- ✅ 自动HTTPS
- ✅ 全球CDN

**缺点**：
- ⚠️ 15分钟无活动会休眠
- ⚠️ 首次访问需要几秒唤醒

**适用**：个人项目，小团队使用

---

## 十二、快速开始清单

- [ ] 创建GitHub账号
- [ ] 创建GitHub仓库
- [ ] 上传代码到GitHub
- [ ] 创建Render账号
- [ ] 在Render上创建Web服务
- [ ] 配置部署设置
- [ ] 等待部署完成
- [ ] 测试访问
- [ ] 分享URL给用户

---

## 需要帮助？

1. **Render文档**：https://render.com/docs
2. **Railway文档**：https://docs.railway.app
3. **PythonAnywhere文档**：https://help.pythonanywhere.com

