# PDF习题拆分PPT工具

一个帮助物理老师将PDF格式的习题册转换为PPT的工具，每页PPT包含一道题目，方便在多媒体大屏上进行讲解。

**GitHub仓库**：https://github.com/19827092373/pdf-to-ppt-manual

[![Python](https://img.shields.io/badge/python-3.7+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/flask-3.0.0-green.svg)](https://flask.palletsprojects.com/)

## 功能特点

- 📄 PDF文件上传和预览
- 🖼️ PDF页面转图片显示
- 📦 手动矩形框选择题目区域
- 🔧 矩形框拖拽和缩放调整
- 📊 自动生成PPT（每页一题）
- 📐 智能图片布局（左上角，不超过页面一半）

## 🚀 快速开始

### 方式一：下载使用（推荐新手）

1. **获取代码**
   - 访问：https://github.com/19827092373/pdf-to-ppt-manual
   - 点击绿色的 "Code" 按钮 → "Download ZIP"
   - 解压到任意文件夹

2. **安装Python**
   - 访问：https://www.python.org/downloads/
   - 下载并安装Python 3.7+（安装时勾选"Add Python to PATH"）

3. **安装依赖**
   ```bash
   pip install -r requirements.txt
   ```
   国内用户可使用镜像：
   ```bash
   pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
   ```

4. **启动应用**
   - Windows：双击 `run.bat`
   - 或命令行运行：`python app.py`

5. **访问应用**
   - 打开浏览器访问：`http://localhost:5001`

### 方式二：使用Git克隆（推荐开发者）

```bash
git clone https://github.com/19827092373/pdf-to-ppt-manual.git
cd pdf-to-ppt-manual
pip install -r requirements.txt
python app.py
```

### 方式三：在线使用（如果已部署）

如果项目已部署到云平台，直接访问部署地址即可使用，无需安装。

---

## 📖 详细使用说明

查看 **[用户使用指南.md](用户使用指南.md)** 了解完整的使用步骤和常见问题。

## 使用方法

1. 启动应用：
```bash
python app.py
```

2. 打开浏览器访问：`http://localhost:5001`

**端口占用问题**：如果5001端口被占用，可以：
- 运行 `run_port.bat` 自定义端口
- 或使用命令：`python app.py 5002`（替换为其他可用端口）

3. 上传PDF文件，按照界面提示操作：
   - 选择PDF文件并上传
   - 在左侧查看所有页面缩略图
   - 点击页面查看大图
   - 在大图上绘制矩形框选择题目
   - 调整矩形框位置和大小
   - 处理完所有页面后，点击"生成PPT"按钮
   - 下载生成的PPT文件

## 项目结构

```
pdf-to-ppt-manual/
├── app.py                 # Flask主应用
├── requirements.txt       # Python依赖
├── README.md             # 项目说明
├── PROJECT_PLAN.md       # 详细项目计划
├── static/
│   ├── css/
│   │   └── style.css     # 样式文件
│   └── js/
│       └── main.js       # 前端逻辑
├── templates/
│   └── index.html        # 主页面
├── uploads/              # 上传文件目录
├── temp/                 # 临时文件目录
└── output/               # 输出PPT目录
```

## 技术栈

- **后端**: Python Flask
- **前端**: HTML5 + CSS3 + JavaScript (原生)
- **PDF处理**: PyMuPDF（推荐，无需poppler）或 pdf2image + poppler
- **图片处理**: Pillow
- **PPT生成**: python-pptx

## 📚 相关文档

- **[用户使用指南.md](用户使用指南.md)** - 完整的使用说明（**推荐新用户查看**）
- **[USAGE.md](USAGE.md)** - 详细操作步骤
- **[GitHub部署一键指南.md](GitHub部署一键指南.md)** - 部署到GitHub
- **[轻量服务器部署方案.md](轻量服务器部署方案.md)** - 国内服务器部署

## 注意事项

- 当前版本需要手动选择每道题目（使用矩形框）
- 建议每页题目数量不要过多，便于手动选择
- 生成的PPT文件会保存在output目录中

## 许可证

MIT License

