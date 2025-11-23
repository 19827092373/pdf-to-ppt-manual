# Render部署故障排除

## ✅ 已修复的问题

### 问题：Pillow安装失败（Python 3.13不兼容）

**错误信息**：
```
Pillow==10.1.0 无法在Python 3.13上构建
```

**解决方案**：
- ✅ 已更新 `requirements.txt`，Pillow版本改为 `>=10.2.0`（支持Python 3.13）
- ✅ 已更新 `render.yaml`，明确指定Python版本

---

## 🔧 如果部署仍然失败

### 方法1：在Render界面手动设置Python版本（推荐）

1. **进入服务设置**
   - 在Render Dashboard中，点击你的服务
   - 点击 "Settings" 标签

2. **设置Python版本**
   - 找到 "Python Version" 或 "Environment" 部分
   - 选择或输入：`3.10.0`
   - 保存设置

3. **重新部署**
   - 点击 "Manual Deploy" → "Deploy latest commit"
   - 等待部署完成

### 方法2：使用render.yaml（已配置）

如果Render支持 `render.yaml`，它会自动使用Python 3.10.0。

确保 `render.yaml` 文件在项目根目录，内容如下：

```yaml
services:
  - type: web
    name: pdf-to-ppt
    env: python
    pythonVersion: "3.10.0"
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn app:app
```

### 方法3：更新requirements.txt（已完成）

如果必须使用Python 3.13，已更新Pillow版本：

```
Pillow>=10.2.0
```

这个版本支持Python 3.13。

---

## 📋 部署检查清单

部署前确保：

- [x] `requirements.txt` 已更新（Pillow>=10.2.0）
- [x] `render.yaml` 已配置Python版本
- [x] `runtime.txt` 存在（python-3.10.0）
- [x] `Procfile` 存在（web: gunicorn app:app）
- [x] 代码已推送到GitHub

---

## 🚀 重新部署步骤

### 自动部署（如果已启用）

1. 代码已推送到GitHub
2. Render会自动检测更新
3. 等待5-10分钟完成部署

### 手动部署

1. 在Render Dashboard中
2. 点击你的服务
3. 点击 "Manual Deploy" → "Deploy latest commit"
4. 等待部署完成

---

## ❓ 其他常见问题

### Q: 仍然提示Pillow安装失败？

**解决方法**：
1. 在Render服务设置中，手动设置Python版本为 `3.10.0`
2. 或者更新所有依赖到最新版本：
   ```bash
   pip install --upgrade Flask pdf2image Pillow python-pptx PyMuPDF gunicorn
   ```

### Q: 如何查看详细的构建日志？

1. 在服务页面
2. 点击 "Logs" 标签
3. 查看构建日志和运行日志

### Q: 部署成功但应用无法访问？

1. 检查服务状态是否为 "Live"
2. 查看日志是否有错误
3. 确认Start Command为 `gunicorn app:app`
4. 首次访问可能需要等待几秒（服务唤醒）

---

## 📞 需要帮助？

如果问题仍然存在：

1. **查看构建日志**：在Render服务页面点击 "Logs"
2. **检查错误信息**：找到具体的错误原因
3. **Render文档**：https://render.com/docs/python-version
4. **Render支持**：https://render.com/support

---

## ✅ 修复后的文件

- ✅ `requirements.txt` - Pillow版本已更新
- ✅ `render.yaml` - Python版本已指定
- ✅ 代码已推送到GitHub

**现在可以重新部署了！** 🚀

