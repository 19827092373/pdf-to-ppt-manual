# Render部署详细指南

## 📋 部署前检查清单

✅ **已完成**：
- [x] GitHub仓库已创建：https://github.com/19827092373/pdf-to-ppt-manual
- [x] 代码已推送到GitHub
- [x] `Procfile` 已创建（`web: gunicorn app:app`）
- [x] `requirements.txt` 已包含 gunicorn
- [x] `runtime.txt` 已创建（Python 3.10.0）
- [x] `app.py` 已支持PORT环境变量
- [x] `.gitignore` 已配置

---

## 🚀 部署步骤（10分钟完成）

### 第一步：创建Render账号

1. **访问Render官网**
   - 打开：https://render.com
   - 点击右上角 "Get Started for Free" 或 "Sign Up"

2. **选择注册方式**
   - **推荐**：选择 "Sign up with GitHub"
   - 点击后会跳转到GitHub授权页面
   - 点击 "Authorize render" 授权

3. **完成注册**
   - 授权成功后会自动登录Render
   - 首次登录可能需要填写一些基本信息（可选）

---

### 第二步：创建Web服务

1. **进入Dashboard**
   - 登录后会自动进入Dashboard
   - 如果没有，点击左上角 "Dashboard"

2. **创建新服务**
   - 点击右上角蓝色的 **"New +"** 按钮
   - 选择 **"Web Service"**

3. **连接GitHub仓库**
   - 如果首次使用，需要连接GitHub账号
   - 点击 "Connect account" 或 "Configure account"
   - 选择要授权的仓库（或选择 "All repositories"）
   - 点击 "Install" 或 "Connect"

4. **选择仓库**
   - 在仓库列表中找到：`19827092373/pdf-to-ppt-manual`
   - 点击该仓库

---

### 第三步：配置服务

#### 3.1 基本信息

- **Name**（服务名称）：
  ```
  pdf-to-ppt
  ```
  > 注意：名称只能包含小写字母、数字和连字符

- **Region**（地区）：
  - 选择离你最近的地区（如：Singapore、Oregon等）
  - 国内用户建议选择：**Singapore**（新加坡）

- **Branch**（分支）：
  ```
  main
  ```
  （默认就是main，无需修改）

- **Root Directory**（根目录）：
  ```
  .
  ```
  （留空或填写 `.`，表示项目根目录）

#### 3.2 构建和启动配置

- **Environment**（环境）：
  ```
  Python 3
  ```
  （从下拉菜单选择）

- **Build Command**（构建命令）：
  ```bash
  pip install -r requirements.txt
  ```
  > 注意：Render会自动检测requirements.txt，但建议明确指定

- **Start Command**（启动命令）：
  ```bash
  gunicorn app:app
  ```
  > 重要：必须使用gunicorn，不能使用 `python app.py`

#### 3.3 计划选择

- **Plan**（计划）：
  - 选择 **"Free"**（免费计划）
  - 免费计划特点：
    - ✅ 完全免费
    - ⚠️ 15分钟无活动后会休眠
    - ⚠️ 首次访问需要几秒唤醒时间
    - ✅ 512MB RAM
    - ✅ 0.1 CPU

#### 3.4 高级设置（可选）

点击 "Advanced" 展开高级设置：

- **Auto-Deploy**（自动部署）：
  - ✅ 勾选 "Auto-Deploy"（代码推送后自动重新部署）

- **Health Check Path**（健康检查路径）：
  ```
  /
  ```
  （可选，用于检查服务是否正常运行）

- **Environment Variables**（环境变量）：
  - 暂时不需要添加
  - Render会自动设置 `PORT` 环境变量

---

### 第四步：创建并部署

1. **创建服务**
   - 检查所有配置是否正确
   - 点击页面底部的 **"Create Web Service"** 按钮

2. **等待部署**
   - Render会自动开始构建和部署
   - 这个过程通常需要 **5-10分钟**
   - 你可以看到实时的构建日志

3. **查看部署日志**
   - 在部署过程中，页面会显示构建日志
   - 如果出现错误，日志会显示具体信息
   - 常见步骤：
     ```
     1. Cloning repository...
     2. Installing dependencies...
     3. Building...
     4. Starting service...
     ```

---

### 第五步：获取访问地址

部署成功后：

1. **查看服务状态**
   - 页面顶部会显示服务状态：**"Live"**（绿色）
   - 如果显示 "Building" 或 "Deploying"，请等待

2. **获取URL**
   - 页面顶部会显示你的应用URL：
     ```
     https://pdf-to-ppt.onrender.com
     ```
   - 或者格式：`https://your-service-name.onrender.com`

3. **访问应用**
   - 点击URL或复制到浏览器访问
   - **首次访问**可能需要等待几秒（服务唤醒）
   - 如果15分钟内没有访问，服务会休眠，下次访问需要等待

---

## ✅ 部署成功检查

部署成功后，你应该能够：

1. ✅ 访问应用URL，看到上传界面
2. ✅ 上传PDF文件
3. ✅ 正常使用所有功能

---

## 🔧 常见问题解决

### Q1: 部署失败，提示 "Build failed"

**可能原因**：
- requirements.txt 中的依赖无法安装
- Python版本不兼容

**解决方法**：
1. 查看构建日志，找到具体错误
2. 检查 `requirements.txt` 是否正确
3. 检查 `runtime.txt` 中的Python版本
4. 确保所有依赖都是有效的版本

### Q2: 部署成功但无法访问

**可能原因**：
- 服务还在休眠（15分钟无活动后）
- Start Command配置错误

**解决方法**：
1. 等待几秒让服务唤醒
2. 检查 Start Command 是否为 `gunicorn app:app`
3. 查看服务日志（点击 "Logs" 标签）

### Q3: 应用启动后立即崩溃

**可能原因**：
- gunicorn未安装
- app.py有错误

**解决方法**：
1. 确保 `requirements.txt` 包含 `gunicorn==21.2.0`
2. 检查应用日志
3. 本地测试：`gunicorn app:app` 是否能正常运行

### Q4: 文件上传失败

**可能原因**：
- 文件大小超过限制（免费计划通常限制较小）
- 存储空间不足

**解决方法**：
1. 限制上传文件大小（代码中已设置为50MB）
2. 考虑使用云存储服务（如AWS S3、阿里云OSS）

### Q5: 服务经常休眠

**免费计划限制**：
- 15分钟无活动后自动休眠
- 这是正常现象

**解决方法**：
1. **接受休眠**：首次访问等待几秒即可
2. **升级付费**：$7/月可以避免休眠
3. **使用定时任务**：设置定时访问保持服务活跃（需要额外配置）

---

## 📝 更新应用

### 方法1：自动部署（推荐）

1. 修改本地代码
2. 提交并推送到GitHub：
   ```bash
   git add .
   git commit -m "更新说明"
   git push
   ```
3. Render会自动检测更新并重新部署
4. 等待几分钟，部署完成后自动更新

### 方法2：手动部署

1. 在Render Dashboard中
2. 点击你的服务
3. 点击 "Manual Deploy" → "Deploy latest commit"

---

## 🔄 管理服务

### 查看日志

1. 在服务页面
2. 点击 "Logs" 标签
3. 可以查看实时日志和历史日志

### 重启服务

1. 在服务页面
2. 点击 "Manual Deploy" → "Clear build cache & deploy"

### 删除服务

1. 在服务页面
2. 点击 "Settings" 标签
3. 滚动到底部
4. 点击 "Delete Service"（红色按钮）
5. 确认删除

---

## 💡 优化建议

### 1. 使用付费计划（可选）

如果经常使用，可以考虑：
- **Starter计划**：$7/月
- ✅ 避免休眠
- ✅ 更多资源
- ✅ 更快响应

### 2. 配置自定义域名（可选）

1. 在服务 "Settings" 中
2. 找到 "Custom Domains"
3. 添加你的域名
4. 按照提示配置DNS

### 3. 环境变量配置（如需要）

如果需要配置环境变量：
1. 在服务 "Environment" 标签
2. 点击 "Add Environment Variable"
3. 添加键值对

---

## 📞 获取帮助

如果遇到问题：

1. **查看Render文档**：https://render.com/docs
2. **查看构建日志**：在服务页面点击 "Logs"
3. **Render支持**：https://render.com/support
4. **GitHub Issues**：在项目仓库提交Issue

---

## 🎉 部署完成！

部署成功后，你可以：

1. ✅ 分享URL给其他人使用
2. ✅ 随时随地访问应用
3. ✅ 无需本地安装Python

**你的应用URL**：
```
https://pdf-to-ppt.onrender.com
```

（实际URL以Render提供的为准）

---

**祝你部署顺利！** 🚀

