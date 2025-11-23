# Render快速部署步骤（5分钟）

## ✅ 准备工作已完成

你的项目已经准备好部署到Render了！所有必需文件都已配置好。

---

## 🚀 快速部署（5步完成）

### 第1步：访问Render并登录

1. 打开：https://render.com
2. 点击 "Get Started for Free"
3. 选择 **"Sign up with GitHub"**（推荐）
4. 授权GitHub账号

### 第2步：创建Web服务

1. 点击右上角 **"New +"** → **"Web Service"**
2. 连接GitHub账号（如果还没连接）
3. 选择仓库：`19827092373/pdf-to-ppt-manual`

### 第3步：配置服务

填写以下信息：

| 配置项 | 值 |
|--------|-----|
| **Name** | `pdf-to-ppt` |
| **Environment** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn app:app` |
| **Plan** | `Free` |

其他设置保持默认即可。

### 第4步：创建并等待

1. 点击 **"Create Web Service"**
2. 等待5-10分钟（构建和部署）
3. 查看构建日志，确保没有错误

### 第5步：获取URL

部署成功后：
- 页面顶部会显示你的应用URL
- 格式：`https://pdf-to-ppt.onrender.com`
- 点击URL访问应用

---

## ⚠️ 重要提示

### 免费计划限制

- ✅ 完全免费
- ⚠️ **15分钟无活动后会休眠**
- ⚠️ **首次访问需要等待几秒**（服务唤醒）

这是正常现象，不影响使用！

### 如果部署失败

1. 查看构建日志（页面会显示）
2. 检查错误信息
3. 常见问题：
   - 依赖安装失败 → 检查 `requirements.txt`
   - 启动失败 → 检查 `Start Command` 是否为 `gunicorn app:app`

---

## 📚 详细文档

查看 `Render部署详细指南.md` 了解：
- 详细配置说明
- 常见问题解决
- 服务管理方法
- 更新应用方法

---

## 🎉 部署完成后

部署成功后，你可以：

1. ✅ 分享URL给其他人
2. ✅ 随时随地访问应用
3. ✅ 代码更新后自动重新部署

**开始部署吧！** 🚀

