# PDF习题拆分PPT工具

一个帮助物理老师将PDF格式的习题册转换为PPT的工具，每页PPT包含一道题目，方便在多媒体大屏上进行讲解。

## 功能特点

- 📄 PDF文件上传和预览
- 🖼️ PDF页面转图片显示
- 📦 手动矩形框选择题目区域
- 🔧 矩形框拖拽和缩放调整
- 📊 自动生成PPT（每页一题）
- 📐 智能图片布局（左上角，面积35%）
- 🔗 支持图片合并（处理跨页题目）
- 📋 自定义题目顺序

## 快速开始

### 本地运行

1. **安装Python依赖**
   ```bash
   pip install -r requirements.txt
   ```

2. **安装PyMuPDF（推荐，无需poppler）**
   ```bash
   pip install PyMuPDF
   ```

3. **启动应用**
   ```bash
   python app.py
   ```

4. **访问应用**
   ```
   http://localhost:5001
   ```

### 部署到服务器

#### 国内服务器（推荐国内用户）

- **轻量服务器**：24元/月
- **学生机**：9.5元/月
- 详细指南：查看 `轻量服务器部署方案.md`

#### Render部署（海外用户）

1. Fork此仓库
2. 在Render上创建Web Service
3. 连接GitHub仓库
4. 自动部署

详细指南：查看 `GitHub部署方案.md`

## 技术栈

- **后端**: Python Flask
- **前端**: HTML5 + CSS3 + JavaScript
- **PDF处理**: PyMuPDF（推荐）或 pdf2image + poppler
- **图片处理**: Pillow
- **PPT生成**: python-pptx

## 项目结构

```
pdf-to-ppt-manual/
├── app.py                 # Flask主应用
├── requirements.txt       # Python依赖
├── Procfile              # Render部署配置
├── runtime.txt           # Python版本
├── static/               # 静态文件
│   ├── css/
│   └── js/
├── templates/            # HTML模板
├── utils/                # 工具模块
│   ├── pdf_handler.py    # PDF处理
│   ├── image_cropper.py  # 图片裁剪
│   └── ppt_generator.py  # PPT生成
├── uploads/              # 上传文件
├── temp/                 # 临时文件
└── output/               # 输出PPT
```

## 使用说明

1. 上传PDF文件
2. 在左侧选择页面
3. 绘制矩形框选择题目
4. 调整矩形框位置和大小
5. （可选）合并跨页题目
6. （可选）拖拽调整题目顺序
7. 生成PPT并下载

详细使用说明：查看 `USAGE.md`

## 部署文档

- `轻量服务器部署方案.md` - 国内服务器部署（推荐）
- `学生机部署指南.md` - 学生机部署（最便宜）
- `GitHub部署方案.md` - GitHub + Render部署
- `国内用户访问说明.md` - 国内访问说明

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

